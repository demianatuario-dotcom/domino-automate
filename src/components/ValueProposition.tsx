import React from 'react';

export default function ValueProposition() {
  const diffs = [
    { title: "Melhor Custo-Benefício", desc: "Preço reduzido em relação à concorrência. Cobrimos ofertas e não perdemos negócio por orçamento." },
    { title: "ROI Curto", desc: "A maioria dos nossos clientes recupera o investimento nos primeiros 30-60 dias." },
    { title: "IA Privada e Segura", desc: "Seus dados não são usados para treinar modelos públicos. Segurança total." },
    { title: "Infraestrutura Própria", desc: "Não dependemos apenas de ferramentas terceiras. Criamos motores customizados." }
  ];

  const steps = [
    { num: "01", title: "Diagnóstico", desc: "Identificamos seus maiores gargalos e onde você está perdendo dinheiro." },
    { num: "02", title: "Implementação", desc: "Construímos a engenharia (IA + N8N + Python) sob medida para seu fluxo." },
    { num: "03", title: "Escala", desc: "Sua operação roda no automático, 24/7, enquanto você foca no fechamento." }
  ];

  return (
    <section style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Why Domino? */}
        <div style={{ marginBottom: '6rem' }}>
          <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '3rem' }}>Por que escolher a <span style={{ color: 'var(--secondary)' }}>Domino Automate?</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {diffs.map((d, i) => (
              <div key={i} className="card-base ghost-border" style={{ padding: '2rem' }}>
                <h4 className="label-md" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{d.title}</h4>
                <p className="body-sm" style={{ opacity: 0.8 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div style={{ padding: '4rem', backgroundColor: 'var(--primary-container)', borderRadius: '24px', border: '1px solid var(--outline-variant)' }}>
          <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '4rem' }}>Como funciona nossa <span style={{ color: 'var(--secondary)' }}>Parceria de Crescimento</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: 'relative', textAlign: 'center' }}>
                <span style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--secondary)', opacity: 0.1, position: 'absolute', top: '-2rem', left: '50%', transform: 'translateX(-50%)' }}>{s.num}</span>
                <h4 className="headline-sm" style={{ marginBottom: '1rem', position: 'relative' }}>{s.title}</h4>
                <p className="body-md" style={{ opacity: 0.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
