import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      id: "atuaria-riscos",
      badge: "Frente 01 • Regulação & Solvência",
      title: "Auditoria CPC 33 / IAS 19 & Governança EFPC",
      subtitle: "Validação Independente para Patrocinadoras e Fundos de Pensão",
      icon: "🏛️",
      points: [
        "Revisão independente de laudos atuariais, notas explicativas e conciliação de passivos em balanços corporativos.",
        "Testes de aderência de tábuas biométricas, hipóteses econômico-financeiras e apuração do Valor Presente Atuarial (VPA).",
        "Modelagem de planos de equacionamento de déficit técnico e suporte a Conselhos Deliberativos e Fiscais perante a PREVIC."
      ],
      result: "Segurança Contábil e Mitigação de Riscos em Balanço"
    },
    {
      id: "pericia-judicial",
      badge: "Frente 02 • Contencioso Estratégico",
      title: "Perícia Atuarial & Assistência Técnica Judicial",
      subtitle: "Defesa Técnica e Liquidação em Litígios Complexos",
      icon: "⚖️",
      points: [
        "Cálculos de liquidação de sentença, recomposição de reserva matemática e benefícios previdenciários/trabalhistas.",
        "Elaboração de quesitos estratégicos e impugnação técnica fundamentada contra laudos periciais inconsistentes.",
        "Pareceres prévios de risco e viabilidade matemática para instrução probatória em bancas de advocacia empresarial."
      ],
      result: "Histórico de 10 Perícias Homologadas no TRT10 e TJDFT"
    },
    {
      id: "automacao-ia",
      badge: "Frente 03 • Engenharia Atuarial",
      title: "Motores de Cálculo em Python & Automação de Riscos",
      subtitle: "Escala Analítica para Consultorias e Departamentos Jurídicos",
      icon: "🐍",
      points: [
        "Algoritmos propietarios em Python e R para processamento massivo de bases cadastrais e projeções estocásticas.",
        "Agentes de IA treinados em normativos PREVIC e jurisprudência para auditoria documental e redação de pareceres.",
        "Esteiras automatizadas em n8n para auditoria contínua de folha, benefícios e contingências sob estrito sigilo LGPD."
      ],
      result: "Eliminação de Erro Material e Ganho de Escala Técnica"
    }
  ];

  return (
    <section id="escopo-atuarial" style={{ padding: '6rem 2rem', position: 'relative', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Escopo Técnico Especializado
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Frentes de Atuação em Ciências Atuariais
          </h2>
          <p className="body-md" style={{ opacity: 0.8, maxWidth: '750px', margin: '0 auto' }}>
            Metodologia rigorosa fundamentada nas normas do Instituto Brasileiro de Atuária (IBA), pronunciamentos contábeis internacionais e engenharia computacional aplicada ao risco.
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
