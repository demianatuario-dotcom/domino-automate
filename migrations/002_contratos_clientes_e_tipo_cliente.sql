-- ============================================================================
-- DOMINO AUTOMATE V2.2 — VERSIONED POSTGRESQL MIGRATION (002)
-- Tabela "Tipo_Cliente" + Renomeação clientes -> "Contratos_Clientes"
-- ============================================================================

-- 1. Tabela de domínio Tipo_Cliente (Verticais oficiais da Domino Automate)
CREATE TABLE IF NOT EXISTS public."Tipo_Cliente" (
  "Tipo" VARCHAR(5) PRIMARY KEY CHECK ("Tipo" ~ '^[A-Z]+$'),
  "Atividade" VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO public."Tipo_Cliente" ("Tipo", "Atividade") VALUES
  ('A', 'ATUÁRIA, PREVIDÊNCIA & RISCOS'),
  ('B', 'JURÍDICO & SOCIEDADES DE ADVOGADOS'),
  ('C', 'CONTÁBIL, FISCAL & BPO FINANCEIRO'),
  ('D', 'ESTÉTICA AVANÇADA, LASH & BROW'),
  ('E', 'HAIR STUDIOS & SALÕES MULTIPROFISSIONAIS'),
  ('F', 'BARBERSHOPS & CLUBES DE ASSINATURA'),
  ('G', 'CLÍNICAS ODONTOLÓGICAS & ESPECIALIDADES'),
  ('H', 'DROGARIAS & FARMÁCIAS DE MANIPULAÇÃO'),
  ('I', 'ÓTICAS, ARMAÇÕES & LENTES DE PRECISÃO'),
  ('J', 'COMÉRCIO FÍSICO, LOJAS & FRANQUIAS')
ON CONFLICT ("Tipo") DO UPDATE
  SET "Atividade" = EXCLUDED."Atividade";

-- 2. Renomear public.clientes -> public."Contratos_Clientes" (idempotente)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'clientes'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Contratos_Clientes'
  ) THEN
    ALTER TABLE public.clientes RENAME TO "Contratos_Clientes";
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public."Contratos_Clientes"'::regclass
      AND conname = 'clientes_pkey'
  ) THEN
    ALTER TABLE public."Contratos_Clientes"
      RENAME CONSTRAINT clientes_pkey TO "Contratos_Clientes_pkey";
  END IF;
END $$;

-- 3. Acrescentar coluna "Tipo_Cliente" (1 caractere) + FK + índice
ALTER TABLE public."Contratos_Clientes"
  ADD COLUMN IF NOT EXISTS "Tipo_Cliente" CHAR(1);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public."Contratos_Clientes"'::regclass
      AND conname = 'fk_contratos_clientes_tipo_cliente'
  ) THEN
    ALTER TABLE public."Contratos_Clientes"
      ADD CONSTRAINT fk_contratos_clientes_tipo_cliente
      FOREIGN KEY ("Tipo_Cliente")
      REFERENCES public."Tipo_Cliente" ("Tipo")
      ON UPDATE CASCADE
      ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_contratos_clientes_tipo_cliente
  ON public."Contratos_Clientes" ("Tipo_Cliente");
