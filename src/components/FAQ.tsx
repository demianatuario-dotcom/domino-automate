'use client';
import React, { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "Como funciona a contratação como Assistente Técnico por escritórios de advocacia (quesitos, acompanhamento de perícia e impugnação de laudos)?",
      a: "Atuamos em todas as etapas probatórias ao lado da banca contratante: desde o parecer prévio de viabilidade econômica na fase inicial até a formulação de quesitos técnicos estratégicos (iniciais e suplementares), acompanhamento de diligências periciais, liquidação de sentença e elaboração de parecer divergente/impugnação técnica fundamentada contra laudos oficiais inconsistentes, em atuação presencial no DF ou remota em todo o Brasil."
    },
    {
      q: "Qual a diferença entre a atuação como Perito do Juízo e como Assistente Técnico / Parecerista?",
      a: "A distinção ética e processual é rigorosamente respeitada: quando nomeado como Perito do Juízo, a atuação ocorre com absoluta imparcialidade técnica, equidistância e fidelidade estrita à prova dos autos para subsidiar a decisão do Magistrado. Já como Assistente Técnico ou Parecerista contratado por escritórios, empresas ou EFPCs, oferecemos suporte técnico especializado à parte para assegurar o rigor matemático da tese, blindar cálculos e apontar erros materiais em laudos contrários."
    },
    {
      q: "Como o uso de Python, R e Excel/VBA aumenta a segurança jurídica e reduz o risco de impugnação de cálculos?",
      a: "Planilhas manuais extensas são vulneráveis a fórmulas sobrescritas, erros de arredondamento em cadeia e falhas ao lidar com grandes volumes de registros. Ao estruturar os cálculos em scripts auditáveis em Python, R e Excel/VBA, entregamos memória de cálculo 100% reproduzível, com trilha de auditoria clara e conformidade exata aos índices e tábuas determinados no título judicial ou regulamento — reduzindo drasticamente a margem para impugnações bem-sucedidas."
    },
    {
      q: "Como funciona a auditoria independente CPC 33 (R1) / IAS 19 e conformidade PREVIC?",
      a: "Executamos a revisão independente de passivos atuariais em balanços de patrocinadoras e EFPCs, validando tábuas biométricas, hipóteses econômico-financeiras (juros reais, inflação, crescimento salarial), apuração do Valor Presente Atuarial (VPA), notas explicativas e planos de equacionamento de déficit, com pareceres técnicos objetivos para Conselhos Deliberativos, Fiscais e auditorias externas."
    },
    {
      q: "Como automações em n8n e agentes de IA privados operam sob sigilo processual e LGPD?",
      a: "Toda a arquitetura é desenhada para dados jurídicos e atuariais sensíveis: implementamos pipelines em n8n, scripts locais/em nuvem privada e agentes de IA isolados onde processos, peças e cadastros de participantes jamais alimentam modelos públicos de terceiros. Antes do envio de documentos sob segredo de justiça ou bases reais, formalizamos termo de confidencialidade (NDA) e canal criptografado em conformidade integral com a LGPD (Lei 13.709/2018)."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container-highest)', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Transparência Técnica & Clareza
          </span>
          <h2 className="display-sm" style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: 0 }}>Perguntas Frequentes sobre <span style={{ color: 'var(--secondary)' }}>Nossos Serviços</span></h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            const panelId = `atuaria-faq-panel-${i}`;
            return (
              <div key={i} className="card-base ghost-border" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1.35rem 1.5rem',
                    minHeight: '48px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'transparent',
                    color: 'var(--on-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span className="label-md" style={{ fontWeight: 'bold' }}>{f.q}</span>
                  <span aria-hidden="true" style={{ fontSize: '1.5rem', transform: isOpen ? 'rotate(45deg)' : 'none', transition: '0.3s' }}>+</span>
                </button>
                {isOpen && (
                  <div id={panelId} style={{ padding: '0 1.5rem 1.35rem' }}>
                    <p className="body-md" style={{ opacity: 0.85, borderTop: '1px solid var(--outline-variant)', paddingTop: '1rem' }}>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA final */}
        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', borderRadius: '12px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)' }}>
          <p className="body-md" style={{ opacity: 0.85, marginBottom: '1.25rem' }}>
            Não encontrou a resposta para sua situação específica?
          </p>
          <a href="#orcamento" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <span>Agendar Reunião Técnica</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
