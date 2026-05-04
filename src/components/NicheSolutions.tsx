import React from 'react';

const niches = [
  {
    title: "Clínicas e Saúde",
    icon: "🏥",
    pain: "Fila de espera e confirmações manuais.",
    solution: "IA que agenda e confirma consultas via WhatsApp.",
    roi: "Redução de 40% nas faltas (no-show)."
  },
  {
    title: "Imobiliárias",
    icon: "🏠",
    pain: "Demora na qualificação de novos leads.",
    solution: "SDR de IA que filtra interesse e agendamento de visitas.",
    roi: "Aumento de 25% na velocidade de fechamento."
  },
  {
    title: "E-commerce",
    icon: "🛒",
    pain: "Abandono de carrinho e suporte lento.",
    solution: "Recuperação automática de vendas e suporte 24/7.",
    roi: "Recuperação de até 15% das vendas perdidas."
  },
  {
    title: "Salões de Beleza",
    icon: "💇",
    pain: "Gestão de agenda e cancelamentos de última hora.",
    solution: "IA para agendamento automático e lembretes inteligentes via WhatsApp.",
    roi: "Aumento de 30% na taxa de ocupação."
  },
  {
    title: "Clínicas de Estética",
    icon: "✨",
    pain: "Perda de leads por demora no primeiro contato.",
    solution: "SDR de IA para qualificação e venda de pacotes 24/7.",
    roi: "Aumento de 25% na venda de procedimentos."
  },
  {
    title: "Barbearia",
    icon: "💈",
    pain: "Fluxo intenso de mensagens e marcações manuais.",
    solution: "Autoconsulta de horários e agendamento instantâneo via IA.",
    roi: "Redução total de custos com recepção."
  },
  {
    title: "Escritório de Advocacia",
    icon: "⚖️",
    pain: "Demora na triagem inicial de clientes e dúvidas repetitivas.",
    solution: "IA para triagem jurídica, agendamento de consultas e respostas automáticas 24/7.",
    roi: "Aumento de 35% na conversão de novos clientes."
  },
  {
    title: "Farmácias",
    icon: "💊",
    pain: "Atendimento lento em pedidos via WhatsApp e cotações manuais.",
    solution: "IA para cotação automática de medicamentos e finalização de pedidos.",
    roi: "Redução de 50% no tempo médio de atendimento."
  }
];

export default function NicheSolutions() {
  return (
    <section id="nichos" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="display-sm">Soluções Especializadas por <span style={{ color: 'var(--secondary)' }}>Segmento</span></h2>
          <p className="body-md" style={{ opacity: 0.8, marginTop: '1rem' }}>Sua empresa tem um cenário único. Nós temos a engenharia certa para ele.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {niches.map((n, i) => (
            <div key={i} className="card-base glass-panel floating-shadow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--outline-variant)', transition: 'border-color 0.3s, transform 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="niche-icon">
                  <span>{n.icon}</span>
                </div>
                <h3 className="headline-sm" style={{ color: 'var(--secondary)' }}>{n.title}</h3>
              </div>
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
