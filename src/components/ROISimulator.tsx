'use client';
import React, { useState, useMemo } from 'react';

export default function ROISimulator() {
  // Inputs tailored for law firms, pension funds (EFPCs), and corporate sponsors
  const [demandas, setDemandas] = useState(25); // volume mensal de processos / cálculos / relatórios
  const [horasPorDemanda, setHorasPorDemanda] = useState(12); // horas manuais gastas por caso
  const [custoHoraTecnica, setCustoHoraTecnica] = useState(250); // R$ / hora de especialista/advogado/perito

  // Calculations
  const stats = useMemo(() => {
    const totalHorasMes = demandas * horasPorDemanda;
    const custoManualMes = totalHorasMes * custoHoraTecnica;
    const custoManualAno = custoManualMes * 12;

    // Automação & IA recuperam em média 65% das horas operacionais de triagem, cálculo e redação
    const horasRecuperadasMes = Math.round(totalHorasMes * 0.65);
    const horasRecuperadasAno = horasRecuperadasMes * 12;

    // Economia operacional direta
    const economiaDiretaAno = horasRecuperadasAno * custoHoraTecnica;

    // Estimativa de contingência prevenida (redução de erro material / impugnação / glosa)
    // Premissa: 10% dos casos manuais sofrem retrabalho ou impugnação onerosa
    const contingenciaPrevenidaAno = demandas * 12 * 0.10 * 8000;

    return {
      horasRecuperadasMes,
      horasRecuperadasAno,
      custoManualAno,
      economiaDiretaAno,
      contingenciaPrevenidaAno
    };
  }, [demandas, horasPorDemanda, custoHoraTecnica]);

  return (
    <section id="simulador" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Simulador Corporativo
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Diagnóstico de <span style={{ color: 'var(--secondary)' }}>Eficiência & Risco Atuarial</span>
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '720px', margin: '1rem auto' }}>
            Estime o impacto de processos manuais de auditoria, liquidação de sentença e relatórios regulatórios na sua operação jurídica ou previdenciária.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Sliders Input Panel */}
          <div className="card-base ghost-border" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className="label-md">Demandas / Cálculos Mensais:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>{demandas} casos/mês</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="150" 
                step="5" 
                value={demandas} 
                onChange={(e) => setDemandas(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Processos judiciais, auditorias de balanço ou pareceres.</span>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className="label-md">Horas Técnicas por Demanda:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>{horasPorDemanda}h / caso</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="40" 
                step="1" 
                value={horasPorDemanda} 
                onChange={(e) => setHorasPorDemanda(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Tempo gasto em triagem, planilhas, conciliação e confecção do laudo.</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className="label-md">Custo da Hora Especializada:</label>
                <span className="label-md" style={{ color: 'var(--secondary)', fontWeight: 700 }}>R$ {custoHoraTecnica}/h</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="600" 
                step="25" 
                value={custoHoraTecnica} 
                onChange={(e) => setCustoHoraTecnica(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <span className="body-xs" style={{ opacity: 0.6 }}>Remuneração média de advogados sêniores, atuários ou peritos.</span>
            </div>
          </div>

          {/* Results Display Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 1: Horas Especializadas Recuperadas */}
            <div className="card-base glass-panel" style={{ borderLeft: '6px solid var(--secondary)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="label-sm" style={{ opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  Horas Especializadas Recuperadas
                </p>
                <span style={{ fontSize: '1.5rem' }}>⏱️</span>
              </div>
              <h3 className="display-sm" style={{ color: 'var(--secondary)', margin: '0.5rem 0', fontSize: '2.2rem', fontWeight: 700 }}>
                +{stats.horasRecuperadasMes}h <span style={{ fontSize: '1.1rem', fontWeight: 400, opacity: 0.8 }}>/ mês</span>
              </h3>
              <p className="body-sm" style={{ opacity: 0.85 }}>
                Equivalente a <strong>+{stats.horasRecuperadasAno} horas anuais</strong> liberadas para foco estratégico em teses jurídicas, negociações e governança de risco.
              </p>
            </div>

            {/* Card 2: Mitigação de Risco e Prejuízo Operacional */}
            <div className="card-base glass-panel" style={{ borderLeft: '6px solid #60a5fa', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="label-sm" style={{ opacity: 0.75, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  Redução de Risco de Glosa / Erro Material
                </p>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              </div>
              <h3 className="display-sm" style={{ color: '#93c5fd', margin: '0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>
                R$ {stats.contingenciaPrevenidaAno.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                <span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.8 }}> / ano (estimado)</span>
              </h3>
              <p className="body-sm" style={{ opacity: 0.85 }}>
                Prevenção de contingências com laudos inconsistentes, retrabalho em liquidações judiciais ou glosas em auditorias contábeis.
              </p>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <a href="#orcamento" className="btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '1.1rem', fontSize: '1rem', fontWeight: 600 }}>
                Solicitar Diagnóstico Institucional Personalizado
              </a>
              <p className="body-xs" style={{ marginTop: '0.75rem', opacity: 0.6, textAlign: 'center' }}>
                *Simulação referencial baseada em benchmarks de automação analítica com Python, n8n e cálculo atuarial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
