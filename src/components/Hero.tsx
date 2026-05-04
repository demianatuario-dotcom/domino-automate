import React from 'react';

export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 2rem', textAlign: 'center', position: 'relative', background: 'var(--surface)' }}>
      <div style={{ maxWidth: '900px', zIndex: 10 }}>
        <h1 className="display-lg" style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Sua empresa perde vendas diariamente por{' '}
          <span style={{ color: 'var(--secondary)' }}>atendimento lento e processos manuais.</span>
        </h1>
        <p className="body-md" style={{ marginBottom: '2.5rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 2.5rem', fontSize: '1.25rem' }}>
          Automatize seu comercial agora e recupere seu faturamento em até 30 dias. 
          Soluções de IA de alta performance para quem não pode perder nenhum lead.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a href="#orcamento" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Solicitar Diagnóstico Gratuito</a>
          <a href="#simulador" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Simular Economia da Minha Empresa</a>
        </div>

        {/* Rapid Proof Badges */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--secondary)' }}>✓</span> <span className="label-md">Atendimento 24/7</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--secondary)' }}>✓</span> <span className="label-md">Resposta Instantânea</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--secondary)' }}>✓</span> <span className="label-md">Follow-up Automático</span>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient blur in background */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }}></div>
    </section>
  );
}
