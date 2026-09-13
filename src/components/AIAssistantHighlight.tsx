'use client';
import React from 'react';

export default function AIAssistantHighlight() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="assistente-virtual" style={{ padding: '6rem 2rem', position: 'relative', backgroundColor: 'var(--surface-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
        
        <div style={{ fontSize: '3.5rem', animation: 'pulse 3s infinite', marginBottom: '-0.5rem' }}>🤖</div>
        <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          Atendimento Técnico Inteligente
        </span>
        <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
          Fale com Nosso <span style={{ color: 'var(--secondary)' }}>Assistente Virtual Especializado</span>
        </h2>
        
        <p className="body-md" style={{ maxWidth: '820px', opacity: 0.9, fontSize: '1.125rem', lineHeight: 1.8 }}>
          Disponibilizamos um agente de IA treinado em <strong>cálculos atuariais, normativos PREVIC, CPC 33 e arquiteturas de automação corporativa</strong>. Realize uma triagem consultiva imediata do seu caso e prepare o terreno para a reunião técnica com Demian Lisboa Pereira (MIBA 1807).
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '2rem' }}>
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>⚖️</div>
            <h3 className="label-md" style={{ fontSize: '1.15rem' }}>Triagem de Perícia Judicial</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Mapeia litígios trabalhistas, previdenciários e cíveis, avaliando a necessidade de laudo ou assistência técnica.</p>
          </div>
          
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>🏛️</div>
            <h3 className="label-md" style={{ fontSize: '1.15rem' }}>Consultoria Atuarial & CPC 33</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Esclarece metodologias de avaliação de solvência, passivos atuariais e conformidade perante a PREVIC.</p>
          </div>
          
          <div className="card-base glass-panel ghost-border" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>🔒</div>
            <h3 className="label-md" style={{ fontSize: '1.15rem' }}>Engenharia n8n & IA Segura</h3>
            <p className="body-sm" style={{ opacity: 0.8 }}>Diagnóstica fluxos manuais para integração via Python e n8n, com rigoroso sigilo bancário e LGPD.</p>
          </div>
        </div>
        
        <button 
          onClick={openChat} 
          className="btn-primary floating-shadow" 
          style={{ marginTop: '2.5rem', fontSize: '1.05rem', padding: '1rem 2.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '50px', fontWeight: 600 }}
        >
          <span>Iniciar Consulta Técnica com o Assistente</span>
          <span style={{ fontSize: '1.3rem' }}>💬</span>
        </button>
        
      </div>
    </section>
  );
}
