# DOMINO AUTOMATE V2.2 — CHANGELOG DE ENGENHARIA & HARDENING DISTRIBUÍDO

> **Data de Lançamento:** 07 de Novembro de 2026  
> **Status:** Produção / Validado (19/19 Testes Automatizados Aprovados, Build Next.js 16 SSG com 19 Rotas ○/ƒ)  
> **Arquitetura:** Hub & Spoke (Portal Raiz + 10 Verticais Especializadas)

---

## 1. RESUMO EXECUTIVO DAS EVOLUÇÕES (V2.1 -> V2.2)

A versão **V2.2** consolidou o ecossistema digital da **Domino Automate** como uma plataforma distribuída de alta resiliência, integridade de dados e conformidade estrita com padrões internacionais de engenharia de software, segurança ofensiva/defensiva (OWASP API Security) e acessibilidade (WCAG 2.1 AA).

---

## 2. DETALHAMENTO DAS MUDANÇAS POR FRENTE

### FRENTE 1 — Governança de Banco de Dados & Concorrência Distribuída
- **`migrations/001_domino_v2_2_schema.sql` & `src/lib/migrations.ts`:**
  - Criação da tabela de controle de migrações `schema_migrations`.
  - Normalização da tabela `clientes` com restrição `UNIQUE (email, telefone)`.
  - Tabela `servicos` com índices para consultas de dores e gargalos técnicos.
  - Tabela de controle de taxa persistente `domino_rate_limits` como tabela logada regular (eliminando overhead de UNLOGGED sem replicação segura).
  - Tabela de idempotência `quote_idempotency` com constraint `CHECK (status IN ('processing', 'succeeded', 'retryable', 'failed'))`.
  - Tabela de fila transacional `quote_outbox` com índice parcial `idx_quote_outbox_pending` para garantia de entrega de webhooks.
- **`src/lib/db.ts`:**
  - Dimensionamento do pool de conexões via `DB_POOL_MAX` para coexistir com múltiplas réplicas em contêineres Docker/Coolify sem esgotar conexões do PostgreSQL.
  - Configuração de `statement_timeout: 10000` (10 segundos) e `query_timeout: 10000`.
  - Registro de handler global `pool.on('error', ...)` impedindo crashes silenciosos.
  - Criação do helper `withTransaction<T>(client, fn)` garantindo atomicidade estrita (`BEGIN`, `COMMIT`, `ROLLBACK`).

### FRENTE 2 — Proteção de Requisições, Streaming & AppSec
- **`src/lib/bodyReader.ts`:**
  - Implementação de `readJsonBodyWithLimit(req, maxBytes)` que consome o fluxo de bytes chunk-by-chunk diretamente do stream HTTP da requisição.
  - Interrupção imediata com status `413 Payload Too Large` caso o payload exceda o limite, mesmo se o cliente omitir ou falsificar o header `Content-Length`.
  - Tratamento resiliente de payloads vazios (400), JSON inválido (400) e desconexões prematuras do cliente.
- **`src/lib/chatControl.ts` & `src/app/api/chat/route.ts`:**
  - Extração de rotinas anti-injeção e controle de diálogo para módulo de biblioteca puro, garantindo compatibilidade estrita com os tipos do App Router do Next.js 16.
  - `buildControlledConversationContents`: mapeamento restrito de turnos `'user'` e `'assistant'` para `'user'` e `'model'` do Gemini, garantindo início obrigatório com turno de usuário e alternância estrita.
  - Sanitização prévia de CPF, CNPJ e dados de cartão (`sanitizeIncomingPII`) antes do envio ao modelo LLM.

### FRENTE 3 — Rate Limiting Distribuído, IP Confiável & FinOps
- **`src/lib/rateLimit.ts`:**
  - Script Lua atômico (`REDIS_SLIDING_WINDOW_LUA`) executado via `EVAL` no Upstash Redis para janelas deslizantes atômicas sem race condition entre réplicas.
  - Janela deslizante em PostgreSQL com locks transacionais `pg_advisory_xact_lock(hashtext($1))` quando Redis não estiver configurado.
  - Mutex em memória por chave (`withKeySerialization`) serializando requisições simultâneas no mesmo worker.
  - Extração segura de IP (`extractClientIdentifier`) com suporte a `TRUST_PROXY` e `TRUSTED_PROXY_HOPS`, validação formal de sintaxe IPv4/IPv6 (`net.isIP`) e descarte de tokens forjados.
  - FinOps: métricas de requisições bloqueadas por namespace e consumo de tokens por vertical (`getFinOpsMetrics`).

### FRENTE 4 — Autenticação Firebase Admin & Comentários
- **`src/app/api/comments/route.ts` & `src/lib/commentsDb.ts`:**
  - Inicialização estrita com credenciais completas (`FIREBASE_SERVICE_ACCOUNT_KEY`, `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` ou `GOOGLE_APPLICATION_CREDENTIALS`).
  - Em ambiente de produção (`NODE_ENV === 'production'`), recusa expressamente a inicialização desprovida de credenciais com erro explicativo.
  - Rate limit prévio por IP e limite de tamanho de payload (8 KB) antes da validação do token Firebase.
  - Verificação de revogação de token (`checkRevoked: true`).
  - Projeção de colunas no banco de dados sem expor `user_email`.
  - Filtro heurístico anti-spam para bloqueio de postagens com links massivos.

### FRENTE 5 — Idempotência de Leads, Transactional Outbox & N8N
- **`src/lib/quoteOutbox.ts` & `src/app/api/quote/route.ts`:**
  - Deduplicação atômica de leads baseada em hash SHA-256 (`computeIdempotencyKey`).
  - Reivindicação atômica e enfileiramento na tabela `quote_outbox` antes da tentativa de webhook.
  - `dispatchToN8NWithRetry`: classificação estrita de status HTTP:
    - `2xx`: Sucesso (`delivered`).
    - `400, 401, 403, 404`: Erro de configuração permanente do cliente (`permanent_client_error`, `ok: false`, sem retries inúteis).
    - `429`: Limite de taxa temporário (`retryable_rate_limit`, respeitando header `Retry-After`).
    - `5xx`: Falha temporária de infraestrutura (`retryable_server_error`, com retry exponencial).
    - `Timeout`: Timeout de rede (`ambiguous_timeout`, preservado no outbox para reprocessamento seguro).
  - Assinatura criptográfica HMAC-SHA256 (`signWebhookPayloadHmac` e `verifyWebhookHmacSignature`) com tolerância anti-replay e comparação em tempo constante (`crypto.timingSafeEqual`).
  - Resposta do endpoint com status detalhado `deliveryStatus` (`'delivered' | 'delivered_webhook_only' | 'queued_outbox' | 'deduplicated'`).

### FRENTE 6 — Motor Matemático de ROI & Governança Econômica
- **`src/lib/roiEngine.ts`:**
  - Implementação do `EconomicPresentationContract` em todas as saídas de simulação.
  - Eliminação de piso artificial de 5%: premissas com taxas abaixo de 5% são respeitadas com exatidão matemática.
  - Aplicação de teto de 85% para evitar distorções econômicas irrealistas.
  - Regra de Payback: quando o custo mensal de manutenção supera o benefício econômico, o payback é formalmente declarado como `null` (`beneficioLiquidoMensal <= 0`).
  - Separação mandatória entre Faturamento Bruto e Margem de Contribuição, vedando categoricamente dupla contagem.
  - Premissa de contingência atuarial em `/Atuaria` (R$ 8.000) parametrizada e editável.

### FRENTE 7 — Acessibilidade WCAG 2.1 AA, UX & SEO
- **`src/components/segments/SegmentLandingTemplate.tsx` & `src/components/estudios/EstudiosLanding.tsx`:**
  - Associação explícita entre `label` e `input` via atributos `htmlFor` e `id` únicos em todos os sliders e campos de formulário.
  - Estados dinâmicos acessíveis com `aria-pressed` nos botões de cenário, subtipo de negócio e seleção de dores/gargalos.
  - Painéis recolhíveis e acordeões de FAQ com `aria-expanded`, `aria-controls` e `role="region"`.
  - Notificações de tela com `aria-live="polite"` nos resultados de simulação e alertas de erro com `role="alert" aria-live="assertive"`.
  - Tratamento de teclado: fechamento de menus mobile e modal de lightbox com tecla `Escape` e restauração de foco ao elemento acionador.
- **Metadados de OpenGraph:**
  - Declaração de dimensões reais de `1024 x 538` para o asset binário `/logo.png` em todas as rotas canônicas e no `RootLayout`.

### FRENTE 8 — Hardening de Build e Deploy Nixpacks/Coolify
- **`next.config.ts`:**
  - Adicionado `serverExternalPackages: ['firebase-admin', 'pg']` para preservar módulos nativos do Node no runtime de servidor.
- **`src/app/api/comments/route.ts`:**
  - Migração de `firebase-admin/app` e `firebase-admin/auth` para `import type` estático e carregamento dinâmico assíncrono via `await import(...)` em runtime, eliminando o conflito `ERR_REQUIRE_ESM` do empacotador Webpack durante a coleta de páginas estáticas.

---

## 3. SUITE DE TESTES E VALIDAÇÃO DE BUILD

- **Suite Automatizada (`src/__tests__/domino-v2.test.ts`):** 19 testes em 7 suites executados com `node --test` nativo (100% aprovados, 0 falhas).
- **TypeScript Strict Mode (`npx tsc --noEmit`):** 0 erros de compilação ou tipagem.
- **Build de Produção Next.js 16 (`npm run build`):** 19 rotas compiladas e geradas com sucesso (14 rotas estáticas pré-renderizadas e 5 rotas dinâmicas de API).

