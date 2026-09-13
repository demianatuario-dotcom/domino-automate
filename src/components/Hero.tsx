import React from 'react';

export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 2rem', textAlign: 'center', position: 'relative', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '960px', zIndex: 10 }}>
        <div className="animate-fadein-1 badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '50px', background: 'rgba(233, 193, 118, 0.1)', border: '1px solid rgba(233, 193, 118, 0.35)', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>🏛️ Boutique de Engenharia Digital & Inteligência Atuarial</span>
        </div>
        <h1 className="display-lg animate-fadein-2" style={{ marginBottom: '1.5rem', lineHeight: '1.15', fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}>
          Inteligência Atuarial, Governança de Riscos e{' '}
          <span style={{ color: 'var(--secondary)' }}>Engenharia de Automação com IA.</span>
        </h1>
        <p className="body-md animate-fadein-3" style={{ marginBottom: '2.5rem', opacity: 0.9, maxWidth: '820px', margin: '0 auto 2.5rem', fontSize: '1.2rem', lineHeight: '1.7' }}>
          Unimos a precisão regulatória do cálculo atuarial (MIBA) à escalabilidade dos sistemas autônomos de IA. Geramos valor concreto por meio da mitigação de riscos atuariais em balanços corporativos, assistência técnica em litígios judiciais complexos e hiperautomação para consultorias e operações jurídicas.
        </p>
        <div className="animate-fadein-3" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <a href="#orcamento" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.01em' }}>
            Agendar Reunião Técnica
          </a>
          <a href="#pilares" className="btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem', fontWeight: 600 }}>
            Explorar Áreas de Atuação
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
            <span className="label-md" style={{ fontSize: '0.875rem' }}>+15 Anos de Geração de Valor em EFPCs e Setor Bancário</span>
          </div>
          <div className="card-base ghost-border" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.25rem', borderRadius: '30px', background: 'rgba(27, 33, 43, 0.5)' }}>
            <span style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>🔒</span> 
            <span className="label-md" style={{ fontSize: '0.875rem' }}>Segurança de Dados & LGPD Bancária</span>
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
      
      {/* Decorative gradient blur in background */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }}></div>
    </section>
  );
}

