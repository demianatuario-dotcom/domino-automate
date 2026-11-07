import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SEGMENTS_CONFIG } from '../config/segmentsConfig.ts';
import { calculateSegmentROI } from '../lib/roiEngine.ts';
import {
  ChatRequestSchema,
  QuoteRequestSchema,
  CommentRequestSchema,
  StructuredAIResponseSchema,
} from '../lib/schemas.ts';
import { checkRateLimit } from '../lib/rateLimit.ts';
import { resolveCanonicalRedirect, CANONICAL_ROUTES } from '../lib/canonicalRoutes.ts';
import sitemap from '../app/sitemap.ts';
import robots from '../app/robots.ts';

type ConfiguredSegmentKey = keyof typeof SEGMENTS_CONFIG;

describe('Domino Automate V2 — Suite de Testes Automatizados (Frente 7)', () => {
  describe('1. Validação do Motor de Composição Visual (SegmentConfig)', () => {
    const expectedIds: ConfiguredSegmentKey[] = [
      'saloes',
      'barbearias',
      'advocacia',
      'contabilidade',
      'farmacias',
      'oticas',
      'odontologia',
      'varejo',
    ];

    it('deve conter todas as 8 verticais parametrizadas com campos obrigatórios e sem any', () => {
      for (const id of expectedIds) {
        const cfg = SEGMENTS_CONFIG[id];
        assert.ok(cfg, `Configuração ausente para ${id}`);
        assert.equal(cfg.key, id);
        assert.ok(cfg.slug.startsWith('/'), `Slug inválido em ${id}`);
        assert.ok(cfg.layoutStrategy, `layoutStrategy ausente em ${id}`);
        assert.ok(Array.isArray(cfg.sectionOrder) && cfg.sectionOrder.length >= 5, `sectionOrder inválido em ${id}`);
        assert.equal(cfg.pas.pains.length, 3, `pas.pains deve ter 3 itens em ${id}`);
        assert.equal(cfg.pillars.items.length, 3, `pillars.items deve ter 3 itens em ${id}`);
        assert.ok(cfg.technicalProof.whatsappDemo.messages.length >= 2, `whatsappDemo.messages ausente em ${id}`);
        assert.ok(cfg.technicalProof.beforeAfter.beforeItems.length >= 2, `beforeAfter.beforeItems ausente em ${id}`);
        assert.equal(cfg.technicalProof.workflowSteps.length, 4, `workflowSteps deve ter 4 etapas em ${id}`);
      }
    });

    it('deve configurar Light Mode padrão nas 4 verticais clínicas/corporativas selecionadas', () => {
      assert.equal(SEGMENTS_CONFIG.odontologia.defaultThemeMode, 'light');
      assert.equal(SEGMENTS_CONFIG.farmacias.defaultThemeMode, 'light');
      assert.equal(SEGMENTS_CONFIG.contabilidade.defaultThemeMode, 'light');
      assert.equal(SEGMENTS_CONFIG.varejo.defaultThemeMode, 'light');
      assert.ok(SEGMENTS_CONFIG.odontologia.lightTheme);
      assert.ok(SEGMENTS_CONFIG.farmacias.lightTheme);
      assert.ok(SEGMENTS_CONFIG.contabilidade.lightTheme);
      assert.ok(SEGMENTS_CONFIG.varejo.lightTheme);
    });
  });

  describe('2. Fórmulas Econômicas e Memória de Cálculo dos Simuladores de ROI', () => {
    it('deve garantir monotonicidade entre cenários (Conservador < Referência < Otimista)', () => {
      for (const id of Object.keys(SEGMENTS_CONFIG) as ConfiguredSegmentKey[]) {
        const cfg = SEGMENTS_CONFIG[id];
        const roi = cfg.simulator;

        const cons = calculateSegmentROI({
          modelType: roi.economicModelType,
          slider1Value: roi.slider1.defaultValue,
          slider2Value: roi.slider2.defaultValue,
          slider3Value: roi.slider3.defaultValue,
          baseConversionRate1: roi.conversionRate1,
          baseRecoveryRate3: roi.recoveryRate3,
          scenario: 'conservador',
          customMarginPct: roi.defaultMarginPct,
          hourlyOperationalValue: roi.hourlyOperationalValue,
          weeklyHoursSavedBase: roi.weeklyHoursSavedBase,
        });

        const ref = calculateSegmentROI({
          modelType: roi.economicModelType,
          slider1Value: roi.slider1.defaultValue,
          slider2Value: roi.slider2.defaultValue,
          slider3Value: roi.slider3.defaultValue,
          baseConversionRate1: roi.conversionRate1,
          baseRecoveryRate3: roi.recoveryRate3,
          scenario: 'referencia',
          customMarginPct: roi.defaultMarginPct,
          hourlyOperationalValue: roi.hourlyOperationalValue,
          weeklyHoursSavedBase: roi.weeklyHoursSavedBase,
        });

        const otim = calculateSegmentROI({
          modelType: roi.economicModelType,
          slider1Value: roi.slider1.defaultValue,
          slider2Value: roi.slider2.defaultValue,
          slider3Value: roi.slider3.defaultValue,
          baseConversionRate1: roi.conversionRate1,
          baseRecoveryRate3: roi.recoveryRate3,
          scenario: 'otimista',
          customMarginPct: roi.defaultMarginPct,
          hourlyOperationalValue: roi.hourlyOperationalValue,
          weeklyHoursSavedBase: roi.weeklyHoursSavedBase,
        });

        assert.ok(
          cons.impactoEconomicoTotalMensal < ref.impactoEconomicoTotalMensal,
          `Falha de monotonicidade (conservador < referencia) em ${id}`
        );
        assert.ok(
          ref.impactoEconomicoTotalMensal < otim.impactoEconomicoTotalMensal,
          `Falha de monotonicidade (referencia < otimista) em ${id}`
        );
        assert.ok(ref.memoriaDeCalculo.length >= 3, `Memória de cálculo incompleta em ${id}`);
      }
    });

    it('deve separar economia operacional de faturamento incremental no modelo de Contabilidade', () => {
      const res = calculateSegmentROI({
        modelType: 'contabilidade-horas-operacionais',
        slider1Value: 18,
        slider2Value: 950,
        slider3Value: 25,
        baseConversionRate1: 0.25,
        baseRecoveryRate3: 0.65,
        scenario: 'referencia',
      });
      assert.ok(res.economiaOperacionalMensal > 0, 'Contabilidade deve gerar economia operacional direta');
      assert.ok(res.faturamentoIncrementalMensal > 0, 'Contabilidade deve calcular novos contratos');
      assert.equal(
        res.impactoEconomicoTotalAnual,
        (res.faturamentoIncrementalMensal + res.economiaOperacionalMensal) * 12
      );
    });
  });

  describe('3. Schemas Zod Estritos (Anti-Injection & Validação de Payload)', () => {
    it('deve validar payload legítimo do Chat e rejeitar propriedades desconhecidas (.strict)', () => {
      const valid = ChatRequestSchema.safeParse({
        message: 'Gostaria de automatizar minha clínica odontológica',
        niche: 'odontologia',
        history: [{ role: 'user', content: 'Olá' }],
      });
      assert.equal(valid.success, true);

      const polluted = ChatRequestSchema.safeParse({
        message: 'Teste',
        niche: 'odontologia',
        isAdmin: true,
      });
      assert.equal(polluted.success, false, 'Deve rejeitar campos extras via .strict()');
    });

    it('deve validar StructuredAIResponseSchema do Gemini com qualificação estruturada', () => {
      const parsed = StructuredAIResponseSchema.safeParse({
        reply: 'Perfeito! Identifiquei os pontos prioritários para sua clínica.',
        qualification: {
          shouldOfferDiagnostic: true,
          gargalos: ['No-show de pacientes'],
          detalhes: 'Clínica com 4 cadeiras',
        },
      });
      assert.equal(parsed.success, true);
    });

    it('deve validar QuoteRequestSchema e CommentRequestSchema', () => {
      const validQuote = QuoteRequestSchema.safeParse({
        vertical: '/Odontologia',
        nome: 'Dr. Roberto',
        email: 'roberto@odonto.com',
        telefone: '61988887777',
        lgpdConsent: true,
      });
      assert.equal(validQuote.success, true);

      const invalidComment = CommentRequestSchema.safeParse({
        nome: 'A',
        comentario: 'Curto',
      });
      assert.equal(invalidComment.success, false);
    });
  });

  describe('4. Rate Limiting Sliding-Window (HTTP 429 Protection)', () => {
    it('deve permitir requisições dentro do limite e bloquear quando excedido', async () => {
      const testId = `unit-${Date.now()}`;
      const policy = { namespace: 'chat' as const, windowMs: 60_000, maxRequests: 2 };

      const r1 = await checkRateLimit(testId, policy);
      r1.releaseConcurrency();
      const r2 = await checkRateLimit(testId, policy);
      r2.releaseConcurrency();
      const r3 = await checkRateLimit(testId, policy);
      r3.releaseConcurrency();

      assert.equal(r1.result.allowed, true);
      assert.equal(r2.result.allowed, true);
      assert.equal(r3.result.allowed, false, 'A 3ª requisição deve ser bloqueada (limite = 2)');
      assert.equal(r3.result.remaining, 0);
    });
  });

  describe('5. Middleware de Redirecionamento Canônico (SEO)', () => {
    it('deve redirecionar variações minúsculas, acentuadas e sinônimos para a rota canônica', () => {
      assert.equal(resolveCanonicalRedirect('/atuaria'), '/Atuaria');
      assert.equal(resolveCanonicalRedirect('/atu%C3%A1ria'), '/Atuaria');
      assert.equal(resolveCanonicalRedirect('/estudios'), '/Estudios');
      assert.equal(resolveCanonicalRedirect('/est%C3%BAdios'), '/Estudios');
      assert.equal(resolveCanonicalRedirect('/saloes/'), '/Saloes');
      assert.equal(resolveCanonicalRedirect('/odontologia'), '/Odontologia');
      assert.equal(resolveCanonicalRedirect('/lojas'), '/Varejo');
      assert.equal(Object.keys(CANONICAL_ROUTES).length >= 25, true);
    });

    it('não deve redirecionar quando a URL já está no formato canônico exato', () => {
      assert.equal(resolveCanonicalRedirect('/Atuaria'), null);
      assert.equal(resolveCanonicalRedirect('/Estudios'), null);
      assert.equal(resolveCanonicalRedirect('/Odontologia'), null);
      assert.equal(resolveCanonicalRedirect('/'), null);
    });
  });

  describe('6. SEO Técnico (Sitemap & Robots)', () => {
    it('deve gerar sitemap com a raiz e todas as 10 verticais canônicas', () => {
      const entries = sitemap();
      assert.equal(entries.length, 11);
      assert.equal(entries[0].url, 'https://domino-automate.com.br');
      assert.ok(entries.some((e) => e.url === 'https://domino-automate.com.br/Atuaria'));
      assert.ok(entries.some((e) => e.url === 'https://domino-automate.com.br/Odontologia'));
    });

    it('deve configurar robots.txt apontando para sitemap.xml e bloqueando /api/', () => {
      const r = robots();
      assert.equal(r.sitemap, 'https://domino-automate.com.br/sitemap.xml');
    });
  });
});
