import { QuoteRequestSchema } from '../../../lib/schemas.ts';
import {
  checkRateLimit,
  extractClientIdentifier,
  buildRateLimitHeaders,
  withCircuitBreaker,
} from '../../../lib/rateLimit.ts';
import { readJsonBodyWithLimit } from '../../../lib/bodyReader.ts';
import {
  computeIdempotencyKey,
  claimLeadAndEnqueueOutbox,
  dispatchToN8NWithRetry,
  finalizeOutboxDeliveryStatus,
  type WebhookDispatchOutcome,
} from '../../../lib/quoteOutbox.ts';

const MAX_QUOTE_PAYLOAD_BYTES = 32_768; // 32 KB

export async function POST(req: Request) {
  const bodyRead = await readJsonBodyWithLimit(req, MAX_QUOTE_PAYLOAD_BYTES);
  if (!bodyRead.ok) {
    return Response.json(
      { success: false, error: bodyRead.error },
      { status: bodyRead.status }
    );
  }

  const rawBody = bodyRead.data;

  // Anti-spam honeypot check before anything else
  if (
    typeof rawBody === 'object' &&
    rawBody !== null &&
    'b_website_check' in rawBody &&
    String((rawBody as Record<string, unknown>).b_website_check ?? '').trim() !== ''
  ) {
    return Response.json({
      success: true,
      deliveryStatus: 'honeypot_ignored',
      message: 'Processado.',
    });
  }

  const parsed = QuoteRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: 'Verifique os campos informados no formulário.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const clientId = extractClientIdentifier(req);

  const { result: rlResult, releaseConcurrency } = await checkRateLimit(clientId, {
    namespace: 'quote',
    windowMs: 5 * 60_000,
    maxRequests: 6,
    maxConcurrent: 2,
    vertical: data.vertical,
  });

  const rlHeaders = buildRateLimitHeaders(rlResult);

  if (!rlResult.allowed) {
    releaseConcurrency();
    return Response.json(
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
    if (data.simulador) {
      formattedDescricao += `Simulador ROI (${data.simulador.scenario}): val1=${data.simulador.val1}, val2=${data.simulador.val2}, val3=${data.simulador.val3}, margem=${data.simulador.customMarginPct ?? '-'}%, impactoMensal=R$ ${data.simulador.impactoMensal}\n`;
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
      ...(data.simulador ? { simulador: data.simulador } : {}),
      idempotencyKey,
      created_at: new Date().toISOString(),
    };

    // 1. Claim idempotency key + persist lead + enqueue outbox event atomically
    const claimResult = await claimLeadAndEnqueueOutbox({
      idempotencyKey,
      email: data.email,
      telefone: data.telefone,
      nome: data.nome,
      empresa: data.empresa,
      vertical: data.vertical || data.origem,
      demanda: data.demanda,
      doresArray: data.doresArray,
      outboxPayload: payloadToN8N,
    });

    if (claimResult.deduplicated) {
      return Response.json(
        {
          success: true,
          deduplicated: true,
          deliveryStatus: 'deduplicated',
          message: 'Solicitação já registrada recentemente.',
        },
        { headers: rlHeaders }
      );
    }

    const dbSucceeded = claimResult.dbPersisted;
    let n8nSucceeded = false;
    let dispatchOutcome: WebhookDispatchOutcome = {
      ok: false,
      retryable: true,
      classification: 'network_error',
      httpStatus: null,
      errorMessage: 'Webhook URL not configured',
    };

    // 2. Attempt immediate outbox delivery to N8N Webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        dispatchOutcome = await withCircuitBreaker(
          'n8n-webhook',
          async () => {
            const outcome = await dispatchToN8NWithRetry(
              webhookUrl,
              payloadToN8N,
              idempotencyKey
            );
            // Trip circuit breaker only on 5xx / timeout / network errors, NOT on 4xx client errors
            if (
              !outcome.ok &&
              (outcome.classification === 'retryable_server_error' ||
                outcome.classification === 'ambiguous_timeout' ||
                outcome.classification === 'network_error')
            ) {
              const err = new Error(outcome.errorMessage || 'N8N transient failure') as Error & {
                outcome?: WebhookDispatchOutcome;
              };
              err.outcome = outcome;
              throw err;
            }
            return outcome;
          },
          { failureThreshold: 4, cooldownMs: 20_000 }
        );
        n8nSucceeded = dispatchOutcome.ok;
      } catch (webhookErr) {
        const attached = (webhookErr as { outcome?: WebhookDispatchOutcome })?.outcome;
        if (attached) {
          dispatchOutcome = attached;
        }
        n8nSucceeded = false;
      }
    }

    await finalizeOutboxDeliveryStatus(idempotencyKey, dispatchOutcome, dbSucceeded);

    // If neither PostgreSQL nor N8N succeeded, return 503 so visitor can retry or use WhatsApp
    if (!dbSucceeded && !n8nSucceeded) {
      return Response.json(
        {
          success: false,
          deliveryStatus: 'failed',
          error:
            'Serviço temporariamente indisponível. Tente novamente em instantes ou chame no WhatsApp.',
        },
        { status: 503, headers: rlHeaders }
      );
    }

    const deliveryStatus =
      n8nSucceeded && dbSucceeded
        ? 'delivered'
        : n8nSucceeded
          ? 'delivered_webhook_only'
          : 'queued_outbox';

    const message = n8nSucceeded
      ? 'Diagnóstico recebido e encaminhado para automação.'
      : 'Diagnóstico registrado com segurança no banco de dados e agendado na fila de entrega.';

    return Response.json(
      {
        success: true,
        deduplicated: false,
        deliveryStatus,
        dbPersisted: dbSucceeded,
        n8nDelivered: n8nSucceeded,
        message,
      },
      { headers: rlHeaders }
    );
  } catch (error) {
    console.error('Quote API Error:', (error as Error).message);
    return Response.json(
      { success: false, error: 'Erro interno ao processar solicitação.' },
      { status: 500, headers: rlHeaders }
    );
  } finally {
    releaseConcurrency();
  }
}
