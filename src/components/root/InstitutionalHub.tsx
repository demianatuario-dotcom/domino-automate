'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CategoryFilter = 'todos' | 'corporativo' | 'beleza' | 'saude' | 'varejo';

interface VerticalHubCard {
  id: string;
  route: string;
  category: Exclude<CategoryFilter, 'todos'>;
  categoryBadge: string;
  icon: string;
  title: string;
  subtitle: string;
  bullets: string[];
  accentColor: string;
  bgGradient: string;
  btnGradient: string;
  btnTextColor: string;
}

const VERTICALS_LIST: VerticalHubCard[] = [
  {
    id: 'atuaria',
    route: '/Atuaria',
    category: 'corporativo',
    categoryBadge: 'ATUÁRIA, PREVIDÊNCIA & RISCOS',
    icon: '🏛️',
    title: 'Inteligência Atuarial, Perícia & Fundos de Pensão',
    subtitle: 'Consultoria atuarial registrada (MIBA 1807), auditoria CPC 33 / IAS 19, perícia judicial complexa e motores analíticos em Python para EFPCs, Patrocinadoras e Bancas Jurídicas.',
    bullets: [
      'Auditoria Independente CPC 33 (R1) / IAS 19 e Solvência PREVIC',
      'Perícia Judicial e Assistência Técnica (TRT10, TJDFT e Tribunais)',
      'Motores de Cálculo Atuarial em Python e Automação de Passivos'
    ],
    accentColor: '#E9C176',
    bgGradient: 'linear-gradient(155deg, #0d2344 0%, #0e141d 100%)',
    btnGradient: 'linear-gradient(45deg, #E9C176, #C9A050)',
    btnTextColor: '#0A0E14'
  },
  {
    id: 'advocacia',
    route: '/Advocacia',
    category: 'corporativo',
    categoryBadge: 'JURÍDICO & SOCIEDADES DE ADVOGADOS',
    icon: '⚖️',
    title: 'Escritórios de Advocacia & Bancas Jurídicas',
    subtitle: 'Triagem jurídica qualificada por IA 24/7, coleta automatizada de provas/documentos via WhatsApp e acompanhamento processual proativo em total conformidade com a OAB e LGPD.',
    bullets: [
      'Triagem Inteligente de Novos Casos e Qualificação de Potenciais Clientes',
      'Coleta Automatizada de Documentos, Procurações e Provas no WhatsApp',
      'Notificações Proativas de Andamentos Processuais e Redução de Chamados'
    ],
    accentColor: '#C5A059',
    bgGradient: 'linear-gradient(155deg, #131B26 0%, #0B0F15 100%)',
    btnGradient: 'linear-gradient(45deg, #C5A059, #E2C280)',
    btnTextColor: '#0B0F15'
  },
  {
    id: 'contabilidade',
    route: '/Contabilidade',
    category: 'corporativo',
    categoryBadge: 'CONTÁBIL, FISCAL & BPO FINANCEIRO',
    icon: '📊',
    title: 'Escritórios de Contabilidade & BPO Financeiro',
    subtitle: 'Cobrança e coleta automática de extratos/XMLs, atendimento imediato a dúvidas fiscais de clientes no WhatsApp e entrega rastreada de guias (DAS, DARF, FGTS e Folha) via n8n.',
    bullets: [
      'Coleta Autônoma de Documentos Contábeis e Extratos todo Mês',
      'Disparo Rastreável de Guias e Alertas Anti-Multa Antes do Vencimento',
      'Assistente de IA no WhatsApp para Dúvidas de CNAE, NF-e e Pró-Labore'
    ],
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(155deg, #0F222A 0%, #0A1419 100%)',
    btnGradient: 'linear-gradient(45deg, #10B981, #34D399)',
    btnTextColor: '#06130E'
  },
  {
    id: 'estudios',
    route: '/Estudios',
    category: 'beleza',
    categoryBadge: 'ESTÉTICA AVANÇADA, LASH & BROW',
    icon: '✨',
    title: 'Estúdios de Beleza & Clínicas de Estética',
    subtitle: 'Recepcionista e SDR de IA 24/7 no WhatsApp, blindagem anti No-Show e Landing Pages de alto padrão para Lash Designers, Micropigmentação, Harmonização e Estética.',
    bullets: [
      'Agendamento IA 24/7 no WhatsApp Enquanto Você Está em Procedimento',
      'Confirmação Antecipada Anti No-Show e Reativação de Manutenções',
      'Landing Pages de Luxo com Portfólio e Conversão Direta'
    ],
    accentColor: '#D4AF37',
    bgGradient: 'linear-gradient(155deg, #24171D 0%, #110D10 100%)',
    btnGradient: 'linear-gradient(45deg, #D4AF37, #F3E5AB)',
    btnTextColor: '#110D10'
  },
  {
    id: 'saloes',
    route: '/Saloes',
    category: 'beleza',
    categoryBadge: 'HAIR STUDIOS & SALÕES MULTIPROFISSIONAIS',
    icon: '💇‍♀️',
    title: 'Salões de Beleza & Hair Studios',
    subtitle: 'Orquestração inteligente de agendas para múltiplos profissionais (cabeleireiros, coloristas, manicures), triagem de mechas/química e recorrência automática de clientes.',
    bullets: [
      'Recepção Centralizada no WhatsApp para Equipes Multiprofissionais',
      'Triagem Prévia de Mechas, Colorimetria e Tratamentos Capilares',
      'Reativação Automática de Retoque de Raiz, Corte e Hidratação'
    ],
    accentColor: '#D98A6C',
    bgGradient: 'linear-gradient(155deg, #261915 0%, #140D0B 100%)',
    btnGradient: 'linear-gradient(45deg, #D98A6C, #F2B8A0)',
    btnTextColor: '#140D0B'
  },
  {
    id: 'barbearias',
    route: '/Barbearias',
    category: 'beleza',
    categoryBadge: 'BARBERSHOPS & CLUBES DE ASSINATURA',
    icon: '💈',
    title: 'Barbearias Modernas & Men’s Clubs',
    subtitle: 'Agendamento expresso em segundos pelo WhatsApp sem baixar aplicativo, venda recorrente de Clubes VIP de Assinatura e lembretes automáticos de retorno a cada 15/21 dias.',
    bullets: [
      'Agendamento Rápido por Voz/Texto no WhatsApp por Barbeiro',
      'Motor de Conversão e Retenção para Planos de Assinatura Mensal',
      'Alerta Anti-Furo de Agenda e Convocação do Ciclo de Corte/Barba'
    ],
    accentColor: '#D97706',
    bgGradient: 'linear-gradient(155deg, #221A11 0%, #100D0A 100%)',
    btnGradient: 'linear-gradient(45deg, #D97706, #F59E0B)',
    btnTextColor: '#100D0A'
  },
  {
    id: 'odontologia',
    route: '/Odontologia',
    category: 'saude',
    categoryBadge: 'CLÍNICAS ODONTOLÓGICAS & ESPECIALIDADES',
    icon: '🦷',
    title: 'Consultórios & Clínicas de Odontologia',
    subtitle: 'Captação e agendamento de avaliações de implantes, alinhadores, facetas e ortodontia, resgate de orçamentos em aberto e retorno semestral automático de profilaxia.',
    bullets: [
      'Secretária Digital IA 24/7 para Agendamento de Avaliações',
      'Follow-up Estruturado para Fechamento de Planos de Tratamento',
      'Confirmação Ativa de Cadeiras e Recall Semestral de Prevenção'
    ],
    accentColor: '#0284C7',
    bgGradient: 'linear-gradient(155deg, #0D2130 0%, #08131C 100%)',
    btnGradient: 'linear-gradient(45deg, #0284C7, #38BDF8)',
    btnTextColor: '#061017'
  },
  {
    id: 'farmacias',
    route: '/Farmacias',
    category: 'saude',
    categoryBadge: 'DROGARIAS & FARMÁCIAS DE MANIPULAÇÃO',
    icon: '💊',
    title: 'Farmácias, Drogarias & Manipulação',
    subtitle: 'Recebimento e leitura ágil de receitas médicas no WhatsApp, aceleração de orçamentos de fórmulas manipuladas, delivery farmacêutico e recompra de medicamentos de uso contínuo.',
    bullets: [
      'Triagem Instantânea de Receitas (Foto/PDF) e Cotação Rápida',
      'Follow-up Automático de Orçamentos de Manipulação Não Fechados',
      'Alerta Programado de Recompra de Uso Contínuo (30/60/90 dias)'
    ],
    accentColor: '#0EA5E9',
    bgGradient: 'linear-gradient(155deg, #0B2528 0%, #071517 100%)',
    btnGradient: 'linear-gradient(45deg, #0EA5E9, #2DD4BF)',
    btnTextColor: '#061314'
  },
  {
    id: 'oticas',
    route: '/Oticas',
    category: 'saude',
    categoryBadge: 'ÓTICAS, ARMAÇÕES & LENTES DE PRECISÃO',
    icon: '👓',
    title: 'Óticas & Boutiques de Saúde Visual',
    subtitle: 'Orçamento consultivo de receitas oftalmológicas via WhatsApp, indicação inteligente de tratamentos (antirreflexo, filtro azul, multifocal) e alerta anual de renovação de grau.',
    bullets: [
      'Recepção de Receita Oftalmológica e Pré-Orçamento Consultivo 24/7',
      'Acompanhamento Proativo do Status de Laboratório e Entrega',
      'Recall Automático de 12 Meses para Exame de Vista e Troca de Óculos'
    ],
    accentColor: '#EAB308',
    bgGradient: 'linear-gradient(155deg, #1E1B12 0%, #110F0A 100%)',
    btnGradient: 'linear-gradient(45deg, #EAB308, #FDE047)',
    btnTextColor: '#110F0A'
  },
  {
    id: 'varejo',
    route: '/Varejo',
    category: 'varejo',
    categoryBadge: 'COMÉRCIO FÍSICO, LOJAS & FRANQUIAS',
    icon: '🛍️',
    title: 'Lojas Comerciais Físicas em Geral',
    subtitle: 'Transforme o tráfego digital e do Instagram em visitas presenciais e entregas no mesmo dia: vendedor SDR de IA 24/7, reserva em loja (Drive-Thru) e reativação da base de clientes.',
    bullets: [
      'Atendimento Imediato de Preço, Tamanho e Estoque via WhatsApp',
      'Reserva Expressa para Retirada na Loja Física ou Delivery Local',
      'Campanhas Inteligentes de Recompra, Aniversário e Pós-Venda'
    ],
    accentColor: '#F97316',
    bgGradient: 'linear-gradient(155deg, #24160E 0%, #120B07 100%)',
    btnGradient: 'linear-gradient(45deg, #F97316, #FB923C)',
    btnTextColor: '#120B07'
  }
];

export default function InstitutionalHub() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todos');

  const capabilities = [
    {
      num: '01',
      title: 'Engenharia de Software & Arquitetura Web',
      tag: 'Next.js • TypeScript • Sistemas Críticos',
      desc: 'Construção de ecossistemas digitais proprietários de resposta sub-segundo, desenhados sob medida com identidade visual dedicada para autoridade, captura qualificada e conversão direta.'
    },
    {
      num: '02',
      title: 'Orquestração Autônoma & Pipelines de Dados',
      tag: 'n8n • Python • R • PostgreSQL',
      desc: 'Integração ponta a ponta entre bancos de dados, ERPs, agendas, CRMs e canais de comunicação, eliminando trabalho braçal, retrabalho humano e gargalos operacionais.'
    },
    {
      num: '03',
      title: 'Agentes de Inteligência Artificial Privada',
      tag: 'LLMs • WhatsApp API • Governança LGPD',
      desc: 'Assistentes cognitivos treinados na regra de negócio específica de cada um dos 10 segmentos atendidos para triagem técnica, agendamento autônomo 24/7 e vendas em tempo real.'
    }
  ];

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos os Segmentos', count: VERTICALS_LIST.length },
    { key: 'corporativo', label: 'Corporativo, Jurídico & Contábil', count: VERTICALS_LIST.filter(v => v.category === 'corporativo').length },
    { key: 'beleza', label: 'Beleza & Bem-Estar', count: VERTICALS_LIST.filter(v => v.category === 'beleza').length },
    { key: 'saude', label: 'Saúde, Farma & Óticas', count: VERTICALS_LIST.filter(v => v.category === 'saude').length },
    { key: 'varejo', label: 'Comércio & Varejo Físico', count: VERTICALS_LIST.filter(v => v.category === 'varejo').length },
  ];

  const filteredVerticals = activeCategory === 'todos'
    ? VERTICALS_LIST
    : VERTICALS_LIST.filter(v => v.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--surface)', color: 'var(--on-surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Institucional */}
      <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.png" alt="Domino Automate Logo" width={150} height={50} className="mobile-logo-img" style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(233, 193, 118, 0.2))' }} priority />
        </Link>

        <nav className="header-nav" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          <a href="#apresentacao" className="label-md desktop-only" style={{ opacity: 0.85 }}>A Domino</a>
          <a href="#habilidades" className="label-md desktop-only" style={{ opacity: 0.85 }}>Competências</a>
          <a href="#verticais" className="label-md desktop-only" style={{ opacity: 0.85 }}>10 Segmentos</a>
          <Link href="/Atuaria" className="label-md desktop-only" style={{ color: 'var(--secondary)' }}>
            Atuária ↗
          </Link>
          <Link href="/Estudios" className="label-md desktop-only" style={{ color: '#E5C07B' }}>
            Estúdios ↗
          </Link>
          <a href="#verticais" className="btn-primary header-btn desktop-only" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            Escolher Meu Segmento
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
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} style={{ overflowY: 'auto', maxHeight: '85vh' }}>
        <a href="#apresentacao" onClick={() => setMenuOpen(false)}>A Domino Automate</a>
        <a href="#habilidades" onClick={() => setMenuOpen(false)}>Habilidades & Engenharia</a>
        <a href="#verticais" onClick={() => setMenuOpen(false)}>Todos os 10 Segmentos</a>
        <div style={{ borderTop: '1px solid var(--outline-variant)', margin: '0.5rem 0', paddingTop: '0.5rem' }}>
          {VERTICALS_LIST.map((v) => (
            <Link
              key={v.id}
              href={v.route}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '0.5rem 0', color: v.accentColor, fontSize: '0.92rem', fontWeight: 600 }}
            >
              {v.icon} {v.route} — {v.title.split('&')[0]} ↗
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero: Introdução Institucional da Domino Automate */}
      <section id="apresentacao" style={{ padding: '9rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: '42vw', height: '42vw', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', filter: 'blur(90px)', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '920px' }}>
            <div className="animate-fadein-1 badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 1.1rem', borderRadius: '4px', background: 'rgba(233, 193, 118, 0.1)', borderLeft: '3px solid var(--secondary)', marginBottom: '1.75rem' }}>
              <span style={{ color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                DOMINO AUTOMATE • ENGENHARIA DE SISTEMAS, IA & HIPERAUTOMAÇÃO EM 10 VERTICAIS
              </span>
            </div>

            <h1 className="display-lg animate-fadein-2" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.1rem)', lineHeight: 1.08, marginBottom: '1.75rem', textAlign: 'left' }}>
              Engenharia Digital, Inteligência Analítica e{' '}
              <span style={{ color: 'var(--secondary)' }}>Sistemas Autônomos de IA.</span>
            </h1>

            <p className="body-md animate-fadein-3" style={{ fontSize: '1.2rem', lineHeight: 1.75, opacity: 0.88, maxWidth: '820px', marginBottom: '2.75rem' }}>
              A <strong>Domino Automate</strong> é uma software house e consultoria de engenharia aplicada sediada em Brasília-DF. Desenvolvemos ecossistemas especializados por segmento — de <strong>Inteligência Atuarial, Advocacia e Contabilidade</strong> a <strong>Beleza, Saúde, Farmácias, Óticas e Varejo Físico</strong> — unindo orquestração n8n/Python e agentes de IA 24/7 no WhatsApp.
            </p>

            <div className="animate-fadein-4" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="#verticais" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem', fontWeight: 700 }}>
                Explorar os 10 Segmentos Atendidos ↓
              </a>
              <a href="#habilidades" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Conhecer Nossas Competências
              </a>
            </div>
          </div>

          {/* Indicadores Institucionais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '4.5rem' }}>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ecossistemas Dedicados</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>10 Verticais de Negócio</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Arquiteturas e agentes treinados especificamente na dor e linguagem de cada setor.</p>
            </div>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Arquitetura Proprietária</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>Python • n8n • Next.js</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Motores analíticos, integrações via API e aplicações web de alta conversão.</p>
            </div>
            <div className="card-base ghost-border" style={{ padding: '1.5rem', backgroundColor: 'rgba(12, 17, 24, 0.75)' }}>
              <p className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operação Contínua</p>
              <p className="display-sm" style={{ margin: '0.4rem 0', fontSize: '1.65rem' }}>Agentes IA 24/7</p>
              <p className="body-sm" style={{ opacity: 0.75 }}>Atendimento consultivo, triagem técnica, agendamentos e vendas em tempo real.</p>
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

      {/* Hub de 10 Verticais Especializadas */}
      <section id="verticais" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
              10 Ecossistemas Dedicados por Setor
            </span>
            <h2 className="display-lg" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Selecione a Vertical do <span style={{ color: 'var(--secondary)' }}>Seu Negócio</span>
            </h2>
            <p className="body-md" style={{ maxWidth: '760px', margin: '0 auto', opacity: 0.85 }}>
              Cada segmento possui sua própria identidade visual, simulador financeiro de retorno (ROI) e consultor de IA especializado. Filtre por macro-setor ou acesse diretamente abaixo:
            </p>
          </div>

          {/* Filtros por Macro-Categoria */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '0.7rem 1.25rem',
                    borderRadius: '999px',
                    border: isActive ? '1px solid var(--secondary)' : '1px solid var(--outline-variant)',
                    backgroundColor: isActive ? 'rgba(233, 193, 118, 0.16)' : 'var(--surface-container)',
                    color: isActive ? 'var(--secondary)' : 'var(--on-surface)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{
                    padding: '0.1rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    backgroundColor: isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#0A0E14' : 'var(--on-surface)',
                    fontWeight: 700
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid dos 10 Segmentos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {filteredVerticals.map((v) => (
              <div
                key={v.id}
                className="card-base ghost-border floating-shadow"
                style={{
                  padding: '2.4rem 2.1rem',
                  background: v.bgGradient,
                  borderTop: `4px solid ${v.accentColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.75rem' }}>
                    <span
                      className="label-sm"
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.07)',
                        color: v.accentColor,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em'
                      }}
                    >
                      {v.categoryBadge}
                    </span>
                    <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                  </div>

                  <h3 className="display-sm" style={{ fontSize: '1.65rem', marginBottom: '0.65rem', color: '#FAF8F5', lineHeight: 1.2 }}>
                    {v.title}
                  </h3>

                  <p className="body-md" style={{ opacity: 0.88, lineHeight: 1.65, marginBottom: '1.4rem', fontSize: '0.95rem', color: '#E5E7EB' }}>
                    {v.subtitle}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', opacity: 0.92, color: '#F3F4F6' }}>
                    {v.bullets.map((bullet, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <span style={{ color: v.accentColor, fontWeight: 800 }}>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.35rem' }}>
                  <Link
                    href={v.route}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.95rem 1.35rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      backgroundImage: v.btnGradient,
                      color: v.btnTextColor,
                      borderRadius: '6px'
                    }}
                  >
                    <span>Acessar Soluções da Vertical</span>
                    <span style={{ fontWeight: 800 }}>{v.route} →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Institucional com Mapa Completo das 10 Subpastas */}
      <footer style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '4rem 2rem', marginTop: 'auto', borderTop: '1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '460px' }}>
              <h4 className="headline-sm" style={{ color: 'var(--secondary)', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                Domino Automate
              </h4>
              <p className="body-sm" style={{ opacity: 0.78, fontSize: '0.88rem', lineHeight: 1.6 }}>
                DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA • CNPJ: 66.699.218/0001-94 • Brasília - DF
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="https://domino-automate.com.br/curriculo/" target="_blank" rel="noopener noreferrer" className="label-sm" style={{ opacity: 0.85 }}>
                Portal Curricular ↗
              </a>
              <a href="https://wa.me/5561981171564" target="_blank" rel="noopener noreferrer" className="label-sm" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                WhatsApp Direto: (61) 98117-1564 ↗
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem 1.75rem', alignItems: 'center' }}>
            <span className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verticais Especializadas:
            </span>
            {VERTICALS_LIST.map((v) => (
              <Link
                key={v.id}
                href={v.route}
                className="label-sm"
                style={{ color: v.accentColor, fontWeight: 600 }}
              >
                {v.route}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
