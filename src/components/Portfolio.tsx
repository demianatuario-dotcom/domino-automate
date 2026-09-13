"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Book {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: string[];
  tags: string[];
}

const corporateCases = [
  {
    id: 'funcef-modelagem',
    title: 'Modelagem Atuarial em Python (FUNCEF)',
    category: 'Previdência Complementar Fechada',
    badge: '3º Maior Fundo de Pensão do Brasil',
    icon: '🐍',
    description: 'Desenvolvimento e implementação de algoritmos de cálculo atuarial e projeção de solvência em Python para planos previdenciários complexos, integrando bases cadastrais massivas a modelos matemáticos de alta precisão.',
    tags: ['Python', 'Cálculo Atuarial', 'Modelagem de Risco', 'Governança EFPC']
  },
  {
    id: 'pericias-tjdft-trt10',
    title: '10 Perícias Atuariais Homologadas (TJDFT & TRT10)',
    category: 'Perícia Judicial & Assistência Técnica',
    badge: '10 Laudos Concluídos com Sucesso',
    icon: '⚖️',
    description: 'Atuação especializada como Perito Judicial e Assistente Técnico em litígios previdenciários, bancários e trabalhistas de alta complexidade. Apuração rigorosa de reservas matemáticas, diferenças salariais e liquidações de sentença.',
    tags: ['TJDFT', 'TRT 10ª Região', 'Perícia Contábil/Atuarial', 'Quesitos Estratégicos']
  },
  {
    id: 'consultoria-cpc33-previc',
    title: 'Consultoria Regulatória PREVIC & CPC 33 (R1) / IAS 19',
    category: 'Auditoria de Balanços e Solvência',
    badge: 'Conformidade Regulatória e Mitigação de Déficits Atuariais',
    icon: '📊',
    description: 'Auditoria independente de passivos atuariais, validação de tábuas biométricas e hipóteses financeiras, testes de sensibilidade e pareceres técnicos fundamentados para patrocinadoras e conselhos deliberativos.',
    tags: ['CPC 33 (R1)', 'IAS 19', 'PREVIC', 'Auditoria Independente']
  },
  {
    id: 'engenharia-n8n-ia',
    title: 'Engenharia de Automação com n8n, Python & Agentes IA',
    category: 'Hiperautomação Corporativa & Web',
    badge: 'Pipelines Seguros & LGPD',
    icon: '⚡',
    description: 'Construção de plataformas web corporativas de alto desempenho, esteiras autônomas de dados orquestradas via n8n e assistentes de IA generativa integrados ao WhatsApp para triagem qualificada e suporte 24/7.',
    tags: ['n8n', 'Python', 'Agentes IA Privados', 'WhatsApp API', 'Next.js'],
    hasBook: true
  }
];

const books: Book[] = [
  {
    id: 'lana-wolf',
    title: 'Plataforma Digital & Automação n8n',
    category: 'Arquitetura Web & IA',
    description: 'Plataforma Avançada Integrada com Agente de IA, WhatsApp e Automações N8N para Orçamentação e Gestão de Fluxos.',
    coverImage: '/Book_Lana/Site1.png',
    images: [
      '/Book_Lana/Site1.png',
      '/Book_Lana/Site2.png',
      '/Book_Lana/Site3.png',
      '/Book_Lana/Site4.png',
      '/Book_Lana/Site5.png',
      '/Book_Lana/Fluxo N8N.png',
      '/Book_Lana/Fluxos N8N.png'
    ],
    tags: ['Next.js', 'n8n', 'IA']
  }
];

export default function Portfolio() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const openBook = (book: Book) => {
    setActiveBook(book);
    setCurrentImageIdx(0);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBook = () => {
    setActiveBook(null);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBook && currentImageIdx < activeBook.images.length - 1) {
      setCurrentImageIdx((prev) => prev + 1);
    }
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBook && currentImageIdx > 0) {
      setCurrentImageIdx((prev) => prev - 1);
    }
  };

  return (
    <section id="casos-solucoes" style={{ padding: '6rem 2rem', position: 'relative', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Portfólio Institucional
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Obras de Engenharia Digital & Atuária Aplicada
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '750px', margin: '0 auto' }}>
            Geração comprovada de valor em grandes instituições de previdência, laudos periciais homologados em tribunais superiores e ecossistemas de automação corporativa.
          </p>
        </div>
        
        {/* Executive Case Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {corporateCases.map(item => (
            <div 
              key={item.id} 
              className="card-base ghost-border glass-panel" 
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '3px solid var(--secondary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="label-sm" style={{ color: 'var(--secondary)', background: 'rgba(233, 193, 118, 0.12)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontWeight: 700 }}>
                  {item.badge}
                </span>
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              </div>

              <div>
                <p className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{item.category}</p>
                <h3 className="headline-sm" style={{ fontSize: '1.25rem', color: 'var(--on-surface)', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
              </div>

              <p className="body-sm" style={{ opacity: 0.85, lineHeight: 1.65, flex: 1 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {item.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', opacity: 0.8 }}>
                    {t}
                  </span>
                ))}
              </div>

              {item.hasBook && (
                <button
                  onClick={() => openBook(books[0])}
                  className="btn-secondary"
                  style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Ver Book de Arquitetura & Telas</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Highlight Banner: Papers, Guias & Meus Estudos */}
        <div 
          className="card-base" 
          style={{ 
            padding: '3.5rem 3rem', 
            background: 'linear-gradient(135deg, rgba(27, 33, 43, 0.95) 0%, rgba(13, 35, 68, 0.75) 100%)',
            border: '1px solid rgba(233, 193, 118, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '50px', background: 'rgba(233, 193, 118, 0.15)', border: '1px solid rgba(233, 193, 118, 0.3)' }}>
              <span style={{ fontSize: '0.9rem' }}>📚</span>
              <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Produção Científica & Metodológica
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', width: '100%', alignItems: 'center' }}>
              <div>
                <h3 className="display-sm" style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Papers Técnicos, Guias Práticos e <span style={{ color: 'var(--secondary)' }}>Estudos Atuariais</span>
                </h3>
                <p className="body-md" style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '1rem' }}>
                  Acreditamos na transparência e no aprofundamento metodológico. Desenvolvemos continuamente artigos técnicos, notas de pesquisa sobre CPC 33, modelagem de solvência em EFPCs e a aplicação prática de agentes autônomos no direito corporativo.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Notas Técnicas PREVIC
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Modelagem de Reservas em Python
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                    <span style={{ color: 'var(--secondary)' }}>✓</span> Teses Periciais para Tribunais
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(10, 14, 20, 0.6)', border: '1px solid var(--outline-variant)', width: '100%' }}>
                  <p className="label-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Acesse a Seção "Meus Estudos"
                  </p>
                  <p className="body-sm" style={{ opacity: 0.8, marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                    Consulte os guias completos e estudos publicados diretamente no portal curricular do nosso fundador.
                  </p>
                  <a 
                    href="https://domino-automate.com.br/curriculo/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, width: '100%', justifyContent: 'center' }}
                  >
                    <span>Explorar Meus Estudos & Currículo</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Lightbox / Modal for Book Captures */}
      {activeBook && (
        <div 
          onClick={closeBook}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, 
            backgroundColor: 'rgba(10, 14, 20, 0.95)', backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
        >
           <div style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', zIndex: 1001, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <div style={{ color: '#fff' }}>
                <h3 className="headline-sm">{activeBook.title}</h3>
                <p className="body-sm" style={{ opacity: 0.7 }}>Visualizando Imagem {currentImageIdx + 1} de {activeBook.images.length}</p>
              </div>
              <button onClick={closeBook} style={{ background: 'var(--surface-variant-glass)', border: '1px solid var(--outline-variant)', borderRadius: '50%', color: '#fff', fontSize: '1.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                &times;
              </button>
           </div>

           <div style={{ position: 'relative', width: '85%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4rem' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={prevImg} disabled={currentImageIdx === 0} style={{ 
                position: 'absolute', left: '-5%', background: 'var(--surface-variant-glass)',
                border: '1px solid var(--outline-variant)', borderRadius: '50%', width: '50px', height: '50px',
                color: '#fff', fontSize: '1.5rem', cursor: currentImageIdx === 0 ? 'not-allowed' : 'pointer', zIndex: 10,
                opacity: currentImageIdx === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>&#10094;</button>

              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={activeBook.images[currentImageIdx]} alt={`${activeBook.title} imagem ${currentImageIdx + 1}`} fill style={{ objectFit: 'contain' }} />
              </div>

              <button onClick={nextImg} disabled={currentImageIdx === activeBook.images.length - 1} style={{ 
                position: 'absolute', right: '-5%', background: 'var(--surface-variant-glass)',
                border: '1px solid var(--outline-variant)', borderRadius: '50%', width: '50px', height: '50px',
                color: '#fff', fontSize: '1.5rem', cursor: currentImageIdx === activeBook.images.length - 1 ? 'not-allowed' : 'pointer', zIndex: 10,
                opacity: currentImageIdx === activeBook.images.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>&#10095;</button>
           </div>
        </div>
      )}
    </section>
  );
}
