import React from 'react';

export default function SocialProof() {
  const stats = [
    { label: "Tempo de Resposta", value: "-90%", description: "Leads atendidos em segundos." },
    { label: "Custo Operacional", value: "-40%", description: "Redução em tarefas repetitivas." },
    { label: "Conversão Comercial", value: "+28%", description: "Aumento médio em fechamentos." },
    { label: "Disponibilidade", value: "24/7", description: "Sua empresa nunca dorme." }
  ];

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--primary-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p className="display-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{stat.value}</p>
              <p className="label-md" style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p className="body-sm" style={{ opacity: 0.7 }}>{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Logos Placeholder */}
        <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid var(--outline-variant)', textAlign: 'center' }}>
          <p className="label-sm" style={{ opacity: 0.5, textTransform: 'uppercase', marginBottom: '2rem' }}>Tecnologias que dominamos</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4rem', filter: 'grayscale(1) opacity(0.5)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>N8N</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PYTHON</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>OPENAI</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ANTHROPIC</span>
          </div>
        </div>
      </div>
    </section>
  );
}
