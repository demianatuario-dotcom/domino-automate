'use client';
import React from 'react';

export default function AIAssistantHighlight() {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="assistente-virtual" style={{ padding: '6rem 2rem', position: 'relative', backgroundColor: 'var(--surface-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
        
        <div style={{ marginBottom: '-0.5rem', display: 'flex', justifyContent: 'center' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ filter: 'drop-shadow(0 0 16px rgba(233,193,118,0.35))' }}>
            <circle cx="28" cy="28" r="27" stroke="rgba(233,193,118,0.3)" strokeWidth="1.5"/>
            <circle cx="28" cy="28" r="20" stroke="rgba(233,193,118,0.15)" strokeWidth="1"/>
            <circle cx="28" cy="28" r="6" fill="rgba(233,193,118,0.2)" stroke="var(--secondary)" strokeWidth="1.5"/>
            <line x1="28" y1="8" x2="28" y2="22" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="28" y1="34" x2="28" y2="48" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="28" x2="22" y2="28" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="34" y1="28" x2="48" y2="28" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="28" cy="8" r="2.5" fill="var(--secondary)"/>
            <circle cx="28" cy="48" r="2.5" fill="var(--secondary)"/>
            <circle cx="8" cy="28" r="2.5" fill="var(--secondary)"/>
            <circle cx="48" cy="28" r="2.5" fill="var(--secondary)"/>
          </svg>
        </div>
        <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
          Atendimento Técnico Inteligente
        </span>
        <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
          Diagnóstico Preliminar com <span style={{ color: 'var(--secondary)' }}>Assistente Técnico de IA</span>
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
