import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      id: "pericia-judicial",
      badge: "Pilar A • Contencioso & Tribunais",
      title: "Perícia Judicial & Assistência Técnica Estratégica",
      subtitle: "Suporte Técnico para Escritórios de Advocacia e Varas de Justiça",
      icon: "⚖️",
      points: [
        "Formulação de quesitos técnicos estratégicos (iniciais, elucidativos e suplementares) e acompanhamento pericial completo.",
        "Análise crítica e impugnação fundamentada de laudos periciais divergentes, expondo inconsistências metodológicas ou erros materiais.",
        "Liquidação de sentença, reserva matemática, revisão de benefícios e equacionamento de déficit com memória de cálculo 100% reproduzível."
      ],
      result: "Rigor Probatório, Segurança Decisória e Histórico no TRT10 / TJDFT"
    },
    {
      id: "atuaria-riscos",
      badge: "Pilar B • Regulação & Solvência",
      title: "Auditoria CPC 33 / IAS 19 & Governança PREVIC",
      subtitle: "Validação Independente para Conselhos, Patrocinadoras e EFPCs",
      icon: "🏛️",
      points: [
        "Validação independente de passivos atuariais, notas explicativas e conciliação de obrigações em balanços corporativos.",
        "Testes de aderência de tábuas biométricas, hipóteses econômico-financeiras e apuração do Valor Presente Atuarial (VPA).",
        "Avaliação de risco de equacionamento de déficit, solvência, liquidez e pareceres técnicos para Conselhos Deliberativos e Patrocinadoras."
      ],
      result: "Segurança Contábil, Mitigação de Riscos e Conformidade PREVIC"
    },
    {
      id: "automacao-ia",
      badge: "Pilar C • Engenharia de Dados & IA",
      title: "Auditoria de Dados em Python & Automação Jurídica (n8n / IA)",
      subtitle: "Substituição de Planilhas Manuais por Modelos Auditáveis e Seguros",
      icon: "🐍",
      points: [
        "Substituição de planilhas manuais vulneráveis por scripts auditáveis em Python, R e Excel/VBA para grandes volumes de processos e participantes.",
        "Agentes de IA privados sob sigilo LGPD para extração, cruzamento e conferência de grandes bases documentais e processuais.",
        "Fluxos automatizados em n8n para auditoria contínua de contingências, conciliações e apoio à emissão de relatórios técnicos."
      ],
      result: "Eliminação de Erro Material, Rastreabilidade e Ganho de Escala"
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
            Frentes de Atuação em <span style={{ color: 'var(--secondary)' }}>Perícia, Atuária & Prova Técnica</span>
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '820px', margin: '0 auto' }}>
            Metodologia rigorosa fundamentada nas normas do Instituto Brasileiro de Atuária (IBA), pronunciamentos contábeis CPC 33 / IAS 19, diretrizes PREVIC e engenharia de dados aplicada à prova pericial.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
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

        {/* Comparative Block: Planilhas Manuais Impugnáveis vs. Prova Técnica Auditável em Python/R */}
        <div
          className="card-base ghost-border glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(14, 20, 29, 0.95) 0%, rgba(27, 33, 43, 0.85) 100%)',
            border: '1px solid rgba(233, 193, 118, 0.25)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              Diferencial Tecnológico na Prova Pericial
            </span>
            <h3 className="headline-sm" style={{ fontSize: '1.5rem', marginTop: '0.35rem', color: 'var(--on-surface)' }}>
              Planilhas Manuais Impugnáveis <span style={{ color: 'var(--secondary)' }}>vs.</span> Prova Técnica Auditável em Python/R
            </h3>
            <p className="body-sm" style={{ opacity: 0.8, maxWidth: '720px', margin: '0.5rem auto 0' }}>
              Rastreabilidade integral, reprodutibilidade matemática e redução drástica de risco de erro material para escritórios de advocacia, juízos e auditorias.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.75rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.22)' }}>
              <h4 className="label-md" style={{ color: '#f87171', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span aria-hidden="true">⚠️</span> Planilhas Manuais Impugnáveis
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', opacity: 0.85, lineHeight: 1.55 }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#f87171' }}>✗</span><span>Fórmulas sobrescritas manualmente, referências quebradas e difícil conferência pela parte ou pelo Juízo.</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#f87171' }}>✗</span><span>Divergências silenciosas de arredondamento e aplicação imprecisa de índices econômicos/juros.</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#f87171' }}>✗</span><span>Lentidão ou travamento ao auditar extensas séries históricas ou milhares de participantes.</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#f87171' }}>✗</span><span>Sem trilha de auditoria: uma célula alterada compromete toda a credibilidade do parecer.</span></li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <h4 className="label-md" style={{ color: '#34d399', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span aria-hidden="true">🛡️</span> Prova Técnica Auditável em Python / R / VBA
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.55 }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span><span>Scripts documentados e versionados: memória de cálculo 100% reproduzível e auditável linha a linha.</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span><span>Aplicação exata de índices legais/contratuais (INPC, IPCA, Selic, juros moratórios e tábuas biométricas).</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span><span>Processamento veloz de grandes bases de processos/participantes sem risco de erro material.</span></li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>✓</span><span>Segurança probatória que blinda laudos e sustenta impugnações técnicas irrefutáveis.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
