import React from 'react';

export default function QuemSomos() {
  return (
    <section id="lideranca-atuarial" style={{ padding: '6rem 2rem', position: 'relative', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Responsabilidade Técnica Homologada
          </span>
          <h2 className="display-lg" style={{ color: 'var(--secondary)', marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Liderança Atuarial & Pericial (MIBA 1807)
          </h2>
          <p className="body-md" style={{ maxWidth: '750px', margin: '0 auto', opacity: 0.85 }}>
            Experiência executiva em fundos de pensão, patrocinadoras estatais e privadas e atuação consolidada perante os tribunais superiores.
          </p>
        </div>

        <div className="card-base" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', padding: '3.5rem 3rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', opacity: 0.6, filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: '1px solid var(--outline-variant)', paddingRight: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--tertiary), var(--primary-container))', animation: 'shimmerBadge 2.5s infinite' }} />
                <div style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #1b212b, #0d2344)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.65rem', fontWeight: 800, color: 'var(--secondary)', border: '2px solid var(--surface-container)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
                  DP
                </div>
              </div>
              <div>
                <h3 className="headline-sm" style={{ fontSize: '1.4rem', color: 'var(--on-surface)', marginBottom: '0.2rem' }}>
                  Demian Lisboa Pereira
                </h3>
                <p className="label-md" style={{ color: 'var(--secondary)' }}>
                  Atuário Registrado (MIBA 1807) & Perito Judicial
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                🏛️ +15 Anos Caixa Econômica Federal
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                ⚖️ Ex-Perito Judicial TRT10 & TJDFT
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                📊 Especialista CPC 33 (R1) & IAS 19
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)' }}>
                🎓 MBA Finanças IBMEC • Técnico UFRGS
              </span>
            </div>

            <p className="body-sm" style={{ opacity: 0.85, lineHeight: 1.7, marginTop: '1rem' }}>
              Mais de uma década e meia de atuação direta em modelagem de reservas, solvência, liquidez e governança de planos previdenciários patrocinados por uma das maiores instituições financeiras da América Latina.
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <a
                href="https://domino-automate.com.br/curriculo/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}
              >
                <span>Acessar Currículo Completo & Estudos</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 className="headline-sm" style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>
              Rigor Matemático Aliado à Computação Científica
            </h4>

            <p className="body-md" style={{ opacity: 0.9, lineHeight: 1.7 }}>
              Enquanto pareceres tradicionais baseiam-se em planilhas manuais sujeitas a falhas operacionais e impugnações, nossa prática atuarial utiliza algoritmos auditáveis em <strong>Python e R</strong> para validar integralmente massas de participantes, fluxos de caixa futuros e reservas matemáticas sob as diretrizes da <strong>PREVIC e CPC 33 (R1) / IAS 19</strong>.
            </p>

            <div style={{ marginTop: '0.5rem', padding: '1.25rem', borderRadius: '8px', background: 'var(--surface-container-high)', borderLeft: '4px solid var(--secondary)' }}>
              <h5 className="label-md" style={{ color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                Credenciais e Marcos de Atuação Atuarial:
              </h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '1rem', marginTop: '0.05rem' }}>⚖️</span><span><strong>10 Perícias Judiciais Homologadas</strong>: Laudos e quesitos que sustentaram decisões técnicas no TRT10 e TJDFT.</span></li>
                <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '1rem', marginTop: '0.05rem' }}>🐍</span><span><strong>Modelagem FUNCEF</strong>: Motor de cálculo atuarial em Python para o 3º maior fundo de pensão do Brasil.</span></li>
                <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--secondary)', fontSize: '1rem', marginTop: '0.05rem' }}>📊</span><span><strong>Governança de Passivos CPC 33 / IAS 19</strong>: Pareceres preventivos e corretivos de equacionamento de déficit para conselhos corporativos.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
