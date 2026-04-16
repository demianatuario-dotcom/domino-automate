import React from 'react';

export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 2rem', textAlign: 'center', position: 'relative' }}>
      <div style={{ maxWidth: '800px', zIndex: 10 }}>
        <h1 className="display-lg" style={{ marginBottom: '1.5rem' }}>
          Otimize sua Operação. <br/>
          <span style={{ color: 'var(--secondary)' }}>Escale sua Receita.</span>
        </h1>
        <p className="body-md" style={{ marginBottom: '2.5rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          A Domino Automate é o braço de engenharia da sua PME. Transformamos processos manuais 
          em sistemas automatizados através de N8N, Python e Inteligência Artificial.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#orcamento" className="btn-primary">Criar Solução Agora</a>
          <a href="#solucoes" className="btn-secondary">Explorar Serviços</a>
        </div>
      </div>
      
      {/* Decorative gradient blur in background */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }}></div>
    </section>
  );
}
