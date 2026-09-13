'use client';
import React, { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "Como funciona a atuação em perícias judiciais e assistência técnica atuarial?",
      a: "Atuamos tanto como Perito do Juízo quanto como Assistente Técnico indicado por escritórios de advocacia e departamentos jurídicos corporativos. Elaboramos quesitos preliminares estratégicos, pareceres de viabilidade, cálculos de liquidação de sentença e impugnações técnicas fundamentadas a laudos divergentes perante o TRT10, TJDFT e demais jurisdições."
    },
    {
      q: "Qual a metodologia aplicada na auditoria independente de CPC 33 (R1) e IAS 19?",
      a: "Realizamos a revisão rigorosa de tábuas biométricas, premissas econômico-financeiras (taxas de juros reais, inflação, crescimento de benefícios), apuração do valor presente das obrigações atuariais (VPA) e conciliação de passivos para notas explicativas de balanço de patrocinadoras e fundos de pensão (EFPCs), em conformidade com as normas contábeis e da PREVIC."
    },
    {
      q: "Como é garantida a segurança dos dados e o sigilo atuarial/bancário (LGPD)?",
      a: "Nossa infraestrutura opera sob padrões de sigilo bancário e governança de dados. Em automações e agentes de IA, implementamos ambientes privados onde dados confidenciais, cadastros de participantes e litígios nunca são utilizados para treinar modelos públicos de terceiros, atendendo com total rigor à Lei Geral de Proteção de Dados (LGPD)."
    },
    {
      q: "É possível integrar bases legadas e ERPs com automações em Python e n8n?",
      a: "Sim. Construímos pipelines que conectam bancos legados, planilhas e sistemas de folha/benefícios a motores de cálculo em Python e orquestradores em n8n. O resultado é a geração de relatórios e conciliações automáticas com auditoria completa de cada etapa, eliminando retrabalho e inconsistências materiais."
    },
    {
      q: "Quais são as modalidades de contratação dos serviços?",
      a: "Atendemos sob demanda (por parecer técnico atuarial, laudo pericial judicial ou projeto específico de engenharia de automação) e também em regime de assessoria técnica corporativa continuada para suporte permanente a comitês de risco, conselhos deliberativos e bancas de advocacia."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container-highest)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '4rem' }}>Perguntas Frequentes sobre <span style={{ color: 'var(--secondary)' }}>Nossos Serviços</span></h2>
        
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
