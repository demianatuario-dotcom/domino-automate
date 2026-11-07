import crypto from 'node:crypto';
import { getPool, sanitizeDbErrorMessage } from './db.ts';

export type IdempotencyStatus = 'processing' | 'succeeded' | 'retryable' | 'failed';
export type OutboxStatus = 'pending' | 'processing' | 'delivered' | 'retryable' | 'failed';

export type WebhookDispatchClassification =
  | 'delivered'
  | 'retryable_rate_limit'
  | 'retryable_server_error'
  | 'ambiguous_timeout'
  | 'permanent_client_error'
  | 'permanent_config_error'
  | 'network_error';

export interface WebhookDispatchOutcome {
  ok: boolean;
  retryable: boolean;
  classification: WebhookDispatchClassification;
  httpStatus: number | null;
  retryAfterMs?: number;
  errorMessage?: string;
}

export interface ClaimAndPersistResult {
  deduplicated: boolean;
  dbPersisted: boolean;
  leadId: number | null;
  idempotencyStatus: IdempotencyStatus;
}

const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const HMAC_REPLAY_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

declare global {
  var __dominoFallbackIdempotencyStore:
    | Map<
        string,
        {
          status: IdempotencyStatus;
          expiresAt: number;
          leadId: number | null;
          lastError?: string;
        }
      >
    | undefined;
  var __dominoQuoteLockQueue: Map<string, Promise<void>> | undefined;
  var __dominoQuoteSchemaInitialized: boolean | undefined;
}

function getFallbackIdempotencyStore() {
  if (!global.__dominoFallbackIdempotencyStore) {
    global.__dominoFallbackIdempotencyStore = new Map();
  }
  return global.__dominoFallbackIdempotencyStore;
}

/**
 * Serializes concurrent execution for the same idempotencyKey within a process
 * and across simulated multi-worker test harnesses sharing the same runtime.
 */
export async function withIdempotencyKeyLock<T>(
  idempotencyKey: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!global.__dominoQuoteLockQueue) {
    global.__dominoQuoteLockQueue = new Map();
  }
  const queue = global.__dominoQuoteLockQueue;
  const prev = queue.get(idempotencyKey) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  queue.set(idempotencyKey, prev.then(() => current));

  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (queue.get(idempotencyKey) === current) {
      queue.delete(idempotencyKey);
    }
  }
}

export function computeIdempotencyKey(input: {
  email: string;
  telefone: string;
  vertical: string;
  demanda: string;
  nome: string;
}): string {
  const raw = [
    input.email.trim().toLowerCase(),
    input.telefone.replace(/\D/g, ''),
    input.vertical.trim().toLowerCase(),
    input.demanda.trim().toLowerCase(),
    input.nome.trim().toLowerCase(),
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function signWebhookPayloadHmac(
  bodyStr: string,
  timestamp: string,
  secret: string
): string {
  const mac = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${bodyStr}`)
    .digest('hex');
  return `sha256=${mac}`;
}

export function verifyWebhookHmacSignature(
  bodyStr: string,
  timestamp: string,
  signatureHeader: string,
  secret: string,
  nowMs: number = Date.now()
): boolean {
  if (!secret || !timestamp || !signatureHeader) return false;
  const rawNum = Number(timestamp);
  const tsNum = Number.isNaN(rawNum) ? Date.parse(timestamp) : rawNum;
  if (Number.isNaN(tsNum) || Math.abs(nowMs - tsNum) > HMAC_REPLAY_TOLERANCE_MS) {
    return false;
  }
  const expected = signWebhookPayloadHmac(bodyStr, timestamp, secret);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signatureHeader, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function parseRetryAfterMs(headerVal: string | null): number | undefined {
  if (!headerVal) return undefined;
  const secs = Number(headerVal.trim());
  if (!Number.isNaN(secs) && secs >= 0) {
    return Math.min(30_000, Math.max(200, Math.round(secs * 1000)));
  }
  return undefined;
}

/**
 * Dispatches payload to N8N Webhook with strict HTTP status classification:
 * - 2xx: delivered (ok: true, retryable: false)
 * - 429: retryable_rate_limit (respects Retry-After)
 * - 5xx: retryable_server_error (retry with backoff)
 * - Timeout: ambiguous_timeout (retryable with same X-Idempotency-Key)
 * - 400, 401, 403, 404 (4xx != 429): permanent_client_error (ok: false, retryable: false)
 */
export async function dispatchToN8NWithRetry(
  webhookUrl: string,
  payload: Record<string, unknown>,
  idempotencyKey: string,
  options: {
    maxAttempts?: number;
    baseBackoffMs?: number;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
  } = {}
): Promise<WebhookDispatchOutcome> {
  const maxAttempts = options.maxAttempts ?? 2;
  const baseBackoffMs = options.baseBackoffMs ?? 300;
  const timeoutMs = options.timeoutMs ?? 8000;
  const fetchFn = options.fetchImpl ?? fetch;

  const secret = (process.env.N8N_WEBHOOK_SECRET || '').trim();
  const requireHmac =
    process.env.N8N_REQUIRE_HMAC === 'true' || process.env.NODE_ENV === 'production';

  if (requireHmac && !secret) {
    return {
      ok: false,
      retryable: true,
      classification: 'permanent_config_error',
      httpStatus: null,
      errorMessage:
        'N8N_WEBHOOK_SECRET é obrigatório em produção quando o webhook está habilitado.',
    };
  }

  const bodyStr = JSON.stringify(payload);
  let lastOutcome: WebhookDispatchOutcome = {
    ok: false,
    retryable: true,
    classification: 'network_error',
    httpStatus: null,
    errorMessage: 'No attempt executed',
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const timestamp = String(Date.now());
    const signature = secret ? signWebhookPayloadHmac(bodyStr, timestamp, secret) : '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Source-Origin': 'domino-automate-web',
      'X-Idempotency-Key': idempotencyKey,
      'X-Webhook-Timestamp': timestamp,
      ...(signature ? { 'X-Webhook-Signature': signature } : {}),
    };

    try {
      const response = await fetchFn(webhookUrl, {
        method: 'POST',
        headers,
        body: bodyStr,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          ok: true,
          retryable: false,
          classification: 'delivered',
          httpStatus: response.status,
        };
      }

      if (response.status === 429) {
        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
        lastOutcome = {
          ok: false,
          retryable: true,
          classification: 'retryable_rate_limit',
          httpStatus: 429,
          retryAfterMs,
          errorMessage: 'N8N HTTP 429 Too Many Requests',
        };
        if (attempt < maxAttempts) {
          const waitMs = retryAfterMs ?? baseBackoffMs * attempt;
          await new Promise((r) => setTimeout(r, Math.min(waitMs, 2000)));
          continue;
        }
        return lastOutcome;
      }

      if (response.status >= 400 && response.status < 500) {
        // 400, 401, 403, 404, 422 etc. -> Permanent client/config error. NEVER succeed silently!
        return {
          ok: false,
          retryable: false,
          classification: 'permanent_client_error',
          httpStatus: response.status,
          errorMessage: `N8N HTTP ${response.status} permanent client error`,
        };
      }

      // 5xx Server Error -> retryable
      lastOutcome = {
        ok: false,
        retryable: true,
        classification: 'retryable_server_error',
        httpStatus: response.status,
        errorMessage: `N8N HTTP ${response.status} server error`,
      };
    } catch (err) {
      const errName = err instanceof Error ? err.name : '';
      const errMsg = err instanceof Error ? err.message : String(err);
      const isTimeout =
        errName === 'TimeoutError' ||
        errName === 'AbortError' ||
        /timeout|aborted/i.test(errMsg);

      lastOutcome = {
        ok: false,
        retryable: true,
        classification: isTimeout ? 'ambiguous_timeout' : 'network_error',
        httpStatus: null,
        errorMessage: isTimeout ? 'N8N request timed out (ambiguous state)' : errMsg,
      };
    }

    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, baseBackoffMs * attempt));
    }
  }

  return lastOutcome;
}

/**
 * Ensures the idempotency and transactional outbox tables exist in PostgreSQL.
 */
async function ensureQuoteTablesOnClient(client: {
  query: (sql: string, params?: unknown[]) => Promise<unknown>;
}): Promise<void> {
  if (global.__dominoQuoteSchemaInitialized) return;
  await client.query(`
    CREATE TABLE IF NOT EXISTS quote_idempotency (
      id BIGSERIAL PRIMARY KEY,
      idempotency_key VARCHAR(64) NOT NULL,
      status VARCHAR(24) NOT NULL CHECK (status IN ('processing', 'succeeded', 'retryable', 'failed')),
      lead_id BIGINT,
      last_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL,
      CONSTRAINT uq_quote_idempotency_key UNIQUE (idempotency_key)
    );
    CREATE INDEX IF NOT EXISTS idx_quote_idempotency_expires ON quote_idempotency (expires_at);

    CREATE TABLE IF NOT EXISTS quote_outbox (
      id BIGSERIAL PRIMARY KEY,
      idempotency_key VARCHAR(64) NOT NULL,
      lead_id BIGINT,
      payload JSONB NOT NULL,
      status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'retryable', 'failed')),
      attempts INT NOT NULL DEFAULT 0,
      next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_http_status INT,
      last_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uq_quote_outbox_idem_key UNIQUE (idempotency_key)
    );
  `);
  global.__dominoQuoteSchemaInitialized = true;
}

/**
 * Atomically claims the idempotency key, upserts the lead in `clientes`,
 * and inserts the event in `quote_outbox` inside a single PostgreSQL transaction.
 * If PostgreSQL is not configured, falls back to serialized process-safe idempotency tracking.
 */
export async function claimLeadAndEnqueueOutbox(params: {
  idempotencyKey: string;
  email: string;
  telefone: string;
  nome: string;
  empresa: string;
  vertical: string;
  demanda: string;
  doresArray: string[];
  outboxPayload: Record<string, unknown>;
}): Promise<ClaimAndPersistResult> {
  return withIdempotencyKeyLock(params.idempotencyKey, async () => {
    const now = Date.now();
    const expiresAtDate = new Date(now + IDEMPOTENCY_WINDOW_MS);
    const pool = getPool();

    if (pool) {
      let client;
      try {
        client = await pool.connect();
        await ensureQuoteTablesOnClient(client);

        await client.query('BEGIN');
        // Transaction-level advisory lock on idempotencyKey prevents concurrent race across containers
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
          `quote_idem:${params.idempotencyKey}`,
        ]);

        // Cleanup expired idempotency entries probabilistically (2%)
        if (Math.random() < 0.02) {
          await client.query('DELETE FROM quote_idempotency WHERE expires_at < NOW()');
        }

        const existingRes = await client.query<{
          status: IdempotencyStatus;
          expires_at: string;
          lead_id: number | null;
        }>(
          'SELECT status, expires_at, lead_id FROM quote_idempotency WHERE idempotency_key = $1',
          [params.idempotencyKey]
        );

        if (existingRes.rows.length > 0) {
          const existing = existingRes.rows[0];
          const isExpired = new Date(existing.expires_at).getTime() <= now;

          if (
            !isExpired &&
            (existing.status === 'processing' ||
              existing.status === 'succeeded' ||
              existing.status === 'retryable')
          ) {
            await client.query('COMMIT');
            return {
              deduplicated: true,
              dbPersisted: true,
              leadId: existing.lead_id,
              idempotencyStatus: existing.status,
            };
          }
        }

        // Upsert idempotency record as 'processing'
        await client.query(
          `INSERT INTO quote_idempotency (idempotency_key, status, expires_at, updated_at)
           VALUES ($1, 'processing', $2, NOW())
           ON CONFLICT (idempotency_key)
           DO UPDATE SET status = 'processing', expires_at = EXCLUDED.expires_at, updated_at = NOW(), last_error = NULL`,
          [params.idempotencyKey, expiresAtDate.toISOString()]
        );

        // Resolve servicosIds
        let servicosIds = params.demanda || 'Diagnóstico';
        if (params.doresArray.length > 0) {
          try {
            const servicosRes = await client.query<{ id: number }>(
              'SELECT id FROM servicos WHERE gargalo = ANY($1)',
              [params.doresArray]
            );
            if (servicosRes.rows.length > 0) {
              servicosIds = servicosRes.rows.map((row) => row.id).join(', ');
            } else {
              servicosIds = params.doresArray.join(', ').slice(0, 200);
            }
          } catch {
            servicosIds = params.doresArray.join(', ').slice(0, 200);
          }
        }

        const lookupEmail =
          params.email || `${params.telefone.replace(/\D/g, '')}@whatsapp.domino.local`;

        let leadId: number | null = null;
        const clientRes = await client.query<{ id: number }>(
          'SELECT id FROM clientes WHERE email = $1',
          [lookupEmail]
        );

        if (clientRes.rows.length > 0) {
          leadId = clientRes.rows[0].id;
          await client.query(
            'UPDATE clientes SET proposta = $1, whatsapp = COALESCE($2, whatsapp) WHERE email = $3',
            [servicosIds, params.telefone || null, lookupEmail]
          );
        } else {
          const insLead = await client.query<{ id: number }>(
            'INSERT INTO clientes (email, whatsapp, proposta) VALUES ($1, $2, $3) RETURNING id',
            [lookupEmail, params.telefone || null, servicosIds]
          );
          leadId = insLead.rows[0]?.id ?? null;
        }

        // Enqueue transactional outbox event
        await client.query(
          `INSERT INTO quote_outbox (idempotency_key, lead_id, payload, status, attempts, next_attempt_at, updated_at)
           VALUES ($1, $2, $3::jsonb, 'pending', 0, NOW(), NOW())
           ON CONFLICT (idempotency_key)
           DO UPDATE SET payload = EXCLUDED.payload, status = 'pending', next_attempt_at = NOW(), updated_at = NOW()`,
          [params.idempotencyKey, leadId, JSON.stringify(params.outboxPayload)]
        );

        // Mark idempotency as 'retryable' (durably persisted in DB + Outbox, awaiting webhook delivery)
        await client.query(
          `UPDATE quote_idempotency SET status = 'retryable', lead_id = $2, updated_at = NOW() WHERE idempotency_key = $1`,
          [params.idempotencyKey, leadId]
        );

        await client.query('COMMIT');

        // Mirror in fallback store for fast in-process visibility
        getFallbackIdempotencyStore().set(params.idempotencyKey, {
          status: 'retryable',
          expiresAt: now + IDEMPOTENCY_WINDOW_MS,
          leadId,
        });

        return {
          deduplicated: false,
          dbPersisted: true,
          leadId,
          idempotencyStatus: 'retryable',
        };
      } catch (dbErr) {
        if (client) {
          await client.query('ROLLBACK').catch(() => {});
        }
        console.error('Database transactional outbox error:', sanitizeDbErrorMessage(dbErr));
      } finally {
        client?.release();
      }
    }

    // Fallback when PostgreSQL is unavailable: check serialized fallback store
    const store = getFallbackIdempotencyStore();
    for (const [k, val] of store.entries()) {
      if (val.expiresAt <= now) {
        store.delete(k);
      }
    }

    const existingMem = store.get(params.idempotencyKey);
    if (
      existingMem &&
      existingMem.expiresAt > now &&
      (existingMem.status === 'processing' ||
        existingMem.status === 'succeeded' ||
        existingMem.status === 'retryable')
    ) {
      return {
        deduplicated: true,
        dbPersisted: false,
        leadId: existingMem.leadId,
        idempotencyStatus: existingMem.status,
      };
    }

    store.set(params.idempotencyKey, {
      status: 'processing',
      expiresAt: now + IDEMPOTENCY_WINDOW_MS,
      leadId: null,
    });

    return {
      deduplicated: false,
      dbPersisted: false,
      leadId: null,
      idempotencyStatus: 'processing',
    };
  });
}

/**
 * Updates the idempotency and outbox state after a webhook delivery attempt.
 */
export async function finalizeOutboxDeliveryStatus(
  idempotencyKey: string,
  outcome: WebhookDispatchOutcome,
  dbPersisted: boolean
): Promise<IdempotencyStatus> {
  const store = getFallbackIdempotencyStore();
  const now = Date.now();

  let nextIdemStatus: IdempotencyStatus;
  let nextOutboxStatus: OutboxStatus;

  if (outcome.ok) {
    nextIdemStatus = 'succeeded';
    nextOutboxStatus = 'delivered';
  } else if (outcome.retryable && dbPersisted) {
    nextIdemStatus = 'retryable';
    nextOutboxStatus = 'retryable';
  } else {
    nextIdemStatus = dbPersisted ? 'retryable' : 'failed';
    nextOutboxStatus = outcome.retryable ? 'retryable' : 'failed';
  }

  if (nextIdemStatus === 'failed' && !dbPersisted) {
    // Allow immediate retry by visitor if neither DB nor N8N succeeded
    store.delete(idempotencyKey);
  } else {
    store.set(idempotencyKey, {
      status: nextIdemStatus,
      expiresAt: now + IDEMPOTENCY_WINDOW_MS,
      leadId: store.get(idempotencyKey)?.leadId ?? null,
      lastError: outcome.errorMessage,
    });
  }

  const pool = getPool();
  if (pool && dbPersisted) {
    let client;
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      await client.query(
        `UPDATE quote_idempotency
         SET status = $2, last_error = $3, updated_at = NOW()
         WHERE idempotency_key = $1`,
        [idempotencyKey, nextIdemStatus, outcome.errorMessage ?? null]
      );
      await client.query(
        `UPDATE quote_outbox
         SET status = $2,
             attempts = attempts + 1,
             last_http_status = $3,
             last_error = $4,
             next_attempt_at = CASE WHEN $2 = 'retryable' THEN NOW() + INTERVAL '2 minutes' ELSE NOW() END,
             updated_at = NOW()
         WHERE idempotency_key = $1`,
        [idempotencyKey, nextOutboxStatus, outcome.httpStatus, outcome.errorMessage ?? null]
      );
      await client.query('COMMIT');
    } catch (err) {
      if (client) {
        await client.query('ROLLBACK').catch(() => {});
      }
      console.warn('Outbox status update warning:', sanitizeDbErrorMessage(err));
    } finally {
      client?.release();
    }
  }

  return nextIdemStatus;
}

/**
 * Outbox Worker: processes pending/retryable events from `quote_outbox` and delivers them to N8N.
 * Uses `FOR UPDATE SKIP LOCKED` so multiple workers/containers never process the same outbox row.
 */
export async function processPendingOutboxBatch(
  limit: number = 10,
  fetchImpl?: typeof fetch
): Promise<{ processed: number; delivered: number; failed: number }> {
  const pool = getPool();
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!pool || !webhookUrl) {
    return { processed: 0, delivered: 0, failed: 0 };
  }

  let client;
  try {
    client = await pool.connect();
    await ensureQuoteTablesOnClient(client);
    await client.query('BEGIN');

    const rowsRes = await client.query<{
      idempotency_key: string;
      payload: Record<string, unknown>;
      attempts: number;
    }>(
      `SELECT idempotency_key, payload, attempts
       FROM quote_outbox
       WHERE status IN ('pending', 'retryable')
         AND next_attempt_at <= NOW()
         AND attempts < 5
       ORDER BY created_at ASC
       LIMIT $1
       FOR UPDATE SKIP LOCKED`,
      [limit]
    );

    if (rowsRes.rows.length === 0) {
      await client.query('COMMIT');
      return { processed: 0, delivered: 0, failed: 0 };
    }

    const keys = rowsRes.rows.map((r) => r.idempotency_key);
    await client.query(
      `UPDATE quote_outbox SET status = 'processing', updated_at = NOW() WHERE idempotency_key = ANY($1)`,
      [keys]
    );
    await client.query('COMMIT');

    let delivered = 0;
    let failed = 0;

    for (const row of rowsRes.rows) {
      const outcome = await dispatchToN8NWithRetry(
        webhookUrl,
        row.payload,
        row.idempotency_key,
        { maxAttempts: 1, fetchImpl }
      );
      await finalizeOutboxDeliveryStatus(row.idempotency_key, outcome, true);
      if (outcome.ok) {
        delivered += 1;
      } else {
        failed += 1;
      }
    }

    return { processed: rowsRes.rows.length, delivered, failed };
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.warn('Outbox worker batch warning:', sanitizeDbErrorMessage(err));
    return { processed: 0, delivered: 0, failed: 0 };
  } finally {
    client?.release();
  }
}

