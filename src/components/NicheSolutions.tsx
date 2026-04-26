import React from 'react';

export default function NicheSolutions() {
  const niches = [
    {
      title: "Clínicas e Saúde",
      pain: "Fila de espera e confirmações manuais.",
      solution: "IA que agenda e confirma consultas via WhatsApp.",
      roi: "Redução de 40% nas faltas (no-show)."
    },
    {
      title: "Imobiliárias",
      pain: "Demora na qualificação de novos leads.",
      solution: "SDR de IA que filtra interesse e agendamento de visitas.",
      roi: "Aumento de 25% na velocidade de fechamento."
    },
    {
      title: "E-commerce",
      pain: "Abandono de carrinho e suporte lento.",
      solution: "Recuperação automática de vendas e suporte 24/7.",
      roi: "Recuperação de até 15% das vendas perdidas."
    },
    {
      title: "Serviços e B2B",
      pain: "Processos manuais de orçamento e contratos.",
      solution: "Automação de propostas e integração total com CRM.",
      roi: "Economia de 20+ horas semanais da equipe."
    }
  ];

  return (
    <section id="nichos" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="display-sm">Soluções Especializadas por <span style={{ color: 'var(--secondary)' }}>Segmento</span></h2>
          <p className="body-md" style={{ opacity: 0.8, marginTop: '1rem' }}>Sua empresa tem um cenário único. Nós temos a engenharia certa para ele.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {niches.map((n, i) => (
            <div key={i} className="card-base glass-panel floating-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--outline-variant)' }}>
              <h3 className="headline-sm" style={{ color: 'var(--secondary)' }}>{n.title}</h3>
              <div>
                <p className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase' }}>O Problema:</p>
                <p className="body-sm">{n.pain}</p>
              </div>
              <div>
                <p className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase' }}>Nossa Solução:</p>
                <p className="body-sm">{n.solution}</p>
              </div>
              <div style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: 'var(--primary-container)', borderRadius: '8px', textAlign: 'center' }}>
                <p className="label-md" style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{n.roi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
