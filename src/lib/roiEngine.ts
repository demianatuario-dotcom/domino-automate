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

export interface ROICalculationInput {
  modelType: EconomicModelType;
  slider1Value: number; // Volume de demandas/leads/contatos mensais
  slider2Value: number; // Ticket médio (R$) ou Custo/Hora (R$)
  slider3Value: number; // Perda semanal (faltas/orçamentos abertos/horas manuais)
  baseConversionRate1: number; // Taxa referencial de recuperação sobre Slider 1 (0..1)
  baseRecoveryRate3: number; // Taxa referencial de recuperação sobre Slider 3 (0..1)
  scenario: ROIScenarioKey;
  customMarginPct?: number; // Margem líquida / contribuição (default 60% serviços, 35% varejo/farma)
  hourlyOperationalValue?: number; // Valor da hora operacional economizada (R$/h)
  weeklyHoursSavedBase?: number; // Horas semanais economizadas com triagem/lembretes automáticos
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
  memoriaDeCalculo: string[];
}

export function calculateSegmentROI(input: ROICalculationInput): ROICalculationOutput {
  const scenarioMultiplier = DEFAULT_SCENARIO_MULTIPLIERS[input.scenario];

  // Relative uplift multiplied by scenario factor, capped safely between 5% and 85%
  const effectiveRate1 = Math.min(0.85, Math.max(0.05, input.baseConversionRate1 * scenarioMultiplier));
  const effectiveRate3 = Math.min(0.85, Math.max(0.05, input.baseRecoveryRate3 * scenarioMultiplier));

  const defaultMargin =
    input.modelType === 'farmacias-atendimento-pedidos' ||
    input.modelType === 'varejo-vendas-recompra' ||
    input.modelType === 'oticas-recuperacao-orcamentos'
      ? 40
      : 65;

  const marginPct = Math.min(95, Math.max(15, input.customMarginPct ?? defaultMargin));
  const marginDecimal = marginPct / 100;

  const hourlyValue = input.hourlyOperationalValue ?? 45;
  const weeklyHoursBase = input.weeklyHoursSavedBase ?? 6;
  const horasPoupadasMes = Math.max(
    2,
    Math.round(weeklyHoursBase * 4 * scenarioMultiplier)
  );

  // Special handling for Contabilidade where Slider 3 is weekly manual hours spent chasing docs
  if (input.modelType === 'contabilidade-horas-operacionais') {
    const proposalsConvertedMonth = Math.max(1, Math.round(input.slider1Value * effectiveRate1));
    const faturamentoIncrementalMensal = proposalsConvertedMonth * input.slider2Value;
    const faturamentoAtualBaseMensal = Math.round(input.slider1Value * 2.2 * input.slider2Value);
    const faturamentoPotencialMensal = faturamentoAtualBaseMensal + faturamentoIncrementalMensal;
    const lucroIncrementalMensal = Math.round(faturamentoIncrementalMensal * marginDecimal);

    const hoursSavedFromDocsMonth = Math.max(
      4,
      Math.round(input.slider3Value * 4 * effectiveRate3)
    );
    const custoHoraContabil = 65;
    const economiaOperacionalMensal = hoursSavedFromDocsMonth * custoHoraContabil;

    const impactoEconomicoTotalMensal = faturamentoIncrementalMensal + economiaOperacionalMensal;
    const impactoEconomicoTotalAnual = impactoEconomicoTotalMensal * 12;

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
      memoriaDeCalculo: [
        `Cenário selecionado: ${input.scenario.toUpperCase()} (fator ponderador ${(scenarioMultiplier * 100).toFixed(0)}%)`,
        `Novos contratos/mês via triagem IA: ${input.slider1Value} propostas × ${(effectiveRate1 * 100).toFixed(0)}% = +${proposalsConvertedMonth} contratos × R$ ${input.slider2Value.toLocaleString('pt-BR')} = R$ ${faturamentoIncrementalMensal.toLocaleString('pt-BR')}/mês`,
        `Horas operacionais liberadas (coleta automática n8n): ${input.slider3Value}h/sem × 4 sem × ${(effectiveRate3 * 100).toFixed(0)}% = ${hoursSavedFromDocsMonth}h/mês × R$ ${custoHoraContabil}/h = R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês`,
        `Lucro líquido incremental estimado (margem ${marginPct}%): R$ ${lucroIncrementalMensal.toLocaleString('pt-BR')}/mês + R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês em produtividade`,
      ],
    };
  }

  const extraConversionsMonth = Math.max(1, Math.round(input.slider1Value * effectiveRate1));
  const revenueFromConversions = extraConversionsMonth * input.slider2Value;

  const monthlyLostOpportunities = input.slider3Value * 4;
  const recoveredItemsMonth = Math.max(1, Math.round(monthlyLostOpportunities * effectiveRate3));
  const revenueFromRecovery = recoveredItemsMonth * input.slider2Value;

  const faturamentoAtualBaseMensal = Math.round(
    (input.slider1Value * 1.5 + monthlyLostOpportunities) * input.slider2Value
  );
  const faturamentoIncrementalMensal = revenueFromConversions + revenueFromRecovery;
  const faturamentoPotencialMensal = faturamentoAtualBaseMensal + faturamentoIncrementalMensal;
  const lucroIncrementalMensal = Math.round(faturamentoIncrementalMensal * marginDecimal);
  const economiaOperacionalMensal = horasPoupadasMes * hourlyValue;

  const impactoEconomicoTotalMensal = faturamentoIncrementalMensal + economiaOperacionalMensal;
  const impactoEconomicoTotalAnual = impactoEconomicoTotalMensal * 12;

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
    memoriaDeCalculo: [
      `Cenário selecionado: ${input.scenario.toUpperCase()} (fator de ajuste ${(scenarioMultiplier * 100).toFixed(0)}% sobre a premissa base)`,
      `1. Atendimento Imediato IA 24/7: ${input.slider1Value} contatos/mês × ${(effectiveRate1 * 100).toFixed(0)}% de recuperação = +${extraConversionsMonth} conversões × R$ ${input.slider2Value.toLocaleString('pt-BR')} = +R$ ${revenueFromConversions.toLocaleString('pt-BR')}/mês`,
      `2. Automação de Retenção/Confirmação (n8n): ${input.slider3Value}/sem (${monthlyLostOpportunities}/mês) × ${(effectiveRate3 * 100).toFixed(0)}% recuperados = +${recoveredItemsMonth} recuperações × R$ ${input.slider2Value.toLocaleString('pt-BR')} = +R$ ${revenueFromRecovery.toLocaleString('pt-BR')}/mês`,
      `3. Faturamento Bruto Incremental: R$ ${faturamentoIncrementalMensal.toLocaleString('pt-BR')}/mês | Lucro Incremental Estimado (Margem ${marginPct}%): R$ ${lucroIncrementalMensal.toLocaleString('pt-BR')}/mês`,
      `4. Economia Operacional de Equipe: ~${horasPoupadasMes}h/mês poupadas em triagem manual (R$ ${economiaOperacionalMensal.toLocaleString('pt-BR')}/mês)`,
    ],
  };
}

