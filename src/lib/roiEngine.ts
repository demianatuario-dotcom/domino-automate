export type ROIScenarioKey = 'conservador' | 'referencia' | 'otimista';

export type EconomicModelType =
  | 'atuaria-horas-risco'
  | 'estudios-conversao-noshow'
  | 'saloes-ocupacao-cancelamentos'
  | 'barbearias-recorrencia-agenda'
  | 'advocacia-triagem-produtividade'
  | 'contabilidade-horas-operacionais'
  | 'farmacias-atendimento-pedidos'
  | 'oticas-recuperacao-orcamentos'
  | 'odontologia-ocupacao-faltas'
  | 'varejo-vendas-recompra';

export interface ROIScenarioMultipliers {
  conservador: number;
  referencia: number;
  otimista: number;
}

export const DEFAULT_SCENARIO_MULTIPLIERS: ROIScenarioMultipliers = {
  conservador: 0.65,
  referencia: 1.0,
  otimista: 1.3,
};

export const DEFAULT_ROI_CONFIG = {
  standardBaselineRevenueMultiplier: 1.5,
  contabilidadeBaselineRevenueMultiplier: 2.2,
  standardHourlyOperationalValue: 45,
  contabilidadeHourlyOperationalValue: 65,
  retailDefaultMarginPct: 40,
  serviceDefaultMarginPct: 65,
  defaultWeeklyHoursSavedBase: 6,
  defaultAtuariaContingencyUnitCost: 8000,
} as const;

/**
 * Common Economic Presentation Contract across all Domino Automate simulators.
 * Distinguishes gross revenue, contribution margin, operational savings, freed capacity,
 * mitigated risk, investment, maintenance, and payback without forcing a single formula.
 */
export interface EconomicPresentationContract {
  faturamentoBrutoIncrementalMensal: number;
  margemContribuicaoIncrementalMensal: number;
  economiaOperacionalMensal: number;
  capacidadeProdutivaLiberadaHorasMes: number;
  riscoMitigadoAnual: number;
  investimentoEstimado: number | null;
  manutencaoMensal: number;
  beneficioLiquidoMensal: number;
  paybackMeses: number | null;
}

export interface ROICalculationInput {
  modelType: EconomicModelType;
  slider1Value: number; // Volume de demandas/leads/contatos mensais
  slider2Value: number; // Ticket médio (R$) ou Custo/Hora (R$)
  slider3Value: number; // Perda semanal (faltas/orçamentos abertos/horas manuais)
  baseConversionRate1: number; // Taxa referencial de recuperação sobre Slider 1 (0..1)
  baseRecoveryRate3: number; // Taxa referencial de recuperação sobre Slider 3 (0..1)
  scenario: ROIScenarioKey;
  customMarginPct?: number; // Margem de contribuição (%)
  hourlyOperationalValue?: number; // Valor da hora operacional economizada (R$/h)
  weeklyHoursSavedBase?: number; // Horas semanais economizadas com triagem/lembretes automáticos
  baselineRevenueMultiplier?: number; // Multiplicador de base atual sobre o volume do slider 1
  estimatedInvestment?: number; // Investimento inicial opcional (R$)
  monthlyMaintenanceCost?: number; // Custo mensal de manutenção opcional (R$)
  mitigatedRiskAnnual?: number; // Risco anual mitigado opcional (R$)
}

export interface ROICalculationOutput {
  scenario: ROIScenarioKey;
  scenarioMultiplier: number;
  effectiveRate1Pct: number;
  effectiveRate3Pct: number;
  marginPct: number;
  faturamentoAtualBaseMensal: number;
  faturamentoIncrementalMensal: number;
  faturamentoPotencialMensal: number;
  lucroIncrementalMensal: number;
  economiaOperacionalMensal: number;
  impactoEconomicoTotalMensal: number;
  impactoEconomicoTotalAnual: number;
  extraConversionsMonth: number;
  recoveredItemsMonth: number;
  horasPoupadasMes: number;
  investimentoEstimado?: number;
  manutencaoMensal?: number;
  paybackMeses?: number | null;
  presentationContract: EconomicPresentationContract;
  memoriaDeCalculo: string[];
}

export function calculateSegmentROI(input: ROICalculationInput): ROICalculationOutput {
  const scenarioMultiplier = DEFAULT_SCENARIO_MULTIPLIERS[input.scenario];

  // Relative uplift multiplied by scenario factor, clamped between 0% (no artificial 5% floor) and 85%
  const rawRate1 = Math.max(0, input.baseConversionRate1) * scenarioMultiplier;
  const rawRate3 = Math.max(0, input.baseRecoveryRate3) * scenarioMultiplier;
  const effectiveRate1 = Math.min(0.85, rawRate1);
  const effectiveRate3 = Math.min(0.85, rawRate3);

  const defaultMargin =
    input.modelType === 'farmacias-atendimento-pedidos' ||
    input.modelType === 'varejo-vendas-recompra' ||
    input.modelType === 'oticas-recuperacao-orcamentos'
      ? DEFAULT_ROI_CONFIG.retailDefaultMarginPct
      : DEFAULT_ROI_CONFIG.serviceDefaultMarginPct;

  const marginPct = Math.min(95, Math.max(15, input.customMarginPct ?? defaultMargin));
  const marginDecimal = marginPct / 100;

  const slider1Safe = Math.max(0, input.slider1Value);
  const slider2Safe = Math.max(0, input.slider2Value);
  const slider3Safe = Math.max(0, input.slider3Value);

  const weeklyHoursBase = Math.max(
    0,
    input.weeklyHoursSavedBase ?? DEFAULT_ROI_CONFIG.defaultWeeklyHoursSavedBase
  );
  const horasPoupadasMes = Math.round(weeklyHoursBase * 4 * scenarioMultiplier);
  const manutencaoMensal = Math.max(0, input.monthlyMaintenanceCost ?? 0);
  const riscoMitigadoAnual = Math.max(0, input.mitigatedRiskAnnual ?? 0);

  // Special handling for Contabilidade where Slider 3 is weekly manual hours spent chasing docs
  if (input.modelType === 'contabilidade-horas-operacionais') {
    const baselineMult =
      input.baselineRevenueMultiplier ?? DEFAULT_ROI_CONFIG.contabilidadeBaselineRevenueMultiplier;
    const custoHoraContabil =
      input.hourlyOperationalValue ?? DEFAULT_ROI_CONFIG.contabilidadeHourlyOperationalValue;

    const proposalsConvertedMonth = Math.round(slider1Safe * effectiveRate1);
    const faturamentoIncrementalMensal = proposalsConvertedMonth * slider2Safe;
    const faturamentoAtualBaseMensal = Math.round(slider1Safe * baselineMult * slider2Safe);
    const faturamentoPotencialMensal = faturamentoAtualBaseMensal + faturamentoIncrementalMensal;
    const lucroIncrementalMensal = Math.round(faturamentoIncrementalMensal * marginDecimal);

    const hoursSavedFromDocsMonth = Math.round(slider3Safe * 4 * effectiveRate3);
    const economiaOperacionalMensal = hoursSavedFromDocsMonth * custoHoraContabil;

    const impactoEconomicoTotalMensal = lucroIncrementalMensal + economiaOperacionalMensal;
    const impactoEconomicoTotalAnual = impactoEconomicoTotalMensal * 12;
    const beneficioLiquidoMensal = impactoEconomicoTotalMensal - manutencaoMensal;

    const memoriaDeCalculo = [
      `Cenário selecionado: ${input.scenario.toUpperCase()} (fator ponderador ${(scenarioMultiplier * 100).toFixed(0)}%)`,
      `Novos contratos/mês via triagem IA: ${slider1Safe} propostas × ${(effectiveRate1 * 100).toFixed(1)}% = +${proposalsConvertedMonth} contratos × R$ ${slider2Safe.toLocaleString('pt-BR')} = R$ ${faturamentoIncrementalMensal.toLocaleString('pt-BR')}/mês`,
      `Horas operacionais liberadas (coleta automática n8n): ${slider3Safe}h/sem × 4 sem × ${(effectiveRate3 * 100).toFixed(1)}% = ${hoursSavedFromDocsMonth}h/mês × R$ ${custoHoraContabil}/h = R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês`,
      `Margem de contribuição incremental estimada (${marginPct}%): R$ ${lucroIncrementalMensal.toLocaleString('pt-BR')}/mês + R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês em produtividade = R$ ${impactoEconomicoTotalMensal.toLocaleString('pt-BR')}/mês (sem dupla contagem com faturamento bruto)`,
    ];

    let investimentoEstimado: number | undefined;
    let paybackMeses: number | null | undefined;
    if (input.estimatedInvestment !== undefined && input.estimatedInvestment > 0) {
      investimentoEstimado = input.estimatedInvestment;
      paybackMeses =
        beneficioLiquidoMensal > 0
          ? Number((investimentoEstimado / beneficioLiquidoMensal).toFixed(1))
          : null;
      memoriaDeCalculo.push(
        `Investimento estimado: R$ ${investimentoEstimado.toLocaleString('pt-BR')}${manutencaoMensal > 0 ? ` | Manutenção: R$ ${manutencaoMensal.toLocaleString('pt-BR')}/mês` : ''} | Payback estimado: ${paybackMeses !== null ? `${paybackMeses} meses` : 'N/A (benefício líquido insuficiente)'}`
      );
    }

    return {
      scenario: input.scenario,
      scenarioMultiplier,
      effectiveRate1Pct: Math.round(effectiveRate1 * 100),
      effectiveRate3Pct: Math.round(effectiveRate3 * 100),
      marginPct,
      faturamentoAtualBaseMensal,
      faturamentoIncrementalMensal,
      faturamentoPotencialMensal,
      lucroIncrementalMensal,
      economiaOperacionalMensal,
      impactoEconomicoTotalMensal,
      impactoEconomicoTotalAnual,
      extraConversionsMonth: proposalsConvertedMonth,
      recoveredItemsMonth: hoursSavedFromDocsMonth,
      horasPoupadasMes: hoursSavedFromDocsMonth,
      ...(investimentoEstimado !== undefined
        ? { investimentoEstimado, manutencaoMensal, paybackMeses }
        : {}),
      presentationContract: {
        faturamentoBrutoIncrementalMensal: faturamentoIncrementalMensal,
        margemContribuicaoIncrementalMensal: lucroIncrementalMensal,
        economiaOperacionalMensal,
        capacidadeProdutivaLiberadaHorasMes: hoursSavedFromDocsMonth,
        riscoMitigadoAnual,
        investimentoEstimado: investimentoEstimado ?? null,
        manutencaoMensal,
        beneficioLiquidoMensal,
        paybackMeses: paybackMeses ?? null,
      },
      memoriaDeCalculo,
    };
  }

  const baselineMult =
    input.baselineRevenueMultiplier ?? DEFAULT_ROI_CONFIG.standardBaselineRevenueMultiplier;
  const hourlyValue =
    input.hourlyOperationalValue ?? DEFAULT_ROI_CONFIG.standardHourlyOperationalValue;

  const extraConversionsMonth = Math.round(slider1Safe * effectiveRate1);
  const revenueFromConversions = extraConversionsMonth * slider2Safe;

  const monthlyLostOpportunities = slider3Safe * 4;
  const recoveredItemsMonth = Math.round(monthlyLostOpportunities * effectiveRate3);
  const revenueFromRecovery = recoveredItemsMonth * slider2Safe;

  const faturamentoAtualBaseMensal = Math.round(
    (slider1Safe * baselineMult + monthlyLostOpportunities) * slider2Safe
  );
  const faturamentoIncrementalMensal = revenueFromConversions + revenueFromRecovery;
  const faturamentoPotencialMensal = faturamentoAtualBaseMensal + faturamentoIncrementalMensal;
  const lucroIncrementalMensal = Math.round(faturamentoIncrementalMensal * marginDecimal);
  const economiaOperacionalMensal = horasPoupadasMes * hourlyValue;

  const impactoEconomicoTotalMensal = lucroIncrementalMensal + economiaOperacionalMensal;
  const impactoEconomicoTotalAnual = impactoEconomicoTotalMensal * 12;
  const beneficioLiquidoMensal = impactoEconomicoTotalMensal - manutencaoMensal;

  const memoriaDeCalculo = [
    `Cenário selecionado: ${input.scenario.toUpperCase()} (fator de ajuste ${(scenarioMultiplier * 100).toFixed(0)}% sobre a premissa base; frentes independentes sem sobreposição)`,
    `1. Atendimento Imediato IA 24/7 (novos contatos): ${slider1Safe} contatos/mês × ${(effectiveRate1 * 100).toFixed(1)}% de recuperação = +${extraConversionsMonth} conversões × R$ ${slider2Safe.toLocaleString('pt-BR')} = +R$ ${revenueFromConversions.toLocaleString('pt-BR')}/mês`,
    `2. Automação de Retenção/Confirmação n8n (agenda/orçamentos já abertos): ${slider3Safe}/sem (${monthlyLostOpportunities}/mês) × ${(effectiveRate3 * 100).toFixed(1)}% recuperados = +${recoveredItemsMonth} recuperações × R$ ${slider2Safe.toLocaleString('pt-BR')} = +R$ ${revenueFromRecovery.toLocaleString('pt-BR')}/mês`,
    `3. Faturamento Bruto Incremental: R$ ${faturamentoIncrementalMensal.toLocaleString('pt-BR')}/mês | Margem de contribuição incremental estimada (${marginPct}%): R$ ${lucroIncrementalMensal.toLocaleString('pt-BR')}/mês`,
    `4. Economia Operacional de Equipe: ~${horasPoupadasMes}h/mês poupadas em triagem manual (R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês)`,
  ];

  let investimentoEstimado: number | undefined;
  let paybackMeses: number | null | undefined;
  if (input.estimatedInvestment !== undefined && input.estimatedInvestment > 0) {
    investimentoEstimado = input.estimatedInvestment;
    paybackMeses =
      beneficioLiquidoMensal > 0
        ? Number((investimentoEstimado / beneficioLiquidoMensal).toFixed(1))
        : null;
    memoriaDeCalculo.push(
      `5. Investimento estimado: R$ ${investimentoEstimado.toLocaleString('pt-BR')}${manutencaoMensal > 0 ? ` | Manutenção: R$ ${manutencaoMensal.toLocaleString('pt-BR')}/mês` : ''} | Payback estimado: ${paybackMeses !== null ? `${paybackMeses} meses` : 'N/A (benefício líquido insuficiente)'}`
    );
  }

  return {
    scenario: input.scenario,
    scenarioMultiplier,
    effectiveRate1Pct: Math.round(effectiveRate1 * 100),
    effectiveRate3Pct: Math.round(effectiveRate3 * 100),
    marginPct,
    faturamentoAtualBaseMensal,
    faturamentoIncrementalMensal,
    faturamentoPotencialMensal,
    lucroIncrementalMensal,
    economiaOperacionalMensal,
    impactoEconomicoTotalMensal,
    impactoEconomicoTotalAnual,
    extraConversionsMonth,
    recoveredItemsMonth,
    horasPoupadasMes,
    ...(investimentoEstimado !== undefined
      ? { investimentoEstimado, manutencaoMensal, paybackMeses }
      : {}),
    presentationContract: {
      faturamentoBrutoIncrementalMensal: faturamentoIncrementalMensal,
      margemContribuicaoIncrementalMensal: lucroIncrementalMensal,
      economiaOperacionalMensal,
      capacidadeProdutivaLiberadaHorasMes: horasPoupadasMes,
      riscoMitigadoAnual,
      investimentoEstimado: investimentoEstimado ?? null,
      manutencaoMensal,
      beneficioLiquidoMensal,
      paybackMeses: paybackMeses ?? null,
    },
    memoriaDeCalculo,
  };
}
