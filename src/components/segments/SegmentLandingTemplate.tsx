'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SegmentConfig } from '@/config/segmentsConfig';
import AIChat from '@/components/AIChat';

interface SegmentLandingTemplateProps {
  config: SegmentConfig;
}

export default function SegmentLandingTemplate({ config }: SegmentLandingTemplateProps) {
  const { theme, hero, pas, pillars, simulator, form, faqs } = config;

  const [menuOpen, setMenuOpen] = useState(false);

  // Simulator states
  const [val1, setVal1] = useState(simulator.slider1.defaultValue);
  const [val2, setVal2] = useState(simulator.slider2.defaultValue);
  const [val3, setVal3] = useState(simulator.slider3.defaultValue);

  // Form states
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [subType, setSubType] = useState(form.subTypes[0]);
  const [selectedPains, setSelectedPains] = useState<string[]>(form.painsList.slice(0, 2));
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const simResults = useMemo(() => {
    const extraConversionsMonth = Math.max(1, Math.round(val1 * simulator.conversionRate1));
    const revenueFromConversions = extraConversionsMonth * val2;

    const recoveredItemsMonth = Math.max(1, Math.round(val3 * 4 * simulator.recoveryRate3));
    const revenueFromRecovery = recoveredItemsMonth * val2;

    const monthlyTotal = revenueFromConversions + revenueFromRecovery;
    const annualTotal = monthlyTotal * 12;

    return {
      extraConversionsMonth,
      recoveredItemsMonth,
      monthlyTotal,
      annualTotal,
    };
  }, [val1, val2, val3, simulator.conversionRate1, simulator.recoveryRate3]);

  const togglePain = (pain: string) => {
    setSelectedPains(prev =>
      prev.includes(pain) ? prev.filter(p => p !== pain) : [...prev, pain]
    );
  };

  useEffect(() => {
    const handleAutomate = (e: any) => {
      const data = e.detail;
      if (data) {
        setNome(data.nome || '');
        setEmail(data.email || '');
        setWhatsapp(data.telefone || '');
        setDetalhes(data.detalhes || '');

        fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vertical: config.slug,
            origem: config.slug,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            tipo_organizacao: subType,
            demanda: form.demandLabel,
            dores: (data.dores || selectedPains).join(', '),
            doresArray: data.dores || selectedPains,
            descricao: data.detalhes || `Solicitado via Consultor IA na vertical ${config.slug}`,
          }),
        }).catch(err => console.error(err));
      }
    };

    window.addEventListener('automate-budget', handleAutomate);
    return () => window.removeEventListener('automate-budget', handleAutomate);
  }, [config.slug, subType, form.demandLabel, selectedPains]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setLoading(true);
    const cleanPhone = whatsapp.replace(/\D/g, '');

    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: config.slug,
          origem: config.slug,
          nome: nome.trim(),
          empresa: empresa.trim(),
          email: email.trim(),
          telefone: cleanPhone,
          tipo_organizacao: subType,
          demanda: form.demandLabel,
          dores: selectedPains.join(', '),
          doresArray: selectedPains,
          descricao: detalhes.trim(),
          b_website_check: honeypot,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar diagnóstico:', err);
    } finally {
      setLoading(false);
    }
  };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const whatsappDirectUrl = `https://wa.me/5561981171564?text=${encodeURIComponent(
    `${hero.whatsappGreeting}${empresa ? ` (${empresa})` : ''}`
  )}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary,
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Header Adaptado ao Segmento */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: `${theme.bgPrimary}E6`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image src="/logo.png" alt="Domino Automate Logo" width={140} height={46} className="mobile-logo-img" style={{ objectFit: 'contain' }} priority />
          </Link>
          <span
            className="desktop-only"
            style={{
              fontSize: '0.72rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: `${theme.accentPrimary}22`,
              color: theme.accentPrimary,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {config.headerBadge}
          </span>
        </div>

        <nav className="header-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" className="label-sm desktop-only" style={{ opacity: 0.8, color: theme.textPrimary }}>
            ← Portal Domino
          </Link>
          <a href="#pilares-solucao" className="label-md desktop-only" style={{ color: theme.textPrimary }}>
            Soluções
          </a>
          <a href="#simulador-roi" className="label-md desktop-only" style={{ color: theme.textPrimary }}>
            Simulador
          </a>
          <a href="#faq-segmento" className="label-md desktop-only" style={{ color: theme.textPrimary }}>
            Dúvidas
          </a>
          <a
            href="#diagnostico"
            className="desktop-only"
            style={{
              padding: '0.65rem 1.35rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: theme.borderRadius,
              backgroundImage: theme.accentGradient,
              color: theme.buttonTextColor,
            }}
          >
            Solicitar Diagnóstico
          </a>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{ borderColor: theme.cardBorder, color: theme.textPrimary }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ backgroundColor: theme.bgSecondary }}>
        <Link href="/" onClick={() => setMenuOpen(false)}>← Voltar ao Portal Domino</Link>
        <a href="#pilares-solucao" onClick={() => setMenuOpen(false)}>Soluções para o Segmento</a>
        <a href="#simulador-roi" onClick={() => setMenuOpen(false)}>Simulador de Resultados</a>
        <a href="#faq-segmento" onClick={() => setMenuOpen(false)}>Perguntas Frequentes</a>
        <a href="#diagnostico" onClick={() => setMenuOpen(false)} style={{ color: theme.accentPrimary, fontWeight: 700 }}>
          Solicitar Diagnóstico Agora
        </a>
      </nav>

      {/* BLOCK 1: HERO SECTION */}
      <section
        style={{
          minHeight: '95vh',
          padding: '8.5rem 2rem 4.5rem',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: theme.heroGlow,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                backgroundColor: `${theme.accentPrimary}1F`,
                border: `1px solid ${theme.cardBorder}`,
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ color: theme.accentPrimary, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                {hero.preHeadline}
              </span>
            </div>

            <h1
              className="display-lg"
              style={{
                fontSize: 'clamp(2.2rem, 4.1vw, 3.5rem)',
                lineHeight: 1.1,
                color: theme.textPrimary,
                marginBottom: '1.5rem',
              }}
            >
              {hero.headlineMain}{' '}
              <span style={{ color: theme.accentPrimary }}>{hero.headlineHighlight}</span>
            </h1>

            <p className="body-md" style={{ fontSize: '1.14rem', lineHeight: 1.7, color: theme.textSecondary, marginBottom: '2.25rem' }}>
              {hero.subHeadline}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <a
                href="#diagnostico"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: theme.borderRadius,
                  backgroundImage: theme.accentGradient,
                  color: theme.buttonTextColor,
                  boxShadow: `0 8px 28px ${theme.accentPrimary}38`,
                }}
              >
                {hero.primaryCta}
              </a>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '1rem 1.75rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: theme.borderRadius,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{hero.secondaryCta}</span>
                <span>💬</span>
              </a>
            </div>

            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {hero.metrics.map((m, idx) => (
                <div key={idx}>
                  <p style={{ fontSize: '1.45rem', fontWeight: 700, color: theme.accentPrimary, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {m.value}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: theme.textSecondary, opacity: 0.85 }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Visual de Arquitetura Aplicada */}
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: theme.borderRadius,
              padding: '2.25rem',
              border: `1px solid ${theme.cardBorder}`,
              borderTop: `4px solid ${theme.accentPrimary}`,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.35rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: `${theme.accentPrimary}20`,
                  color: theme.accentPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {hero.visualCard.tag}
              </span>
              <span style={{ fontSize: '2.25rem' }}>{config.icon}</span>
            </div>

            <div>
              <h3 className="headline-sm" style={{ fontSize: '1.35rem', color: theme.textPrimary, marginBottom: '0.4rem', lineHeight: 1.3 }}>
                {hero.visualCard.title}
              </h3>
              <p className="body-sm" style={{ color: theme.textSecondary, opacity: 0.85 }}>
                {hero.visualCard.subtitle}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1.25rem', borderRadius: '8px', backgroundColor: theme.bgPrimary }}>
              {hero.visualCard.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', fontSize: '0.9rem', lineHeight: 1.55, color: theme.textSecondary }}>
                  <span style={{ color: theme.accentPrimary, fontWeight: 700 }}>✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={openChat}
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: theme.borderRadius,
                backgroundColor: `${theme.accentPrimary}1F`,
                border: `1px solid ${theme.accentPrimary}`,
                color: theme.accentPrimary,
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Testar Consultor IA deste Segmento Agora</span>
              <span>{config.icon}</span>
            </button>
          </div>
        </div>
      </section>

      {/* BLOCK 2: PAS (PROBLEM & AGITATION) */}
      <section style={{ padding: '5.5rem 2rem', backgroundColor: theme.bgSecondary }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
            <span className="label-sm" style={{ color: theme.accentPrimary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              {pas.sectionTag}
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.8rem)', marginTop: '0.5rem', color: theme.textPrimary }}>
              {pas.headlineMain}{' '}
              <span style={{ color: theme.accentPrimary }}>{pas.headlineHighlight}</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
            {pas.pains.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '2.25rem',
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.cardBg,
                  borderLeft: `4px solid ${theme.painBorderColor}`,
                  borderTop: `1px solid ${theme.cardBorder}`,
                  borderRight: `1px solid ${theme.cardBorder}`,
                  borderBottom: `1px solid ${theme.cardBorder}`,
                }}
              >
                <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                <h3 className="headline-sm" style={{ fontSize: '1.25rem', margin: '0.75rem 0 0.5rem', color: theme.textPrimary }}>
                  {p.title}
                </h3>
                <p className="body-sm" style={{ color: theme.textSecondary, lineHeight: 1.65 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3: OS 3 PILARES DA SOLUÇÃO */}
      <section id="pilares-solucao" style={{ padding: '6rem 2rem', backgroundColor: theme.bgPrimary, scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="label-sm" style={{ color: theme.accentPrimary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              {pillars.sectionTag}
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginTop: '0.5rem', color: theme.textPrimary }}>
              {pillars.headlineMain}{' '}
              <span style={{ color: theme.accentPrimary }}>{pillars.headlineHighlight}</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {pillars.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderTop: `4px solid ${theme.accentPrimary}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.7rem',
                      borderRadius: '4px',
                      backgroundColor: `${theme.accentPrimary}20`,
                      color: theme.accentPrimary,
                    }}
                  >
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                </div>

                <h3 className="headline-sm" style={{ fontSize: '1.35rem', color: theme.textPrimary }}>
                  {item.title}
                </h3>

                <p className="body-sm" style={{ color: theme.textSecondary, lineHeight: 1.65 }}>
                  {item.desc}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    padding: '0.8rem 1rem',
                    borderRadius: '6px',
                    backgroundColor: `${theme.accentPrimary}18`,
                    color: theme.accentPrimary,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  ✓ {item.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 4: SIMULADOR INTERATIVO DE ROI DO SEGMENTO */}
      <section id="simulador-roi" style={{ padding: '6rem 2rem', backgroundColor: theme.bgSecondary, scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label-sm" style={{ color: theme.accentPrimary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              {simulator.sectionTag}
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', marginTop: '0.5rem', color: theme.textPrimary }}>
              {simulator.headlineMain}{' '}
              <span style={{ color: theme.accentPrimary }}>{simulator.headlineHighlight}</span>
            </h2>
            <p className="body-md" style={{ color: theme.textSecondary, maxWidth: '680px', margin: '0.75rem auto 0' }}>
              {simulator.subtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: theme.cardBg,
                padding: '2.25rem',
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <label className="label-md" style={{ fontSize: '0.9rem' }}>{simulator.slider1.label}:</label>
                  <span style={{ color: theme.accentPrimary, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {val1} {simulator.slider1.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={simulator.slider1.min}
                  max={simulator.slider1.max}
                  step={simulator.slider1.step}
                  value={val1}
                  onChange={e => setVal1(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <label className="label-md" style={{ fontSize: '0.9rem' }}>{simulator.slider2.label}:</label>
                  <span style={{ color: theme.accentPrimary, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {simulator.slider2.unit === 'R$' ? `R$ ${val2.toLocaleString('pt-BR')}` : `${val2} ${simulator.slider2.unit}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={simulator.slider2.min}
                  max={simulator.slider2.max}
                  step={simulator.slider2.step}
                  value={val2}
                  onChange={e => setVal2(Number(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <label className="label-md" style={{ fontSize: '0.9rem' }}>{simulator.slider3.label}:</label>
                  <span style={{ color: theme.accentPrimary, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {val3} {simulator.slider3.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={simulator.slider3.min}
                  max={simulator.slider3.max}
                  step={simulator.slider3.step}
                  value={val3}
                  onChange={e => setVal3(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  padding: '2rem',
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.cardBg,
                  borderLeft: `5px solid ${theme.accentPrimary}`,
                  borderTop: `1px solid ${theme.cardBorder}`,
                  borderRight: `1px solid ${theme.cardBorder}`,
                  borderBottom: `1px solid ${theme.cardBorder}`,
                }}
              >
                <p className="label-sm" style={{ textTransform: 'uppercase', color: theme.accentPrimary }}>
                  {simulator.resultLabel}
                </p>
                <p className="display-sm" style={{ fontSize: '2.35rem', color: theme.textPrimary, margin: '0.4rem 0', fontWeight: 700 }}>
                  + R$ {simResults.monthlyTotal.toLocaleString('pt-BR')} <span style={{ fontSize: '1rem', opacity: 0.75 }}>/mês</span>
                </p>
                <p className="body-sm" style={{ color: theme.textSecondary, lineHeight: 1.6 }}>
                  Projeção considerando <strong>+{simResults.extraConversionsMonth} {simulator.metric1Suffix}</strong> e <strong>+{simResults.recoveredItemsMonth} {simulator.metric3Suffix}</strong>.
                </p>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: theme.borderRadius,
                  backgroundColor: `${theme.accentPrimary}18`,
                  border: `1px solid ${theme.cardBorder}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <p className="label-sm" style={{ color: theme.accentPrimary }}>Impacto Projetado em 12 Meses:</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.textPrimary }}>
                    + R$ {simResults.annualTotal.toLocaleString('pt-BR')} / ano
                  </p>
                </div>
                <button
                  onClick={openChat}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: theme.borderRadius,
                    backgroundImage: theme.accentGradient,
                    color: theme.buttonTextColor,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Falar com a IA {config.icon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 5: FORMULÁRIO INTEGRADO AO WEBHOOK N8N + WHATSAPP */}
      <section id="diagnostico" style={{ padding: '6rem 2rem', backgroundColor: theme.bgPrimary, scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="label-sm" style={{ color: theme.accentPrimary, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              {form.sectionTag}
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)', marginTop: '0.5rem', color: theme.textPrimary }}>
              {form.headlineMain}{' '}
              <span style={{ color: theme.accentPrimary }}>{form.headlineHighlight}</span>
            </h2>
            <p className="body-md" style={{ color: theme.textSecondary, maxWidth: '640px', margin: '0.5rem auto 0' }}>
              {form.subtitle}
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                padding: '3.5rem 2rem',
                borderRadius: theme.borderRadius,
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentPrimary}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{config.icon}</div>
              <h3 className="headline-sm" style={{ color: theme.accentPrimary, marginBottom: '0.75rem', fontSize: '1.6rem' }}>
                Diagnóstico Registrado com Sucesso!
              </h3>
              <p className="body-md" style={{ maxWidth: '520px', margin: '0 auto 2rem', color: theme.textSecondary }}>
                Nossa esteira no <strong>n8n</strong> já processou as informações de <strong>{empresa || nome}</strong>. Clique abaixo para iniciar o atendimento prioritário no WhatsApp:
              </p>
              <a
                href={`https://wa.me/5561981171564?text=${encodeURIComponent(
                  `Olá! Acabei de preencher o diagnóstico na vertical ${config.slug} da Domino Automate.\n\n• Nome: ${nome}\n• Organização: ${empresa || 'Não informado'}\n• Perfil: ${subType}\n• Prioridades: ${selectedPains.join(', ')}\n\nGostaria de avançar com a proposta!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2.25rem',
                  borderRadius: theme.borderRadius,
                  backgroundImage: theme.accentGradient,
                  color: theme.buttonTextColor,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                }}
              >
                <span>Continuar no WhatsApp Agora</span>
                <span>💬</span>
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              style={{
                backgroundColor: theme.cardBg,
                padding: '2.75rem',
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.cardBorder}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="b_website_check"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="label-md" style={{ display: 'block', marginBottom: '0.75rem', color: theme.accentPrimary }}>
                  1. Qual é o perfil da sua operação?
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {form.subTypes.map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSubType(item)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '50px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        backgroundColor: subType === item ? theme.accentPrimary : theme.bgPrimary,
                        color: subType === item ? theme.buttonTextColor : theme.textPrimary,
                        border: `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-md" style={{ display: 'block', marginBottom: '0.75rem', color: theme.accentPrimary }}>
                  2. Quais gargalos você deseja eliminar primeiro? (Pode selecionar vários)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {form.painsList.map(pain => {
                    const active = selectedPains.includes(pain);
                    return (
                      <button
                        type="button"
                        key={pain}
                        onClick={() => togglePain(pain)}
                        style={{
                          padding: '0.65rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.83rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          backgroundColor: active ? `${theme.accentPrimary}24` : theme.bgPrimary,
                          color: active ? theme.accentPrimary : theme.textSecondary,
                          border: active ? `1px solid ${theme.accentPrimary}` : '1px solid rgba(255,255,255,0.08)',
                          fontWeight: active ? 700 : 400,
                        }}
                      >
                        {active ? '✓ ' : '+ '} {pain}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <input
                  required
                  type="text"
                  placeholder="Seu Nome Completo"
                  className="input-field"
                  style={{ backgroundColor: theme.bgPrimary }}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
                <input
                  type="text"
                  placeholder={form.orgPlaceholder}
                  className="input-field"
                  style={{ backgroundColor: theme.bgPrimary }}
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                />
                <input
                  required
                  type="tel"
                  placeholder="Seu WhatsApp com DDD"
                  className="input-field"
                  style={{ backgroundColor: theme.bgPrimary }}
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                />
                <input
                  required
                  type="email"
                  placeholder="Seu Melhor E-mail"
                  className="input-field"
                  style={{ backgroundColor: theme.bgPrimary }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <textarea
                  placeholder="Descreva brevemente sua rotina atual ou alguma necessidade específica (opcional)..."
                  className="input-field"
                  style={{ backgroundColor: theme.bgPrimary, minHeight: '95px', resize: 'vertical' }}
                  value={detalhes}
                  onChange={e => setDetalhes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '1.1rem 2rem',
                    borderRadius: theme.borderRadius,
                    backgroundImage: theme.accentGradient,
                    color: theme.buttonTextColor,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Processando na Automação N8N...' : 'Receber Proposta & Diagnóstico no WhatsApp →'}
                </button>
                <p style={{ fontSize: '0.78rem', opacity: 0.65, textAlign: 'center' }}>
                  🔒 Dados protegidos sob sigilo e em estrita conformidade com a LGPD (Lei 13.709/2018).
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* BLOCK 6: FAQ ESPECÍFICO DO SEGMENTO */}
      <section id="faq-segmento" style={{ padding: '5.5rem 2rem', backgroundColor: theme.bgSecondary, scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '3rem', color: theme.textPrimary }}>
            Perguntas Frequentes • <span style={{ color: theme.accentPrimary }}>{config.slug.replace('/', '')}</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: '1.5rem',
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h4 className="label-md" style={{ color: theme.textPrimary, fontSize: '1rem' }}>{f.q}</h4>
                  <span style={{ color: theme.accentPrimary, fontSize: '1.4rem', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <p className="body-sm" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', color: theme.textSecondary, lineHeight: 1.65 }}>
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3.5rem 2rem', backgroundColor: theme.bgPrimary, borderTop: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h4 className="headline-sm" style={{ color: theme.accentPrimary, fontSize: '1.2rem' }}>
              Domino Automate • Vertical {config.slug.replace('/', '')}
            </h4>
            <p style={{ fontSize: '0.82rem', opacity: 0.7, marginTop: '0.25rem', color: theme.textSecondary }}>
              DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA • CNPJ: 66.699.218/0001-94 • Brasília - DF
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: theme.accentPrimary, fontWeight: 600 }}>
              ← Todas as Unidades Domino Automate
            </Link>
            <a href={whatsappDirectUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: theme.textPrimary }}>
              WhatsApp: (61) 98117-1564
            </a>
          </div>
        </div>
      </footer>

      <AIChat niche={config.key} />
    </div>
  );
}
