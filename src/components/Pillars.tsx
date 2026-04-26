import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      title: "Demora no Atendimento?",
      description: "Nossos SDRs Autônomos de IA atendem leads em segundos, qualificam e agendam reuniões 24h por dia. Não perca mais nenhum cliente por demora.",
      icon: "🤖",
      result: "Aumento imediato na taxa de conversão."
    },
    {
      title: "Falhas em Processos Manuais?",
      description: "Orquestramos fluxos via N8N que conectam seus sistemas (CRM, ERP, Planilhas). Elimine o erro humano e escale sua operação.",
      icon: "⚡",
      result: "Redução drástica em custos operacionais."
    },
    {
      title: "Gargalos de Dados?",
      description: "Desenvolvemos motores em Python para processamento complexo e automação de decisões. Transforme dados brutos em inteligência comercial.",
      icon: "🐍",
      result: "Previsibilidade total do seu faturamento."
    }
  ];

  return (
    <section id="solucoes" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '4rem' }}>Nossos Pilares Arquiteturais</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {pillars.map((pillar, i) => (
            <div key={i} className="card-base floating-shadow glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--secondary)' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>{pillar.icon}</div>
              <h3 className="headline-sm">{pillar.title}</h3>
              <p className="body-md" style={{ opacity: 0.8, flex: 1 }}>{pillar.description}</p>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary-container)', borderRadius: '4px', borderLeft: '3px solid var(--secondary)' }}>
                <p className="label-sm" style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>✓ {pillar.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
