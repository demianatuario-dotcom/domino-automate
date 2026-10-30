"use client";

import React from 'react';

const corporateCases = [
  {
    id: 'funcef-modelagem',
    title: 'Modelagem Atuarial em Python (FUNCEF)',
    category: 'Previdência Complementar Fechada',
    badge: '3º Maior Fundo de Pensão do Brasil',
    icon: '🐍',
    description: 'Desenvolvimento e implementação de algoritmos de cálculo atuarial e projeção de solvência em Python para planos previdenciários complexos, integrando bases cadastrais massivas a modelos matemáticos de alta precisão.',
    tags: ['Python', 'Cálculo Atuarial', 'Modelagem de Risco', 'Governança EFPC']
  },
  {
    id: 'pericias-tjdft-trt10',
    title: '10 Perícias Atuariais Homologadas (TJDFT & TRT10)',
    category: 'Perícia Judicial & Assistência Técnica',
    badge: '10 Laudos Concluídos com Sucesso',
    icon: '⚖️',
    description: 'Atuação especializada como Perito Judicial e Assistente Técnico em litígios previdenciários, bancários e trabalhistas de alta complexidade. Apuração rigorosa de reservas matemáticas, diferenças salariais e liquidações de sentença.',
    tags: ['TJDFT', 'TRT 10ª Região', 'Perícia Contábil/Atuarial', 'Quesitos Estratégicos']
  },
  {
    id: 'consultoria-cpc33-previc',
    title: 'Auditoria Regulatória PREVIC & CPC 33 (R1) / IAS 19',
    category: 'Auditoria de Balanços e Solvência',
    badge: 'Conformidade e Mitigação de Déficits',
    icon: '📊',
    description: 'Auditoria independente de passivos atuariais, validação de tábuas biométricas e hipóteses financeiras, testes de sensibilidade e pareceres técnicos fundamentados para patrocinadoras e conselhos deliberativos.',
    tags: ['CPC 33 (R1)', 'IAS 19', 'PREVIC', 'Auditoria Independente']
  }
];

export default function Portfolio() {
  return (
    <section id="laudos-estudos" style={{ padding: '6rem 2rem', position: 'relative', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Acervo Técnico & Jurisprudencial
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Casos de Atuária Aplicada & Perícias
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '750px', margin: '0 auto' }}>
            Geração comprovada de valor em grandes entidades de previdência complementar e laudos periciais homologados no Poder Judiciário.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {corporateCases.map(item => (
            <div
              key={item.id}
              className="card-base ghost-border glass-panel"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--secondary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="label-sm" style={{ color: 'var(--secondary)', background: 'rgba(233, 193, 118, 0.12)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontWeight: 700 }}>
                  {item.badge}
                </span>
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              </div>

              <div>
                <p className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{item.category}</p>
                <h3 className="headline-sm" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
              </div>

              <p className="body-sm" style={{ opacity: 0.85, lineHeight: 1.65, flex: 1 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {item.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', opacity: 0.8 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner: Papers, Guias & Meus Estudos */}
        <div
          className="card-base"
          style={{
            padding: '3.5rem 3rem',
            background: 'linear-gradient(135deg, rgba(27, 33, 43, 0.95) 0%, rgba(13, 35, 68, 0.75) 100%)',
            border: '1px solid rgba(233, 193, 118, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '50px', background: 'rgba(233, 193, 118, 0.15)', border: '1px solid rgba(233, 193, 118, 0.3)' }}>
              <span style={{ fontSize: '0.9rem' }}>📚</span>
              <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Produção Científica & Metodológica
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', width: '100%', alignItems: 'center' }}>
              <div>
                <h3 className="display-sm" style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Papers Técnicos, Guias Práticos e <span style={{ color: 'var(--secondary)' }}>Estudos Atuariais</span>
                </h3>
                <p className="body-md" style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '1rem' }}>
                  Desenvolvemos continuamente artigos técnicos, notas de pesquisa sobre CPC 33, modelagem de solvência em EFPCs e teses periciais em litígios previdenciários.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Notas Técnicas PREVIC
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Modelagem de Reservas em Python
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Teses Periciais para Tribunais
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(10, 14, 20, 0.6)', border: '1px solid var(--outline-variant)', width: '100%' }}>
                  <p className="label-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Acesse a Seção "Meus Estudos"
                  </p>
                  <p className="body-sm" style={{ opacity: 0.8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                    Consulte os guias completos e estudos publicados diretamente no portal curricular de Demian Lisboa Pereira.
                  </p>
                  <a
                    href="https://domino-automate.com.br/curriculo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, width: '100%', justifyContent: 'center' }}
                  >
                    <span>Explorar Meus Estudos & Currículo</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
