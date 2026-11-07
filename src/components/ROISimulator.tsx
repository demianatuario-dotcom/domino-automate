'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { trackDominoEvent } from '@/lib/analytics';
import { DEFAULT_ROI_CONFIG, type ROIScenarioKey } from '@/lib/roiEngine';

const SCENARIO_CONFIG: Record<ROIScenarioKey, { label: string; recupRatio: number; erroRatio: number }> = {
  conservador: { label: 'Conservador', recupRatio: 0.45, erroRatio: 0.05 },
  referencia: { label: 'Referência', recupRatio: 0.65, erroRatio: 0.10 },
  otimista: { label: 'Otimista', recupRatio: 0.80, erroRatio: 0.15 },
};

export default function ROISimulator() {
  const [demandas, setDemandas] = useState(25);
  const [horasPorDemanda, setHorasPorDemanda] = useState(12);
  const [custoHoraTecnica, setCustoHoraTecnica] = useState(250);
  const [custoMedioContingencia, setCustoMedioContingencia] = useState<number>(
    DEFAULT_ROI_CONFIG.defaultAtuariaContingencyUnitCost
  );
  const [scenario, setScenario] = useState<ROIScenarioKey>('referencia');
  const [showMemory, setShowMemory] = useState(false);
  const [simStarted, setSimStarted] = useState(false);

  const notifySimStart = () => {
    if (!simStarted) {
      setSimStarted(true);
      trackDominoEvent('simulator_start', { vertical: '/Atuaria', section: 'roi_simulator' });
    }
  };

  const stats = useMemo(() => {
    const cfg = SCENARIO_CONFIG[scenario];
    const totalHorasMes = demandas * horasPorDemanda;
    const custoManualMes = totalHorasMes * custoHoraTecnica;
    const custoManualAno = custoManualMes * 12;

    const horasRecuperadasMes = Math.round(totalHorasMes * cfg.recupRatio);
    const horasRecuperadasAno = horasRecuperadasMes * 12;

    const economiaDiretaMes = horasRecuperadasMes * custoHoraTecnica;
    const economiaDiretaAno = horasRecuperadasAno * custoHoraTecnica;

    const contingenciaPrevenidaAno = Math.round(
      demandas * 12 * cfg.erroRatio * custoMedioContingencia
    );

    const memoriaDeCalculo = [
      `Cenário ${cfg.label}: recuperação de ${Math.round(cfg.recupRatio * 100)}% das horas operacionais de triagem, conciliação de bases e cálculo.`,
      `Carga técnica mensal atual: ${demandas} demandas × ${horasPorDemanda}h = ${totalHorasMes}h/mês (Custo base: R$ ${custoManualMes.toLocaleString('pt-BR')}/mês).`,
      `Capacidade produtiva liberada: ${totalHorasMes}h × ${Math.round(cfg.recupRatio * 100)}% = ${horasRecuperadasMes}h/mês (${horasRecuperadasAno}h/ano).`,
      `Economia operacional direta: ${horasRecuperadasMes}h × R$ ${custoHoraTecnica}/h = R$ ${economiaDiretaMes.toLocaleString('pt-BR')}/mês (R$ ${economiaDiretaAno.toLocaleString('pt-BR')}/ano).`,
      `Mitigação de risco material/glosa (premissa configurável, não somada à economia mensal para evitar dupla contagem): ${demandas * 12} casos/ano × ${Math.round(cfg.erroRatio * 100)}% taxa de retrabalho × R$ ${custoMedioContingencia.toLocaleString('pt-BR')} (premissa de custo médio por contingência) = R$ ${contingenciaPrevenidaAno.toLocaleString('pt-BR')}/ano.`,
    ];

    return {
      cfg,
      totalHorasMes,
      horasRecuperadasMes,
      horasRecuperadasAno,
      custoManualAno,
      economiaDiretaMes,
      economiaDiretaAno,
      contingenciaPrevenidaAno,
      memoriaDeCalculo,
    };
  }, [demandas, horasPorDemanda, custoHoraTecnica, custoMedioContingencia, scenario]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('atuaria-roi-update', {
          detail: {
            val1: demandas,
            val2: custoHoraTecnica,
            val3: horasPorDemanda,
            scenario,
            impactoMensal: stats.economiaDiretaMes,
          },
        })
      );
    }
  }, [demandas, custoHoraTecnica, horasPorDemanda, scenario, stats.economiaDiretaMes]);

  return (
    <section id="simulador" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Simulador Corporativo • Modelo de Horas Técnicas & Retrabalho
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Diagnóstico de <span style={{ color: 'var(--secondary)' }}>Geração de Valor & Mitigação de Risco Atuarial</span>
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '720px', margin: '1rem auto' }}>
            Estime o impacto econômico de processos manuais de auditoria, liquidação de sentença e relatórios regulatórios na sua operação jurídica ou previdenciária.
          </p>

          {/* 3-Scenario Selector */}
          <div role="group" aria-label="Cenários de simulação" style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.35rem', borderRadius: '50px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--outline-variant)', marginTop: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['conservador', 'referencia', 'otimista'] as ROIScenarioKey[]).map((scen) => {
              const active = scenario === scen;
              return (
                <button
                  key={scen}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    notifySimStart();
                    setScenario(scen);
                    trackDominoEvent('simulator_complete', {
                      vertical: '/Atuaria',
                      scenario: scen,
                      section: 'roi_simulator',
                    });
                  }}
                  style={{
                    padding: '0.55rem 1.15rem',
                    minHeight: '44px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: active ? 'var(--secondary)' : 'transparent',
                    color: active ? 'var(--on-secondary)' : 'var(--on-surface)',
                  }}
                >
                  Cenário {SCENARIO_CONFIG[scen].label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Sliders Input Panel */}
          <div className="card-base ghost-border" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '2.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <label htmlFor="atuaria-slider-demandas" className="label-md">Demandas / Cálculos Mensais:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>{demandas} casos/mês</span>
              </div>
              <input
                id="atuaria-slider-demandas"
                type="range"
                min="5"
                max="150"
                step="5"
                value={demandas}
                onChange={(e) => { notifySimStart(); setDemandas(Number(e.target.value)); }}
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Processos judiciais, auditorias de balanço ou pareceres.</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <label htmlFor="atuaria-slider-horas" className="label-md">Horas Técnicas por Demanda:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>{horasPorDemanda}h / caso</span>
              </div>
              <input
                id="atuaria-slider-horas"
                type="range"
                min="2"
                max="40"
                step="1"
                value={horasPorDemanda}
                onChange={(e) => { notifySimStart(); setHorasPorDemanda(Number(e.target.value)); }}
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Tempo gasto em triagem, planilhas, conciliação e confecção do laudo.</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <label htmlFor="atuaria-slider-custo-hora" className="label-md">Custo da Hora Especializada:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>R$ {custoHoraTecnica}/h</span>
              </div>
              <input
                id="atuaria-slider-custo-hora"
                type="range"
                min="100"
                max="600"
                step="25"
                value={custoHoraTecnica}
                onChange={(e) => { notifySimStart(); setCustoHoraTecnica(Number(e.target.value)); }}
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Remuneração média de advogados sêniores, atuários ou peritos.</span>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label htmlFor="atuaria-slider-contingencia" className="label-sm" style={{ opacity: 0.85 }}>
                  Premissa Configurável: Custo Médio por Contingência / Retrabalho:
                </label>
                <span className="label-sm" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                  R$ {custoMedioContingencia.toLocaleString('pt-BR')}
                </span>
              </div>
              <input
                id="atuaria-slider-contingencia"
                type="range"
                min="1000"
                max="30000"
                step="1000"
                value={custoMedioContingencia}
                onChange={(e) => { notifySimStart(); setCustoMedioContingencia(Number(e.target.value)); }}
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>
                Premissa referencial ajustável por porte do litígio/auditoria (não constitui valor universal ou garantia).
              </span>
            </div>
          </div>

          {/* Results Display Panel */}
          <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Card 1: Horas Especializadas & Economia Direta */}
            <div className="card-base glass-panel" style={{ borderLeft: '6px solid var(--secondary)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="label-sm" style={{ opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  Economia Operacional Direta ({stats.cfg.label} • Projeção do Simulador)
                </p>
                <span style={{ fontSize: '1.5rem' }} aria-hidden="true">⏱️</span>
              </div>
              <h3 className="display-sm" style={{ color: 'var(--secondary)', margin: '0.5rem 0', fontSize: '2.1rem', fontWeight: 700 }}>
                R$ {stats.economiaDiretaMes.toLocaleString('pt-BR')} <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}>/ mês</span>
              </h3>
              <p className="body-sm" style={{ opacity: 0.85 }}>
                Equivalente a <strong>+{stats.horasRecuperadasMes}h/mês (+{stats.horasRecuperadasAno}h/ano)</strong> de capacidade técnica liberada, gerando <strong>R$ {stats.economiaDiretaAno.toLocaleString('pt-BR')}/ano</strong> em produtividade operacional.
              </p>
            </div>

            {/* Card 2: Mitigação de Risco e Prejuízo Operacional */}
            <div className="card-base glass-panel" style={{ borderLeft: '6px solid #60a5fa', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="label-sm" style={{ opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  Mitigação de Risco de Glosa / Erro Material (Premissa Configurável)
                </p>
                <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🛡️</span>
              </div>
              <h3 className="display-sm" style={{ color: '#93c5fd', margin: '0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>
                R$ {stats.contingenciaPrevenidaAno.toLocaleString('pt-BR')}
                <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}> / ano (premissa estimada)</span>
              </h3>
              <p className="body-sm" style={{ opacity: 0.85 }}>
                Estimativa separada (não somada à economia operacional mensal) considerando a premissa configurada de R$ {custoMedioContingencia.toLocaleString('pt-BR')} por contingência evitada.
              </p>
            </div>

            {/* Calculation Memory Accordion */}
            <div className="card-base ghost-border" style={{ padding: '1rem 1.25rem' }}>
              <button
                type="button"
                aria-expanded={showMemory}
                aria-controls="atuaria-roi-memory-panel"
                onClick={() => setShowMemory(!showMemory)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  color: 'var(--on-surface)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                <span>📐 Ver Memória de Cálculo e Premissas ({stats.cfg.label})</span>
                <span aria-hidden="true">{showMemory ? '−' : '+'}</span>
              </button>
              {showMemory && (
                <ul id="atuaria-roi-memory-panel" style={{ marginTop: '0.75rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', opacity: 0.85 }}>
                  {stats.memoriaDeCalculo.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '0.25rem' }}>
              <a
                href="#orcamento"
                onClick={() =>
                  trackDominoEvent('simulator_complete', {
                    vertical: '/Atuaria',
                    scenario,
                    section: 'roi_cta',
                    estimatedMonthlyImpact: stats.economiaDiretaMes,
                  })
                }
                className="btn-primary"
                style={{ width: '100%', display: 'block', textAlign: 'center', padding: '1.1rem', fontSize: '1rem', fontWeight: 600 }}
              >
                Solicitar Diagnóstico Institucional Personalizado
              </a>
              <p className="body-xs" style={{ marginTop: '0.75rem', opacity: 0.6, textAlign: 'center' }}>
                *Projeção do simulador baseada em premissas configuráveis pelo usuário. Não constitui garantia de resultado financeiro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
