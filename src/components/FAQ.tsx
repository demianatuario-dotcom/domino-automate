'use client';
import React, { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "A automação é segura para os meus dados?",
      a: "Sim. Utilizamos infraestrutura de IA Privada e seguimos rigorosamente as normas da LGPD. Seus dados não são compartilhados com modelos públicos para treinamento."
    },
    {
      q: "Quanto tempo demora para a solução estar no ar?",
      a: "Nossa metodologia de 'Setup Rápido' permite que sua primeira automação esteja rodando em média em 7 dias úteis após o diagnóstico."
    },
    {
      q: "A Domino Automate substitui minha equipe atual?",
      a: "Não. Nossas soluções visam eliminar tarefas repetitivas e burocráticas para que sua equipe foque no que realmente traz faturamento: o fechamento comercial e a estratégia."
    },
    {
      q: "Qual o investimento necessário?",
      a: "O investimento varia conforme a complexidade, mas trabalhamos com um modelo de Implantação + Suporte Mensal focado em gerar ROI positivo nos primeiros 60 dias."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container-highest)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '4rem' }}>Dúvidas <span style={{ color: 'var(--secondary)' }}>Comuns</span></h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((f, i) => (
            <div key={i} className="card-base ghost-border" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 className="label-md" style={{ fontWeight: 'bold' }}>{f.q}</h4>
                <span style={{ fontSize: '1.5rem', transform: openIndex === i ? 'rotate(45deg)' : 'none', transition: '0.3s' }}>+</span>
              </div>
              {openIndex === i && (
                <p className="body-md" style={{ marginTop: '1rem', opacity: 0.8, borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem' }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
