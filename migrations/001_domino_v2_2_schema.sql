-- ============================================================================
-- DOMINO AUTOMATE V2.2 — VERSIONED POSTGRESQL MIGRATION (001)
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(64) PRIMARY KEY,
  description TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Clientes (Leads)
CREATE TABLE IF NOT EXISTS clientes (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(160) NOT NULL,
  whatsapp VARCHAR(32),
  proposta TEXT,
  nome VARCHAR(120),
  empresa VARCHAR(150),
  vertical VARCHAR(60) DEFAULT '/Atuaria',
  lgpd_consent BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_clientes_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_clientes_vertical_created ON clientes (vertical, created_at DESC);

-- 2. Serviços / Gargalos Técnicos (/Atuaria)
CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  gargalo VARCHAR(200) NOT NULL UNIQUE,
  justificativa TEXT NOT NULL,
  atividades TEXT,
  pergunta TEXT,
  implantacao NUMERIC(12, 2),
  manutencao NUMERIC(12, 2)
);

-- 3. Comentários Autenticados (/Atuaria)
CREATE TABLE IF NOT EXISTS comentarios (
  id BIGSERIAL PRIMARY KEY,
  user_name VARCHAR(80) NOT NULL,
  user_email VARCHAR(160),
  user_image TEXT,
  provider VARCHAR(40) NOT NULL DEFAULT 'firebase',
  content VARCHAR(1000) NOT NULL,
  parent_id BIGINT REFERENCES comentarios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_created_at ON comentarios (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_parent_id ON comentarios (parent_id);

-- 4. Rate Limiting Distribuído & Orçamento Diário FinOps (Logged Table para sobreviver a restart)
CREATE TABLE IF NOT EXISTS domino_rate_limits (
  id BIGSERIAL PRIMARY KEY,
  rate_key VARCHAR(180) NOT NULL,
  hit_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_domino_rate_limits_key_hit ON domino_rate_limits (rate_key, hit_at);

-- 5. Idempotência Distribuída de Leads (/api/quote)
CREATE TABLE IF NOT EXISTS quote_idempotency (
  id BIGSERIAL PRIMARY KEY,
  idempotency_key VARCHAR(64) NOT NULL,
  status VARCHAR(24) NOT NULL CHECK (status IN ('processing', 'succeeded', 'retryable', 'failed')),
  lead_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT uq_quote_idempotency_key UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_quote_idempotency_expires ON quote_idempotency (expires_at);

-- 6. Transactional Outbox para Entrega Confiável ao N8N
CREATE TABLE IF NOT EXISTS quote_outbox (
  id BIGSERIAL PRIMARY KEY,
  idempotency_key VARCHAR(64) NOT NULL REFERENCES quote_idempotency(idempotency_key) ON DELETE CASCADE,
  lead_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_quote_outbox_pending ON quote_outbox (status, next_attempt_at)
  WHERE status IN ('pending', 'retryable');

