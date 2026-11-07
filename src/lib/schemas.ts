import { z } from 'zod';

export const VALID_NICHES = [
  'atuaria',
  'estudios',
  'saloes',
  'barbearias',
  'advocacia',
  'contabilidade',
  'farmacias',
  'oticas',
  'odontologia',
  'varejo',
] as const;

export type ValidNiche = (typeof VALID_NICHES)[number];

export const MAX_CHAT_HISTORY_TURNS = 10;
export const MAX_CHAT_TURN_CHARS = 1500;
export const MAX_CHAT_HISTORY_TOTAL_CHARS = 6000;

/**
 * Controlled conversation history turn.
 * Only 'user' and 'assistant' conversational turns are permitted;
 * 'system', 'developer', 'tool', 'function' or privileged roles are strictly rejected.
 */
export const ChatHistoryItemSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(MAX_CHAT_TURN_CHARS),
  })
  .strict();

export const ChatRequestSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, 'A mensagem não pode estar vazia.')
      .max(MAX_CHAT_TURN_CHARS, 'A mensagem excede o limite de 1500 caracteres.'),
    history: z
      .array(ChatHistoryItemSchema)
      .max(MAX_CHAT_HISTORY_TURNS)
      .optional()
      .default([])
      .refine(
        (items) =>
          items.reduce((sum, item) => sum + item.content.length, 0) <=
          MAX_CHAT_HISTORY_TOTAL_CHARS,
        {
          message: `O histórico excede o limite total de ${MAX_CHAT_HISTORY_TOTAL_CHARS} caracteres.`,
        }
      ),
    niche: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val): val is ValidNiche => (VALID_NICHES as readonly string[]).includes(val), {
        message: 'Segmento inválido.',
      })
      .optional()
      .default('atuaria'),
    sessionId: z.string().trim().max(80).optional(),
  })
  .strict();

export type ChatRequestInput = z.infer<typeof ChatRequestSchema>;

export const StructuredQualificationSchema = z
  .object({
    shouldOfferDiagnostic: z.boolean().default(false),
    gargalos: z.array(z.string().trim().max(140)).max(6).default([]),
    detalhes: z.string().trim().max(600).default(''),
  })
  .strict();

export const StructuredAIResponseSchema = z
  .object({
    reply: z.string().trim().min(1).max(3000),
    qualification: StructuredQualificationSchema.optional(),
  })
  .strict();

const cleanPhoneRegex = /^[0-9+\-()\s]{8,22}$/;

export const QuoteSimulatorSchema = z
  .object({
    val1: z.number(),
    val2: z.number(),
    val3: z.number(),
    scenario: z.enum(['conservador', 'referencia', 'otimista']),
    customMarginPct: z.number().optional(),
    impactoMensal: z.number(),
  })
  .strict();

export const QuoteRequestSchema = z
  .object({
    vertical: z.string().trim().max(60).optional().default('/Atuaria'),
    origem: z.string().trim().max(80).optional().default('/Atuaria'),
    nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
    empresa: z.string().trim().max(150).optional().default(''),
    email: z
      .union([z.string().trim().email('E-mail inválido.').max(160), z.literal('')])
      .optional()
      .default(''),
    telefone: z
      .string()
      .trim()
      .max(25)
      .refine((val) => val === '' || cleanPhoneRegex.test(val), {
        message: 'Telefone/WhatsApp inválido.',
      })
      .optional()
      .default(''),
    tipo_organizacao: z.string().trim().max(120).optional().default(''),
    demanda: z.string().trim().max(160).optional().default('Diagnóstico Estratégico'),
    dores: z.string().trim().max(1000).optional().default(''),
    doresArray: z.array(z.string().trim().max(160)).max(15).optional().default([]),
    descricao: z.string().trim().max(3000).optional().default(''),
    perguntas_respostas: z.record(z.string().max(200), z.string().max(1000)).optional().default({}),
    lgpdConsent: z.literal(true),
    simulador: QuoteSimulatorSchema.optional(),
    sessionId: z.string().trim().max(80).optional(),
    b_website_check: z.string().max(120).optional().default(''),
  })
  .strict();

export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;

export const CommentRequestSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(2, 'O comentário não pode ser vazio.')
      .max(1000, 'Comentário muito longo.'),
    parentId: z.union([z.number().int().positive(), z.null()]).optional().default(null),
  })
  .strict();
