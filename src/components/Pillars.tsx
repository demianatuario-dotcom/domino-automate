import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      id: "atuaria-riscos",
      badge: "Pilar 01 • Regulação & Solvência",
      title: "Inteligência Atuarial & Governança",
      subtitle: "Para EFPCs, Fundos de Pensão e Patrocinadoras",
      icon: "🏛️",
      points: [
        "Auditoria e validação independente de CPC 33 (R1) e IAS 19 para balanços corporativos.",
        "Avaliação aprofundada de premissas demográficas, tábuas biométricas e solvência atuarial.",
        "Gestão de risco de equacionamento de déficit técnico e pareceres estratégicos para Conselhos Deliberativos e Fiscais."
      ],
      result: "Conformidade PREVIC e Mitigação de Riscos em Balanço"
    },
    {
      id: "pericia-judicial",
      badge: "Pilar 02 • Segurança Jurídica",
      title: "Perícia Atuarial & Assistência Técnica Judicial",
      subtitle: "Para Escritórios de Advocacia e Departamentos Jurídicos",
      icon: "⚖️",
      points: [
        "Cálculos de liquidação de sentença e apuração rigorosa de reservas matemáticas em litígios complexos.",
        "Formulação de quesitos estratégicos e impugnação técnica fundamentada de laudos periciais divergentes.",
        "Pareceres prévios de viabilidade atuarial para instrução probatória em teses cíveis, trabalhistas e previdenciárias."
      ],
      result: "Histórico de 10 Perícias Homologadas no TRT10 e TJDFT"
    },
    {
      id: "automacao-ia",
      badge: "Pilar 03 • Engenharia Aplicada",
      title: "Engenharia de Automação & IA Corporativa",
      subtitle: "Para Operações Jurídicas e Financeiras de Alto Volume",
      icon: "⚡",
      points: [
        "Agentes autônomos de IA treinados em normativos PREVIC e jurisprudência para redação e análise documental técnica.",
        "Orquestração de pipelines em n8n e scripts Python/R integrando bancos legados a relatórios automáticos.",
        "Triagem jurídica e financeira automatizada via WhatsApp/Web com segurança de dados e conformidade total à LGPD."
      ],
      result: "Autonomia Operacional e Eliminação de Erros Manuais"
    }
  ];

  return (
    <section id="pilares" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Estrutura de Soluções
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Os 3 Pilares de Atuação Estratégica
          </h2>
          <p className="body-md" style={{ opacity: 0.8, maxWidth: '750px', margin: '0 auto' }}>
            A união entre a chancela regulatória atuarial (MIBA) e a vanguarda da engenharia de software e inteligência artificial para proteger seu balanço e otimizar processos judiciais.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {pillars.map((pillar, i) => (
            <div 
              key={i} 
              id={pillar.id}
              className="card-base floating-shadow glass-panel" 
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '4px solid var(--secondary)', position: 'relative', scrollMarginTop: '100px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="label-sm" style={{ color: 'var(--secondary)', background: 'rgba(233, 193, 118, 0.12)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontWeight: 700 }}>
                  {pillar.badge}
                </span>
                <span style={{ fontSize: '2.2rem' }}>{pillar.icon}</span>
              </div>

              <div>
                <h3 className="headline-sm" style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: 'var(--on-surface)' }}>
                  {pillar.title}
                </h3>
                <p className="body-sm" style={{ color: 'var(--secondary)', opacity: 0.9, fontWeight: 500 }}>
                  {pillar.subtitle}
                </p>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, padding: 0 }}>
                {pillar.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', fontSize: '0.9rem', lineHeight: '1.55', opacity: 0.85 }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold', minWidth: '16px' }}>✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--primary-container)', borderRadius: '6px', borderLeft: '3px solid var(--secondary)' }}>
                <p className="label-sm" style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: '0.825rem' }}>
                  🎯 {pillar.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
