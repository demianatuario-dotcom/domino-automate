import { getPool } from './db.ts';

export interface RateLimitPolicy {
  namespace: 'chat' | 'quote' | 'comments';
  windowMs: number;
  maxRequests: number;
  maxConcurrent?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number;
  retryAfterSec: number;
}

interface SlidingWindowEntry {
  timestamps: number[];
  activeConcurrent: number;
}

declare global {
  var __dominoRateLimitStore: Map<string, SlidingWindowEntry> | undefined;
  var __dominoPgRateTableInitialized: boolean | undefined;
  var __dominoCircuitBreakers: Map<
    string,
    { failures: number; openedAt: number | null }
  > | undefined;
}

function getLocalStore(): Map<string, SlidingWindowEntry> {
  if (!global.__dominoRateLimitStore) {
    global.__dominoRateLimitStore = new Map();
  }
  return global.__dominoRateLimitStore;
}

export function extractClientIdentifier(req: Request, sessionId?: string): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');
  const rawIp = forwarded ? forwarded.split(',')[0].trim() : realIp?.trim() || '127.0.0.1';
  const cleanSession = sessionId ? sessionId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) : '';
  return cleanSession ? `${rawIp}:${cleanSession}` : rawIp;
}

async function checkUpstashSlidingWindow(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const now = Date.now();
  const windowStart = now - windowMs;
  const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const pipeline = [
      ['ZREMRANGEBYSCORE', key, '0', String(windowStart)],
      ['ZADD', key, String(now), member],
      ['ZCARD', key],
      ['PEXPIRE', key, String(windowMs)],
    ];

    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { result: number }[];
    const count = Number(data?.[2]?.result ?? 1);
    const allowed = count <= maxRequests;
    const remaining = Math.max(0, maxRequests - count);
    const resetAtMs = now + windowMs;

    return {
      allowed,
      limit: maxRequests,
      remaining,
      resetAtMs,
      retryAfterSec: allowed ? 0 : Math.ceil(windowMs / 1000),
    };
  } catch {
    return null;
  }
}

async function recordPgSlidingWindow(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult | null> {
  const pool = getPool();
  if (!pool) return null;

  let client;
  try {
    client = await pool.connect();
    if (!global.__dominoPgRateTableInitialized) {
      await client.query(`
        CREATE UNLOGGED TABLE IF NOT EXISTS domino_rate_limits (
          rate_key VARCHAR(160) NOT NULL,
          hit_at BIGINT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_domino_rate_limits_key_hit ON domino_rate_limits (rate_key, hit_at);
      `);
      global.__dominoPgRateTableInitialized = true;
    }

    const now = Date.now();
    const windowStart = now - windowMs;

    await client.query('DELETE FROM domino_rate_limits WHERE hit_at < $1', [windowStart]);
    const countRes = await client.query<{ cnt: string }>(
      'SELECT COUNT(*)::text AS cnt FROM domino_rate_limits WHERE rate_key = $1 AND hit_at >= $2',
      [key, windowStart]
    );

    const currentCount = parseInt(countRes.rows[0]?.cnt ?? '0', 10);
    if (currentCount >= maxRequests) {
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAtMs: now + windowMs,
        retryAfterSec: Math.ceil(windowMs / 1000),
      };
    }

    await client.query('INSERT INTO domino_rate_limits (rate_key, hit_at) VALUES ($1, $2)', [
      key,
      now,
    ]);

    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - (currentCount + 1)),
      resetAtMs: now + windowMs,
      retryAfterSec: 0,
    };
  } catch {
    return null;
  } finally {
    client?.release();
  }
}

export async function checkRateLimit(
  identifier: string,
  policy: RateLimitPolicy
): Promise<{ result: RateLimitResult; releaseConcurrency: () => void }> {
  const key = `rl:${policy.namespace}:${identifier}`;
  const store = getLocalStore();
  const now = Date.now();
  const windowStart = now - policy.windowMs;

  const entry = store.get(key) ?? { timestamps: [], activeConcurrent: 0 };
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (policy.maxConcurrent && entry.activeConcurrent >= policy.maxConcurrent) {
    store.set(key, entry);
    return {
      result: {
        allowed: false,
        limit: policy.maxRequests,
        remaining: 0,
        resetAtMs: now + 5000,
        retryAfterSec: 5,
      },
      releaseConcurrency: () => {},
    };
  }

  entry.activeConcurrent += 1;
  store.set(key, entry);

  const releaseConcurrency = () => {
    const current = store.get(key);
    if (current) {
      current.activeConcurrent = Math.max(0, current.activeConcurrent - 1);
      store.set(key, current);
    }
  };

  // Fast L1 rejection if already over limit in current worker
  if (entry.timestamps.length >= policy.maxRequests) {
    const oldest = entry.timestamps[0] ?? now;
    const resetAtMs = oldest + policy.windowMs;
    return {
      result: {
        allowed: false,
        limit: policy.maxRequests,
        remaining: 0,
        resetAtMs,
        retryAfterSec: Math.max(1, Math.ceil((resetAtMs - now) / 1000)),
      },
      releaseConcurrency,
    };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  // Distributed L2 check: Upstash Redis (if configured) -> PostgreSQL UNLOGGED table -> L1 fallback
  const upstashRes = await checkUpstashSlidingWindow(key, policy.windowMs, policy.maxRequests);
  if (upstashRes) {
    return { result: upstashRes, releaseConcurrency };
  }

  const pgRes = await recordPgSlidingWindow(key, policy.windowMs, policy.maxRequests);
  if (pgRes) {
    return { result: pgRes, releaseConcurrency };
  }

  return {
    result: {
      allowed: true,
      limit: policy.maxRequests,
      remaining: Math.max(0, policy.maxRequests - entry.timestamps.length),
      resetAtMs: now + policy.windowMs,
      retryAfterSec: 0,
    },
    releaseConcurrency,
  };
}

export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAtMs / 1000)),
    ...(result.retryAfterSec > 0 ? { 'Retry-After': String(result.retryAfterSec) } : {}),
  };
}

/**
 * Simple Circuit Breaker for external services (Gemini API, N8N Webhook)
 */
export async function withCircuitBreaker<T>(
  serviceName: string,
  fn: () => Promise<T>,
  options: { failureThreshold?: number; cooldownMs?: number } = {}
): Promise<T> {
  const failureThreshold = options.failureThreshold ?? 4;
  const cooldownMs = options.cooldownMs ?? 30_000;

  if (!global.__dominoCircuitBreakers) {
    global.__dominoCircuitBreakers = new Map();
  }

  const state = global.__dominoCircuitBreakers.get(serviceName) ?? {
    failures: 0,
    openedAt: null,
  };

  if (state.openedAt !== null) {
    const elapsed = Date.now() - state.openedAt;
    if (elapsed < cooldownMs) {
      throw new Error(`Circuit breaker open for ${serviceName}`);
    }
    // Half-open attempt
    state.openedAt = null;
  }

  try {
    const result = await fn();
    state.failures = 0;
    state.openedAt = null;
    global.__dominoCircuitBreakers.set(serviceName, state);
    return result;
  } catch (err) {
    state.failures += 1;
    if (state.failures >= failureThreshold) {
      state.openedAt = Date.now();
    }
    global.__dominoCircuitBreakers.set(serviceName, state);
    throw err;
  }
}
