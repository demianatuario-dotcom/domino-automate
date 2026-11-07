'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SegmentConfig, SectionBlockKey, ThemeMode } from '@/config/segmentsConfig';
import { calculateSegmentROI, ROIScenarioKey } from '@/lib/roiEngine';
import { trackDominoEvent, type LeadDeliveryAnalyticsStatus } from '@/lib/analytics';
import AIChat from '@/components/AIChat';

interface SegmentLandingTemplateProps {
  config: SegmentConfig;
}

export default function SegmentLandingTemplate({ config }: SegmentLandingTemplateProps) {
  const { hero, pas, pillars, technicalProof, simulator, form, faqs } = config;

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'light' || attr === 'dark') {
        return attr;
      }
    }
    return config.defaultThemeMode;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Simulator states
  const [val1, setVal1] = useState(simulator.slider1.defaultValue);
  const [val2, setVal2] = useState(simulator.slider2.defaultValue);
  const [val3, setVal3] = useState(simulator.slider3.defaultValue);
  const [scenario, setScenario] = useState<ROIScenarioKey>('referencia');
  const [customMarginPct, setCustomMarginPct] = useState<number>(simulator.defaultMarginPct);
  const [showMemory, setShowMemory] = useState(false);
  const simulatorStartedRef = useRef(false);

  // Form states
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [subType, setSubType] = useState(form.subTypes[0]);
  const [selectedPains, setSelectedPains] = useState<string[]>(form.painsList.slice(0, 2));
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<LeadDeliveryAnalyticsStatus>('delivered');
  const [formError, setFormError] = useState('');
  const formStartedRef = useRef(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Read ?theme=light|dark for A/B campaigns and fire page_view_vertical event
  useEffect(() => {
    let resolvedTheme = config.defaultThemeMode;
    if (typeof window !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme');
      const params = new URLSearchParams(window.location.search);
      const qTheme = params.get('theme');
      if (qTheme === 'light' || qTheme === 'dark') {
        resolvedTheme = qTheme;
        setThemeMode(qTheme);
      } else if (attr === 'light' || attr === 'dark') {
        resolvedTheme = attr;
        setThemeMode(attr);
      }
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }

    trackDominoEvent('page_view_vertical', {
      vertical: config.slug,
      themeMode: resolvedTheme,
      layoutStrategy: config.layoutStrategy,
    });
  }, [config.defaultThemeMode, config.slug, config.layoutStrategy]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  const activeTheme = themeMode === 'light' ? config.lightTheme : config.theme;
  const effectiveAccent =
    themeMode === 'light'
      ? activeTheme.accentText || activeTheme.accentPrimary
      : activeTheme.accentPrimary;
  const primaryButtonBackground =
    themeMode === 'light'
      ? { backgroundColor: effectiveAccent, backgroundImage: 'none' }
      : { backgroundImage: activeTheme.accentGradient };

  const roiOutput = useMemo(() => {
    return calculateSegmentROI({
      modelType: simulator.economicModelType,
      slider1Value: val1,
      slider2Value: val2,
      slider3Value: val3,
      baseConversionRate1: simulator.conversionRate1,
      baseRecoveryRate3: simulator.recoveryRate3,
      scenario,
      customMarginPct,
      hourlyOperationalValue: simulator.hourlyOperationalValue,
      weeklyHoursSavedBase: simulator.weeklyHoursSavedBase,
      baselineRevenueMultiplier: simulator.baselineRevenueMultiplier,
      estimatedInvestment: simulator.estimatedInvestment,
    });
  }, [val1, val2, val3, scenario, customMarginPct, simulator]);

  const handleSimulatorInteraction = (setter: (v: number) => void, value: number) => {
    if (!simulatorStartedRef.current) {
      simulatorStartedRef.current = true;
      trackDominoEvent('simulator_start', {
        vertical: config.slug,
        scenario,
        themeMode,
      });
    }
    setter(value);
  };

  const togglePain = (pain: string) => {
    setSelectedPains((prev) =>
      prev.includes(pain) ? prev.filter((p) => p !== pain) : [...prev, pain]
    );
  };

  useEffect(() => {
    const handleAutomate = (e: Event) => {
      const customEv = e as CustomEvent<{
        nome?: string;
        email?: string;
        telefone?: string;
        detalhes?: string;
        dores?: string[];
      }>;
      const data = customEv.detail;
      if (data) {
        setNome(data.nome || '');
        setEmail(data.email || '');
        setWhatsapp(data.telefone || '');
        setDetalhes(data.detalhes || '');
        setLgpdConsent(true);
        setSubmitted(true);

        trackDominoEvent('chat_lead_captured', {
          vertical: config.slug,
          themeMode,
        });
      }
    };

    window.addEventListener('automate-budget', handleAutomate);
    return () => window.removeEventListener('automate-budget', handleAutomate);
  }, [config.slug, subType, form.demandLabel, selectedPains, themeMode]);

  const handleFormFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackDominoEvent('form_start', {
        vertical: config.slug,
        themeMode,
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!lgpdConsent) {
      setFormError('Confirme a ciência de privacidade (LGPD) para prosseguir.');
      return;
    }

    setFormError('');
    setLoading(true);
    const cleanPhone = whatsapp.replace(/\D/g, '');

    try {
      const res = await fetch('/api/quote', {
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
          lgpdConsent: true,
          simulador: {
            val1,
            val2,
            val3,
            scenario,
            customMarginPct,
            impactoMensal: roiOutput.impactoEconomicoTotalMensal,
          },
          b_website_check: honeypot,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setFormError(errData.error || 'Não foi possível enviar agora. Tente pelo WhatsApp.');
      } else {
        const resData = (await res.json().catch(() => ({}))) as {
          deduplicated?: boolean;
          deliveryStatus?: string;
        };
        const status = (resData.deliveryStatus || 'delivered') as LeadDeliveryAnalyticsStatus;
        setDeliveryStatus(status);
        setSubmitted(true);
        if (!resData.deduplicated) {
          trackDominoEvent('form_submit', {
            vertical: config.slug,
            scenario,
            themeMode,
            estimatedMonthlyImpact: roiOutput.impactoEconomicoTotalMensal,
            deliveryStatus: status,
          });
        }
      }
    } catch {
      setFormError('Erro de conexão. Tente novamente ou chame no WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const openChat = (section: string) => {
    trackDominoEvent('chat_open', {
      vertical: config.slug,
      section,
      themeMode,
    });
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const whatsappDirectUrl = `https://wa.me/5561981171564?text=${encodeURIComponent(
    `${hero.whatsappGreeting}${empresa ? ` (${empresa})` : ''}`
  )}`;

  const cssVariablesStyle = {
    '--segment-bg': activeTheme.bgPrimary,
    '--segment-bg-secondary': activeTheme.bgSecondary,
    '--segment-surface': activeTheme.cardBg,
    '--segment-border': activeTheme.cardBorder,
    '--segment-accent': effectiveAccent,
    '--segment-accent-text': effectiveAccent,
    '--segment-accent-secondary': activeTheme.accentSecondary,
    '--segment-text': activeTheme.textPrimary,
    '--segment-text-muted': activeTheme.textSecondary,
    '--segment-card-radius': activeTheme.borderRadius,
    '--segment-button-radius': activeTheme.borderRadius,
    minHeight: '100vh',
    backgroundColor: 'var(--segment-bg)',
    color: 'var(--segment-text)',
  } as React.CSSProperties;

  // JSON-LD Structured Data (Service + BreadcrumbList + FAQPage)
  const jsonLdData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: config.metaTitle,
          description: config.metaDescription,
          provider: {
            '@type': 'Organization',
            name: 'Domino Automate',
            url: 'https://domino-automate.com.br',
            taxID: '66.699.218/0001-94',
          },
          areaServed: 'BR',
          url: `https://domino-automate.com.br${config.slug}`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Domino Automate',
              item: 'https://domino-automate.com.br/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: config.headerBadge,
              item: `https://domino-automate.com.br${config.slug}`,
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        },
      ],
    }),
    [config.metaTitle, config.metaDescription, config.slug, config.headerBadge, faqs]
  );

  const renderPASSection = () => (
    <section
      key="pas"
      id="dores-setor"
      style={{ padding: '5.5rem 2rem', backgroundColor: 'var(--segment-bg-secondary)' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            {pas.sectionTag}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            {pas.headlineMain}{' '}
            <span style={{ color: 'var(--segment-accent)' }}>{pas.headlineHighlight}</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {pas.pains.map((p, idx) => (
            <div
              key={idx}
              style={{
                padding: '2rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                borderLeft: `4px solid ${activeTheme.painBorderColor}`,
                borderTop: '1px solid var(--segment-border)',
                borderRight: '1px solid var(--segment-border)',
                borderBottom: '1px solid var(--segment-border)',
              }}
            >
              <span style={{ fontSize: '1.9rem' }} aria-hidden="true">
                {p.icon}
              </span>
              <h3
                className="headline-sm"
                style={{
                  fontSize: '1.22rem',
                  margin: '0.75rem 0 0.5rem',
                  color: 'var(--segment-text)',
                }}
              >
                {p.title}
              </h3>
              <p className="body-sm" style={{ color: 'var(--segment-text-muted)', lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPillarsSection = () => (
    <section
      key="pillars"
      id="pilares-solucao"
      style={{ padding: '5.5rem 2rem', backgroundColor: 'var(--segment-bg)', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            {pillars.sectionTag}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.9rem, 3.4vw, 2.9rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            {pillars.headlineMain}{' '}
            <span style={{ color: 'var(--segment-accent)' }}>{pillars.headlineHighlight}</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {pillars.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '2.25rem 1.85rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                border: '1px solid var(--segment-border)',
                borderTop: '4px solid var(--segment-accent)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.7rem',
                    borderRadius: '4px',
                    backgroundColor: `${activeTheme.accentPrimary}1F`,
                    color: 'var(--segment-accent)',
                  }}
                >
                  {item.badge}
                </span>
                <span style={{ fontSize: '1.9rem' }} aria-hidden="true">
                  {item.icon}
                </span>
              </div>

              <h3 className="headline-sm" style={{ fontSize: '1.3rem', color: 'var(--segment-text)' }}>
                {item.title}
              </h3>

              <p className="body-sm" style={{ color: 'var(--segment-text-muted)', lineHeight: 1.65 }}>
                {item.desc}
              </p>

              <div
                style={{
                  marginTop: 'auto',
                  padding: '0.8rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: `${activeTheme.accentPrimary}18`,
                  color: 'var(--segment-accent)',
                  fontSize: '0.84rem',
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
  );

  const renderTechnicalProofSection = () => (
    <section
      key="technical-proof"
      id="demonstracao-tecnica"
      style={{
        padding: '5.5rem 2rem',
        backgroundColor: 'var(--segment-bg-secondary)',
        scrollMarginTop: '80px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            {technicalProof.sectionTag}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            {technicalProof.headlineMain}{' '}
            <span style={{ color: 'var(--segment-accent)' }}>{technicalProof.headlineHighlight}</span>
          </h2>
          <p
            className="body-sm"
            style={{
              color: 'var(--segment-text-muted)',
              maxWidth: '680px',
              margin: '0.6rem auto 0',
              opacity: 0.85,
            }}
          >
            {technicalProof.disclaimer}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '2.25rem',
            alignItems: 'stretch',
            marginBottom: '2.5rem',
          }}
        >
          {/* Coluna 1: Simulação de Conversa WhatsApp */}
          <div
            style={{
              backgroundColor: 'var(--segment-surface)',
              borderRadius: 'var(--segment-card-radius)',
              border: '1px solid var(--segment-border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1rem 1.35rem',
                backgroundColor: `${activeTheme.accentPrimary}1F`,
                borderBottom: '1px solid var(--segment-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--segment-text)' }}>
                  💬 {technicalProof.whatsappDemo.agentName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--segment-accent)', fontWeight: 600 }}>
                  ● {technicalProof.whatsappDemo.statusText}
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  border: '1px solid var(--segment-border)',
                  color: 'var(--segment-text-muted)',
                }}
              >
                SIMULAÇÃO REALISTA
              </span>
            </div>

            <div
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                flex: 1,
                backgroundColor: 'var(--segment-bg)',
              }}
            >
              {technicalProof.whatsappDemo.messages.map((msg, i) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isAI ? 'flex-start' : 'flex-end',
                      maxWidth: '88%',
                      padding: '0.8rem 1rem',
                      borderRadius: isAI ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                      backgroundColor: isAI ? 'var(--segment-surface)' : `${activeTheme.accentPrimary}24`,
                      border: '1px solid var(--segment-border)',
                    }}
                  >
                    <p
                      className="body-sm"
                      style={{
                        fontSize: '0.86rem',
                        color: 'var(--segment-text)',
                        lineHeight: 1.5,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {msg.text}
                    </p>
                    <span
                      style={{
                        display: 'block',
                        textAlign: 'right',
                        fontSize: '0.68rem',
                        color: 'var(--segment-text-muted)',
                        opacity: 0.75,
                      }}
                    >
                      {isAI ? 'Agente IA • ' : 'Cliente • '}
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: Antes vs. Depois */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                padding: '1.6rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                border: '1px solid var(--segment-border)',
                borderLeft: `4px solid ${activeTheme.painBorderColor}`,
                flex: 1,
              }}
            >
              <p
                className="label-sm"
                style={{
                  color: activeTheme.painBorderColor,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '0.85rem',
                }}
              >
                ✕ ANTES: {technicalProof.beforeAfter.beforeTitle}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {technicalProof.beforeAfter.beforeItems.map((it, idx) => (
                  <li
                    key={idx}
                    className="body-sm"
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      color: 'var(--segment-text-muted)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span style={{ color: activeTheme.painBorderColor, fontWeight: 700 }}>•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: '1.6rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                border: '1px solid var(--segment-border)',
                borderLeft: '4px solid var(--segment-accent)',
                flex: 1,
              }}
            >
              <p
                className="label-sm"
                style={{
                  color: 'var(--segment-accent)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '0.85rem',
                }}
              >
                ✓ DEPOIS: {technicalProof.beforeAfter.afterTitle}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {technicalProof.beforeAfter.afterItems.map((it, idx) => (
                  <li
                    key={idx}
                    className="body-sm"
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      color: 'var(--segment-text)',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ color: 'var(--segment-accent)', fontWeight: 800 }}>✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pipeline Técnico em 4 Etapas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {technicalProof.workflowSteps.map((wf) => (
            <div
              key={wf.step}
              style={{
                padding: '1.35rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                border: '1px solid var(--segment-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--segment-accent)',
                    textTransform: 'uppercase',
                  }}
                >
                  ETAPA {wf.step} • {wf.tech}
                </span>
              </div>
              <h4
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  color: 'var(--segment-text)',
                  marginBottom: '0.35rem',
                }}
              >
                {wf.title}
              </h4>
              <p className="body-sm" style={{ fontSize: '0.83rem', color: 'var(--segment-text-muted)' }}>
                {wf.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderSimulatorSection = () => (
    <section
      key="simulator"
      id="simulador-roi"
      style={{
        padding: '5.5rem 2rem',
        backgroundColor: 'var(--segment-bg)',
        scrollMarginTop: '80px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            {simulator.sectionTag}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.85rem, 3.3vw, 2.75rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            {simulator.headlineMain}{' '}
            <span style={{ color: 'var(--segment-accent)' }}>{simulator.headlineHighlight}</span>
          </h2>
          <p
            className="body-md"
            style={{ color: 'var(--segment-text-muted)', maxWidth: '700px', margin: '0.6rem auto 0' }}
          >
            {simulator.subtitle}
          </p>
        </div>

        {/* Seletor de Cenários: Conservador / Referência / Otimista */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '2.25rem',
          }}
        >
          {(
            [
              { key: 'conservador', label: 'Cenário Conservador (65%)' },
              { key: 'referencia', label: 'Cenário Referência (100%)' },
              { key: 'otimista', label: 'Cenário Otimista (130%)' },
            ] as { key: ROIScenarioKey; label: string }[]
          ).map((sc) => {
            const active = scenario === sc.key;
            return (
              <button
                key={sc.key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setScenario(sc.key);
                  trackDominoEvent('simulator_start', {
                    vertical: config.slug,
                    scenario: sc.key,
                    themeMode,
                  });
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: active ? 'var(--segment-accent)' : 'var(--segment-surface)',
                  color: active ? activeTheme.buttonTextColor : 'var(--segment-text)',
                  border: '1px solid var(--segment-border)',
                  minHeight: '44px',
                }}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.25rem',
            alignItems: 'start',
          }}
        >
          {/* Controles / Premissas Editáveis */}
          <div
            style={{
              backgroundColor: 'var(--segment-surface)',
              padding: '2rem',
              borderRadius: 'var(--segment-card-radius)',
              border: '1px solid var(--segment-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', gap: '0.5rem' }}>
                <label htmlFor="sim-slider-1" className="label-md" style={{ fontSize: '0.88rem', color: 'var(--segment-text)' }}>
                  {simulator.slider1.label}:
                </label>
                <span style={{ color: 'var(--segment-accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {val1} {simulator.slider1.unit}
                </span>
              </div>
              <input
                id="sim-slider-1"
                type="range"
                min={simulator.slider1.min}
                max={simulator.slider1.max}
                step={simulator.slider1.step}
                value={val1}
                onChange={(e) => handleSimulatorInteraction(setVal1, Number(e.target.value))}
                aria-label={simulator.slider1.label}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', gap: '0.5rem' }}>
                <label htmlFor="sim-slider-2" className="label-md" style={{ fontSize: '0.88rem', color: 'var(--segment-text)' }}>
                  {simulator.slider2.label}:
                </label>
                <span style={{ color: 'var(--segment-accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {simulator.slider2.unit === 'R$'
                    ? `R$ ${val2.toLocaleString('pt-BR')}`
                    : `${val2} ${simulator.slider2.unit}`}
                </span>
              </div>
              <input
                id="sim-slider-2"
                type="range"
                min={simulator.slider2.min}
                max={simulator.slider2.max}
                step={simulator.slider2.step}
                value={val2}
                onChange={(e) => handleSimulatorInteraction(setVal2, Number(e.target.value))}
                aria-label={simulator.slider2.label}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', gap: '0.5rem' }}>
                <label htmlFor="sim-slider-3" className="label-md" style={{ fontSize: '0.88rem', color: 'var(--segment-text)' }}>
                  {simulator.slider3.label}:
                </label>
                <span style={{ color: 'var(--segment-accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {val3} {simulator.slider3.unit}
                </span>
              </div>
              <input
                id="sim-slider-3"
                type="range"
                min={simulator.slider3.min}
                max={simulator.slider3.max}
                step={simulator.slider3.step}
                value={val3}
                onChange={(e) => handleSimulatorInteraction(setVal3, Number(e.target.value))}
                aria-label={simulator.slider3.label}
              />
            </div>

            {/* Premissa editável de Margem */}
            <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--segment-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="sim-slider-margin" className="label-sm" style={{ color: 'var(--segment-text-muted)' }}>
                  Premissa: Margem de Contribuição Estimada (%):
                </label>
                <span style={{ color: 'var(--segment-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {customMarginPct}%
                </span>
              </div>
              <input
                id="sim-slider-margin"
                type="range"
                min={20}
                max={90}
                step={5}
                value={customMarginPct}
                onChange={(e) => handleSimulatorInteraction(setCustomMarginPct, Number(e.target.value))}
                aria-label="Margem de Contribuição Estimada"
              />
            </div>
          </div>

          {/* Resultados Econômicos Distintos + Memória de Cálculo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div
              aria-live="polite"
              style={{
                padding: '1.85rem',
                borderRadius: 'var(--segment-card-radius)',
                backgroundColor: 'var(--segment-surface)',
                borderLeft: '5px solid var(--segment-accent)',
                borderTop: '1px solid var(--segment-border)',
                borderRight: '1px solid var(--segment-border)',
                borderBottom: '1px solid var(--segment-border)',
              }}
            >
              <p className="label-sm" style={{ textTransform: 'uppercase', color: 'var(--segment-accent)' }}>
                {simulator.resultLabel} ({scenario.toUpperCase()})
              </p>
              <p
                className="display-sm"
                style={{
                  fontSize: '2.2rem',
                  color: 'var(--segment-text)',
                  margin: '0.35rem 0',
                  fontWeight: 700,
                }}
              >
                + R$ {roiOutput.faturamentoIncrementalMensal.toLocaleString('pt-BR')}{' '}
                <span style={{ fontSize: '0.95rem', opacity: 0.75 }}>/mês (Faturamento Bruto Incremental)</span>
              </p>

              {/* Quadro de Distinção Econômica */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.85rem',
                  marginTop: '1rem',
                  padding: '0.95rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--segment-bg)',
                  border: '1px solid var(--segment-border)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--segment-text-muted)', display: 'block' }}>
                    Margem de Contribuição ({roiOutput.marginPct}%)
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--segment-accent)' }}>
                    + R$ {roiOutput.lucroIncrementalMensal.toLocaleString('pt-BR')}/mês
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--segment-text-muted)', display: 'block' }}>
                    Economia Operacional
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--segment-text)' }}>
                    R$ {roiOutput.economiaOperacionalMensal.toLocaleString('pt-BR')}/mês ({roiOutput.horasPoupadasMes}h)
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--segment-text-muted)', display: 'block' }}>
                    Projeção 12 Meses
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--segment-text)' }}>
                    + R$ {roiOutput.impactoEconomicoTotalAnual.toLocaleString('pt-BR')}/ano
                  </strong>
                </div>
              </div>

              <p className="body-sm" style={{ color: 'var(--segment-text-muted)', lineHeight: 1.55, marginTop: '0.9rem' }}>
                Estimativa baseada em <strong>+{roiOutput.extraConversionsMonth} {simulator.metric1Suffix}</strong> e{' '}
                <strong>+{roiOutput.recoveredItemsMonth} {simulator.metric3Suffix}</strong>.
              </p>

              {/* Accordion de Memória de Cálculo */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowMemory(!showMemory)}
                  aria-expanded={showMemory}
                  aria-controls="sim-memory-panel"
                  style={{
                    background: 'transparent',
                    color: 'var(--segment-accent)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {showMemory ? '▲ Ocultar Memória de Cálculo' : '▼ Ver Memória de Cálculo e Premissas'}
                </button>

                {showMemory && (
                  <div
                    id="sim-memory-panel"
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.9rem 1rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--segment-bg)',
                      border: '1px solid var(--segment-border)',
                      fontSize: '0.78rem',
                      color: 'var(--segment-text-muted)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    {roiOutput.memoriaDeCalculo.map((line, i) => (
                      <p key={i}>• {line}</p>
                    ))}
                    <p style={{ opacity: 0.75, marginTop: '0.25rem', fontStyle: 'italic' }}>
                      *Nota técnica: Simulação matemática referencial baseada nas premissas selecionadas acima pelo visitante; não constitui garantia de faturamento.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <a
              href="#diagnostico"
              onClick={() =>
                trackDominoEvent('simulator_complete', {
                  vertical: config.slug,
                  scenario,
                  themeMode,
                  estimatedMonthlyImpact: roiOutput.impactoEconomicoTotalMensal,
                })
              }
              style={{
                padding: '1rem 1.5rem',
                borderRadius: 'var(--segment-button-radius)',
                ...primaryButtonBackground,
                color: activeTheme.buttonTextColor,
                fontWeight: 700,
                textAlign: 'center',
                display: 'block',
                fontSize: '0.98rem',
              }}
            >
              Validar Este Cenário no Meu Negócio →
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFormSection = () => (
    <section
      key="form"
      id="diagnostico"
      style={{
        padding: '5.5rem 2rem',
        backgroundColor: 'var(--segment-bg-secondary)',
        scrollMarginTop: '80px',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            {form.sectionTag}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.85rem, 3.3vw, 2.7rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            {form.headlineMain}{' '}
            <span style={{ color: 'var(--segment-accent)' }}>{form.headlineHighlight}</span>
          </h2>
          <p
            className="body-md"
            style={{ color: 'var(--segment-text-muted)', maxWidth: '620px', margin: '0.5rem auto 0' }}
          >
            {form.subtitle}
          </p>
        </div>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: '3.25rem 2rem',
              borderRadius: 'var(--segment-card-radius)',
              backgroundColor: 'var(--segment-surface)',
              border: '2px solid var(--segment-accent)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.75rem', marginBottom: '0.85rem' }} aria-hidden="true">{config.icon}</div>
            <h3
              className="headline-sm"
              style={{ color: 'var(--segment-accent)', marginBottom: '0.75rem', fontSize: '1.55rem' }}
            >
              Diagnóstico Registrado com Sucesso!
            </h3>
            <p
              className="body-md"
              style={{ maxWidth: '520px', margin: '0 auto 1.85rem', color: 'var(--segment-text-muted)' }}
            >
              {deliveryStatus === 'queued_outbox' ? (
                <>
                  As informações de <strong>{empresa || nome}</strong> foram gravadas com segurança na fila transacional da Domino Automate. Caso deseje atendimento imediato, clique abaixo para abrir o WhatsApp:
                </>
              ) : (
                <>
                  Nossa esteira no <strong>n8n</strong> já recebeu as informações de{' '}
                  <strong>{empresa || nome}</strong>. Caso deseje atendimento imediato, clique abaixo para abrir o WhatsApp:
                </>
              )}
            </p>
            <a
              href={`https://wa.me/5561981171564?text=${encodeURIComponent(
                `Olá! Acabei de preencher o diagnóstico na vertical ${config.slug} da Domino Automate.\n\n• Nome: ${nome}\n• Organização: ${empresa || 'Não informado'}\n• Perfil: ${subType}\n• Prioridades: ${selectedPains.join(', ')}\n\nGostaria de avançar com a proposta!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackDominoEvent('whatsapp_click', {
                  vertical: config.slug,
                  section: 'post_form_success',
                  themeMode,
                })
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                borderRadius: 'var(--segment-button-radius)',
                ...primaryButtonBackground,
                color: activeTheme.buttonTextColor,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <span>Adiantar Conversa no WhatsApp</span>
              <span aria-hidden="true">💬</span>
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleFormSubmit}
            onFocus={handleFormFocus}
            aria-busy={loading}
            style={{
              backgroundColor: 'var(--segment-surface)',
              padding: '2.25rem',
              borderRadius: 'var(--segment-card-radius)',
              border: '1px solid var(--segment-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.65rem',
            }}
          >
            <input
              type="text"
              name="b_website_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div>
              <span
                className="label-md"
                style={{ display: 'block', marginBottom: '0.65rem', color: 'var(--segment-accent)' }}
              >
                1. Qual é o perfil da sua operação?
              </span>
              <div role="group" aria-label="Perfil da operação" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {form.subTypes.map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-pressed={subType === item}
                    onClick={() => setSubType(item)}
                    style={{
                      padding: '0.55rem 0.95rem',
                      borderRadius: '50px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      minHeight: '44px',
                      backgroundColor: subType === item ? 'var(--segment-accent)' : 'var(--segment-bg)',
                      color: subType === item ? activeTheme.buttonTextColor : 'var(--segment-text)',
                      border: '1px solid var(--segment-border)',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span
                className="label-md"
                style={{ display: 'block', marginBottom: '0.65rem', color: 'var(--segment-accent)' }}
              >
                2. Quais gargalos deseja resolver primeiro?
              </span>
              <div role="group" aria-label="Gargalos prioritários" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {form.painsList.map((pain) => {
                  const active = selectedPains.includes(pain);
                  return (
                    <button
                      type="button"
                      key={pain}
                      aria-pressed={active}
                      onClick={() => togglePain(pain)}
                      style={{
                        padding: '0.6rem 0.95rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        minHeight: '44px',
                        backgroundColor: active ? `${activeTheme.accentPrimary}22` : 'var(--segment-bg)',
                        color: active ? 'var(--segment-accent)' : 'var(--segment-text-muted)',
                        border: active
                          ? '1px solid var(--segment-accent)'
                          : '1px solid var(--segment-border)',
                        fontWeight: active ? 700 : 400,
                      }}
                    >
                      {active ? '✓ ' : '+ '} {pain}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label htmlFor="segment-input-nome" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--segment-text-muted)' }}>
                  Seu Nome *
                </label>
                <input
                  id="segment-input-nome"
                  required
                  type="text"
                  placeholder="Ex: Ana Carolina"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--segment-bg)',
                    color: 'var(--segment-text)',
                    border: '1px solid var(--segment-border)',
                    minHeight: '46px',
                  }}
                />
              </div>

              <div>
                <label htmlFor="segment-input-org" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--segment-text-muted)' }}>
                  {form.orgLabel}
                </label>
                <input
                  id="segment-input-org"
                  type="text"
                  placeholder={form.orgPlaceholder}
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--segment-bg)',
                    color: 'var(--segment-text)',
                    border: '1px solid var(--segment-border)',
                    minHeight: '46px',
                  }}
                />
              </div>

              <div>
                <label htmlFor="segment-input-whatsapp" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--segment-text-muted)' }}>
                  WhatsApp com DDD *
                </label>
                <input
                  id="segment-input-whatsapp"
                  required
                  type="tel"
                  placeholder="(61) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--segment-bg)',
                    color: 'var(--segment-text)',
                    border: '1px solid var(--segment-border)',
                    minHeight: '46px',
                  }}
                />
              </div>

              <div>
                <label htmlFor="segment-input-email" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--segment-text-muted)' }}>
                  E-mail Corporativo (Opcional)
                </label>
                <input
                  id="segment-input-email"
                  type="email"
                  placeholder="contato@suaempresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--segment-bg)',
                    color: 'var(--segment-text)',
                    border: '1px solid var(--segment-border)',
                    minHeight: '46px',
                  }}
                />
              </div>
            </div>

            <label
              htmlFor="segment-input-lgpd"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: 'var(--segment-text-muted)',
                cursor: 'pointer',
              }}
            >
              <input
                id="segment-input-lgpd"
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                style={{ marginTop: '0.2rem', accentColor: activeTheme.accentPrimary }}
              />
              <span>
                Concordo com o tratamento dos meus dados de contato exclusivamente para elaboração de diagnóstico comercial pela Domino Automate, em conformidade com a LGPD (Lei nº 13.709/2018).
              </span>
            </label>

            {formError && (
              <p role="alert" aria-live="assertive" style={{ color: activeTheme.painBorderColor, fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.05rem',
                borderRadius: 'var(--segment-button-radius)',
                ...primaryButtonBackground,
                color: activeTheme.buttonTextColor,
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'wait' : 'pointer',
                minHeight: '50px',
              }}
            >
              {loading ? 'Registrando Diagnóstico...' : 'Receber Diagnóstico Personalizado →'}
            </button>
          </form>
        )}
      </div>
    </section>
  );

  const renderFAQSection = () => (
    <section
      key="faq"
      id="faq-segmento"
      style={{ padding: '5.5rem 2rem', backgroundColor: 'var(--segment-bg)', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            className="label-sm"
            style={{
              color: 'var(--segment-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            Dúvidas Frequentes • {config.slug}
          </span>
          <h2
            className="display-lg"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              marginTop: '0.5rem',
              color: 'var(--segment-text)',
            }}
          >
            Perguntas Frequentes sobre <span style={{ color: 'var(--segment-accent)' }}>Nossa Arquitetura</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--segment-card-radius)',
                  backgroundColor: 'var(--segment-surface)',
                  border: '1px solid var(--segment-border)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  id={`segment-faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`segment-faq-panel-${idx}`}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'transparent',
                    color: 'var(--segment-text)',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: 'var(--segment-accent)', fontSize: '1.25rem' }} aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`segment-faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`segment-faq-btn-${idx}`}
                    style={{
                      padding: '0 1.5rem 1.35rem',
                      color: 'var(--segment-text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const sectionRenderers: Record<SectionBlockKey, () => React.ReactNode> = {
    pas: renderPASSection,
    pillars: renderPillarsSection,
    'technical-proof': renderTechnicalProofSection,
    simulator: renderSimulatorSection,
    form: renderFormSection,
    faq: renderFAQSection,
  };

  return (
    <div style={cssVariablesStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Header Adaptado ao Segmento com Toggle Dark/Light */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: `${activeTheme.bgPrimary}EB`,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--segment-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Image
              src="/logo.png"
              alt="Domino Automate Logo"
              width={136}
              height={44}
              className="mobile-logo-img"
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
          <span
            className="desktop-only"
            style={{
              fontSize: '0.7rem',
              padding: '0.28rem 0.7rem',
              borderRadius: '4px',
              backgroundColor: `${activeTheme.accentPrimary}1F`,
              color: 'var(--segment-accent)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {config.headerBadge}
          </span>
        </div>

        <nav className="header-nav" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/" className="label-sm desktop-only" style={{ opacity: 0.85, color: 'var(--segment-text)' }}>
            ← Portal Domino
          </Link>
          <a href="#demonstracao-tecnica" className="label-md desktop-only" style={{ color: 'var(--segment-text)' }}>
            Demonstração
          </a>
          <a href="#simulador-roi" className="label-md desktop-only" style={{ color: 'var(--segment-text)' }}>
            Simulador ROI
          </a>
          <a href="#faq-segmento" className="label-md desktop-only" style={{ color: 'var(--segment-text)' }}>
            Dúvidas
          </a>

          {/* Alternador de Tema (Light / Dark Experimentation) */}
          <button
            type="button"
            onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            title="Alternar tema Claro / Escuro"
            aria-label="Alternar tema Claro ou Escuro"
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'var(--segment-surface)',
              border: '1px solid var(--segment-border)',
              color: 'var(--segment-text)',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            {themeMode === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>

          <a
            href="#diagnostico"
            className="desktop-only"
            onClick={() =>
              trackDominoEvent('cta_primary_click', {
                vertical: config.slug,
                section: 'header',
                themeMode,
              })
            }
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              borderRadius: 'var(--segment-button-radius)',
              ...primaryButtonBackground,
              color: activeTheme.buttonTextColor,
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Solicitar Diagnóstico
          </a>
          <button
            ref={hamburgerRef}
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="segment-mobile-menu"
            style={{ borderColor: activeTheme.cardBorder, color: activeTheme.textPrimary, minWidth: '44px', minHeight: '44px' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav id="segment-mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ backgroundColor: activeTheme.bgSecondary }}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          ← Voltar ao Portal Domino
        </Link>
        <a href="#demonstracao-tecnica" onClick={() => setMenuOpen(false)}>
          Demonstração no WhatsApp
        </a>
        <a href="#pilares-solucao" onClick={() => setMenuOpen(false)}>
          Soluções para o Segmento
        </a>
        <a href="#simulador-roi" onClick={() => setMenuOpen(false)}>
          Simulador de Resultados
        </a>
        <a href="#faq-segmento" onClick={() => setMenuOpen(false)}>
          Perguntas Frequentes
        </a>
        <a
          href="#diagnostico"
          onClick={() => setMenuOpen(false)}
          style={{ color: 'var(--segment-accent)', fontWeight: 700 }}
        >
          Solicitar Diagnóstico Agora
        </a>
      </nav>

      {/* HERO SECTION (Hierarquia de Conversão: 1. CTA Contextual, 2. WhatsApp Secundário) */}
      <section
        style={{
          minHeight: '88vh',
          padding: '8rem 2rem 4rem',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: activeTheme.heroGlow,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
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
                padding: '0.38rem 0.95rem',
                borderRadius: '50px',
                backgroundColor: `${activeTheme.accentPrimary}1F`,
                border: '1px solid var(--segment-border)',
                marginBottom: '1.35rem',
              }}
            >
              <span style={{ color: 'var(--segment-accent)', fontSize: '0.8rem', fontWeight: 700 }}>
                {hero.preHeadline}
              </span>
            </div>

            <h1
              className="display-lg"
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.4rem)',
                lineHeight: 1.1,
                color: 'var(--segment-text)',
                marginBottom: '1.35rem',
              }}
            >
              {hero.headlineMain}{' '}
              <span style={{ color: 'var(--segment-accent)' }}>{hero.headlineHighlight}</span>
            </h1>

            <p
              className="body-md"
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.68,
                color: 'var(--segment-text-muted)',
                marginBottom: '2rem',
              }}
            >
              {hero.subHeadline}
            </p>

            {/* Hierarquia Clara de CTAs: Primário Destacado + Secundário Menos Destacado */}
            <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <a
                href={config.layoutStrategy === 'roi-first' ? '#simulador-roi' : '#diagnostico'}
                onClick={() =>
                  trackDominoEvent('cta_primary_click', {
                    vertical: config.slug,
                    section: 'hero_primary',
                    themeMode,
                    layoutStrategy: config.layoutStrategy,
                  })
                }
                style={{
                  padding: '0.95rem 1.85rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  borderRadius: 'var(--segment-button-radius)',
                  ...primaryButtonBackground,
                  color: activeTheme.buttonTextColor,
                  boxShadow: `0 6px 22px ${activeTheme.accentPrimary}33`,
                  minHeight: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {hero.primaryCta}
              </a>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackDominoEvent('whatsapp_click', {
                    vertical: config.slug,
                    section: 'hero_secondary',
                    themeMode,
                  })
                }
                style={{
                  padding: '0.95rem 1.5rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  borderRadius: 'var(--segment-button-radius)',
                  backgroundColor: 'var(--segment-surface)',
                  border: '1px solid var(--segment-border)',
                  color: 'var(--segment-text)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  minHeight: '48px',
                }}
              >
                <span>{hero.secondaryCta}</span>
                <span>💬</span>
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                paddingTop: '1.15rem',
                borderTop: '1px solid var(--segment-border)',
              }}
            >
              {hero.metrics.map((m, idx) => (
                <div key={idx}>
                  <p
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--segment-accent)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    {m.value}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--segment-text-muted)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Visual de Arquitetura Aplicada */}
          <div
            style={{
              backgroundColor: 'var(--segment-surface)',
              borderRadius: 'var(--segment-card-radius)',
              padding: '2rem',
              border: '1px solid var(--segment-border)',
              borderTop: '4px solid var(--segment-accent)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.32rem 0.7rem',
                  borderRadius: '4px',
                  backgroundColor: `${activeTheme.accentPrimary}20`,
                  color: 'var(--segment-accent)',
                  textTransform: 'uppercase',
                }}
              >
                {hero.visualCard.tag}
              </span>
              <span style={{ fontSize: '2rem' }} aria-hidden="true">
                {config.icon}
              </span>
            </div>

            <div>
              <h2
                className="headline-sm"
                style={{ fontSize: '1.3rem', color: 'var(--segment-text)', marginBottom: '0.35rem' }}
              >
                {hero.visualCard.title}
              </h2>
              <p className="body-sm" style={{ color: 'var(--segment-text-muted)' }}>
                {hero.visualCard.subtitle}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                padding: '1.15rem',
                borderRadius: '8px',
                backgroundColor: 'var(--segment-bg)',
                border: '1px solid var(--segment-border)',
              }}
            >
              {hero.visualCard.bullets.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    color: 'var(--segment-text-muted)',
                  }}
                >
                  <span style={{ color: 'var(--segment-accent)', fontWeight: 700 }}>✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openChat('hero_visual_card')}
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--segment-button-radius)',
                backgroundColor: `${activeTheme.accentPrimary}18`,
                border: '1px solid var(--segment-accent)',
                color: 'var(--segment-accent)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                minHeight: '46px',
              }}
            >
              Tirar Dúvidas com o Consultor IA {config.icon}
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÕES ORDENADAS DINAMICAMENTE CONFORME A ESTRATÉGIA DA VERTICAL */}
      {config.sectionOrder.map((blockKey) => sectionRenderers[blockKey]())}

      {/* Footer da Vertical */}
      <footer
        style={{
          padding: '3rem 2rem 5.5rem',
          backgroundColor: 'var(--segment-bg-secondary)',
          borderTop: '1px solid var(--segment-border)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, color: 'var(--segment-accent)', fontSize: '1.05rem' }}>
              Domino Automate • {config.headerBadge}
            </p>
            <p className="body-sm" style={{ color: 'var(--segment-text-muted)', fontSize: '0.82rem' }}>
              DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA • CNPJ: 66.699.218/0001-94 • Brasília - DF
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/" className="label-sm" style={{ color: 'var(--segment-accent)' }}>
              ← Portal Raiz Domino Automate
            </Link>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label-sm"
              style={{ color: 'var(--segment-text)' }}
            >
              WhatsApp: (61) 98117-1564 ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Canal 3: Chat IA Assistido */}
      <AIChat niche={config.key} />
    </div>
  );
}
