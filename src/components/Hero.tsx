import React from 'react';

export default function Hero() {
  return (
    <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 2rem 3rem', textAlign: 'center', position: 'relative', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '960px', zIndex: 10 }}>
        <div className="animate-fadein-1 badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '50px', background: 'rgba(233, 193, 118, 0.1)', border: '1px solid rgba(233, 193, 118, 0.35)', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>⚖️ Vertical Especializada em Ciências Atuariais, Previdência & Perícia Judicial</span>
        </div>
        <h1 className="display-lg animate-fadein-2" style={{ marginBottom: '1.5rem', lineHeight: '1.14', fontSize: 'clamp(2.25rem, 4.4vw, 3.65rem)' }}>
          Auditoria CPC 33 / IAS 19, Solvência PREVIC e{' '}
          <span style={{ color: 'var(--secondary)' }}>Perícia Atuarial de Alta Complexidade.</span>
        </h1>
        <p className="body-md animate-fadein-3" style={{ marginBottom: '2.5rem', opacity: 0.9, maxWidth: '820px', margin: '0 auto 2.5rem', fontSize: '1.18rem', lineHeight: '1.7' }}>
          Atuação técnica direta sob responsabilidade de atuário registrado (<strong>MIBA 1807</strong>) na avaliação independente de passivos atuariais em balanços corporativos, equacionamento de déficits em EFPCs, assistência técnica em litígios judiciais (TRT10 / TJDFT) e modelagem estocástica automatizada.
        </p>
        <div className="animate-fadein-3" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <a href="#orcamento" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', fontWeight: 600 }}>
            Solicitar Parecer ou Assistência Técnica
          </a>
          <a
            href="https://wa.me/5561981171564?text=Ol%C3%A1%2C%20Demian!%20Vim%20pela%20vertical%20de%20Atu%C3%A1ria%20da%20Domino%20Automate%20e%20gostaria%20de%20conversar%20sobre%20uma%20demanda%20t%C3%A9cnica."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '1rem 2rem', fontSize: '1.05rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Falar com o Atuário no WhatsApp</span>
            <span>↗</span>
          </a>
        </div>

        {/* Rapid Proof Badges */}
        <div className="animate-fadein-4" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="card-base ghost-border" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '30px', background: 'rgba(27, 33, 43, 0.5)' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>⚖️</span>
            <span className="label-md" style={{ fontSize: '0.875rem' }}>MIBA Registrado: <strong>1807</strong></span>
          </div>
          <div className="card-base ghost-border" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '30px', background: 'rgba(27, 33, 43, 0.5)' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>🏛️</span>
            <span className="label-md" style={{ fontSize: '0.875rem' }}>+15 Anos em Governança de EFPCs e Setor Bancário</span>
          </div>
          <div className="card-base ghost-border" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '30px', background: 'rgba(27, 33, 43, 0.5)' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>📊</span>
            <span className="label-md" style={{ fontSize: '0.875rem' }}>Conformidade CPC 33 (R1), IAS 19 & PREVIC</span>
          </div>
        </div>

        {/* Credential Anchor Line */}
        <div className="animate-fadein-4" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', opacity: 0.55, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>
          <span>10 Perícias Homologadas</span>
          <span style={{ color: 'var(--secondary)' }}>•</span>
          <span>Caixa Econômica Federal</span>
          <span style={{ color: 'var(--secondary)' }}>•</span>
          <span>FUNCEF — 3º Maior Fundo de Pensão do Brasil</span>
          <span style={{ color: 'var(--secondary)' }}>•</span>
          <span>TRT10 & TJDFT</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }} />
    </section>
  );
}
