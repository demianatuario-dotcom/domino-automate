import React from 'react';

export default function Pillars() {
  const pillars = [
    {
      title: "Orquestração N8N",
      description: "Conecte CRMs, ERPs e e-mails de forma fluida sem intervenção humana. Reduza o atrito e evite falhas operacionais.",
      icon: "⚡"
    },
    {
      title: "Python Integrado",
      description: "Para regras de negócio complexas, desenvolvemos scripts robustos capazes de processar altos volumes de dados.",
      icon: "🐍"
    },
    {
      title: "SDRs Autônomos de IA",
      description: "Agentes inteligentes integrados ao seu WhatsApp que qualificam leads, marcam reuniões e operam 24/7.",
      icon: "🤖"
    }
  ];

  return (
    <section id="solucoes" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '4rem' }}>Nossos Pilares Arquiteturais</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {pillars.map((pillar, i) => (
            <div key={i} className="card-base floating-shadow glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>{pillar.icon}</div>
              <h3 className="headline-sm">{pillar.title}</h3>
              <p className="body-md" style={{ opacity: 0.8 }}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
