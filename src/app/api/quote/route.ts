import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPool } from '@/lib/db';
import { QuoteRequestSchema } from '@/lib/schemas';
import {
  checkRateLimit,
  extractClientIdentifier,
  buildRateLimitHeaders,
  withCircuitBreaker,
} from '@/lib/rateLimit';

const MAX_QUOTE_PAYLOAD_BYTES = 32_768; // 32 KB
const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

declare global {
  var __dominoQuoteIdempotencyMap: Map<string, number> | undefined;
}

function getIdempotencyMap(): Map<string, number> {
  if (!global.__dominoQuoteIdempotencyMap) {
    global.__dominoQuoteIdempotencyMap = new Map();
  }
  return global.__dominoQuoteIdempotencyMap;
}

function computeIdempotencyKey(input: {
  email: string;
  telefone: string;
  vertical: string;
  demanda: string;
  nome: string;
}): string {
  const raw = [
    input.email.toLowerCase(),
    input.telefone.replace(/\D/g, ''),
    input.vertical.toLowerCase(),
    input.demanda.toLowerCase(),
    input.nome.toLowerCase(),
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

async function dispatchToN8NWithRetry(
  webhookUrl: string,
  payload: Record<string, unknown>,
  idempotencyKey: string
): Promise<void> {
  const bodyStr = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const secret = process.env.N8N_WEBHOOK_SECRET || '';
  const signature = secret
    ? crypto.createHmac('sha256', secret).update(`${timestamp}.${bodyStr}`).digest('hex')
    : '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Source-Origin': 'domino-automate-web',
    'X-Idempotency-Key': idempotencyKey,
    'X-Webhook-Timestamp': timestamp,
    ...(signature ? { 'X-Webhook-Signature': `sha256=${signature}` } : {}),
  };

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: bodyStr,
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        return;
      }

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        console.warn('N8N Webhook returned client status:', response.status);
        return;
      }

      lastErr = new Error(`N8N HTTP ${response.status}`);
    } catch (err) {
      lastErr = err;
    }

    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastErr;
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_QUOTE_PAYLOAD_BYTES) {
    return NextResponse.json(
      { success: false, error: 'Payload excede o limite permitido.' },
      { status: 413 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'JSON inválido.' }, { status: 400 });
  }

  // Anti-spam honeypot check before anything else
  if (
    typeof rawBody === 'object' &&
    rawBody !== null &&
    'b_website_check' in rawBody &&
    String((rawBody as Record<string, unknown>).b_website_check ?? '').trim() !== ''
  ) {
    return NextResponse.json({ success: true, message: 'Processado.' });
  }

  const parsed = QuoteRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Verifique os campos informados no formulário.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const clientId = extractClientIdentifier(req, data.sessionId);

  const { result: rlResult, releaseConcurrency } = await checkRateLimit(clientId, {
    namespace: 'quote',
    windowMs: 5 * 60_000,
    maxRequests: 6,
    maxConcurrent: 2,
  });

  const rlHeaders = buildRateLimitHeaders(rlResult);

  if (!rlResult.allowed) {
    releaseConcurrency();
    return NextResponse.json(
      {
        success: false,
        error: 'Muitas solicitações enviadas recentemente. Aguarde alguns minutos ou chame no WhatsApp.',
      },
      { status: 429, headers: rlHeaders }
    );
  }

  try {
    const idempotencyKey = computeIdempotencyKey({
      email: data.email,
      telefone: data.telefone,
      vertical: data.vertical || data.origem,
      demanda: data.demanda,
      nome: data.nome,
    });

    const idemMap = getIdempotencyMap();
    const now = Date.now();
    for (const [k, ts] of idemMap.entries()) {
      if (now - ts > IDEMPOTENCY_WINDOW_MS) {
        idemMap.delete(k);
      }
    }

    if (idemMap.has(idempotencyKey)) {
      return NextResponse.json(
        {
          success: true,
          deduplicated: true,
          message: 'Solicitação já registrada recentemente.',
        },
        { headers: rlHeaders }
      );
    }

    idemMap.set(idempotencyKey, now);

    let formattedDescricao = '';
    if (data.vertical || data.origem) {
      formattedDescricao += `Vertical / Origem: ${data.vertical || data.origem}\n`;
    }
    if (data.tipo_organizacao) {
      formattedDescricao += `Tipo de Organização / Operação: ${data.tipo_organizacao}\n`;
    }
    if (data.demanda) {
      formattedDescricao += `Demanda Principal: ${data.demanda}\n`;
    }
    if (data.empresa) {
      formattedDescricao += `Empresa / Estabelecimento: ${data.empresa}\n`;
    }
    if (formattedDescricao) {
      formattedDescricao += '\n';
    }

    if (data.descricao) {
      formattedDescricao += `Detalhamento da Demanda:\n${data.descricao.trim()}\n\n`;
    }

    if (data.perguntas_respostas && Object.keys(data.perguntas_respostas).length > 0) {
      formattedDescricao += 'Respostas aos questionamentos específicos:\n';
      for (const [dor, resposta] of Object.entries(data.perguntas_respostas)) {
        formattedDescricao += `- Referente a: "${dor}"\n  Resposta: ${resposta}\n\n`;
      }
    }

    const payloadToN8N: Record<string, unknown> = {
      vertical: data.vertical,
      origem: data.origem || data.vertical || '/Atuaria',
      nome: data.nome,
      empresa: data.empresa,
      email: data.email,
      telefone: data.telefone,
      tipo_organizacao: data.tipo_organizacao,
      demanda: data.demanda,
      dores: data.dores,
      doresArray: data.doresArray,
      descricao: formattedDescricao.trim(),
      lgpdConsent: data.lgpdConsent,
      idempotencyKey,
      created_at: new Date().toISOString(),
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await withCircuitBreaker(
          'n8n-webhook',
          () => dispatchToN8NWithRetry(webhookUrl, payloadToN8N, idempotencyKey),
          { failureThreshold: 4, cooldownMs: 20_000 }
        );
      } catch (webhookErr) {
        console.warn('N8N Webhook dispatch warning:', (webhookErr as Error).message);
      }
    }

    // Persist lead in PostgreSQL using shared Pool singleton
    const pool = getPool();
    if (pool && (data.email || data.telefone)) {
      let client;
      try {
        client = await pool.connect();

        let servicosIds = data.demanda || 'Diagnóstico';
        if (data.doresArray && data.doresArray.length > 0) {
          const servicosRes = await client.query<{ id: number }>(
            'SELECT id FROM servicos WHERE gargalo = ANY($1)',
            [data.doresArray]
          );
          if (servicosRes.rows.length > 0) {
            servicosIds = servicosRes.rows.map((row) => row.id).join(', ');
          } else {
            servicosIds = data.doresArray.join(', ').slice(0, 200);
          }
        }

        const lookupEmail =
          data.email || `${data.telefone.replace(/\D/g, '')}@whatsapp.domino.local`;

        const clientRes = await client.query<{ id: number }>(
          'SELECT id FROM clientes WHERE email = $1',
          [lookupEmail]
        );

        if (clientRes.rows.length > 0) {
          await client.query('UPDATE clientes SET proposta = $1, whatsapp = COALESCE($2, whatsapp) WHERE email = $3', [
            servicosIds,
            data.telefone || null,
            lookupEmail,
          ]);
        } else {
          await client.query(
            'INSERT INTO clientes (email, whatsapp, proposta) VALUES ($1, $2, $3)',
            [lookupEmail, data.telefone || null, servicosIds]
          );
        }
      } catch (dbError) {
        console.error('Database operation failed:', (dbError as Error).message);
      } finally {
        client?.release();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Proposta encaminhada via N8N.',
      },
      { headers: rlHeaders }
    );
  } catch (error) {
    console.error('Quote API Error:', (error as Error).message);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao encaminhar proposta.' },
      { status: 500, headers: rlHeaders }
    );
  } finally {
    releaseConcurrency();
  }
}
