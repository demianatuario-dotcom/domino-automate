'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AIChat from '@/components/AIChat';
import { trackDominoEvent, type LeadDeliveryAnalyticsStatus } from '@/lib/analytics';
import type { ROIScenarioKey } from '@/lib/roiEngine';

const BOOK_LANA_IMAGES = [
  { src: '/Book_Lana/Site1.png', label: 'Hero & Posicionamento de Alto Padrão' },
  { src: '/Book_Lana/Site2.png', label: 'Vitrine de Procedimentos & Autoridade' },
  { src: '/Book_Lana/Site3.png', label: 'Experiência Visual & Prova Social' },
  { src: '/Book_Lana/Site4.png', label: 'Jornada de Agendamento Mobile-First' },
  { src: '/Book_Lana/Site5.png', label: 'Conversão & Integração WhatsApp' },
  { src: '/Book_Lana/Fluxo N8N.png', label: 'Arquitetura N8N de Atendimento & Triagem' },
  { src: '/Book_Lana/Fluxos N8N.png', label: 'Orquestração Completa N8N + IA + Agenda' },
];

const SEGMENTOS_ESTUDIO = [
  'Estúdio de Cílios & Sobrancelhas (Lash / Brow)',
  'Clínica de Estética Facial & Corporal',
  'Salão de Beleza & Hair Studio Premium',
  'Micropigmentação & Harmonização',
  'Spa, Unhas & Espaço de Bem-Estar',
];

const DORES_ESTUDIO = [
  'Demora para responder clientes no WhatsApp / Direct',
  'Clientes que faltam ou desmarcam em cima da hora (No-Show)',
  'Perda de mensagens à noite e nos finais de semana',
  'Falta de retorno automático para manutenção (30/45 dias)',
  'Site ou link na bio amador que não passa alto valor',
  'Profissional interrompendo atendimento em maca para responder celular',
];

const ESTUDIOS_SCENARIOS: Record<ROIScenarioKey, { label: string; whatsappConvRatio: number; noShowRecupRatio: number }> = {
  conservador: { label: 'Conservador', whatsappConvRatio: 0.04, noShowRecupRatio: 0.45 },
  referencia: { label: 'Referência', whatsappConvRatio: 0.063, noShowRecupRatio: 0.65 },
  otimista: { label: 'Otimista', whatsappConvRatio: 0.09, noShowRecupRatio: 0.80 },
};

interface AutomateBudgetDetail {
  nome?: string;
  email?: string;
  telefone?: string;
  detalhes?: string;
  dores?: string[];
}

export default function EstudiosLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Simulator state for Beauty Studios
  const [mensagensDia, setMensagensDia] = useState(18);
  const [ticketMedio, setTicketMedio] = useState(220);
  const [faltasSemana, setFaltasSemana] = useState(4);
  const [margemLiquidaPct, setMargemLiquidaPct] = useState(65);
  const [scenario, setScenario] = useState<ROIScenarioKey>('referencia');
  const [showMemory, setShowMemory] = useState(false);
  const [simStarted, setSimStarted] = useState(false);

  // Lightbox state for Book Lana
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  // Lead Form state (N8N + WhatsApp)
  const [nome, setNome] = useState('');
  const [nomeEstudio, setNomeEstudio] = useState('');
  const [segmento, setSegmento] = useState(SEGMENTOS_ESTUDIO[0]);
  const [selectedDores, setSelectedDores] = useState<string[]>([
    'Demora para responder clientes no WhatsApp / Direct',
    'Clientes que faltam ou desmarcam em cima da hora (No-Show)',
  ]);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<LeadDeliveryAnalyticsStatus>('delivered');
  const [formError, setFormError] = useState('');
  const [formStarted, setFormStarted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    trackDominoEvent('page_view_vertical', { vertical: '/Estudios' });
  }, []);

  useEffect(() => {
    if (!menuOpen && !lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, lightboxOpen]);

  const notifySimStart = () => {
    if (!simStarted) {
      setSimStarted(true);
      trackDominoEvent('simulator_start', { vertical: '/Estudios', section: 'roi_simulator' });
    }
  };

  const notifyFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackDominoEvent('form_start', { vertical: '/Estudios', section: 'lead_form' });
    }
  };

  const simResults = useMemo(() => {
    const cfg = ESTUDIOS_SCENARIOS[scenario];
    const contatosMes = mensagensDia * 26;
    const novosAgendamentosMes = Math.round(contatosMes * cfg.whatsappConvRatio);
    const receitaRecuperadaWhatsApp = novosAgendamentosMes * ticketMedio;

    const faltasMes = faltasSemana * 4;
    const faltasEvitadasMes = Math.round(faltasMes * cfg.noShowRecupRatio);
    const receitaRecuperadaNoShow = faltasEvitadasMes * ticketMedio;

    const ganhoBrutoMensal = receitaRecuperadaWhatsApp + receitaRecuperadaNoShow;
    const lucroLiquidoMensal = Math.round(ganhoBrutoMensal * (margemLiquidaPct / 100));
    const ganhoAnual = ganhoBrutoMensal * 12;

    const memoriaDeCalculo = [
      `Cenário ${cfg.label}: taxa de recuperação de contatos no WhatsApp de ${(cfg.whatsappConvRatio * 100).toFixed(1)}% e contenção de No-Show de ${Math.round(cfg.noShowRecupRatio * 100)}%.`,
      `Demanda mensal: ${mensagensDia} contatos/dia × 26 dias = ${contatosMes} contatos/mês → +${novosAgendamentosMes} agendamentos extras × R$ ${ticketMedio} = R$ ${receitaRecuperadaWhatsApp.toLocaleString('pt-BR')}/mês.`,
      `Redução de faltas: ${faltasSemana} faltas/semana × 4 = ${faltasMes} faltas/mês → ${faltasEvitadasMes} horários preservados × R$ ${ticketMedio} = R$ ${receitaRecuperadaNoShow.toLocaleString('pt-BR')}/mês.`,
      `Faturamento Incremental Bruto: R$ ${ganhoBrutoMensal.toLocaleString('pt-BR')}/mês | Margem de Contribuição Incremental (${margemLiquidaPct}%): R$ ${lucroLiquidoMensal.toLocaleString('pt-BR')}/mês.`,
    ];

    return {
      cfg,
      novosAgendamentosMes,
      faltasEvitadasMes,
      ganhoBrutoMensal,
      lucroLiquidoMensal,
      ganhoAnual,
      memoriaDeCalculo,
    };
  }, [mensagensDia, ticketMedio, faltasSemana, margemLiquidaPct, scenario]);

  const toggleDor = (dor: string) => {
    notifyFormStart();
    setSelectedDores((prev) =>
      prev.includes(dor) ? prev.filter((item) => item !== dor) : [...prev, dor]
    );
  };

  useEffect(() => {
    const handleAutomate = (e: Event) => {
      const customEvent = e as CustomEvent<AutomateBudgetDetail>;
      const data = customEvent.detail;
      if (data) {
        setNome(data.nome || '');
        setEmail(data.email || '');
        setWhatsapp(data.telefone || '');
        setDetalhes(data.detalhes || '');
        setLgpdConsent(true);
        setSubmitted(true);
        trackDominoEvent('chat_lead_captured', { vertical: '/Estudios', section: 'ai_chat' });
      }
    };

    window.addEventListener('automate-budget', handleAutomate);
    return () => window.removeEventListener('automate-budget', handleAutomate);
  }, [segmento, selectedDores]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!lgpdConsent) {
      setFormError('Confirme o consentimento LGPD para prosseguir.');
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
          vertical: '/Estudios',
          origem: '/Estudios',
          nome: nome.trim(),
          empresa: nomeEstudio.trim(),
          email: email.trim(),
          telefone: cleanPhone,
          tipo_organizacao: segmento,
          demanda: 'Ecossistema IA + N8N + Landing Page para Estúdio',
          dores: selectedDores.join(', '),
          doresArray: selectedDores,
          descricao: detalhes.trim(),
          b_website_check: honeypot,
          lgpdConsent: true,
          simulador: {
            val1: mensagensDia,
            val2: ticketMedio,
            val3: faltasSemana,
            scenario,
            customMarginPct: margemLiquidaPct,
            impactoMensal: simResults.lucroLiquidoMensal,
          },
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
            vertical: '/Estudios',
            section: 'lead_form',
            scenario,
            estimatedMonthlyImpact: simResults.lucroLiquidoMensal,
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

  const openChat = () => {
    trackDominoEvent('chat_open', { vertical: '/Estudios', section: 'roi_simulator' });
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const whatsappDirectUrl = `https://wa.me/5561981171564?text=${encodeURIComponent(
    `Olá! Vim pela página /Estudios da Domino Automate. Gostaria de saber como funciona a Recepcionista de IA 24/7 e a Automação Anti No-Show para o meu estúdio${nomeEstudio ? ` (${nomeEstudio})` : ''}!`
  )}`;

  const faqs = [
    {
      q: 'A Inteligência Artificial parece um robô engessado com as minhas clientes?',
      a: 'De forma alguma. Diferente daqueles chatbots antigos de "digite 1 para agendar", nossa IA conversa com linguagem natural, acolhedora e personalizada com o tom de voz do seu estúdio. Ela tira dúvidas de procedimentos, explica cuidados, contorna objeções de valor e conduz a cliente até o agendamento.',
    },
    {
      q: 'Como funciona a redução de faltas e desmarcações (No-Show)?',
      a: 'Nosso motor em n8n monitora sua agenda e envia lembretes estratégicos via WhatsApp 24h e 3h antes do procedimento, solicitando confirmação. Caso a cliente precise reagendar com antecedência, o sistema já aciona a fila de espera para não deixar sua maca ou cadeira vazia.',
    },
    {
      q: 'E para clientes que precisam voltar para manutenção (cílios, sobrancelhas, botox, corte)?',
      a: 'A automação identifica automaticamente há quantos dias a cliente realizou o procedimento e dispara uma mensagem carinhosa e personalizada no WhatsApp convidando-a para agendar o retorno antes que ela procure a concorrência.',
    },
    {
      q: 'Preciso entender de tecnologia ou programação para usar?',
      a: 'Zero! A Domino Automate entrega tudo 100% configurado, testado e rodando (Landing Page + Fluxos n8n + Assistente IA no WhatsApp). Você continua cuidando das suas clientes enquanto o sistema trabalha nos bastidores.',
    },
  ];

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Automação de WhatsApp, IA e Landing Pages para Estúdios de Beleza',
          description:
            'Recepcionista de IA 24/7 no WhatsApp, blindagem anti no-show via n8n e Landing Pages de alto padrão para estúdios de beleza e estética.',
          provider: {
            '@type': 'Organization',
            name: 'Domino Automate',
            url: 'https://domino-automate.com.br',
          },
          areaServed: 'BR',
          url: 'https://domino-automate.com.br/Estudios',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Domino Automate',
              item: 'https://domino-automate.com.br',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Estúdios de Beleza & Estética',
              item: 'https://domino-automate.com.br/Estudios',
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
    []
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#110D10',
        color: '#FAF6F0',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Luxury Beauty */}
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
          backgroundColor: 'rgba(17, 13, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
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
              padding: '0.3rem 0.7rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              color: '#E5C07B',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ✨ Vertical Estúdios & Estética
          </span>
        </div>

        <nav className="header-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" className="label-sm desktop-only" style={{ opacity: 0.75, color: '#FAF6F0' }}>
            ← Portal Domino
          </Link>
          <a href="#case-lana" className="label-md desktop-only" style={{ color: '#FAF6F0' }}>Case Real</a>
          <a href="#solucao-estudios" className="label-md desktop-only" style={{ color: '#FAF6F0' }}>Soluções</a>
          <a href="#calculadora-agenda" className="label-md desktop-only" style={{ color: '#FAF6F0' }}>Simulador de Agenda</a>
          <a
            href="#diagnostico-estudio"
            onClick={() => trackDominoEvent('cta_primary_click', { vertical: '/Estudios', section: 'header' })}
            style={{
              padding: '0.65rem 1.35rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '4px',
              backgroundImage: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
              color: '#110D10',
            }}
            className="desktop-only"
          >
            Quero Lotar Minha Agenda
          </a>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="estudios-mobile-menu"
            style={{ borderColor: 'rgba(212, 175, 55, 0.3)', color: '#FAF6F0', minWidth: '44px', minHeight: '44px' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav id="estudios-mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ backgroundColor: '#1A1318' }}>
        <Link href="/" onClick={() => setMenuOpen(false)}>← Voltar ao Portal Domino</Link>
        <a href="#case-lana" onClick={() => setMenuOpen(false)}>Vitrine Case Real</a>
        <a href="#solucao-estudios" onClick={() => setMenuOpen(false)}>Como Funciona</a>
        <a href="#calculadora-agenda" onClick={() => setMenuOpen(false)}>Simulador de Faturamento</a>
        <a href="#diagnostico-estudio" onClick={() => setMenuOpen(false)} style={{ color: '#E5C07B', fontWeight: 700 }}>
          Solicitar Orçamento no WhatsApp
        </a>
      </nav>

      {/* BLOCK 1: HERO SECTION (Portfolio-First Strategy) */}
      <section
        style={{
          minHeight: '92vh',
          padding: '7.5rem 1.25rem 3.5rem',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.14) 0%, rgba(17, 13, 16, 1) 65%)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ color: '#E5C07B', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ✨ Para Estúdios de Beleza, Clínicas de Estética & Lash Designers
              </span>
            </div>

            <h1
              className="display-lg"
              style={{
                fontSize: 'clamp(2.1rem, 4.2vw, 3.6rem)',
                lineHeight: 1.1,
                color: '#FAF6F0',
                marginBottom: '1.25rem',
              }}
            >
              Sua Agenda Cheia 24/7 no WhatsApp{' '}
              <span style={{ color: '#E5C07B' }}>Enquanto Você Atende em Maca.</span>
            </h1>

            <p className="body-md" style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#DFD7CE', marginBottom: '2rem' }}>
              Pare de perder clientes por demorar 2 horas para responder no WhatsApp ou por faltas de última hora. Implementamos sua <strong>Recepcionista de IA Humanizada + Automação Anti No-Show no n8n + Landing Page de Alto Padrão</strong>.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <a
                href="#diagnostico-estudio"
                onClick={() => trackDominoEvent('cta_primary_click', { vertical: '/Estudios', section: 'hero' })}
                style={{
                  padding: '1rem 1.85rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  backgroundImage: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
                  color: '#110D10',
                  boxShadow: '0 8px 30px rgba(212, 175, 55, 0.28)',
                }}
              >
                Quero Automatizar Meu Estúdio →
              </a>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDominoEvent('whatsapp_click', { vertical: '/Estudios', section: 'hero_secondary' })}
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#FAF6F0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>Falar no WhatsApp Agora</span>
                <span>💬</span>
              </a>
            </div>

            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#E5C07B', fontFamily: 'Space Grotesk, sans-serif' }}>5 seg</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>Tempo de resposta no WhatsApp</p>
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#E5C07B', fontFamily: 'Space Grotesk, sans-serif' }}>-65%</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>Redução operacional de faltas</p>
              </div>
              <div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#E5C07B', fontFamily: 'Space Grotesk, sans-serif' }}>24/7</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.75 }}>Agendamentos inclusive domingo à noite</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div
            style={{
              backgroundColor: '#1B1418',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <Image
                src="/Book_Lana/Site1.png"
                alt="Case Real Estúdio de Beleza - Lana Wolf"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px', backgroundColor: 'rgba(17, 13, 16, 0.88)', border: '1px solid #D4AF37', fontSize: '0.75rem', color: '#E5C07B', fontWeight: 700 }}>
                Case Real Implementado • Estúdio Lana Wolf
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#FAF6F0', marginBottom: '0.2rem' }}>Ecossistema Web + IA + Fluxos N8N</h3>
                <p style={{ fontSize: '0.85rem', color: '#DFD7CE', opacity: 0.8 }}>Veja por dentro as telas e o robô de agendamento em produção.</p>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentImg(0); setLightboxOpen(true); }}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid #D4AF37',
                  color: '#E5C07B',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Ver 7 Telas do Projeto ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2: CASE REAL LANA WOLF (Portfolio-First Ordering) */}
      <section id="case-lana" style={{ padding: '5.5rem 1.25rem', backgroundColor: '#171115', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <span className="label-sm" style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                Portfólio Real • Engenharia Domino Automate
              </span>
              <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.75rem)', marginTop: '0.5rem', color: '#FAF6F0' }}>
                Por Dentro do Ecossistema <span style={{ color: '#E5C07B' }}>Lana Wolf Studio</span>
              </h2>
            </div>
            <p className="body-md" style={{ maxWidth: '480px', color: '#DFD7CE', opacity: 0.85 }}>
              Clique em qualquer tela abaixo para inspecionar a plataforma web e os fluxos reais do n8n construídos para o setor de beleza.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {BOOK_LANA_IMAGES.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => { setCurrentImg(idx); setLightboxOpen(true); }}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#1F171C',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <Image src={img.src} alt={img.label} fill style={{ objectFit: 'cover' }} />
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E5C07B' }}>{img.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3: THE PROBLEM & AGITATION (PAS Framework) */}
      <section style={{ padding: '5.5rem 1.25rem', backgroundColor: '#110D10' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
            <span className="label-sm" style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              O Gargalo Invisível dos Estúdios
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.85rem)', marginTop: '0.5rem', color: '#FAF6F0' }}>
              Por Que Tantas Clientes Mandam &ldquo;Qual o Valor?&rdquo; e <span style={{ color: '#E5C07B' }}>Somem Sem Agendar?</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.75rem' }}>
            <div style={{ padding: '2rem', borderRadius: '12px', backgroundColor: '#1F171C', borderLeft: '4px solid #E57373' }}>
              <span style={{ fontSize: '2rem' }}>⏳</span>
              <h3 className="headline-sm" style={{ fontSize: '1.2rem', margin: '0.75rem 0 0.5rem', color: '#FAF6F0' }}>
                Demora Enquanto Você Está Atendendo
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', opacity: 0.85, lineHeight: 1.65 }}>
                Quando a cliente vê um Story seu e manda mensagem no impulso, ela quer resposta imediata. Se você está em procedimento e só responde 2 horas depois, o desejo esfriou ou ela já fechou com outro espaço.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '12px', backgroundColor: '#1F171C', borderLeft: '4px solid #E57373' }}>
              <span style={{ fontSize: '2rem' }}>📉</span>
              <h3 className="headline-sm" style={{ fontSize: '1.2rem', margin: '0.75rem 0 0.5rem', color: '#FAF6F0' }}>
                Buracos na Agenda por Faltas (No-Show)
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', opacity: 0.85, lineHeight: 1.65 }}>
                Cada horário vago por esquecimento da cliente ou desmarcação sem aviso prévio é prejuízo líquido que nunca mais volta. Sem confirmação ativa automatizada, sua agenda fica refém da sorte.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '12px', backgroundColor: '#1F171C', borderLeft: '4px solid #E57373' }}>
              <span style={{ fontSize: '2rem' }}>🔁</span>
              <h3 className="headline-sm" style={{ fontSize: '1.2rem', margin: '0.75rem 0 0.5rem', color: '#FAF6F0' }}>
                Clientes que Não Retornam na Manutenção
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', opacity: 0.85, lineHeight: 1.65 }}>
                O lucro real de um estúdio está na recorrência (manutenção de extensão de cílios, retoque, limpeza de pele, hidratação). Sem um sistema que chame a cliente de volta no dia exato, você precisa gastar sempre mais com anúncios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 4: THE TRANSFORMATION & METHOD (3 Pillars for Beauty Studios) */}
      <section id="solucao-estudios" style={{ padding: '5.5rem 1.25rem', backgroundColor: '#171115', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="label-sm" style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              Engenharia Domino Automate para Beleza & Estética
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginTop: '0.5rem', color: '#FAF6F0' }}>
              O Ecossistema Completo que <span style={{ color: '#E5C07B' }}>Transforma Seu Estúdio</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.75rem' }}>
            <div style={{ padding: '2.25rem 1.75rem', borderRadius: '14px', backgroundColor: '#1B1418', borderTop: '4px solid #D4AF37', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '4px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#E5C07B' }}>
                  PILAR 01 • ATENDIMENTO 24/7
                </span>
                <span style={{ fontSize: '2rem' }}>🤖</span>
              </div>
              <h3 className="headline-sm" style={{ fontSize: '1.3rem', color: '#FAF6F0' }}>
                Recepcionista & SDR de IA no WhatsApp
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', lineHeight: 1.65 }}>
                Treinada com o catálogo de procedimentos, preços, pacotes e regras do seu estúdio. Atende com empatia em segundos, apresenta o valor do seu trabalho antes do preço e qualifica a cliente para agendamento imediato.
              </p>
              <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#E5C07B', fontSize: '0.85rem', fontWeight: 700 }}>
                ✓ Nunca perde um lead de madrugada ou fim de semana
              </div>
            </div>

            <div style={{ padding: '2.25rem 1.75rem', borderRadius: '14px', backgroundColor: '#1B1418', borderTop: '4px solid #D4AF37', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '4px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#E5C07B' }}>
                  PILAR 02 • ORQUESTRAÇÃO N8N
                </span>
                <span style={{ fontSize: '2rem' }}>📅</span>
              </div>
              <h3 className="headline-sm" style={{ fontSize: '1.3rem', color: '#FAF6F0' }}>
                Blindagem Anti No-Show & Reativação
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', lineHeight: 1.65 }}>
                Fluxos automáticos no n8n que enviam lembretes de confirmação, orientações pré-procedimento, pesquisa de satisfação pós-atendimento e aviso automático de retorno de manutenção (15, 30 ou 45 dias).
              </p>
              <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#E5C07B', fontSize: '0.85rem', fontWeight: 700 }}>
                ✓ Agenda previsível e aumento da recorrência mensal
              </div>
            </div>

            <div style={{ padding: '2.25rem 1.75rem', borderRadius: '14px', backgroundColor: '#1B1418', borderTop: '4px solid #D4AF37', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.7rem', borderRadius: '4px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#E5C07B' }}>
                  PILAR 03 • POSICIONAMENTO PREMIUM
                </span>
                <span style={{ fontSize: '2rem' }}>💎</span>
              </div>
              <h3 className="headline-sm" style={{ fontSize: '1.3rem', color: '#FAF6F0' }}>
                Landing Page de Luxo & Alta Conversão
              </h3>
              <p className="body-sm" style={{ color: '#DFD7CE', lineHeight: 1.65 }}>
                Substitua links genéricos na bio do Instagram por uma página exclusiva que valoriza seus resultados (antes/depois), transmite autoridade imediata, rastreia campanhas (UTM) e direciona a cliente pronta para fechar.
              </p>
              <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#E5C07B', fontSize: '0.85rem', fontWeight: 700 }}>
                ✓ Percepção de alto valor para cobrar o que você merece
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 5: INTERACTIVE ROI & AGENDA SIMULATOR FOR BEAUTY STUDIOS */}
      <section id="calculadora-agenda" style={{ padding: '5.5rem 1.25rem', backgroundColor: '#110D10', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="label-sm" style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              Calculadora de Receita do Estúdio • 3 Cenários Auditáveis
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.85rem)', marginTop: '0.5rem', color: '#FAF6F0' }}>
              Quanto Dinheiro Seu Estúdio Está <span style={{ color: '#E5C07B' }}>Deixando na Mesa?</span>
            </h2>
            <p className="body-md" style={{ color: '#DFD7CE', opacity: 0.85, maxWidth: '680px', margin: '0.75rem auto 1.25rem' }}>
              Simule abaixo o impacto financeiro de responder suas clientes em 5 segundos e reduzir as faltas semanais com nossa automação.
            </p>

            {/* Scenario selector */}
            <div style={{ display: 'inline-flex', gap: '0.4rem', padding: '0.35rem', borderRadius: '50px', backgroundColor: '#1B1418', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              {(['conservador', 'referencia', 'otimista'] as ROIScenarioKey[]).map((scen) => {
                const active = scenario === scen;
                return (
                  <button
                    key={scen}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      notifySimStart();
                      setScenario(scen);
                      trackDominoEvent('simulator_complete', {
                        vertical: '/Estudios',
                        scenario: scen,
                        section: 'roi_simulator',
                      });
                    }}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      minHeight: '42px',
                      backgroundColor: active ? '#D4AF37' : 'transparent',
                      color: active ? '#110D10' : '#FAF6F0',
                    }}
                  >
                    Cenário {ESTUDIOS_SCENARIOS[scen].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2.25rem', alignItems: 'start' }}>
            <div style={{ backgroundColor: '#1B1418', padding: '2rem', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="estudios-slider-1" className="label-md">Interessadas por dia no WhatsApp/Direct:</label>
                  <span style={{ color: '#E5C07B', fontWeight: 700 }}>{mensagensDia} contatos/dia</span>
                </div>
                <input
                  id="estudios-slider-1"
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={mensagensDia}
                  onChange={(e) => { notifySimStart(); setMensagensDia(Number(e.target.value)); }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="estudios-slider-2" className="label-md">Ticket Médio do Procedimento:</label>
                  <span style={{ color: '#E5C07B', fontWeight: 700 }}>R$ {ticketMedio}</span>
                </div>
                <input
                  id="estudios-slider-2"
                  type="range"
                  min="80"
                  max="1200"
                  step="20"
                  value={ticketMedio}
                  onChange={(e) => { notifySimStart(); setTicketMedio(Number(e.target.value)); }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="estudios-slider-3" className="label-md">Faltas ou desmarcações por semana:</label>
                  <span style={{ color: '#E5C07B', fontWeight: 700 }}>{faltasSemana} horários/semana</span>
                </div>
                <input
                  id="estudios-slider-3"
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={faltasSemana}
                  onChange={(e) => { notifySimStart(); setFaltasSemana(Number(e.target.value)); }}
                />
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label htmlFor="estudios-slider-margin" className="label-sm" style={{ opacity: 0.85 }}>Premissa Editável: Margem de Contribuição Estimada (%)</label>
                  <span style={{ color: '#E5C07B', fontWeight: 700, fontSize: '0.85rem' }}>{margemLiquidaPct}%</span>
                </div>
                <input
                  id="estudios-slider-margin"
                  type="range"
                  min="25"
                  max="90"
                  step="5"
                  value={margemLiquidaPct}
                  onChange={(e) => { notifySimStart(); setMargemLiquidaPct(Number(e.target.value)); }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div aria-live="polite" style={{ padding: '1.75rem', borderRadius: '12px', backgroundColor: '#1B1418', borderLeft: '5px solid #D4AF37' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p className="label-sm" style={{ textTransform: 'uppercase', color: '#E5C07B' }}>
                    Faturamento Incremental Bruto ({simResults.cfg.label})
                  </p>
                  <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Receita Recuperada</span>
                </div>
                <p className="display-sm" style={{ fontSize: '2.25rem', color: '#FAF6F0', margin: '0.35rem 0', fontWeight: 700 }}>
                  + R$ {simResults.ganhoBrutoMensal.toLocaleString('pt-BR')} <span style={{ fontSize: '1rem', opacity: 0.75 }}>/mês</span>
                </p>
                <p className="body-sm" style={{ color: '#DFD7CE', opacity: 0.85 }}>
                  Margem de Contribuição Estimada ({margemLiquidaPct}% margem): <strong>R$ {simResults.lucroLiquidoMensal.toLocaleString('pt-BR')}/mês</strong> • Recuperando <strong>+{simResults.novosAgendamentosMes} agendamentos/mês</strong> e evitando <strong>{simResults.faltasEvitadasMes} faltas/mês</strong>.
                </p>
              </div>

              <div style={{ padding: '1.4rem', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <p className="label-sm" style={{ color: '#E5C07B' }}>Impacto Acumulado em 12 Meses:</p>
                  <p style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FAF6F0' }}>
                    + R$ {simResults.ganhoAnual.toLocaleString('pt-BR')} / ano
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openChat}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '4px',
                    backgroundColor: '#D4AF37',
                    color: '#110D10',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Simular com a IA ✨
                </button>
              </div>

              {/* Calculation Memory Accordion */}
              <div style={{ padding: '1rem 1.25rem', borderRadius: '10px', backgroundColor: '#1B1418', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <button
                  type="button"
                  aria-expanded={showMemory}
                  aria-controls="estudios-memory-panel"
                  onClick={() => setShowMemory(!showMemory)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    color: '#FAF6F0',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <span>📐 Ver Memória de Cálculo ({simResults.cfg.label})</span>
                  <span style={{ color: '#E5C07B' }} aria-hidden="true">{showMemory ? '−' : '+'}</span>
                </button>
                {showMemory && (
                  <ul id="estudios-memory-panel" style={{ marginTop: '0.75rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#DFD7CE', opacity: 0.9 }}>
                    {simResults.memoriaDeCalculo.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 6: N8N WEBHOOK + WHATSAPP CONVERSION FORM */}
      <section id="diagnostico-estudio" style={{ padding: '5.5rem 1.25rem', backgroundColor: '#171115', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="label-sm" style={{ color: '#E5C07B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              Implementação Sob Medida • N8N + IA + WhatsApp
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)', marginTop: '0.5rem', color: '#FAF6F0' }}>
              Solicite o Diagnóstico para o <span style={{ color: '#E5C07B' }}>Seu Estúdio</span>
            </h2>
            <p className="body-md" style={{ color: '#DFD7CE', opacity: 0.85, maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Escolha abaixo o perfil do seu espaço e os pontos que você deseja automatizar. Nossa esteira no n8n registrará seu pedido imediatamente.
            </p>
          </div>

          {submitted ? (
            <div role="status" aria-live="polite" style={{ padding: '3.5rem 2rem', borderRadius: '16px', backgroundColor: '#1B1418', border: '1px solid #D4AF37', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">✨</div>
              <h3 className="headline-sm" style={{ color: '#E5C07B', marginBottom: '0.75rem', fontSize: '1.6rem' }}>
                Diagnóstico do Seu Estúdio Registrado!
              </h3>
              <p className="body-md" style={{ maxWidth: '520px', margin: '0 auto 2rem', color: '#DFD7CE' }}>
                {deliveryStatus === 'queued_outbox' ? (
                  <>
                    As informações de <strong>{nomeEstudio || nome}</strong> foram gravadas com segurança na fila transacional da Domino Automate. Clique no botão abaixo para abrir a conversa prioritária no nosso WhatsApp com seu resumo pronto:
                  </>
                ) : (
                  <>
                    Recebemos os dados de <strong>{nomeEstudio || nome}</strong> via automação N8N. Clique no botão abaixo para abrir a conversa prioritária no nosso WhatsApp com seu resumo pronto:
                  </>
                )}
              </p>
              <a
                href={`https://wa.me/5561981171564?text=${encodeURIComponent(
                  `Olá! Acabei de preencher o diagnóstico na página /Estudios da Domino Automate.\n\n• Nome: ${nome}\n• Estúdio: ${nomeEstudio || 'Não informado'}\n• Segmento: ${segmento}\n• Prioridades: ${selectedDores.join(', ')}\n\nGostaria de conversar sobre a implementação!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDominoEvent('whatsapp_click', { vertical: '/Estudios', section: 'post_form_success' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem 2.25rem',
                  borderRadius: '4px',
                  backgroundImage: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
                  color: '#110D10',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                }}
              >
                <span>Continuar no WhatsApp da Especialista</span>
                <span aria-hidden="true">💬</span>
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              aria-busy={loading}
              style={{
                backgroundColor: '#1B1418',
                padding: '2.5rem 2rem',
                borderRadius: '16px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem',
              }}
            >
              {/* Honeypot anti-spam */}
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
                <span className="label-md" style={{ display: 'block', marginBottom: '0.75rem', color: '#E5C07B' }}>
                  1. Qual é o segmento do seu espaço?
                </span>
                <div role="group" aria-label="Segmento do estúdio" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {SEGMENTOS_ESTUDIO.map((item) => (
                    <button
                      type="button"
                      key={item}
                      aria-pressed={segmento === item}
                      onClick={() => { notifyFormStart(); setSegmento(item); }}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '50px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        minHeight: '42px',
                        backgroundColor: segmento === item ? '#D4AF37' : '#261C22',
                        color: segmento === item ? '#110D10' : '#FAF6F0',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="label-md" style={{ display: 'block', marginBottom: '0.75rem', color: '#E5C07B' }}>
                  2. Quais gargalos você quer resolver primeiro? (Pode marcar vários)
                </span>
                <div role="group" aria-label="Gargalos prioritários" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {DORES_ESTUDIO.map((dor) => {
                    const active = selectedDores.includes(dor);
                    return (
                      <button
                        type="button"
                        key={dor}
                        aria-pressed={active}
                        onClick={() => toggleDor(dor)}
                        style={{
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          minHeight: '42px',
                          backgroundColor: active ? 'rgba(212, 175, 55, 0.2)' : '#261C22',
                          color: active ? '#E5C07B' : '#DFD7CE',
                          border: active ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                          fontWeight: active ? 700 : 400,
                        }}
                      >
                        {active ? '✓ ' : '+ '} {dor}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="estudios-input-nome" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: '#DFD7CE' }}>
                    Seu Nome *
                  </label>
                  <input
                    id="estudios-input-nome"
                    required
                    type="text"
                    placeholder="Seu Nome"
                    className="input-field"
                    style={{ backgroundColor: '#110D10', width: '100%' }}
                    value={nome}
                    onChange={(e) => { notifyFormStart(); setNome(e.target.value); }}
                  />
                </div>
                <div>
                  <label htmlFor="estudios-input-estudio" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: '#DFD7CE' }}>
                    Nome do Estúdio / Clínica
                  </label>
                  <input
                    id="estudios-input-estudio"
                    type="text"
                    placeholder="Nome do Estúdio / Clínica (@instagram)"
                    className="input-field"
                    style={{ backgroundColor: '#110D10', width: '100%' }}
                    value={nomeEstudio}
                    onChange={(e) => setNomeEstudio(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="estudios-input-whatsapp" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: '#DFD7CE' }}>
                    Seu WhatsApp com DDD *
                  </label>
                  <input
                    id="estudios-input-whatsapp"
                    required
                    type="tel"
                    placeholder="Seu WhatsApp com DDD"
                    className="input-field"
                    style={{ backgroundColor: '#110D10', width: '100%' }}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="estudios-input-email" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: '#DFD7CE' }}>
                    Seu Melhor E-mail *
                  </label>
                  <input
                    id="estudios-input-email"
                    required
                    type="email"
                    placeholder="Seu Melhor E-mail"
                    className="input-field"
                    style={{ backgroundColor: '#110D10', width: '100%' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="estudios-input-detalhes" className="label-sm" style={{ display: 'block', marginBottom: '0.35rem', color: '#DFD7CE' }}>
                  Detalhes da Operação (Opcional)
                </label>
                <textarea
                  id="estudios-input-detalhes"
                  placeholder="Conte brevemente quantas profissionais atendem hoje no espaço ou alguma necessidade específica (opcional)..."
                  className="input-field"
                  style={{ backgroundColor: '#110D10', minHeight: '90px', resize: 'vertical', width: '100%' }}
                  value={detalhes}
                  onChange={(e) => setDetalhes(e.target.value)}
                />
              </div>

              <label htmlFor="estudios-input-lgpd" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.8rem', color: '#DFD7CE', cursor: 'pointer' }}>
                <input
                  id="estudios-input-lgpd"
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  required
                  style={{ marginTop: '0.2rem', accentColor: '#D4AF37' }}
                />
                <span>
                  Concordo em receber o diagnóstico comercial da Domino Automate via WhatsApp e e-mail em conformidade com a LGPD (Lei nº 13.709/2018).
                </span>
              </label>

              {formError && (
                <p role="alert" aria-live="assertive" style={{ color: '#E57373', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {formError}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={loading || !lgpdConsent}
                  style={{
                    padding: '1.1rem 2rem',
                    borderRadius: '4px',
                    backgroundImage: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
                    color: '#110D10',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Enviando para nossa Automação...' : 'Receber Proposta & Diagnóstico no WhatsApp →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '5rem 1.25rem', backgroundColor: '#110D10' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="display-sm" style={{ textAlign: 'center', marginBottom: '3rem', color: '#FAF6F0' }}>
            Dúvidas Frequentes de <span style={{ color: '#E5C07B' }}>Gestoras de Estúdios</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: '10px',
                    backgroundColor: '#1B1418',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    id={`estudios-faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`estudios-faq-panel-${i}`}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="label-md" style={{ color: '#FAF6F0', fontSize: '1rem' }}>{f.q}</span>
                    <span style={{ color: '#E5C07B', fontSize: '1.4rem' }} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div
                      id={`estudios-faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`estudios-faq-btn-${i}`}
                      style={{ padding: '0 1.5rem 1.5rem' }}
                    >
                      <p className="body-sm" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#DFD7CE', lineHeight: 1.65 }}>
                        {f.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3.5rem 2rem', backgroundColor: '#0B080A', borderTop: '1px solid rgba(212, 175, 55, 0.18)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h4 className="headline-sm" style={{ color: '#E5C07B', fontSize: '1.2rem' }}>Domino Automate • Vertical Estúdios</h4>
            <p style={{ fontSize: '0.82rem', opacity: 0.7, marginTop: '0.25rem' }}>
              DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA • CNPJ: 66.699.218/0001-94 • Brasília - DF
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: '#E5C07B' }}>← Portal Domino Automate</Link>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDominoEvent('whatsapp_click', { vertical: '/Estudios', section: 'footer' })}
              style={{ fontSize: '0.85rem', color: '#FAF6F0' }}
            >
              WhatsApp: (61) 98117-1564
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal for Book_Lana */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de Telas do Case Lana Wolf"
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(11, 8, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <div>
              <h4 style={{ color: '#E5C07B', fontSize: '1.1rem' }}>{BOOK_LANA_IMAGES[currentImg].label}</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Imagem {currentImg + 1} de {BOOK_LANA_IMAGES.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#FAF6F0', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '72vh' }} onClick={(e) => e.stopPropagation()}>
            <Image src={BOOK_LANA_IMAGES[currentImg].src} alt={BOOK_LANA_IMAGES[currentImg].label} fill style={{ objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setCurrentImg((prev) => (prev > 0 ? prev - 1 : BOOK_LANA_IMAGES.length - 1))}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', backgroundColor: '#1B1418', border: '1px solid #D4AF37', color: '#E5C07B', cursor: 'pointer' }}
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => setCurrentImg((prev) => (prev < BOOK_LANA_IMAGES.length - 1 ? prev + 1 : 0))}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', backgroundColor: '#1B1418', border: '1px solid #D4AF37', color: '#E5C07B', cursor: 'pointer' }}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Configured for Beauty Studios */}
      <AIChat niche="estudios" />
    </div>
  );
}
