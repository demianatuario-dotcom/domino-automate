'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InstitutionalHub() {
  const [menuOpen, setMenuOpen] = useState(false);

  const capabilities = [
    {
      num: '01',
      title: 'Engenharia de Software & Arquitetura Web',
      tag: 'Next.js • TypeScript • Sistemas Críticos',
      desc: 'Construção de ecossistemas digitais propietarios de resposta sub-segundo, desenhados sob medida para autoridade institucional, captura qualificada e conversão direta.'
    },
    {
      num: '02',
      title: 'Orquestração Autônoma & Pipelines de Dados',
      tag: 'n8n • Python • R • PostgreSQL',
      desc: 'Integração ponta a ponta entre bancos de dados, ERPs, CRMs e canais de comunicação, eliminando trabalho braçal, retrabalho humano e gargalos operacionais.'
    },
    {
      num: '03',
      title: 'Agentes de Inteligência Artificial Privada',
      tag: 'LLMs • WhatsApp API • Governança LGPD',
      desc: 'Assistentes cognitivos treinados na regra de negócio específica de cada vertical para triagem técnica, agendamento autônomo 24/7 e diagnóstico em tempo real.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', color: 'var(--on-surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Institucional */}
      <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.png" alt="Domino Automate Logo" width={150} height={50} className="mobile-logo-img" style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(233, 193, 118, 0.2))' }} priority />
        </Link>

        <nav className="header-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#apresentacao" className="label-md desktop-only" style={{ opacity: 0.85 }}>A Domino</a>
          <a href="#habilidades" className="label-md desktop-only" style={{ opacity: 0.85 }}>Competências</a>
          <a href="#verticais" className="label-md desktop-only" style={{ opacity: 0.85 }}>Unidades de Negócio</a>
          <Link href="/Atuária" className="label-md desktop-only" style={{ color: 'var(--secondary)' }}>
            Atuária ↗
          </Link>
          <Link href="/Estúdios" className="label-md desktop-only" style={{ color: '#E5C07B' }}>
            Estúdios ↗
          </Link>
          <a href="#verticais" className="btn-primary header-btn desktop-only" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            Acessar Soluções
          </a>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#apresentacao" onClick={() => setMenuOpen(false)}>A Domino Automate</a>
        <a href="#habilidades" onClick={() => setMenuOpen(false)}>Habilidades & Engenharia</a>
        <a href="#verticais" onClick={() => setMenuOpen(false)}>Unidades de Negócio</a>
        <Link href="/Atuária" onClick={() => setMenuOpen(false)} style={{ color: 'var(--secondary)' }}>
          Vertical: Atuária & Riscos ↗
        </Link>
        <Link href="/Estúdios" onClick={() => setMenuOpen(false)} style={{ color: 'var(--secondary)' }}>
          Vertical: Estúdios de Beleza ↗
        </Link>
      </nav>

      {/* Hero: Introdução Institucional da Domino Automate */}
      <section id="apresentacao" style={{ padding: '9rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: '42vw', height: '42vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(90px)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '920px' }}>
            <div className="animate-fadein-1 badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 1.1rem', borderRadius: '4px', background: 'rgba(233, 193, 118, 0.1)', borderLeft: '3px solid var(--secondary)', marginBottom: '1.75rem' }}>
              <span style={{ color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                DOMINO AUTOMATE • ENGENHARIA DE SISTEMAS & HIPERAUTOMAÇÃO
              </span>
            </div>

            <h1 className="display-lg animate-fadein-2" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.1rem)', lineHeight: 1.08, marginBottom: '1.75rem', textAlign: 'left' }}>
              Engenharia Digital, Inteligência Analítica e{' '}
              <span style={{ color: 'var(--secondary)' }}>Sistemas Autônomos de IA.</span>
            </h1>

            <p className="body-md animate-fadein-3" style={{ fontSize: '1.2rem', lineHeight: 1.75, opacity: 0.88, maxWidth: '780px', marginBottom: '2.75rem' }}>
              A <strong>Domino Automate</strong> é uma software house e consultoria de engenharia aplicada sediada em Brasília-DF. Desenvolvemos arquiteturas digitais sob medida que combinam <strong>modelagem matemática, orquestração de processos (n8n / Python) e agentes de Inteligência Artificial privada</strong> para transformar operações complexas em máquinas previsíveis de eficiência e geração de valor.
            </p>

            <div className="animate-fadein-4" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="#verticais" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem', fontWeight: 700 }}>
                Explorar Verticais Especializadas ↓
              </a>
              <a href="#habilidades" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Conhecer Nossas Competências
              </a>
            </div>
          </div>

          {/* Indicadores Institucionais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '4.5rem' }}>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Arquitetura Proprietária</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>Python • n8n • Next.js</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Motores analíticos, integrações via API e aplicações web de alta performance.</p>
            </div>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operação Contínua</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>Agentes IA 24/7</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Atendimento consultivo, triagem técnica e execução de fluxos em tempo real.</p>
            </div>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Privacidade & Rigor</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>100% LGPD & Sigilo</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Infraestrutura em nuvem privada com proteção integral dos dados de clientes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competências & Habilidades da Domino */}
      <section id="habilidades" style={{ padding: '5.5rem 2rem', backgroundColor: 'var(--surface-container-low)', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
            <div>
              <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                DNA Tecnológico & Habilidades
              </span>
              <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)', marginTop: '0.5rem' }}>
                O Que Construímos na <span style={{ color: 'var(--secondary)' }}>Domino Automate</span>
              </h2>
            </div>
            <p className="body-md" style={{ maxWidth: '480px', opacity: 0.8 }}>
              Unimos engenharia de software moderna, ciência de dados e automação inteligente para resolver gargalos onde soluções genéricas falham.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {capabilities.map((cap) => (
              <div
                key={cap.num}
                className="card-base ghost-border"
                style={{
                  position: 'relative',
                  padding: '2.5rem 2rem',
                  backgroundColor: 'var(--surface-container)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <span style={{ position: 'absolute', top: '0.5rem', right: '1.25rem', fontSize: '4.5rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--secondary)', opacity: 0.08, lineHeight: 1 }}>
                  {cap.num}
                </span>
                <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {cap.tag}
                </span>
                <h3 className="headline-sm" style={{ fontSize: '1.35rem', lineHeight: 1.3 }}>
                  {cap.title}
                </h3>
                <p className="body-sm" style={{ opacity: 0.85, lineHeight: 1.7 }}>
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hub de Verticais Especializadas: /Atuária e /Estúdios */}
      <section id="verticais" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              Ecossistemas Dedicados por Setor
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Selecione a Vertical do <span style={{ color: 'var(--secondary)' }}>Seu Segmento</span>
            </h2>
            <p className="body-md" style={{ maxWidth: '720px', margin: '0 auto', opacity: 0.85 }}>
              Cada mercado exige linguagem, modelagem e fluxos específicos. Acesse abaixo o ambiente exclusivo desenhado para a sua área de atuação:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
            {/* Card Vertical 1: /Atuária */}
            <div
              className="card-base ghost-border floating-shadow"
              style={{
                padding: '3rem 2.5rem',
                background: 'linear-gradient(155deg, #0d2344 0%, #0e141d 100%)',
                borderTop: '4px solid var(--secondary)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="label-sm" style={{ padding: '0.4rem 0.85rem', borderRadius: '4px', backgroundColor: 'rgba(233, 193, 118, 0.15)', color: 'var(--secondary)', fontWeight: 700 }}>
                    VERTICAL CORPORATIVA & JURÍDICA
                  </span>
                  <span style={{ fontSize: '2.25rem' }}>🏛️</span>
                </div>

                <h3 className="display-sm" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#fff' }}>
                  Inteligência Atuarial, Perícia & Governança de Riscos
                </h3>

                <p className="body-md" style={{ opacity: 0.88, lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  Soluções de alta precisão conduzidas por atuário registrado (MIBA 1807) para Fundos de Pensão (EFPCs), Patrocinadoras e Escritórios de Advocacia em litígios complexos.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', opacity: 0.9 }}>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>✓</span>
                    <span>Auditoria Independente CPC 33 (R1) / IAS 19 e Solvência PREVIC</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>✓</span>
                    <span>Perícia Judicial e Assistência Técnica (TRT10, TJDFT e Tribunais)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>✓</span>
                    <span>Motores de Cálculo Atuarial em Python e Agentes de IA Jurídica</span>
                  </li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem' }}>
                <Link
                  href="/Atuária"
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1.1rem 1.5rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  <span>Explorar Vertical de Atuária</span>
                  <span>/Atuária →</span>
                </Link>
              </div>
            </div>

            {/* Card Vertical 2: /Estúdios */}
            <div
              className="card-base ghost-border floating-shadow"
              style={{
                padding: '3rem 2.5rem',
                background: 'linear-gradient(155deg, #24171D 0%, #110D10 100%)',
                borderTop: '4px solid #D4AF37',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="label-sm" style={{ padding: '0.4rem 0.85rem', borderRadius: '4px', backgroundColor: 'rgba(212, 175, 55, 0.16)', color: '#E5C07B', fontWeight: 700 }}>
                    VERTICAL BELEZA, ESTÉTICA & BEM-ESTAR
                  </span>
                  <span style={{ fontSize: '2.25rem' }}>✨</span>
                </div>

                <h3 className="display-sm" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: '#FAF8F5' }}>
                  Automação & Recepção IA para Estúdios de Beleza
                </h3>

                <p className="body-md" style={{ opacity: 0.88, lineHeight: 1.7, marginBottom: '1.75rem', color: '#EAE3DC' }}>
                  Ecossistema completo de atendimento, agendamento inteligente 24/7 no WhatsApp e Landing Pages de alto padrão para Clínicas de Estética, Lash Designers e Salões Premium.
                </p>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', opacity: 0.9, color: '#EAE3DC' }}>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: '#E5C07B', fontWeight: 700 }}>✓</span>
                    <span>SDR & Recepcionista de IA no WhatsApp 24/7 para Agendamentos</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: '#E5C07B', fontWeight: 700 }}>✓</span>
                    <span>Automação Anti No-Show (Lembretes, Confirmações e Reativação)</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ color: '#E5C07B', fontWeight: 700 }}>✓</span>
                    <span>Landing Pages de Luxo com Funil Direto para WhatsApp e N8N</span>
                  </li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(229, 192, 123, 0.2)', paddingTop: '1.5rem' }}>
                <Link
                  href="/Estúdios"
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1.1rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    backgroundImage: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
                    color: '#110D10'
                  }}
                >
                  <span>Explorar Vertical de Estúdios</span>
                  <span>/Estúdios →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Institucional Enxuto */}
      <footer style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '3.5rem 2rem', marginTop: 'auto', borderTop: '1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 className="headline-sm" style={{ color: 'var(--secondary)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              Domino Automate
            </h4>
            <p className="body-sm" style={{ opacity: 0.75, fontSize: '0.85rem' }}>
              DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA • CNPJ: 66.699.218/0001-94 • Brasília - DF
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/Atuária" className="label-sm" style={{ color: 'var(--secondary)' }}>/Atuária</Link>
            <Link href="/Estúdios" className="label-sm" style={{ color: 'var(--secondary)' }}>/Estúdios</Link>
            <a href="https://domino-automate.com.br/curriculo/" target="_blank" rel="noopener noreferrer" className="label-sm" style={{ opacity: 0.8 }}>
              Portal Curricular ↗
            </a>
            <a href="https://wa.me/5561981171564" target="_blank" rel="noopener noreferrer" className="label-sm" style={{ opacity: 0.8 }}>
              WhatsApp: (61) 98117-1564
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

