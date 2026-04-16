import React from 'react';

export default function Header() {
  return (
    <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-surface)' }}>
        Domino <span style={{ color: 'var(--secondary)' }}>Automate</span>
      </div>
      <nav style={{ display: 'flex', gap: '2rem' }}>
        <a href="#solucoes" className="label-md">Soluções</a>
        <a href="#portfolio" className="label-md">Casos Reais</a>
        <a href="#orcamento" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Solicitar Proposta</a>
      </nav>
    </header>
  );
}
