'use client';
import React from 'react';

export default function AIAssistantHighlight() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="assistente-virtual" style={{ padding: '6rem 2rem', position: 'relative', backgroundColor: 'var(--surface-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
        
        <div style={{ fontSize: '4rem', animation: 'pulse 3s infinite', marginBottom: '-1rem' }}>🤖</div>
        <h2 className="display-lg">Consultor de Inovação em Tempo Integral</h2>
        
        <p className="body-md" style={{ maxWidth: '800px', opacity: 0.9, fontSize: '1.125rem', lineHeight: 1.8 }}>
          Temos um Assistente Virtual com IA especializado à sua disposição 24 horas por dia. 
          Ele conhece todos os nossos serviços em profundidade e está pronto para entender 
          os gargalos da sua operação, oferecendo de forma consultiva as melhores estratégias 
          e soluções em tecnologia.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '2rem' }}>
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>🎯</div>
            <h3 className="label-md" style={{ fontSize: '1.25rem' }}>Triagem e Diagnóstico</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Analisa o cenário atual da sua empresa para mapear seus principais problemas operacionais.</p>
          </div>
          
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>💡</div>
            <h3 className="label-md" style={{ fontSize: '1.25rem' }}>Consultoria Especializada</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Domina nossas soluções de desenvolvimento, automação com N8N e agentes autônomos.</p>
          </div>
          
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>⚡</div>
            <h3 className="label-md" style={{ fontSize: '1.25rem' }}>Atendimento Imediato</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Respostas rápidas e precisas, preparando todo o terreno antes de falar com nossa equipe técnica.</p>
          </div>
        </div>
        
        <button 
          onClick={openChat} 
          className="btn-primary floating-shadow" 
          style={{ marginTop: '3rem', fontSize: '1.125rem', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px' }}
        >
          <span>Conversar com o Assistente Agora</span>
          <span style={{ fontSize: '1.5rem' }}>💬</span>
        </button>
        
      </div>
    </section>
  );
}
