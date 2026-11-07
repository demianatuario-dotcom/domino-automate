import type { EconomicModelType } from '../lib/roiEngine.ts';

export type SegmentNicheKey =
  | 'atuaria'
  | 'estudios'
  | 'saloes'
  | 'barbearias'
  | 'advocacia'
  | 'contabilidade'
  | 'farmacias'
  | 'oticas'
  | 'odontologia'
  | 'varejo';

export type LayoutStrategy =
  | 'authority-first'
  | 'portfolio-first'
  | 'problem-first'
  | 'roi-first'
  | 'demonstration-first';

export type SectionBlockKey =
  | 'pas'
  | 'pillars'
  | 'technical-proof'
  | 'simulator'
  | 'form'
  | 'faq';

export type ThemeMode = 'dark' | 'light';

export interface SegmentTheme {
  bgPrimary: string;
  bgSecondary: string;
  cardBg: string;
  cardBorder: string;
  accentPrimary: string;
  accentSecondary: string;
  accentText?: string;
  accentGradient: string;
  buttonTextColor: string;
  textPrimary: string;
  textSecondary: string;
  painBorderColor: string;
  heroGlow: string;
  borderRadius: string;
}

export interface SimulatorSliderConfig {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface TechnicalProofConfig {
  sectionTag: string;
  headlineMain: string;
  headlineHighlight: string;
  disclaimer: string;
  whatsappDemo: {
    agentName: string;
    statusText: string;
    messages: {
      sender: 'client' | 'ai';
      text: string;
      time: string;
    }[];
  };
  beforeAfter: {
    beforeTitle: string;
    beforeItems: string[];
    afterTitle: string;
    afterItems: string[];
  };
  workflowSteps: {
    step: string;
    title: string;
    tech: string;
    desc: string;
  }[];
}

export interface SegmentConfig {
  key: SegmentNicheKey;
  slug: string;
  headerBadge: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  layoutStrategy: LayoutStrategy;
  sectionOrder: SectionBlockKey[];
  defaultThemeMode: ThemeMode;
  theme: SegmentTheme;
  lightTheme: SegmentTheme;
  hero: {
    preHeadline: string;
    headlineMain: string;
    headlineHighlight: string;
    subHeadline: string;
    primaryCta: string;
    secondaryCta: string;
    whatsappGreeting: string;
    metrics: { value: string; label: string }[];
    visualCard: {
      tag: string;
      title: string;
      subtitle: string;
      bullets: string[];
    };
  };
  pas: {
    sectionTag: string;
    headlineMain: string;
    headlineHighlight: string;
    pains: { icon: string; title: string; desc: string }[];
  };
  pillars: {
    sectionTag: string;
    headlineMain: string;
    headlineHighlight: string;
    items: {
      badge: string;
      icon: string;
      title: string;
      desc: string;
      result: string;
    }[];
  };
  technicalProof: TechnicalProofConfig;
  simulator: {
    economicModelType: EconomicModelType;
    sectionTag: string;
    headlineMain: string;
    headlineHighlight: string;
    subtitle: string;
    slider1: SimulatorSliderConfig;
    slider2: SimulatorSliderConfig;
    slider3: SimulatorSliderConfig;
    resultLabel: string;
    conversionRate1: number; // relative uplift 0.05..0.50
    recoveryRate3: number;   // relative recovery 0.10..0.70
    defaultMarginPct: number;
    hourlyOperationalValue: number;
    weeklyHoursSavedBase: number;
    baselineRevenueMultiplier: number;
    estimatedInvestment?: number;
    metric1Suffix: string;
    metric3Suffix: string;
  };
  form: {
    sectionTag: string;
    headlineMain: string;
    headlineHighlight: string;
    subtitle: string;
    orgLabel: string;
    orgPlaceholder: string;
    subTypes: string[];
    painsList: string[];
    demandLabel: string;
  };
  faqs: { q: string; a: string }[];
  chatConfig: {
    welcomeBubbleTitle: string;
    welcomeBubbleHighlight: string;
    headerTitle: string;
    initialMessage: string;
    collectNamePrompt: string;
    successMessage: string;
  };
}

export const SEGMENTS_CONFIG: Record<Exclude<SegmentNicheKey, 'atuaria' | 'estudios'>, SegmentConfig> = {
  saloes: {
    key: 'saloes',
    slug: '/Saloes',
    headerBadge: '💇‍♀️ Vertical Salões de Beleza & Hair Studios',
    icon: '💇‍♀️',
    metaTitle: 'Domino Automate | Automação, IA 24/7 no WhatsApp & Gestão de Agenda para Salões de Beleza',
    metaDescription: 'Elimine cadeiras ociosas, automatize o agendamento de mechas, corte, coloração e manicure pelo WhatsApp 24/7 e reative clientes automaticamente com IA e n8n.',
    layoutStrategy: 'problem-first',
    sectionOrder: ['pas', 'pillars', 'technical-proof', 'simulator', 'form', 'faq'],
    defaultThemeMode: 'dark',
    theme: {
      bgPrimary: '#161110',
      bgSecondary: '#1E1614',
      cardBg: '#251B19',
      cardBorder: 'rgba(224, 159, 125, 0.28)',
      accentPrimary: '#E09F7D',
      accentSecondary: '#F3C6B0',
      accentGradient: 'linear-gradient(45deg, #D48862, #F3C6B0)',
      buttonTextColor: '#161110',
      textPrimary: '#FDF8F5',
      textSecondary: '#E3D5CE',
      painBorderColor: '#EF5350',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(224, 159, 125, 0.16) 0%, rgba(22, 17, 16, 1) 65%)',
      borderRadius: '14px',
    },
    lightTheme: {
      bgPrimary: '#FAF6F3',
      bgSecondary: '#F3ECE7',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(180, 101, 67, 0.22)',
      accentPrimary: '#B4532A',
      accentSecondary: '#D48862',
      accentText: '#9A4524',
      accentGradient: 'linear-gradient(45deg, #9A4524, #B4532A)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#1F1614',
      textSecondary: '#4A3833',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(212, 136, 98, 0.14) 0%, rgba(250, 246, 243, 1) 65%)',
      borderRadius: '14px',
    },
    hero: {
      preHeadline: '💇‍♀️ Para Salões de Beleza, Hair Stylists & Espaços Multiprofissionais',
      headlineMain: 'Todas as Cadeiras do Seu Salão Ocupadas com',
      headlineHighlight: 'Recepção de IA 24/7 no WhatsApp.',
      subHeadline: 'Chega de recepção sobrecarregada na sexta-feira ou clientes desistindo de agendar mechas, corte e escova pela demora no WhatsApp. Nossa IA qualifica o serviço, organiza múltiplos profissionais e confirma cada horário automaticamente.',
      primaryCta: 'Simular Faturamento do Salão →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Saloes da Domino Automate e quero entender como funciona a Recepção de IA 24/7 e Automação de Agenda para Salões de Beleza!',
      metrics: [
        { value: '< 5 seg', label: 'Tempo de resposta no WhatsApp 24/7' },
        { value: 'Multi-Agenda', label: 'Triagem por cabeleireiro, colorista e manicure' },
        { value: '30/45 dias', label: 'Ciclo automático de retoque de raiz e corte' },
      ],
      visualCard: {
        tag: 'Orquestração Multiprofissional • n8n + IA',
        title: 'Triagem de Cabelo, Unhas, Make e Pacotes de Noiva/Festa',
        subtitle: 'A IA entende o tempo de cada procedimento e direciona para o profissional certo.',
        bullets: [
          'Triagem prévia para avaliação de mechas, progressiva e coloração',
          'Venda cruzada automática (ex: agendou corte → oferece hidratação ou pé e mão)',
          'Alerta automático de retorno a cada 30/45 dias para retoque de raiz e tratamento',
        ],
      },
    },
    pas: {
      sectionTag: 'Os Gargalos que Drenam o Lucro do Salão',
      headlineMain: 'Por Que Seu Salão Tem Movimento na Sexta, Mas',
      headlineHighlight: 'Perde Faturamento de Terça a Quinta?',
      pains: [
        {
          icon: '📱',
          title: 'Recepção Sufocada no WhatsApp e Presencial',
          desc: 'Quem está no balcão cobrando cliente e atendendo telefone não consegue responder 40 mensagens no WhatsApp com agilidade. O resultado? A cliente fecha com o salão concorrente.',
        },
        {
          icon: '🪑',
          title: 'Cadeiras Vazias em Horários Nobres',
          desc: 'Uma cliente que desmarca mechas ou química em cima da hora deixa uma cadeira parada por 4 horas. Sem confirmação antecipada e lista de espera automática, o prejuízo é certo.',
        },
        {
          icon: '💸',
          title: 'Falta de Up-Sell e Retorno Programado',
          desc: 'A cliente faz escova ou corte e vai embora sem que ninguém a lembre de voltar em 30 dias para hidratação ou retoque de cor. O salão vive correndo atrás de clientes novas.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Arquitetura Domino Automate para Salões',
      headlineMain: 'Tecnologia de Alto Padrão para',
      headlineHighlight: 'Gestão e Vendas no Salão',
      items: [
        {
          badge: 'PILAR 01 • RECEPÇÃO IA 24/7',
          icon: '🤖',
          title: 'Concierge de IA no WhatsApp e Instagram',
          desc: 'Responde clientes em 5 segundos a qualquer hora, explica pacotes de mechas, tratamentos capilares, manicure e maquiagem, e já encaminha o agendamento com o profissional ideal.',
          result: 'Zero clientes sem resposta e aumento consistente de agendamentos',
        },
        {
          badge: 'PILAR 02 • AUTOMAÇÃO N8N',
          icon: '🔄',
          title: 'Confirmação Ativa & Reativação de Retoque',
          desc: 'Dispara confirmações 24h antes, preenche desistências com fila de espera inteligente e chama clientes automaticamente quando vence o ciclo de retoque de raiz, corte ou unhas.',
          result: 'Terça a sábado com agenda previsível e retenção ativa',
        },
        {
          badge: 'PILAR 03 • VITRINE DE LUXO',
          icon: '✨',
          title: 'Landing Page de Conversão para Tráfego Pago',
          desc: 'Página exclusiva do seu salão destacando transformações (loiros, morena iluminada, cortes), pacotes promocionais da semana e botão direto para o WhatsApp com rastreamento de anúncios.',
          result: 'Posicionamento premium que atrai clientes de maior ticket médio',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Fluxo em Tempo Real',
      headlineMain: 'Veja Como Nossa Arquitetura Opera no',
      headlineHighlight: 'WhatsApp do Seu Salão',
      disclaimer: 'Demonstração técnica ilustrativa do fluxo de atendimento automatizado para Salões de Beleza.',
      whatsappDemo: {
        agentName: 'Concierge IA • Hair Studio (Demonstração)',
        statusText: 'Online 24/7 • Resposta em 3s',
        messages: [
          { sender: 'client', text: 'Oi! Queria saber valor de mechas e se tem horário pra sábado de manhã.', time: '21:42' },
          { sender: 'ai', text: 'Olá! Seja muito bem-vinda ✨ Para mechas personalizadas, fazemos uma rápida avaliação do seu fio atual. Você poderia me enviar uma foto do seu cabelo sob luz natural e me contar se fez alguma química nos últimos 12 meses?', time: '21:42' },
          { sender: 'client', text: 'Mandei a foto! Só fiz tonalizante há 8 meses.', time: '21:44' },
          { sender: 'ai', text: 'Perfeito! Seu cabelo está ótimo para o protocolo de Mechas + Tratamento Reconstrutor. Temos vaga neste sábado às 09h00 com nossa especialista em loiros. Posso reservar esse horário e já incluir pé e mão no pacote?', time: '21:44' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Recepção Manual Tradicional',
        beforeItems: [
          'Mensagens enviadas à noite ou no domingo só são respondidas na terça-feira',
          'Desistências de mechas deixam a cadeira vazia por 4 horas sem encaixe rápido',
          'Clientes esquecem de agendar o retoque de raiz após 45 dias',
        ],
        afterTitle: 'Salão Orquestrado com Domino (IA + n8n)',
        afterItems: [
          'Triagem capilar imediata 24/7 com coleta de foto e histórico químico',
          'Confirmação automática 24h antes e convocação imediata da fila de espera',
          'Disparo automático de manutenção aos 35/45 dias direto no WhatsApp da cliente',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Gatilho Omnichannel', tech: 'WhatsApp API / Instagram', desc: 'Cliente envia mensagem ou áudio fora do horário comercial.' },
        { step: '02', title: 'Triagem Técnica Capilar', tech: 'Gemini 2.5 Flash', desc: 'Identifica procedimento (corte, mechas, unhas) e coleta pré-requisitos.' },
        { step: '03', title: 'Orquestração de Cadeiras', tech: 'n8n Workflow', desc: 'Cruza disponibilidade do profissional específico e sugere up-sell.' },
        { step: '04', title: 'Blindagem & Recorrência', tech: 'PostgreSQL + Cron n8n', desc: 'Envia lembrete anti-falta e programa o retorno de manutenção.' },
      ],
    },
    simulator: {
      economicModelType: 'saloes-ocupacao-cancelamentos',
      sectionTag: 'Simulador Econômico • Ocupação & Cancelamentos',
      headlineMain: 'Calcule o Potencial de Faturamento Incremental do',
      headlineHighlight: 'Seu Salão Todos os Meses',
      subtitle: 'Compare 3 cenários (Conservador, Referência e Otimista) com memória de cálculo transparente:',
      slider1: { label: 'Contatos de clientes por mês no WhatsApp', unit: 'contatos/mês', min: 80, max: 1200, step: 20, defaultValue: 300 },
      slider2: { label: 'Ticket Médio por atendimento (Corte/Cor/Unhas)', unit: 'R$', min: 80, max: 800, step: 20, defaultValue: 220 },
      slider3: { label: 'Desmarcações / Cadeiras vazias por semana', unit: 'horários/sem', min: 2, max: 25, step: 1, defaultValue: 6 },
      resultLabel: 'Impacto Econômico Mensal Projetado',
      conversionRate1: 0.14,
      recoveryRate3: 0.50,
      defaultMarginPct: 60,
      hourlyOperationalValue: 40,
      weeklyHoursSavedBase: 8,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'novos agendamentos/mês via resposta imediata',
      metric3Suffix: 'horários ociosos recuperados/mês',
    },
    form: {
      sectionTag: 'Diagnóstico Personalizado • Salões de Beleza',
      headlineMain: 'Automatize a Recepção e Agenda do',
      headlineHighlight: 'Seu Salão de Beleza',
      subtitle: 'Informe a estrutura do seu salão abaixo. Nossa automação N8N preparará seu diagnóstico imediatamente.',
      orgLabel: 'Nome do Salão / Hair Studio',
      orgPlaceholder: 'Ex: Studio Belle Hair (@instagram)',
      subTypes: [
        'Salão de Beleza Completo (Cabelo, Unhas, Make)',
        'Hair Studio Especializado em Loiros / Mechas / Cor',
        'Salão Especializado em Cachos / Terapia Capilar',
        'Esmalteria & Beleza Express',
        'Salão de Noivas & Produções de Eventos',
      ],
      painsList: [
        'Recepção não dá conta de responder o WhatsApp rápido',
        'Muitas faltas e desmarcações em cima da hora',
        'Baixo movimento de terça a quinta-feira',
        'Falta de lembrete automático para retorno de retoque/manutenção',
        'Dificuldade em organizar agenda de vários profissionais',
        'Preciso de uma página profissional para anúncios no Instagram',
      ],
      demandLabel: 'Ecossistema IA + N8N + Agenda para Salão de Beleza',
    },
    faqs: [
      {
        q: 'A IA consegue lidar com serviços que exigem avaliação prévia, como mechas e alisamentos?',
        a: 'Sim! Configuramos a IA para solicitar foto do cabelo atual e histórico químico da cliente pelo próprio WhatsApp, já adiantando toda a triagem para o cabeleireiro antes mesmo de ela sentar na cadeira.',
      },
      {
        q: 'Como funciona para salões que têm vários profissionais (cabeleireiros, manicures, maquiadores)?',
        a: 'O fluxo em n8n identifica qual serviço ou profissional a cliente deseja e direciona o agendamento ou notifica o responsável sem confusão de horários.',
      },
      {
        q: 'Posso usar para criar campanhas nos dias mais fracos (terça e quarta)?',
        a: 'Com certeza! Criamos disparos inteligentes de reativação para sua base de clientes oferecendo combos especiais de hidratação, escova ou pé e mão para lotar os dias de menor movimento.',
      },
      {
        q: 'A recepcionista humana do meu salão perde o controle das conversas?',
        a: 'De forma alguma. A IA faz o trabalho pesado de responder em segundos, tirar dúvidas de preços e agendar 24/7, e sua recepcionista pode assumir a conversa no WhatsApp a qualquer momento com um clique.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultora IA',
      welcomeBubbleHighlight: 'para Salões 💇‍♀️',
      headerTitle: 'Consultora IA • Salões de Beleza',
      initialMessage: 'Olá! 💇‍♀️ Sou a consultora de IA da Domino Automate para Salões de Beleza e Hair Studios. Ajudo você a lotar suas cadeiras de terça a sábado, automatizar orçamentos de mechas/procedimentos no WhatsApp 24/7 e zerar os furos na agenda. Quantos profissionais atendem hoje no seu salão?',
      collectNamePrompt: 'Maravilha! Para eu gerar seu plano personalizado, qual é o seu nome e o nome do seu Salão?',
      successMessage: 'Tudo pronto! ✨ Registrei os dados do seu salão na nossa automação N8N e nossa equipe vai te chamar com o diagnóstico completo!',
    },
  },

  barbearias: {
    key: 'barbearias',
    slug: '/Barbearias',
    headerBadge: '💈 Vertical Barbearias & Clubes Masculinos',
    icon: '💈',
    metaTitle: 'Domino Automate | Agendamento IA 24/7 no WhatsApp & Clube de Recorrência para Barbearias',
    metaDescription: 'Automatize 100% da marcação de cortes e barba pelo WhatsApp 24/7, reduza faltas e aumente a frequência quinzenal dos clientes da sua barbearia com IA e n8n.',
    layoutStrategy: 'roi-first',
    sectionOrder: ['simulator', 'technical-proof', 'pas', 'pillars', 'form', 'faq'],
    defaultThemeMode: 'dark',
    theme: {
      bgPrimary: '#0E0D0B',
      bgSecondary: '#161411',
      cardBg: '#1E1B16',
      cardBorder: 'rgba(217, 119, 6, 0.32)',
      accentPrimary: '#F59E0B',
      accentSecondary: '#FBBF24',
      accentGradient: 'linear-gradient(45deg, #D97706, #FBBF24)',
      buttonTextColor: '#0E0D0B',
      textPrimary: '#F9F6F0',
      textSecondary: '#D6CFC2',
      painBorderColor: '#EF4444',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.16) 0%, rgba(14, 13, 11, 1) 65%)',
      borderRadius: '6px',
    },
    lightTheme: {
      bgPrimary: '#FAF8F5',
      bgSecondary: '#F2ECE1',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(180, 83, 9, 0.25)',
      accentPrimary: '#B45309',
      accentSecondary: '#D97706',
      accentText: '#9A4507',
      accentGradient: 'linear-gradient(45deg, #9A4507, #B45309)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#171411',
      textSecondary: '#4B443B',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.14) 0%, rgba(250, 248, 245, 1) 65%)',
      borderRadius: '6px',
    },
    hero: {
      preHeadline: '💈 Para Barbearias Modernas, Redes & Clubes de Assinatura',
      headlineMain: 'Agendamento Instantâneo no WhatsApp Sem',
      headlineHighlight: 'Tirar a Navalha da Mão.',
      subHeadline: 'Homem não gosta de baixar aplicativo nem preencher cadastro longo para cortar o cabelo. Com nossa IA no WhatsApp, seu cliente escolhe o barbeiro, vê os horários livres e agenda corte + barba em 15 segundos, 24 horas por dia.',
      primaryCta: 'Simular Ganho na Bancada →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Fala, equipe Domino! Vim pela página /Barbearias e quero ver como funciona o Agendamento Automático por IA no WhatsApp para minha barbearia!',
      metrics: [
        { value: '15 seg', label: 'Para o cliente agendar pelo WhatsApp' },
        { value: 'Zero Apps', label: 'Sem obrigar o cliente a baixar aplicativo' },
        { value: '15 em 15d', label: 'Lembrete automático de retorno e Clube VIP' },
      ],
      visualCard: {
        tag: 'Autoatendimento Masculino Direto ao Ponto',
        title: 'Do "Tem Horário Hoje?" ao Agendamento Confirmado',
        subtitle: 'Sem links complicados: conversa direta e natural no próprio WhatsApp.',
        bullets: [
          'Consulta de horários em tempo real por barbeiro e unidade',
          'Lembrete automático 2h antes do corte (fim do "esqueci de ir")',
          'Convite automático a cada 15 dias: "Bora alinhar o degradê e a barba?"',
        ],
      },
    },
    pas: {
      sectionTag: 'A Realidade nas Cadeiras da Barbearia',
      headlineMain: 'Quantos Cortes Você Perde Porque o Cliente',
      headlineHighlight: 'Odeia Link de Agendamento Complicado?',
      pains: [
        {
          icon: '✂️',
          title: 'Barbeiro Parando o Corte para Responder Zap',
          desc: 'Ou você interrompe o degradê do cliente na cadeira para olhar o celular, ou demora 1 hora para responder e o cara corta na barbearia da esquina.',
        },
        {
          icon: '📲',
          title: 'Clientes que Ignoram Links de Aplicativos',
          desc: 'Sistemas tradicionais mandam um link frio que exige login e senha. A maioria dos clientes fecha a tela ou manda áudio perguntando "quais horários tem hoje?".',
        },
        {
          icon: '📅',
          title: 'Cliente que Corta de 40 em 40 Dias (Em Vez de 15)',
          desc: 'Sem uma automação que chame o cliente no WhatsApp após 14 ou 20 dias do último corte, ele adia a vinda e você perde metade do faturamento anual daquele cliente.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Engenharia Domino para Barbearias de Elite',
      headlineMain: 'Máquina de Agendamento e Fidelização',
      headlineHighlight: '100% no Automático',
      items: [
        {
          badge: 'PILAR 01 • IA NO WHATSAPP 24/7',
          icon: '💈',
          title: 'Atendente IA que Fala a Língua da Sua Barbearia',
          desc: 'Entende áudios e textos, informa valores de corte, barba, pigmentação, selagem e planos de assinatura (Clube VIP), e fecha o horário na hora.',
          result: 'Economia com recepção e atendimento imediato 24h',
        },
        {
          badge: 'PILAR 02 • MOTOR DE RECORRÊNCIA N8N',
          icon: '⚡',
          title: 'Ciclo Quinzenal & Anti-Furo Automático',
          desc: 'Confirma o comparecimento horas antes do corte e dispara uma mensagem personalizada 15 dias depois sugerindo os melhores horários da semana para manter o visual em dia.',
          result: 'Aumento consistente no LTV (valor gasto por cliente no ano)',
        },
        {
          badge: 'PILAR 03 • PÁGINA DE ALTA CONVERSÃO',
          icon: '🏆',
          title: 'Landing Page Imponente + Captação de Assinantes',
          desc: 'Site rápido e masculino para colocar na bio do Instagram e rodar anúncios locais, destacando o ambiente da barbearia, o Clube de Assinatura e botão direto para o WhatsApp.',
          result: 'Mais clientes novos toda semana vindos do Instagram e Google',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Agendamento sem App',
      headlineMain: 'Veja Como Seu Cliente Agenda em',
      headlineHighlight: '15 Segundos pelo WhatsApp',
      disclaimer: 'Demonstração técnica ilustrativa do fluxo de agendamento para Barbearias.',
      whatsappDemo: {
        agentName: 'Recepção IA • Barber Club (Demonstração)',
        statusText: 'Online 24/7 • Áudio & Texto',
        messages: [
          { sender: 'client', text: 'Fala irmão, tem horário pro Lucas hoje depois das 18h pra corte e barba?', time: '14:10' },
          { sender: 'ai', text: 'Fala campeão! 💈 Com o barbeiro Lucas hoje tenho livre às 18h30 ou às 19h15 para o Combo Corte + Barboterapia (R$ 90). Qual fica melhor pra você?', time: '14:10' },
          { sender: 'client', text: 'Fecha 18h30!', time: '14:11' },
          { sender: 'ai', text: 'Agendado! Hoje às 18h30 com o Lucas. Te mando um lembrete 2h antes. Ah: com o nosso Clube VIP (R$ 149/mês) você corta quantas vezes quiser no mês. Quer testar hoje?', time: '14:11' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Link de App Tradicional / Manual',
        beforeItems: [
          'Cliente desiste ao ter que baixar app ou criar senha',
          'Barbeiro atrasa o corte na cadeira para responder mensagens',
          'Cliente demora 35 a 45 dias para lembrar de voltar',
        ],
        afterTitle: 'Barbearia Automatizada Domino (IA + n8n)',
        afterItems: [
          'Agendamento natural por texto ou áudio direto no WhatsApp',
          'Oferta automática do Clube de Assinatura para clientes frequentes',
          'Recall automático no 15º dia aumentando a frequência de visitas',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Mensagem ou Áudio', tech: 'WhatsApp Business', desc: 'Cliente pede horário de forma rápida sem abrir links externos.' },
        { step: '02', title: 'Consulta de Bancada', tech: 'Gemini 2.5 + n8n', desc: 'Verifica agenda do barbeiro escolhido e apresenta 2 opções diretas.' },
        { step: '03', title: 'Confirmação 2h Antes', tech: 'Automação Anti-Furo', desc: 'Se o cliente imprevisto cancelar, libera a vaga na hora para encaixe.' },
        { step: '04', title: 'Recall de 15 Dias', tech: 'Motor de LTV', desc: 'Convida o cliente automaticamente após 2 semanas do último corte.' },
      ],
    },
    simulator: {
      economicModelType: 'barbearias-recorrencia-agenda',
      sectionTag: 'Simulador de Bancada & Recorrência',
      headlineMain: 'Descubra Quanto Sua Barbearia Pode',
      headlineHighlight: 'Faturar a Mais Todos os Meses',
      subtitle: 'Simule o impacto de atender no WhatsApp em segundos e reduzir os horários vagos:',
      slider1: { label: 'Pedidos de horário no WhatsApp por mês', unit: 'pedidos/mês', min: 100, max: 1500, step: 25, defaultValue: 350 },
      slider2: { label: 'Ticket Médio (Corte / Combo Corte + Barba)', unit: 'R$', min: 40, max: 250, step: 10, defaultValue: 80 },
      slider3: { label: 'Furos / Faltas na bancada por semana', unit: 'horários/sem', min: 2, max: 30, step: 1, defaultValue: 7 },
      resultLabel: 'Impacto Mensal Estimado na Barbearia',
      conversionRate1: 0.16,
      recoveryRate3: 0.55,
      defaultMarginPct: 70,
      hourlyOperationalValue: 35,
      weeklyHoursSavedBase: 7,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'cortes/combos extras agendados no mês',
      metric3Suffix: 'furos de bancada recuperados no mês',
    },
    form: {
      sectionTag: 'Implementação Rápida • Barbearias',
      headlineMain: 'Coloque Sua Barbearia no',
      headlineHighlight: 'Piloto Automático',
      subtitle: 'Preencha os dados da sua barbearia abaixo para receber nossa proposta e demonstração no WhatsApp.',
      orgLabel: 'Nome da Barbearia',
      orgPlaceholder: 'Ex: Don Barber Club (@instagram)',
      subTypes: [
        'Barbearia Individual (1 a 2 cadeiras)',
        'Barbearia Equipe (3 a 6 barbeiros)',
        'Barbearia Grande Porte / Conceito (+7 barbeiros)',
        'Barbearia com Foco em Clube de Assinatura',
        'Rede / Franquia de Barbearias',
      ],
      painsList: [
        'Perder tempo parando o corte para responder WhatsApp',
        'Clientes que não gostam de agendar por link/aplicativo',
        'Faltas e atrasos que travam a bancada no fim de semana',
        'Clientes demorando mais de 30 dias para voltar a cortar',
        'Quero vender mais planos do Clube de Assinatura',
        'Preciso de uma página profissional para atrair clientes novos',
      ],
      demandLabel: 'Automação WhatsApp IA + N8N para Barbearia',
    },
    faqs: [
      {
        q: 'O cliente precisa clicar em link externo ou baixar app para agendar?',
        a: 'Não! Todo o atendimento e escolha de horário pode acontecer direto na conversa do WhatsApp com a IA, do jeito que o cliente mais gosta.',
      },
      {
        q: 'E se o cliente mandar áudio no WhatsApp pedindo horário?',
        a: 'Nossa arquitetura processa mensagens de texto e voz naturais, compreende qual barbeiro e horário ele quer e já responde confirmando.',
      },
      {
        q: 'Como a automação ajuda a vender o Clube de Assinatura da barbearia?',
        a: 'Sempre que um cliente agenda corte avulso com frequência, a IA apresenta a vantagem financeira do seu Clube Mensal e já envia o link de adesão.',
      },
      {
        q: 'Quanto tempo leva para colocar no ar na minha barbearia?',
        a: 'Entregamos a página, os fluxos n8n e o agente de IA configurados com a tabela de preços e horários dos seus barbeiros em poucos dias.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'para Barbearias 💈',
      headerTitle: 'Consultor IA • Barbearias',
      initialMessage: 'Fala, parceiro! 💈 Sou o consultor de IA da Domino Automate para Barbearias. Ajudo você a automatizar 100% dos agendamentos no WhatsApp 24/7 (sem aplicativo chato), cortar os furos na bancada e fazer a rapaziada voltar a cada 15 dias. Quantas cadeiras/barbeiros você tem hoje?',
      collectNamePrompt: 'Show de bola! Para eu montar o plano da sua barbearia, qual é o seu nome e o nome da Barbearia?',
      successMessage: 'Fechado! 💈 Já disparei os dados da sua barbearia na nossa esteira N8N e nosso especialista vai te chamar no WhatsApp!',
    },
  },

  advocacia: {
    key: 'advocacia',
    slug: '/Advocacia',
    headerBadge: '⚖️ Vertical Escritórios de Advocacia & Jurídico',
    icon: '⚖️',
    metaTitle: 'Domino Automate | Triagem Jurídica por IA 24/7, Automação n8n e Captação Ética para Advocacia',
    metaDescription: 'Qualifique clientes no WhatsApp 24/7 com Agentes de IA Jurídica, automatize a coleta de documentos e o atendimento processual em conformidade com o Provimento 205/2021 da OAB e LGPD.',
    layoutStrategy: 'authority-first',
    sectionOrder: ['pillars', 'technical-proof', 'pas', 'simulator', 'form', 'faq'],
    defaultThemeMode: 'dark',
    theme: {
      bgPrimary: '#0B0F17',
      bgSecondary: '#111824',
      cardBg: '#172030',
      cardBorder: 'rgba(197, 160, 89, 0.3)',
      accentPrimary: '#C5A059',
      accentSecondary: '#DFC184',
      accentGradient: 'linear-gradient(45deg, #B38B40, #DFC184)',
      buttonTextColor: '#0B0F17',
      textPrimary: '#F4F6FA',
      textSecondary: '#C8D1E0',
      painBorderColor: '#E57373',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(197, 160, 89, 0.14) 0%, rgba(11, 15, 23, 1) 65%)',
      borderRadius: '4px',
    },
    lightTheme: {
      bgPrimary: '#F8FAFC',
      bgSecondary: '#EFF3F8',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(148, 113, 44, 0.25)',
      accentPrimary: '#8E6A24',
      accentSecondary: '#B38B40',
      accentText: '#7A5A1C',
      accentGradient: 'linear-gradient(45deg, #7A5A1C, #8E6A24)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(197, 160, 89, 0.12) 0%, rgba(248, 250, 252, 1) 65%)',
      borderRadius: '4px',
    },
    hero: {
      preHeadline: '⚖️ Para Escritórios de Advocacia, Bancas Especializadas & Departamentos Jurídicos',
      headlineMain: 'Triagem Jurídica Preliminar 24/7 e',
      headlineHighlight: 'Automação de Fluxos com Rigor Ético.',
      subHeadline: 'Advogados sêniores não devem perder horas em triagens improdutivas ou respondendo "como está meu processo?" no WhatsApp. Implementamos Agentes de IA Privada e esteiras em n8n que qualificam a viabilidade da tese, coletam documentos iniciais e agendam reuniões apenas com casos qualificados.',
      primaryCta: 'Solicitar Diagnóstico para Meu Escritório →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Advocacia da Domino Automate e gostaria de conhecer as soluções de Triagem Jurídica com IA e Automação para nosso escritório.',
      metrics: [
        { value: '< 10s', label: 'Acolhimento inicial do constituinte 24/7' },
        { value: 'LGPD', label: 'Sigilo e proteção de dados jurídicos' },
        { value: 'OAB', label: 'Aderente ao Provimento 205/2021' },
      ],
      visualCard: {
        tag: 'Inteligência Jurídica & Sigilo Profissional',
        title: 'Qualificação de Teses, Coleta Documental e Onboarding',
        subtitle: 'Do primeiro contato no WhatsApp até a pasta pronta no software jurídico.',
        bullets: [
          'Entrevista estruturada por área (Trabalhista, Previdenciário, Cível, Tributário, Família)',
          'Checklist automatizado de documentos (RG, comprovante, CNIS, CTPS, contratos) via WhatsApp',
          'Atendimento informativo de andamento processual sem interromper a produção de peças',
        ],
      },
    },
    pas: {
      sectionTag: 'Os Gargalos Operacionais na Advocacia Moderna',
      headlineMain: 'Quanto Custa a Hora Técnica de um Advogado Gasta em',
      headlineHighlight: 'Triagem Manual e Cobrança de Documentos?',
      pains: [
        {
          icon: '⏱️',
          title: 'Perda de Constituintes por Demora no Primeiro Contato',
          desc: 'Quem busca um advogado por urgência trabalhista, previdenciária, familiar ou empresarial entra em contato com 3 escritórios. O primeiro que acolhe com clareza e agenda a consulta leva o contrato.',
        },
        {
          icon: '📂',
          title: 'Horas de Advogados Drenadas com Curiosos e Casos Inviáveis',
          desc: 'Sem um filtro prévio inteligente, os sócios passam horas em ligações com demandas prescritas, sem provas mínimas ou fora da área de atuação da banca.',
        },
        {
          icon: '📑',
          title: 'Lentidão para Receber Documentos e Assinar Procuração',
          desc: 'O cliente fecha a consulta, mas demora semanas para enviar PDFs legíveis, comprovantes e assinar o contrato de honorários, atrasando o ajuizamento da ação.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Arquitetura Domino Automate para Bancas Jurídicas',
      headlineMain: 'Eficiência Processual, Captação Ética e',
      headlineHighlight: 'Governança de Dados (LGPD)',
      items: [
        {
          badge: 'PILAR 01 • TRIAGEM JURÍDICA IA 24/7',
          icon: '⚖️',
          title: 'Agente de Triagem e Qualificação de Demandas',
          desc: 'Conduz a entrevista preliminar no WhatsApp com linguagem sóbria e acolhedora, identifica a área do direito, verifica requisitos básicos da tese e agenda a consulta com o resumo pronto para o advogado.',
          result: 'Reuniões apenas com potenciais constituintes qualificados',
        },
        {
          badge: 'PILAR 02 • ORQUESTRAÇÃO N8N & PYTHON',
          icon: '🔒',
          title: 'Coleta Documental, Procuração & Follow-up',
          desc: 'Automatiza o pedido e validação de documentos pendentes no WhatsApp, envia link de assinatura digital de procuração/contrato e organiza os arquivos na nuvem do escritório.',
          result: 'Redução drástica no tempo entre a triagem e o protocolo da inicial',
        },
        {
          badge: 'PILAR 03 • PRESENÇA INSTITUCIONAL OAB',
          icon: '🏛️',
          title: 'Landing Pages Jurídicas de Alta Autoridade',
          desc: 'Páginas institucionais e por tese jurídica desenvolvidas em estrita observância ao Provimento 205/2021 da OAB, com foco em conteúdo informativo, autoridade técnica e conversão no WhatsApp.',
          result: 'Posicionamento ético e previsibilidade na entrada de novos casos',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Triagem Jurídica Ética',
      headlineMain: 'Como a IA Conduz a Entrevista Preliminar',
      headlineHighlight: 'Sem Emitir Juízo de Valor Indevido',
      disclaimer: 'Demonstração técnica ilustrativa de fluxo de recepção jurídica (compatível com Provimento 205/2021 OAB e LGPD).',
      whatsappDemo: {
        agentName: 'Secretaria Jurídica Digital (Demonstração)',
        statusText: 'Atendimento Institucional 24/7 • Sigilo LGPD',
        messages: [
          { sender: 'client', text: 'Boa noite. Fui desligado da empresa há 4 meses e não recebi as horas extras dos últimos 3 anos. Vocês atuam nessa área?', time: '20:15' },
          { sender: 'ai', text: 'Boa noite! Agradecemos o contato com nosso escritório. Sim, nossa equipe Trabalhista analisa demandas de jornada e verbas rescisórias. Para prepararmos o resumo preliminar para o advogado especialista, qual era sua função e o regime de controle de ponto?', time: '20:15' },
          { sender: 'client', text: 'Era supervisor comercial, batia ponto eletrônico mas fazia reuniões externas depois das 19h.', time: '20:17' },
          { sender: 'ai', text: 'Compreendido. Como o desligamento ocorreu há 4 meses, sua demanda está dentro do prazo bienal. Podemos agendar uma reunião técnica (online ou presencial) amanhã às 14h30 com o Dr. titular da área Trabalhista?', time: '20:17' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Atendimento Jurídico Não Automatizado',
        beforeItems: [
          'Sócio interrompe redação de recurso para atender triagens improdutivas',
          'Constituinte demora 15 dias para entregar documentos básicos da inicial',
          'Secretaria sobrecarregada respondendo dúvidas repetitivas de andamento',
        ],
        afterTitle: 'Escritório com Arquitetura Domino (IA + n8n)',
        afterItems: [
          'Ficha de triagem estruturada entregue pronta antes da reunião com o advogado',
          'Checklist automático de documentos via WhatsApp com organização em nuvem',
          'Conformidade integral com o Provimento 205/2021 da OAB e LGPD',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Acolhimento Institucional', tech: 'WhatsApp Oficial', desc: 'Atendimento imediato com aviso de privacidade LGPD.' },
        { step: '02', title: 'Filtro de Viabilidade & Prescrição', tech: 'Agente IA Privado', desc: 'Coleta fatos objetivos sem dar parecer jurídico definitivo.' },
        { step: '03', title: 'Checklist Documental', tech: 'Fluxo n8n + Drive/CRM', desc: 'Solicita documentos da tese e envia minuta de procuração.' },
        { step: '04', title: 'Dossiê para o Advogado', tech: 'Resumo Executivo', desc: 'Advogado recebe o caso resumido com horário agendado.' },
      ],
    },
    simulator: {
      economicModelType: 'advocacia-triagem-produtividade',
      sectionTag: 'Simulador de Eficiência Jurídica & Honorários',
      headlineMain: 'Estime o Impacto da Triagem e Automação por IA na',
      headlineHighlight: 'Rentabilidade da Sua Banca',
      subtitle: 'Simule a conversão de consultas qualificadas e a economia de horas técnicas de advogados:',
      slider1: { label: 'Contatos / Leads jurídicos recebidos por mês', unit: 'contatos/mês', min: 15, max: 300, step: 15, defaultValue: 60 },
      slider2: { label: 'Honorários Médios Iniciais por contrato fechado', unit: 'R$', min: 1500, max: 20000, step: 500, defaultValue: 4000 },
      slider3: { label: 'Consultas perdidas por demora no atendimento por semana', unit: 'casos/sem', min: 1, max: 15, step: 1, defaultValue: 2 },
      resultLabel: 'Impacto Econômico Estimado na Banca / Mês',
      conversionRate1: 0.08,
      recoveryRate3: 0.35,
      defaultMarginPct: 75,
      hourlyOperationalValue: 180,
      weeklyHoursSavedBase: 10,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'novos contratos qualificados/mês',
      metric3Suffix: 'oportunidades jurídicas recuperadas/mês',
    },
    form: {
      sectionTag: 'Diagnóstico de Automação Jurídica',
      headlineMain: 'Eleve a Eficiência e o Atendimento do',
      headlineHighlight: 'Seu Escritório de Advocacia',
      subtitle: 'Informe as áreas de atuação e os gargalos da sua banca para receber nosso plano de arquitetura jurídica.',
      orgLabel: 'Nome do Escritório / Sociedade de Advogados',
      orgPlaceholder: 'Ex: Silva & Associados Advocacia',
      subTypes: [
        'Advocacia Previdenciária & Trabalhista',
        'Advocacia Cível, Consumidor & Família',
        'Advocacia Empresarial, Tributária & Societária',
        'Advocacia Bancária, Imobiliária & Contratos',
        'Escritório Full-Service / Multidisciplinar',
      ],
      painsList: [
        'Demora no primeiro atendimento de leads vindos do Google/Indicação',
        'Advogados perdendo muito tempo com triagem de casos inviáveis',
        'Dificuldade e atraso para o cliente enviar documentos completos',
        'Excesso de mensagens de clientes perguntando andamento de processo',
        'Necessidade de Landing Page ética (OAB) para captação de teses',
        'Integração entre WhatsApp, planilha/CRM e pastas de clientes',
      ],
      demandLabel: 'Triagem IA + Automação N8N para Escritório de Advocacia',
    },
    faqs: [
      {
        q: 'O uso de IA na triagem e as Landing Pages respeitam o Provimento 205/2021 da OAB?',
        a: 'Absolutamente. Toda a comunicação é configurada com caráter informativo, sóbrio e consultivo, vedando qualquer mercantilização ou promessa de resultado, servindo como recepção técnica qualificada do escritório.',
      },
      {
        q: 'Como fica o sigilo profissional e a proteção de dados (LGPD) dos clientes?',
        a: 'Utilizamos APIs corporativas privadas onde nenhuma informação enviada pelo constituinte é compartilhada ou usada para treinamento de modelos públicos, além de orientar o não envio de documentos sensíveis antes da formalização.',
      },
      {
        q: 'A IA dá parecer jurídico definitivo ao cliente?',
        a: 'Não. A IA é instruída com guardrails rigorosos para realizar apenas o acolhimento empático, levantar os fatos objetivos e agendar a análise técnica com o advogado responsável.',
      },
      {
        q: 'Caso nosso escritório também precise de Cálculos Atuariais ou Perícia Judicial, vocês atendem?',
        a: 'Sim! A Domino Automate conta com a vertical exclusiva /Atuaria liderada por Demian Lisboa Pereira (Atuário MIBA 1807 e Ex-Perito TRT10/TJDFT) para assistência técnica e cálculos complexos.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'Jurídico & Legal ⚖️',
      headerTitle: 'Consultor IA • Automação para Advocacia',
      initialMessage: 'Olá, Doutor(a)! ⚖️ Sou o consultor da vertical de Advocacia da Domino Automate. Auxilio escritórios a automatizarem a triagem preliminar 24/7 no WhatsApp, a coleta de documentos de clientes e a captação ética (Provimento 205/2021 OAB) com IA privada e LGPD. Qual é a principal área de atuação da sua banca hoje?',
      collectNamePrompt: 'Perfeito, Doutor(a)! Para prepararmos o diagnóstico do seu escritório, qual é o seu nome e o nome da Sociedade/Escritório?',
      successMessage: 'Registrado com sucesso! ⚖️ Nossa equipe de engenharia jurídica já recebeu os dados via N8N e entrará em contato.',
    },
  },

  contabilidade: {
    key: 'contabilidade',
    slug: '/Contabilidade',
    headerBadge: '📊 Vertical Escritórios de Contabilidade & BPO',
    icon: '📊',
    metaTitle: 'Domino Automate | Automação de Coleta Fiscal, Atendimento IA e BPO para Escritórios de Contabilidade',
    metaDescription: 'Pare de cobrar extratos e notas fiscais manualmente todo mês. Automatize a rotina de fechamento contábil, envio de guias (DAS/DARF/FGTS) e captação de empresas com IA, Python e n8n.',
    layoutStrategy: 'roi-first',
    sectionOrder: ['simulator', 'pillars', 'technical-proof', 'pas', 'form', 'faq'],
    defaultThemeMode: 'light',
    theme: {
      bgPrimary: '#091310',
      bgSecondary: '#0E1D18',
      cardBg: '#142822',
      cardBorder: 'rgba(16, 185, 129, 0.3)',
      accentPrimary: '#10B981',
      accentSecondary: '#34D399',
      accentGradient: 'linear-gradient(45deg, #059669, #34D399)',
      buttonTextColor: '#091310',
      textPrimary: '#F0FDF4',
      textSecondary: '#C6E7D6',
      painBorderColor: '#F87171',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.16) 0%, rgba(9, 19, 16, 1) 65%)',
      borderRadius: '8px',
    },
    lightTheme: {
      bgPrimary: '#F8FAFC',
      bgSecondary: '#EEF5F2',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(5, 150, 105, 0.24)',
      accentPrimary: '#059669',
      accentSecondary: '#10B981',
      accentText: '#047857',
      accentGradient: 'linear-gradient(45deg, #047857, #059669)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.12) 0%, rgba(248, 250, 252, 1) 65%)',
      borderRadius: '8px',
    },
    hero: {
      preHeadline: '📊 Para Escritórios de Contabilidade, Contabilidades Consultivas & BPO Financeiro',
      headlineMain: 'Fim da Cobrança Manual de Extratos e',
      headlineHighlight: 'Atendimento Contábil Inteligente 24/7.',
      subHeadline: 'Sua equipe contábil perde dezenas de horas todo início de mês cobrando extratos bancários, XMLs e variáveis de folha no WhatsApp? Automatizamos a coleta documental, o alerta de vencimento de guias (DAS/DARF/FGTS) e a captação de novos CNPJs com n8n, Python e IA.',
      primaryCta: 'Simular Economia de Horas do Escritório →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Contabilidade da Domino Automate e quero conhecer as automações de rotina fiscal/folha e atendimento IA para escritórios contábeis!',
      metrics: [
        { value: 'Dia 1 a 5', label: 'Régua automática de coleta de extratos OFX/XML' },
        { value: 'Zero', label: 'Retrabalho com guias esquecidas pelo cliente' },
        { value: 'Python+n8n', label: 'Conciliação e triagem fiscal inteligente' },
      ],
      visualCard: {
        tag: 'Esteira Contábil Autônoma • Python + n8n',
        title: 'Coleta de Fechamento, Alertas de Guias e Triagem Comercial',
        subtitle: 'Transforme seu escritório em uma contabilidade digital de alta margem.',
        bullets: [
          'Cobrança automática e escalonada de extratos OFX/PDF e movimentação de folha todo dia 1º a 5',
          'Disparo automático de lembretes antes do vencimento de DAS, DARF, INSS e FGTS',
          'Agente de IA que responde dúvidas recorrentes (emissão de NF, pró-labore, CNAE, certidões)',
        ],
      },
    },
    pas: {
      sectionTag: 'A Dor Crônica de Todo Contador e Gestor Contábil',
      headlineMain: 'Sua Equipe Foi Contratada para Analisar Balanços ou para',
      headlineHighlight: 'Cobrar Documentos no WhatsApp Todo Mês?',
      pains: [
        {
          icon: '📥',
          title: 'Caos no Início do Mês para Receber Extratos e Folha',
          desc: 'Analistas fiscais e de DP perdem dias inteiros mandando mensagens individuais para dezenas de clientes que esquecem de enviar extratos, apontamentos de horas e notas.',
        },
        {
          icon: '🧾',
          title: 'Cliente que Não Abre o E-mail e Pede Recálculo de Guia Vencida',
          desc: 'O cliente ignora o e-mail com o DAS ou FGTS, deixa vencer e depois aciona o escritório com urgência no WhatsApp pedindo recálculo com multa e juros — gerando retrabalho não remunerado.',
        },
        {
          icon: '💬',
          title: 'Interrupções Constantes com Dúvidas Básicas e Repetitivas',
          desc: '"Qual o código de serviço da nota?", "Manda meu cartão CNPJ", "Como tiro certidão negativa?". Dezenas de micro-solicitações que destroem a produtividade técnica.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Engenharia Domino para Contabilidades Modernas',
      headlineMain: 'Produtividade Operacional e',
      headlineHighlight: 'Escala Comercial sem Aumentar a Folha',
      items: [
        {
          badge: 'PILAR 01 • ASSISTENTE CONTÁBIL IA',
          icon: '🤖',
          title: 'Atendimento de 1º Nível & Comercial 24/7 no WhatsApp',
          desc: 'Responde dúvidas frequentes dos clientes da carteira instantaneamente e atua como SDR Comercial qualificando empresários interessados em abrir CNPJ ou trocar de contador.',
          result: 'Analistas focados na contabilidade e mais propostas fechadas',
        },
        {
          badge: 'PILAR 02 • ORQUESTRAÇÃO FISCAL N8N',
          icon: '⚙️',
          title: 'Régua Automática de Coleta Mensal & Vencimento de Impostos',
          desc: 'Dispara lembretes automáticos via WhatsApp cobrando documentos de fechamento até o cliente enviar, e avisa sobre vencimentos de impostos eliminando os pedidos de recálculo.',
          result: 'Fechamento contábil ágil e redução drástica de recálculos de guias',
        },
        {
          badge: 'PILAR 03 • PYTHON & INTEGRAÇÃO DE DADOS',
          icon: '🐍',
          title: 'Conciliação de Planilhas, PDFs e Landing Page B2B',
          desc: 'Scripts em Python para leitura, padronização e cruzamento de arquivos financeiros/fiscais + Landing Page de alta conversão para captar clientes de BPO Financeiro e Contabilidade Consultiva.',
          result: 'Redução de erro humano na digitação e mais autoridade B2B',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Automação Fiscal & BPO',
      headlineMain: 'Veja a Régua de Coleta Mensal e Triagem',
      headlineHighlight: 'Operando no WhatsApp do Escritório',
      disclaimer: 'Demonstração técnica ilustrativa da esteira de automação contábil e fiscal.',
      whatsappDemo: {
        agentName: 'Assistente Fiscal IA (Demonstração)',
        statusText: 'Automação Ativa • Fechamento Mensal',
        messages: [
          { sender: 'ai', text: 'Olá, Carlos (Clínica MedVida)! 📊 Hoje é dia 02 e iniciamos o fechamento contábil. Você já pode anexar aqui mesmo no WhatsApp o extrato bancário OFX/PDF do mês passado e confirmar se houve hora extra na folha?', time: '09:00' },
          { sender: 'client', text: 'Bom dia! Segue o PDF do extrato do Itaú. Não teve hora extra esse mês.', time: '09:14' },
          { sender: 'ai', text: 'Arquivo validado e salvo na pasta fiscal da MedVida ✅ Folha liberada para processamento sem variáveis! Lembro também que a guia do DAS vence no dia 20 (enviaremos o alerta 48h antes).', time: '09:14' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Rotina Contábil Manual',
        beforeItems: [
          'Analistas cobrando extratos manualmente cliente por cliente até o dia 15',
          'Pico de pedidos de recálculo de DAS e FGTS vencidos após o dia 20',
          'Arquivos PDF/OFX espalhados em conversas de WhatsApp sem organização',
        ],
        afterTitle: 'Escritório Automatizado Domino (Python + n8n)',
        afterItems: [
          'Disparo e baixa automática de documentos pendentes do dia 1º ao dia 5',
          'Alerta preventivo de vencimento no WhatsApp do sócio 48h antes da guia vencer',
          'Triagem automática de departamento (Fiscal, DP, Societário e Comercial)',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Gatilho de Calendário Fiscal', tech: 'Cron n8n', desc: 'Inicia a régua de coleta mensal e avisos de DAS/DARF/FGTS.' },
        { step: '02', title: 'Recepção & Validação de Arquivos', tech: 'WhatsApp + Python', desc: 'Recebe PDF/OFX/XML e valida se o documento pertence à competência.' },
        { step: '03', title: 'Baixa no Controle de Fechamento', tech: 'PostgreSQL / ERP', desc: 'Marca o cliente como entregue e interrompe os lembretes de cobrança.' },
        { step: '04', title: 'SDR Comercial 24/7', tech: 'Gemini 2.5 Flash', desc: 'Qualifica leads de abertura de empresa e migração contábil.' },
      ],
    },
    simulator: {
      economicModelType: 'contabilidade-horas-operacionais',
      sectionTag: 'Simulador de Produtividade & Novos Contratos Contábeis',
      headlineMain: 'Calcule Quantas Horas e Receita Seu Escritório',
      headlineHighlight: 'Ganha com Automação Contábil',
      subtitle: 'Simule o impacto em horas operacionais poupadas na coleta mensal e em novas propostas fechadas:',
      slider1: { label: 'Propostas comerciais / Leads contábeis por mês', unit: 'propostas/mês', min: 10, max: 150, step: 5, defaultValue: 25 },
      slider2: { label: 'Mensalidade Média Contábil / BPO (Honorário)', unit: 'R$', min: 300, max: 3500, step: 50, defaultValue: 750 },
      slider3: { label: 'Horas semanais da equipe cobrando docs e recalculando guias', unit: 'horas/sem', min: 5, max: 80, step: 5, defaultValue: 25 },
      resultLabel: 'Impacto Econômico Total Estimado / Mês',
      conversionRate1: 0.20,
      recoveryRate3: 0.65,
      defaultMarginPct: 65,
      hourlyOperationalValue: 65,
      weeklyHoursSavedBase: 16,
      baselineRevenueMultiplier: 2.2,
      metric1Suffix: 'novos contratos contábeis/BPO por mês',
      metric3Suffix: 'horas técnicas da equipe liberadas/mês',
    },
    form: {
      sectionTag: 'Diagnóstico para Escritórios de Contabilidade',
      headlineMain: 'Transforme a Operação do Seu',
      headlineHighlight: 'Escritório Contábil',
      subtitle: 'Selecione os principais gargalos dos setores Fiscal, Contábil, DP ou Comercial abaixo:',
      orgLabel: 'Nome do Escritório de Contabilidade',
      orgPlaceholder: 'Ex: Exata Contabilidade & BPO',
      subTypes: [
        'Escritório Contábil Tradicional / Multissetorial',
        'Contabilidade Digital / Nichada (Médicos, TI, Prestadores)',
        'BPO Financeiro & Consultoria Empresarial',
        'Contabilidade Especializada em Lucro Real / Presumido',
        'Abertura de Empresas & Regularização Fiscal',
      ],
      painsList: [
        'Perda de tempo todo mês cobrando extratos e documentos dos clientes',
        'Alto volume de recálculo de guias (DAS/DARF/FGTS) vencidas',
        'Equipe interrompida o dia inteiro no WhatsApp com dúvidas básicas',
        'Trabalho manual repetitivo com planilhas, PDFs e relatórios',
        'Falta de um funil comercial ativo para captar novas empresas',
        'Onboarding lento de novos clientes que migram de outro contador',
      ],
      demandLabel: 'Automação Fiscal/DP N8N + IA para Contabilidade',
    },
    faqs: [
      {
        q: 'Como funciona a régua automática de cobrança de documentos no início do mês?',
        a: 'O fluxo no n8n consulta a lista de clientes pendentes e envia mensagens personalizadas no WhatsApp nos dias programados (ex: dia 1, dia 3 e dia 5). Assim que o cliente envia o extrato/documento, o sistema dá baixa automática e para de cobrar.',
      },
      {
        q: 'A IA consegue separar se o cliente quer falar com o DP, Fiscal, Societário ou Financeiro?',
        a: 'Sim! Ela resolve imediatamente as dúvidas padrão de 1º nível e, quando necessário, já classifica e encaminha a demanda com todos os dados prontos para o departamento responsável.',
      },
      {
        q: 'Podemos usar scripts Python para tratar extratos bancários e planilhas despadronizadas?',
        a: 'Com certeza. Essa é uma das grandes especialidades da Domino Automate: criamos conversores e robôs em Python que transformam PDFs e planilhas caóticas de clientes em layouts prontos para importação no seu sistema contábil.',
      },
      {
        q: 'A solução é segura em relação aos dados fiscais e bancários dos clientes (LGPD)?',
        a: '100% segura. Toda a infraestrutura opera em ambiente isolado com criptografia e sem compartilhamento de dados confidenciais com terceiros.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'Contábil & BPO 📊',
      headerTitle: 'Consultor IA • Automação Contábil',
      initialMessage: 'Olá! 📊 Sou o consultor da vertical de Contabilidade da Domino Automate. Ajudo escritórios contábeis e BPOs a eliminarem a cobrança manual de extratos/documentos todo mês, reduzirem recálculos de guias vencidas e captarem novos CNPJs com IA e n8n. Quantas empresas ativas você atende hoje no escritório?',
      collectNamePrompt: 'Excelente! Para eu estruturar o diagnóstico do seu escritório contábil, qual é o seu nome e o nome da Contabilidade?',
      successMessage: 'Perfeito! 📊 Seu diagnóstico contábil foi registrado na nossa automação N8N e nosso especialista entrará em contato!',
    },
  },

  farmacias: {
    key: 'farmacias',
    slug: '/Farmacias',
    headerBadge: '💊 Vertical Farmácias, Drogarias & Manipulação',
    icon: '💊',
    metaTitle: 'Domino Automate | Cotação de Receitas por IA no WhatsApp & Recompra Contínua para Farmácias',
    metaDescription: 'Responda orçamentos de receitas médicas e fórmulas manipuladas no WhatsApp em segundos, aumente as vendas no delivery e automatize a recompra de medicamentos de uso contínuo.',
    layoutStrategy: 'demonstration-first',
    sectionOrder: ['technical-proof', 'pillars', 'simulator', 'pas', 'form', 'faq'],
    defaultThemeMode: 'light',
    theme: {
      bgPrimary: '#081418',
      bgSecondary: '#0D1F26',
      cardBg: '#132B34',
      cardBorder: 'rgba(6, 182, 212, 0.32)',
      accentPrimary: '#06B6D4',
      accentSecondary: '#22C55E',
      accentGradient: 'linear-gradient(45deg, #06B6D4, #22C55E)',
      buttonTextColor: '#081418',
      textPrimary: '#F0FDFA',
      textSecondary: '#C2E5EC',
      painBorderColor: '#F87171',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.16) 0%, rgba(8, 20, 24, 1) 65%)',
      borderRadius: '10px',
    },
    lightTheme: {
      bgPrimary: '#F6FBFB',
      bgSecondary: '#EBF5F6',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(8, 145, 178, 0.24)',
      accentPrimary: '#0891B2',
      accentSecondary: '#0D9488',
      accentText: '#0E7490',
      accentGradient: 'linear-gradient(45deg, #0E7490, #0891B2)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#082026',
      textSecondary: '#2D4F57',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(8, 145, 178, 0.12) 0%, rgba(246, 251, 251, 1) 65%)',
      borderRadius: '10px',
    },
    hero: {
      preHeadline: '💊 Para Farmácias de Manipulação, Drogarias & Delivery Farmacêutico',
      headlineMain: 'Cotação Instantânea no WhatsApp e',
      headlineHighlight: 'Recompra Automática de Uso Contínuo.',
      subHeadline: 'No varejo farmacêutico e de manipulação, quem demora 15 minutos para responder uma foto de receita no WhatsApp perde o pedido para a rede concorrente. Nossa IA acolhe o paciente na hora, agiliza o orçamento e lembra o cliente quando o medicamento contínuo está acabando.',
      primaryCta: 'Ver Simulador do Delivery →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Farmacias da Domino Automate e quero saber como funciona a IA de Atendimento no WhatsApp e Recompra de Uso Contínuo para farmácias!',
      metrics: [
        { value: '< 5 seg', label: 'Acolhimento de receitas e pedidos no WhatsApp' },
        { value: '25/30 dias', label: 'Alerta automático de reposição de uso contínuo' },
        { value: '24/7', label: 'Recepção de receitas e triagem de delivery' },
      ],
      visualCard: {
        tag: 'Motor de Vendas Farmacêutico • WhatsApp + n8n',
        title: 'Triagem de Receitas, Cross-Sell de Perfumaria/Vitaminas e Recorrência',
        subtitle: 'Velocidade de resposta no balcão digital e fidelização de pacientes crônicos.',
        bullets: [
          'Recebimento organizado de fotos de receitas médicas e pré-cadastro automático do pedido',
          'Sugestão inteligente de itens complementares (vitaminas, dermocosméticos, infantil)',
          'Aviso automático aos 25 dias: "Sua fórmula/medicamento contínuo está acabando. Deseja receber em casa?"',
        ],
      },
    },
    pas: {
      sectionTag: 'Por Que Tantos Orçamentos no WhatsApp Não Viram Venda?',
      headlineMain: 'O Cliente Manda a Foto da Receita para 3 Farmácias:',
      headlineHighlight: 'A Primeira que Responde Leva o Pedido.',
      pains: [
        {
          icon: '📸',
          title: 'Fila de Espera no WhatsApp em Horário de Pico',
          desc: 'Os balconistas estão atendendo clientes na loja física enquanto o WhatsApp acumula 20 fotos de receitas e pedidos de entrega. Quando alguém responde, o cliente já comprou em outra.',
        },
        {
          icon: '💊',
          title: 'Perda da Recompra de Medicamentos e Fórmulas Contínuas',
          desc: 'O cliente compra um tratamento para 30 ou 60 dias. Se a sua farmácia não entrar em contato no WhatsApp 5 dias antes de acabar a caixa/pote, ele compra onde estiver passando na rua.',
        },
        {
          icon: '🛒',
          title: 'Orçamentos Abandonados Sem Follow-Up Estruturado',
          desc: 'Na farmácia de manipulação, dezenas de clientes pedem cotação da fórmula, recebem o preço e param de responder. Sem um follow-up automático e consultivo, milhares de reais ficam na mesa todo mês.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Soluções Domino Automate para o Setor Farmacêutico',
      headlineMain: 'Atendimento Rápido, Recuperação de Orçamentos e',
      headlineHighlight: 'Fidelização de Uso Contínuo',
      items: [
        {
          badge: 'PILAR 01 • ATENDIMENTO IA 24/7',
          icon: '⚡',
          title: 'Triagem Instantânea de Receitas e Pedidos no WhatsApp',
          desc: 'Atende o cliente em 3 segundos, coleta foto da receita, endereço de entrega e forma de pagamento, tira dúvidas de disponibilidade e organiza a fila para fechamento imediato.',
          result: 'Redução drástica nas vendas perdidas por espera no WhatsApp',
        },
        {
          badge: 'PILAR 02 • RECOMPRA AUTOMÁTICA N8N',
          icon: '🔁',
          title: 'Ciclo Inteligente de Uso Contínuo & Recuperação de Cotações',
          desc: 'Faz follow-up automático de orçamentos de manipulação em aberto e dispara lembretes personalizados quando o medicamento contínuo ou suplemento do cliente está prestes a acabar.',
          result: 'Receita recorrente previsível todos os meses no delivery',
        },
        {
          badge: 'PILAR 03 • CANAL DIGITAL DE CONVERSÃO',
          icon: '🏥',
          title: 'Landing Page Rápida para Envio de Receita & Delivery',
          desc: 'Página otimizada para anúncios locais no Google e Instagram onde o cliente clica e já cai no WhatsApp pronto para enviar a receita ou pedir entrega expressa.',
          result: 'Captação constante de novos pacientes do seu bairro/cidade',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Triagem de Receita & Uso Contínuo',
      headlineMain: 'Veja Como o Balcão Digital Atende e',
      headlineHighlight: 'Fideliza o Paciente em Segundos',
      disclaimer: 'Demonstração técnica ilustrativa do fluxo de atendimento farmacêutico (respeitando ANVISA e LGPD).',
      whatsappDemo: {
        agentName: 'Atendimento Digital • Farmácia & Manipulação (Demo)',
        statusText: 'Online 24/7 • Recepção de Receitas',
        messages: [
          { sender: 'client', text: 'Oi, vocês manipulam essa fórmula que a dermatologista passou? [Foto da Receita]', time: '11:20' },
          { sender: 'ai', text: 'Olá! Recebemos sua receita com nitidez 💊 Nossa equipe farmacêutica já está conferindo os ativos para te passar o valor exato em instantes. Você prefere receber em casa hoje via Delivery ou retirar na loja?', time: '11:20' },
          { sender: 'client', text: 'Prefiro entrega em casa, meu CEP é 70000-000.', time: '11:21' },
          { sender: 'ai', text: 'Perfeito! Taxa de entrega gratuita para sua região em pedidos acima de R$ 150. Também registramos o lembrete automático para te avisar 5 dias antes de suas 60 cápsulas terminarem!', time: '11:21' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Balcão Digital Sem Automação',
        beforeItems: [
          'Paciente espera 25 minutos no WhatsApp e fecha com a farmácia concorrente',
          'Orçamentos de manipulação enviados sem follow-up estruturado no mesmo dia',
          'Zero controle sobre a data de término do medicamento de uso contínuo',
        ],
        afterTitle: 'Farmácia com Arquitetura Domino (IA + n8n)',
        afterItems: [
          'Recepção da receita e coleta de CEP em menos de 5 segundos 24/7',
          'Follow-up automático de cotações em aberto aumentando o fechamento',
          'Disparo programado aos 25/55 dias garantindo a recompra recorrente',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Recepção da Receita', tech: 'WhatsApp 24/7', desc: 'Acolhe o cliente imediatamente e coleta foto da receita + CEP.' },
        { step: '02', title: 'Fila Prioritária p/ Orçamentista', tech: 'n8n Router', desc: 'Entrega os dados estruturados para o farmacêutico validar e cotar.' },
        { step: '03', title: 'Recuperação de Orçamento', tech: 'Follow-up Automático', desc: 'Retoma contato caso o cliente não responda após receber o valor.' },
        { step: '04', title: 'Motor de Uso Contínuo', tech: 'Ciclo 25/55 Dias', desc: 'Lembra o paciente de repor sua fórmula ou medicamento contínuo.' },
      ],
    },
    simulator: {
      economicModelType: 'farmacias-atendimento-pedidos',
      sectionTag: 'Simulador Econômico • Delivery & Uso Contínuo',
      headlineMain: 'Simule o Crescimento do Delivery da',
      headlineHighlight: 'Sua Farmácia com IA e Automação',
      subtitle: 'Compare os cenários Conservador, Referência e Otimista para cotações e recompras:',
      slider1: { label: 'Cotações / Receitas no WhatsApp por mês', unit: 'cotações/mês', min: 150, max: 3000, step: 50, defaultValue: 600 },
      slider2: { label: 'Ticket Médio por pedido / fórmula manipulada', unit: 'R$', min: 45, max: 450, step: 15, defaultValue: 135 },
      slider3: { label: 'Orçamentos abertos / Clientes contínuos p/ reativar por semana', unit: 'clientes/sem', min: 5, max: 100, step: 5, defaultValue: 20 },
      resultLabel: 'Impacto Econômico Estimado no Delivery / Mês',
      conversionRate1: 0.15,
      recoveryRate3: 0.40,
      defaultMarginPct: 40,
      hourlyOperationalValue: 35,
      weeklyHoursSavedBase: 10,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'pedidos extras convertidos por velocidade/mês',
      metric3Suffix: 'recompras e orçamentos recuperados/mês',
    },
    form: {
      sectionTag: 'Diagnóstico para Farmácias & Manipulação',
      headlineMain: 'Potencialize as Vendas pelo WhatsApp da',
      headlineHighlight: 'Sua Farmácia',
      subtitle: 'Preencha os dados abaixo para receber o plano de automação para o seu balcão digital e delivery:',
      orgLabel: 'Nome da Farmácia / Drogaria',
      orgPlaceholder: 'Ex: Farmácia Vida & Manipulação',
      subTypes: [
        'Farmácia de Manipulação & Homeopatia',
        'Drogaria Independente / Farmácia de Bairro com Delivery',
        'Rede de Farmácias (Múltiplas Lojas)',
        'Farmácia Especializada em Suplementos & Dermocosméticos',
      ],
      painsList: [
        'Demora para responder clientes que mandam foto de receita no WhatsApp',
        'Muitos orçamentos de manipulação enviados que o cliente não fecha',
        'Falta de controle automático para chamar clientes de uso contínuo',
        'Balconistas sobrecarregados entre o atendimento físico e o celular',
        'Baixo ticket médio por falta de oferta de perfumaria/vitaminas',
        'Preciso de uma página de alta conversão para anúncios de delivery',
      ],
      demandLabel: 'Automação de Delivery, Cotação IA & Recompra para Farmácia',
    },
    faqs: [
      {
        q: 'Como a automação funciona quando o cliente envia a foto de uma receita médica?',
        a: 'A IA recepciona o cliente no mesmo segundo, solicita a foto nítida da receita e o CEP de entrega, faz a pré-triagem e já entrega tudo organizado para o farmacêutico/orçamentista finalizar com velocidade máxima.',
      },
      {
        q: 'Como funciona a recuperação de orçamentos em Farmácias de Manipulação?',
        a: 'Quando o orçamento é enviado e o cliente visualiza mas não responde, o fluxo n8n entra em ação após algumas horas de forma consultiva perguntando se ficou alguma dúvida ou oferecendo facilidades de entrega/parcelamento.',
      },
      {
        q: 'O sistema respeita as normas da ANVISA e a privacidade de dados de saúde (LGPD)?',
        a: 'Sim, rigorosamente. A IA não prescreve medicamentos nem substitui o farmacêutico; ela atua na agilidade de atendimento, logística de delivery e lembrete de reposição sob total conformidade com a LGPD.',
      },
      {
        q: 'É possível lembrar o cliente de comprar novamente um remédio de uso contínuo?',
        a: 'Sim! Programamos ciclos de 25, 30 ou 55 dias para que o sistema envie uma mensagem automática no WhatsApp do cliente oferecendo a reposição antes que o medicamento dele acabe.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'para Farmácias 💊',
      headerTitle: 'Consultor IA • Farmácias & Manipulação',
      initialMessage: 'Olá! 💊 Sou o consultor da vertical de Farmácias da Domino Automate. Ajudo drogarias e farmácias de manipulação a responderem cotações de receitas no WhatsApp em segundos, recuperarem orçamentos parados e automatizarem a recompra de medicamentos de uso contínuo. Sua farmácia hoje é drogaria, manipulação ou ambas?',
      collectNamePrompt: 'Ótimo! Para montarmos o plano de automação do seu delivery farmacêutico, qual é o seu nome e o nome da Farmácia?',
      successMessage: 'Tudo certo! 💊 Seus dados já foram processados pela nossa automação N8N e nosso especialista vai falar com você no WhatsApp!',
    },
  },

  oticas: {
    key: 'oticas',
    slug: '/Oticas',
    headerBadge: '👓 Vertical Óticas & Boutiques Visuais',
    icon: '👓',
    metaTitle: 'Domino Automate | Orçamento de Receitas no WhatsApp, IA 24/7 e Renovação Anual para Óticas',
    metaDescription: 'Converta mais receitas oftalmológicas no WhatsApp, agende testes de adaptação e consultas parceiras 24/7 e automatize a renovação anual de óculos multifocais e lentes.',
    layoutStrategy: 'portfolio-first',
    sectionOrder: ['technical-proof', 'pillars', 'pas', 'simulator', 'form', 'faq'],
    defaultThemeMode: 'dark',
    theme: {
      bgPrimary: '#11100E',
      bgSecondary: '#191714',
      cardBg: '#221F1A',
      cardBorder: 'rgba(245, 158, 11, 0.3)',
      accentPrimary: '#F59E0B',
      accentSecondary: '#FDE68A',
      accentGradient: 'linear-gradient(45deg, #D97706, #FDE68A)',
      buttonTextColor: '#11100E',
      textPrimary: '#FAF8F5',
      textSecondary: '#DED8CE',
      painBorderColor: '#EF4444',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, rgba(17, 16, 14, 1) 65%)',
      borderRadius: '8px',
    },
    lightTheme: {
      bgPrimary: '#FAF9F5',
      bgSecondary: '#F2EFE7',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(180, 83, 9, 0.25)',
      accentPrimary: '#B45309',
      accentSecondary: '#D97706',
      accentText: '#9A4507',
      accentGradient: 'linear-gradient(45deg, #9A4507, #B45309)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#181613',
      textSecondary: '#4A453D',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, rgba(250, 249, 245, 1) 65%)',
      borderRadius: '8px',
    },
    hero: {
      preHeadline: '👓 Para Óticas Independentes, Redes de Óticas & Boutiques de Lentes de Alta Precisão',
      headlineMain: 'Transforme Fotos de Receitas Oftalmológicas em',
      headlineHighlight: 'Vendas de Óculos de Maior Ticket.',
      subHeadline: 'Quando o paciente sai do oftalmologista com a receita na mão, ele pesquisa pelo WhatsApp antes de entrar na loja. Nossa IA atende na hora, consulta o perfil visual do cliente, explica a diferença entre tratamentos (antirreflexo, filtro azul, multifocal) e agenda a prova das armações na sua ótica.',
      primaryCta: 'Simular Conversão de Receitas →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Oticas da Domino Automate e quero ver como funciona a IA de Orçamento de Receitas e Renovação de Óculos para minha ótica!',
      metrics: [
        { value: '< 5 seg', label: 'Acolhimento consultivo de receitas no WhatsApp' },
        { value: '12 Meses', label: 'Automação de retorno para troca de grau/armação' },
        { value: '90 Dias', label: 'Ciclo de reposição para lentes de contato' },
      ],
      visualCard: {
        tag: 'Consultoria Ótica Inteligente • WhatsApp + n8n',
        title: 'Qualificação de Receita, Indicação de Lentes & Pós-Venda',
        subtitle: 'Não passe apenas "preço seco" no WhatsApp: gere desejo e leve o cliente até a loja.',
        bullets: [
          'Triagem da receita oftalmológica (visão simples, multifocal/progressiva, alto índice)',
          'Educação do cliente sobre lentes digitais, fotossensíveis e proteção de luz azul',
          'Régua de pós-venda: ajuste de armação (30 dias) e lembrete anual de novo exame/troca de óculos',
        ],
      },
    },
    pas: {
      sectionTag: 'Por Que Sua Ótica Perde Vendas no WhatsApp?',
      headlineMain: 'Passar Apenas o Preço da Lente no WhatsApp Faz o Cliente',
      headlineHighlight: 'Comprar na Ótica Mais Barata da Rua.',
      pains: [
        {
          icon: '📄',
          title: 'Atendimento no WhatsApp que Só "Joga Preço" Sem Encantar',
          desc: 'O cliente manda a foto da receita e pergunta "quanto fica?". Se o vendedor apenas responde "R$ 680" sem qualificar a rotina do cliente nem levá-lo à loja para provar armações, a venda morre ali.',
        },
        {
          icon: '🕶️',
          title: 'Orçamentos de Lentes Multifocais Abandonados',
          desc: 'Óculos multifocais têm alto valor agregado (R$ 1.500 a R$ 4.000+), mas exigem confiança e acompanhamento. Sem um follow-up estruturado no WhatsApp, o cliente adia a compra ou fecha em outra ótica.',
        },
        {
          icon: '📆',
          title: 'Clientes que Compraram Há 1 Ano e Nunca Mais Foram Contatados',
          desc: 'Sua gaveta ou sistema tem centenas de clientes cujo grau já venceu há 12 ou 18 meses, além de usuários de lentes de contato que precisam recomprar a caixa a cada 90 dias.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Arquitetura Domino Automate para Óticas',
      headlineMain: 'Mais Fluxo de Clientes na Loja Física e',
      headlineHighlight: 'Maior Ticket Médio em Lentes',
      items: [
        {
          badge: 'PILAR 01 • CONSULTORA ÓTICA DE IA 24/7',
          icon: '👓',
          title: 'Atendimento Consultivo de Receitas no WhatsApp',
          desc: 'Recebe a receita do cliente a qualquer hora, pergunta sobre o uso (computador, direção noturna, leitura), valoriza seus tratamentos de lentes e convida para experimentar as armações na loja.',
          result: 'Mais clientes comparecendo presencialmente na ótica',
        },
        {
          badge: 'PILAR 02 • AUTOMAÇÃO DE CARTEIRA N8N',
          icon: '🔄',
          title: 'Follow-up de Multifocais, Lentes de Contato & Renovação Anual',
          desc: 'Acompanha automaticamente clientes que cotaram e não fecharam, avisa quando o óculos fica pronto no laboratório e reativa clientes após 12 meses para atualizar o grau ou trocar de estilo.',
          result: 'Vendas recorrentes usando a base de clientes que você já tem',
        },
        {
          badge: 'PILAR 03 • VITRINE DIGITAL DE ESTILO',
          icon: '✨',
          title: 'Landing Page para Captação de Receitas e Campanhas',
          desc: 'Página moderna para seus anúncios no Instagram e Google ("Envie sua receita pelo WhatsApp" ou "Conheça nossa coleção solar/grau"), rastreando cada lead gerado.',
          result: 'Maior aproveitamento sobre o investimento em anúncios locais',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Consultoria Visual no WhatsApp',
      headlineMain: 'Veja Como a IA Valoriza Suas Lentes e',
      headlineHighlight: 'Traz o Cliente para a Loja',
      disclaimer: 'Demonstração técnica ilustrativa do atendimento consultivo para Óticas.',
      whatsappDemo: {
        agentName: 'Consultora Visual IA • Ótica (Demonstração)',
        statusText: 'Online 24/7 • Especialista em Lentes & Estilo',
        messages: [
          { sender: 'client', text: 'Oi, saí do oftalmologista agora. Quanto fica uma lente multifocal para essa receita?', time: '16:05' },
          { sender: 'ai', text: 'Olá! Parabéns por cuidar da sua visão 👓 Recebi sua receita! Para te indicar o campo visual ideal sem distorção lateral: você passa mais tempo no computador/celular ou dirigindo?', time: '16:05' },
          { sender: 'client', text: 'Trabalho o dia todo no computador e dirijo à noite.', time: '16:06' },
          { sender: 'ai', text: 'Nesse caso, as lentes Multifocais Digitais com Filtro Azul + Antirreflexo Noturno vão te dar um conforto incrível. Separei 3 opções de pacotes e podemos deixar 4 armações leves separadas para você provar hoje às 17h30 com medição digital. Posso confirmar?', time: '16:06' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Cotação Fria no WhatsApp',
        beforeItems: [
          'Vendedor passa apenas preço seco e o cliente vai atrás do mais barato',
          'Orçamentos de multifocais esquecidos sem acompanhamento nos dias seguintes',
          'Clientes antigos passam 2 anos sem receber contato de renovação de grau',
        ],
        afterTitle: 'Ótica com Arquitetura Domino (IA + n8n)',
        afterItems: [
          'Abordagem consultiva que descobre a rotina visual e agrega tratamentos',
          'Follow-up estruturado em 24h e 72h para destravar orçamentos de alto valor',
          'Aviso automático de laboratório pronto + Recall anual de renovação visual',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Recepção da Receita', tech: 'WhatsApp 24/7', desc: 'Cliente envia foto da receita assim que sai do consultório.' },
        { step: '02', title: 'Diagnóstico de Estilo de Vida', tech: 'Gemini 2.5 Flash', desc: 'Identifica necessidade de filtro azul, fotossensível ou alto índice.' },
        { step: '03', title: 'Agendamento de Prova / Follow-up', tech: 'n8n Pipeline', desc: 'Agenda visita na loja ou acompanha o orçamento enviado.' },
        { step: '04', title: 'Pós-Venda & Recall 12 Meses', tech: 'Automação de Carteira', desc: 'Acompanha adaptação (15d) e chama para renovar o óculos em 1 ano.' },
      ],
    },
    simulator: {
      economicModelType: 'oticas-recuperacao-orcamentos',
      sectionTag: 'Simulador Econômico • Conversão de Receitas & Recall Anual',
      headlineMain: 'Veja Quantos Óculos a Mais Sua Ótica Pode',
      headlineHighlight: 'Fechar Todos os Meses',
      subtitle: 'Simule em 3 cenários o impacto de converter mais receitas do WhatsApp e reativar clientes antigos:',
      slider1: { label: 'Receitas / Orçamentos recebidos no WhatsApp por mês', unit: 'receitas/mês', min: 30, max: 500, step: 10, defaultValue: 100 },
      slider2: { label: 'Ticket Médio do Óculos Completo (Armação + Lentes)', unit: 'R$', min: 350, max: 2500, step: 50, defaultValue: 850 },
      slider3: { label: 'Orçamentos abertos / Clientes antigos (1+ ano) p/ semana', unit: 'clientes/sem', min: 2, max: 35, step: 1, defaultValue: 6 },
      resultLabel: 'Impacto Econômico Estimado na Ótica / Mês',
      conversionRate1: 0.14,
      recoveryRate3: 0.30,
      defaultMarginPct: 50,
      hourlyOperationalValue: 40,
      weeklyHoursSavedBase: 8,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'óculos extras convertidos via WhatsApp/mês',
      metric3Suffix: 'orçamentos e renovações anuais fechadas/mês',
    },
    form: {
      sectionTag: 'Diagnóstico Comercial • Óticas',
      headlineMain: 'Multiplique a Conversão de Receitas da',
      headlineHighlight: 'Sua Ótica',
      subtitle: 'Informe o perfil da sua ótica abaixo para receber nosso diagnóstico de automação comercial:',
      orgLabel: 'Nome da Ótica',
      orgPlaceholder: 'Ex: Ótica Visão Prime (@instagram)',
      subTypes: [
        'Ótica Tradicional / Centro Comercial',
        'Boutique Ótica Premium / Grifes & Multifocais',
        'Rede de Óticas (2 ou mais lojas)',
        'Ótica Popular / Alto Volume de Receitas',
      ],
      painsList: [
        'Clientes pedem preço da receita no WhatsApp e somem',
        'Falta de follow-up em orçamentos de lentes multifocais',
        'Base de clientes antigos parada sem reativação de 12 meses',
        'Demora para atender no WhatsApp em horários de loja cheia',
        'Falta de controle automático de recompra de lentes de contato',
        'Preciso de uma Landing Page para campanhas no Instagram/Google',
      ],
      demandLabel: 'Automação de Orçamento de Receitas IA + N8N para Ótica',
    },
    faqs: [
      {
        q: 'Como a IA evita passar apenas "preço frio" e perder o cliente?',
        a: 'Treinamos a IA com técnicas de vendas consultivas para óticas: antes de falar valores isolados, ela acolhe o cliente, pergunta como ele usa o óculos no dia a dia, explica os benefícios do antirreflexo/filtro azul e cria um motivo para ele experimentar as armações na loja.',
      },
      {
        q: 'A automação avisa o cliente quando o óculos chega do laboratório?',
        a: 'Sim! Além de avisar automaticamente que o óculos está pronto para retirada, o sistema agenda uma mensagem 15 dias depois perguntando sobre a adaptação e outra após 12 meses lembrando de revisar a visão.',
      },
      {
        q: 'Funciona também para recompra de lentes de contato?',
        a: 'Perfeitamente. Se o cliente comprou caixas para 3 ou 6 meses, o n8n avisa automaticamente no WhatsApp dias antes de acabar o estoque dele.',
      },
      {
        q: 'Minha equipe de vendedoras consegue acompanhar e assumir a conversa?',
        a: 'Sim! A IA faz a recepção imediata 24/7 e qualifica a receita, e suas consultoras óticas podem intervir a qualquer instante para mandar fotos das armações da vitrine.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'para Óticas 👓',
      headerTitle: 'Consultor IA • Automação para Óticas',
      initialMessage: 'Olá! 👓 Sou o consultor da vertical de Óticas da Domino Automate. Ajudo óticas a converterem muito mais fotos de receitas oftalmológicas no WhatsApp, fazerem follow-up de multifocais e reativarem clientes após 12 meses para troca de grau e armação. Quantas lojas sua ótica possui hoje?',
      collectNamePrompt: 'Excelente! Para prepararmos o plano comercial da sua ótica, qual é o seu nome e o nome da Ótica?',
      successMessage: 'Pronto! 👓 Já registrei o diagnóstico da sua ótica via N8N e nosso especialista vai te chamar no WhatsApp!',
    },
  },

  odontologia: {
    key: 'odontologia',
    slug: '/Odontologia',
    headerBadge: '🦷 Vertical Consultórios & Clínicas de Odontologia',
    icon: '🦷',
    metaTitle: 'Domino Automate | Agendamento Odontológico por IA 24/7, Redução de Faltas e Fechamento de Tratamentos',
    metaDescription: 'Preencha as cadeiras do seu consultório odontológico com Recepcionista de IA 24/7 no WhatsApp, reduza faltas de pacientes e recupere orçamentos de implantes, facetas e ortodontia.',
    layoutStrategy: 'demonstration-first',
    sectionOrder: ['technical-proof', 'simulator', 'pillars', 'pas', 'form', 'faq'],
    defaultThemeMode: 'light',
    theme: {
      bgPrimary: '#09121C',
      bgSecondary: '#0E1B2A',
      cardBg: '#14263B',
      cardBorder: 'rgba(56, 189, 248, 0.3)',
      accentPrimary: '#38BDF8',
      accentSecondary: '#7DD3FC',
      accentGradient: 'linear-gradient(45deg, #0284C7, #38BDF8)',
      buttonTextColor: '#09121C',
      textPrimary: '#F0F9FF',
      textSecondary: '#C8E1F5',
      painBorderColor: '#F87171',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.16) 0%, rgba(9, 18, 28, 1) 65%)',
      borderRadius: '12px',
    },
    lightTheme: {
      bgPrimary: '#F8FAFC',
      bgSecondary: '#EFF6FF',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(2, 132, 199, 0.22)',
      accentPrimary: '#0284C7',
      accentSecondary: '#0369A1',
      accentText: '#0369A1',
      accentGradient: 'linear-gradient(45deg, #0369A1, #0284C7)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(2, 132, 199, 0.12) 0%, rgba(248, 250, 252, 1) 65%)',
      borderRadius: '12px',
    },
    hero: {
      preHeadline: '🦷 Para Consultórios Odontológicos, Implantodontistas, Ortodontistas & Clínicas de Estética Dental',
      headlineMain: 'Mais Avaliações Agendadas e Zero Cadeiras Ociosas no',
      headlineHighlight: 'Seu Consultório Odontológico.',
      subHeadline: 'Pacientes com dor ou que buscam implantes, facetas em resina/porcelana e alinhadores invisíveis decidem no WhatsApp. Nossa Recepcionista de IA acolhe o paciente em segundos 24/7, agenda a avaliação, confirma o comparecimento e faz follow-up de orçamentos em aberto.',
      primaryCta: 'Simular Agenda do Consultório →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Odontologia da Domino Automate e quero conhecer a Recepcionista de IA 24/7 e Automação de Pacientes para meu consultório odontológico!',
      metrics: [
        { value: '< 5 seg', label: 'Acolhimento de pacientes particulares 24/7' },
        { value: '24h / 3h', label: 'Dupla confirmação ativa anti-falta na cadeira' },
        { value: '6 em 6m', label: 'Recall automático para profilaxia e revisão' },
      ],
      visualCard: {
        tag: 'Jornada do Paciente Odontológico • IA + n8n',
        title: 'Captação de Implantes/Estética, Anti No-Show e Profilaxia Semestral',
        subtitle: 'Sua secretária focada no paciente presencial enquanto a IA cuida do WhatsApp.',
        bullets: [
          'Qualificação humanizada de pacientes particulares (Implantes, Lentes/Facetas, Alinhadores, Urgências)',
          'Confirmação ativa de consulta 24h e 3h antes + orientações pós-operatórias automáticas',
          'Reativação de orçamentos odontológicos não fechados e lembrete semestral de limpeza/prevenção',
        ],
      },
    },
    pas: {
      sectionTag: 'Onde os Consultórios Odontológicos Perdem Mais Receita?',
      headlineMain: 'Você Investe em Equipamentos e Anúncios, Mas',
      headlineHighlight: 'Perde o Paciente no Atendimento do WhatsApp.',
      pains: [
        {
          icon: '🦷',
          title: 'Paciente Pergunta "Quanto Custa o Implante?" e Some',
          desc: 'Quando o atendimento no WhatsApp demora ou não sabe conduzir a conversa com empatia para explicar o valor da avaliação clínica (em conformidade com o CFO), o paciente acha caro ou fecha em outra clínica.',
        },
        {
          icon: '🪑',
          title: 'Hora Clínica Perdida com Paciente que Falta Sem Avisar',
          desc: 'Cadeira odontológica parada custa caro (aluguel, auxiliar, materiais esterilizados). Sem confirmação automatizada e lista de encaixe rápido, as faltas corroem o lucro líquido do dentista.',
        },
        {
          icon: '📋',
          title: 'Gaveta Cheia de Orçamentos Avaliados que Nunca Fecharam',
          desc: 'O paciente fez a avaliação, recebeu o plano de tratamento de R$ 5.000 ou R$ 15.000 e disse "vou pensar". A secretária não tem tempo de fazer o acompanhamento e esse faturamento é esquecido.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Engenharia Domino Automate para Odontologia',
      headlineMain: 'Acolhimento Humanizado, Agenda Blindada e',
      headlineHighlight: 'Resgate de Planos de Tratamento',
      items: [
        {
          badge: 'PILAR 01 • SECRETÁRIA DE IA 24/7',
          icon: '🤖',
          title: 'Triagem e Agendamento de Avaliações no WhatsApp',
          desc: 'Atende pacientes particulares 24h por dia com empatia e ética (normas do CFO), identifica a especialidade desejada (Implante, Estética, Orto, Endodontia) e agenda a consulta.',
          result: 'Aproveitamento elevado de cada paciente que chama no WhatsApp',
        },
        {
          badge: 'PILAR 02 • AUTOMAÇÃO CLÍNICA N8N',
          icon: '📅',
          title: 'Blindagem Anti-Falta, Pós-Operatório & Retorno Semestral',
          desc: 'Envia confirmações de consulta, instruções automáticas de cuidados pós-cirúrgicos (siso/implante), follow-up de orçamentos abertos e convite automático de retorno a cada 6 meses para profilaxia.',
          result: 'Cadeira sempre produtiva e pacientes fidelizados pelo cuidado',
        },
        {
          badge: 'PILAR 03 • LANDING PAGE ODONTOLÓGICA',
          icon: '✨',
          title: 'Página de Alta Autoridade para Captação de Tratamentos Nobres',
          desc: 'Landing Page exclusiva destacando a estrutura da clínica, currículo do(a) cirurgião(ã)-dentista (CRO) e especialidades de maior ticket, pronta para campanhas no Google e Instagram.',
          result: 'Captação previsível de pacientes para implantes, facetas e alinhadores',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Recepção Odontológica Ética (CFO)',
      headlineMain: 'Veja Como a Secretária Digital Conduz o Paciente até a',
      headlineHighlight: 'Avaliação Clínica na Cadeira',
      disclaimer: 'Demonstração técnica ilustrativa do fluxo de atendimento odontológico (aderente ao CFO e LGPD).',
      whatsappDemo: {
        agentName: 'Secretária Digital • Clínica Odonto (Demonstração)',
        statusText: 'Online 24/7 • Acolhimento Humanizado',
        messages: [
          { sender: 'client', text: 'Olá, boa noite! Gostaria de saber o valor de implante dentário e se vocês atendem amanhã.', time: '22:08' },
          { sender: 'ai', text: 'Olá! Boa noite 🦷 Que bom receber seu contato. Na nossa clínica, o planejamento de Implantes é feito com diagnóstico digital individualizado para garantir total segurança e conforto no seu caso.', time: '22:08' },
          { sender: 'client', text: 'Entendi! E como faço para avaliar?', time: '22:09' },
          { sender: 'ai', text: 'Temos dois horários disponíveis amanhã com nosso Especialista em Implantodontia: às 10h30 ou às 16h00. Na consulta ele avalia sua estrutura óssea e já monta seu plano completo. Qual horário prefere reservar?', time: '22:09' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Recepção Odontológica Sobrecarregada',
        beforeItems: [
          'Pacientes que mandam mensagem à noite com dor ou dúvida ficam sem resposta',
          'Faltas não avisadas geram hora clínica ociosa com equipe e sala pagas',
          'Planos de tratamento avaliados ficam parados sem follow-up estruturado',
        ],
        afterTitle: 'Consultório com Arquitetura Domino (IA + n8n)',
        afterItems: [
          'Condução ética (CFO) que transforma pedidos de preço em avaliações agendadas',
          'Dupla confirmação automática (24h e 3h antes) + encaixe de lista de espera',
          'Pós-operatório automatizado e chamada semestral de profilaxia (6 em 6 meses)',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Triagem de Especialidade', tech: 'WhatsApp 24/7 + IA', desc: 'Identifica se é Implante, Estética, Ortodontia ou Urgência.' },
        { step: '02', title: 'Agendamento & Anti-Falta', tech: 'n8n Agenda', desc: 'Reserva horário e dispara confirmações 24h e 3h antes da consulta.' },
        { step: '03', title: 'Resgate de Tratamentos', tech: 'Follow-up Clínico', desc: 'Acompanha pacientes que fizeram avaliação mas ainda não iniciaram.' },
        { step: '04', title: 'Recall Preventivo (180d)', tech: 'Fidelização Odonto', desc: 'Convida o paciente automaticamente a cada 6 meses para profilaxia.' },
      ],
    },
    simulator: {
      economicModelType: 'odontologia-ocupacao-faltas',
      sectionTag: 'Simulador Econômico • Ocupação de Cadeira & Tratamentos',
      headlineMain: 'Calcule o Retorno Financeiro no Seu',
      headlineHighlight: 'Consultório ou Clínica Odontológica',
      subtitle: 'Simule em 3 cenários o impacto de agendar mais avaliações e reduzir faltas na cadeira:',
      slider1: { label: 'Pacientes interessados no WhatsApp por mês', unit: 'pacientes/mês', min: 30, max: 400, step: 10, defaultValue: 100 },
      slider2: { label: 'Ticket Médio do Tratamento / Procedimento', unit: 'R$', min: 350, max: 6000, step: 150, defaultValue: 1500 },
      slider3: { label: 'Faltas na cadeira / Orçamentos parados por semana', unit: 'casos/sem', min: 1, max: 20, step: 1, defaultValue: 4 },
      resultLabel: 'Impacto Econômico Clínico Estimado / Mês',
      conversionRate1: 0.12,
      recoveryRate3: 0.30,
      defaultMarginPct: 60,
      hourlyOperationalValue: 90,
      weeklyHoursSavedBase: 8,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'tratamentos extras iniciados/mês',
      metric3Suffix: 'faltas evitadas e orçamentos resgatados/mês',
    },
    form: {
      sectionTag: 'Diagnóstico para Odontologia',
      headlineMain: 'Modernize o Atendimento e a Agenda do',
      headlineHighlight: 'Seu Consultório Odontológico',
      subtitle: 'Informe as especialidades e necessidades da sua clínica para receber nosso diagnóstico:',
      orgLabel: 'Nome do Consultório / Clínica Odontológica',
      orgPlaceholder: 'Ex: Clínica Odonto Prime • Dr(a). Nome',
      subTypes: [
        'Consultório Odontológico Particular (1 a 2 cadeiras)',
        'Clínica Especializada em Implantes & Reabilitação Oral',
        'Estética Orofacial, Facetas/Lentes & Harmonização',
        'Ortodontia & Alinhadores Invisíveis',
        'Clínica Odontológica Multidisciplinar (+3 cadeiras)',
      ],
      painsList: [
        'Pacientes mandam mensagem no WhatsApp fora do horário ou demoram a ser respondidos',
        'Alto índice de faltas e desmarcações em avaliações e retornos',
        'Muitos orçamentos avaliados que o paciente não volta para fechar',
        'Falta de lembrete automático de retorno de 6 meses (profilaxia/manutenção)',
        'Secretária sobrecarregada entre recepção, telefone, convênios e WhatsApp',
        'Preciso de uma Landing Page ética (CFO) para captar pacientes particulares',
      ],
      demandLabel: 'Secretária IA + Automação N8N para Consultório Odontológico',
    },
    faqs: [
      {
        q: 'O atendimento da IA e a Landing Page seguem as regras do Conselho Federal de Odontologia (CFO)?',
        a: 'Sim, integralmente. A IA não passa orçamentos de tratamentos sem exame clínico prévio — ela explica a importância da avaliação presencial com o cirurgião-dentista e conduz o paciente com acolhimento para agendar sua consulta.',
      },
      {
        q: 'Como funciona o resgate de orçamentos odontológicos que ficaram em aberto?',
        a: 'Quando o paciente realiza a avaliação mas não inicia o tratamento na hora, o fluxo no n8n faz um acompanhamento gentil e programado nos dias seguintes, tirando dúvidas e ajudando sua secretária a destravar o fechamento.',
      },
      {
        q: 'Posso automatizar também o envio de recomendações pós-operatórias?',
        a: 'Com certeza! Após uma cirurgia de implante ou extração de siso, o sistema envia automaticamente no WhatsApp do paciente os cuidados pós-operatórios e pergunta no dia seguinte como ele está se sentindo — encantando o paciente.',
      },
      {
        q: 'Como funciona a chamada automática para limpeza (profilaxia) a cada 6 meses?',
        a: 'O sistema monitora a data da última consulta concluída e, ao completar 180 dias, envia uma mensagem personalizada convidando o paciente para sua revisão preventiva semestral.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'Odontologia 🦷',
      headerTitle: 'Consultor IA • Clínicas de Odontologia',
      initialMessage: 'Olá, Doutor(a)! 🦷 Sou o consultor da vertical de Odontologia da Domino Automate. Ajudo consultórios e clínicas odontológicas a converterem mais pacientes particulares no WhatsApp 24/7, reduzirem faltas na cadeira e resgatarem orçamentos de implantes, estética e ortodontia com IA e n8n. Qual é o foco principal do seu consultório hoje?',
      collectNamePrompt: 'Excelente, Doutor(a)! Para prepararmos o diagnóstico do seu consultório, qual é o seu nome e o nome da Clínica?',
      successMessage: 'Registrado! 🦷 Nossa automação N8N já processou os dados do seu consultório e nosso especialista entrará em contato no WhatsApp!',
    },
  },

  varejo: {
    key: 'varejo',
    slug: '/Varejo',
    headerBadge: '🛍️ Vertical Lojas Comerciais Físicas & Varejo',
    icon: '🛍️',
    metaTitle: 'Domino Automate | Vendas por IA 24/7 no WhatsApp, Catálogo Inteligente e Reativação para Lojas Físicas',
    metaDescription: 'Transforme o WhatsApp da sua loja física em uma máquina de vendas 24/7. Atendimento imediato com IA, recuperação de clientes inativos e integração de estoque/ERP com n8n e Python.',
    layoutStrategy: 'roi-first',
    sectionOrder: ['simulator', 'technical-proof', 'pillars', 'pas', 'form', 'faq'],
    defaultThemeMode: 'light',
    theme: {
      bgPrimary: '#0E1015',
      bgSecondary: '#151821',
      cardBg: '#1C202B',
      cardBorder: 'rgba(249, 115, 22, 0.32)',
      accentPrimary: '#F97316',
      accentSecondary: '#FB923C',
      accentGradient: 'linear-gradient(45deg, #EA580C, #FB923C)',
      buttonTextColor: '#0E1015',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      painBorderColor: '#EF4444',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.16) 0%, rgba(14, 16, 21, 1) 65%)',
      borderRadius: '10px',
    },
    lightTheme: {
      bgPrimary: '#FAFAFA',
      bgSecondary: '#F1F5F9',
      cardBg: '#FFFFFF',
      cardBorder: 'rgba(234, 88, 12, 0.24)',
      accentPrimary: '#EA580C',
      accentSecondary: '#F97316',
      accentText: '#C2410C',
      accentGradient: 'linear-gradient(45deg, #C2410C, #EA580C)',
      buttonTextColor: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      painBorderColor: '#DC2626',
      heroGlow: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.12) 0%, rgba(250, 250, 250, 1) 65%)',
      borderRadius: '10px',
    },
    hero: {
      preHeadline: '🛍️ Para Lojas Físicas de Moda, Calçados, Móveis, Autopeças, Materiais, Pet Shops & Comércio em Geral',
      headlineMain: 'Sua Loja Física Vendendo 24/7 no WhatsApp e',
      headlineHighlight: 'Trazendo Clientes de Volta ao Balcão.',
      subHeadline: 'Não dependa apenas de quem passa na calçada. Conectamos sua loja física a um Vendedor de IA 24/7 no WhatsApp e fluxos em n8n que respondem dúvidas de produtos/estoque em segundos, reservam mercadorias para retirada ou entrega e reativam clientes sumidos.',
      primaryCta: 'Simular Vendas da Minha Loja →',
      secondaryCta: 'Falar no WhatsApp',
      whatsappGreeting: 'Olá! Vim pela página /Varejo da Domino Automate e quero saber como funciona o Vendedor de IA no WhatsApp e Automação de Clientes para minha loja física!',
      metrics: [
        { value: '< 5 seg', label: 'Para atender o cliente que veio do Instagram' },
        { value: 'Drive-Thru', label: 'Reserva no WhatsApp para retirada na loja física' },
        { value: '60/90 dias', label: 'Reativação automática de clientes inativos' },
      ],
      visualCard: {
        tag: 'Varejo Físico + Digital (Phygital) • IA + n8n',
        title: 'Do Post no Instagram para o Caixa da Loja ou Motoboy',
        subtitle: 'Atendimento instantâneo, reserva de peças e fidelização automática.',
        bullets: [
          'Pré-venda inteligente 24/7: tira dúvidas de tamanhos, cores, especificações e formas de pagamento',
          'Reativação automática de clientes de aniversário, trocas de coleção e promoções VIP',
          'Integração via Python/n8n entre planilha/ERP de estoque, WhatsApp dos vendedores e pós-venda',
        ],
      },
    },
    pas: {
      sectionTag: 'Por Que Lojas Físicas Perdem Vendas Todos os Dias?',
      headlineMain: 'O Cliente Vê Seu Produto no Instagram, Chama no WhatsApp e',
      headlineHighlight: 'Desiste Porque o Vendedor Demorou 40 Minutos.',
      pains: [
        {
          icon: '🏃',
          title: 'Vendedor Ocupado na Loja e WhatsApp Abandonado',
          desc: 'Quando a loja física enche, ninguém responde o WhatsApp. Quando a loja esvazia, o cliente que perguntou "tem no tamanho M?" ou "tem essa peça em estoque?" já comprou no concorrente ou na internet.',
        },
        {
          icon: '📉',
          title: 'Milhares de Clientes no Cadastro que Nunca Mais Foram Chamados',
          desc: 'Você tem o telefone de centenas de pessoas que já compraram na sua loja, mas elas passam 6 meses sem receber uma mensagem personalizada com novidades ou benefícios.',
        },
        {
          icon: '📦',
          title: 'Falta de Padrão no Atendimento e Pós-Venda Inexistente',
          desc: 'Cada vendedor responde de um jeito, esquece de fazer follow-up de orçamentos abertos e ninguém pergunta se o cliente gostou do produto após a compra.',
        },
      ],
    },
    pillars: {
      sectionTag: 'Arquitetura Domino Automate para o Comércio Físico',
      headlineMain: 'Transforme Seu WhatsApp e Seu Cadastro em',
      headlineHighlight: 'Lucro Diário no Caixa',
      items: [
        {
          badge: 'PILAR 01 • VENDEDOR DE IA 24/7',
          icon: '🛒',
          title: 'Recepção e Qualificação Instantânea no WhatsApp',
          desc: 'Atende clientes dia e noite, apresenta produtos, condições de parcelamento e entrega/retirada na loja, e já transfere o pedido mastigado para o vendedor finalizar ou cobrar.',
          result: 'Zero vendas perdidas fora do horário comercial ou em picos de loja',
        },
        {
          badge: 'PILAR 02 • MÁQUINA DE RECOMPRA N8N',
          icon: '🔁',
          title: 'Pós-Venda, Aniversariantes e Reativação de Inativos',
          desc: 'Automatiza mensagens de pós-venda, cupom de aniversário, recuperação de orçamentos não fechados e campanhas segmentadas para trazer o cliente de volta à loja física.',
          result: 'Giro de estoque acelerado e clientes comprando mais vezes no ano',
        },
        {
          badge: 'PILAR 03 • VITRINE WEB & INTEGRAÇÃO ERP',
          icon: '⚡',
          title: 'Landing Page de Ofertas & Conciliação em Python',
          desc: 'Página rápida de alta conversão para suas campanhas locais + scripts em Python e n8n para integrar seu sistema de gestão/planilhas ao fluxo de vendas do WhatsApp.',
          result: 'Operação comercial organizada e controle total dos resultados',
        },
      ],
    },
    technicalProof: {
      sectionTag: 'Demonstração Técnica • Venda Omnichannel no WhatsApp',
      headlineMain: 'Veja Como o Vendedor IA Transforma Dúvidas em',
      headlineHighlight: 'Retirada na Loja ou Entrega no Mesmo Dia',
      disclaimer: 'Demonstração técnica ilustrativa do fluxo omnichannel para Lojas Físicas.',
      whatsappDemo: {
        agentName: 'Consultor Digital • Loja Física (Demonstração)',
        statusText: 'Online 24/7 • Consulta de Catálogo & Reserva',
        messages: [
          { sender: 'client', text: 'Oi! Vi no Instagram aquele tênis corrida preto. Tem tamanho 41 na loja do Centro?', time: '19:45' },
          { sender: 'ai', text: 'Olá! Boa noite 🛍️ Conferi aqui no estoque da unidade Centro e temos 2 pares do modelo Running Black no tamanho 41! Está R$ 349 (ou 6x de R$ 58,16 sem juros).', time: '19:45' },
          { sender: 'client', text: 'Que ótimo! Consigo passar aí amanhã na hora do almoço pra pegar.', time: '19:46' },
          { sender: 'ai', text: 'Perfeito! Já deixei o par 41 reservado no seu nome no balcão expresso até amanhã às 14h00 (ou se preferir, enviamos por motoboy amanhã às 9h). Também quer ver as meias de compressão com 20% off no combo?', time: '19:46' },
        ],
      },
      beforeAfter: {
        beforeTitle: 'Atendimento Varejista Tradicional',
        beforeItems: [
          'Leads de anúncios do Instagram à noite esfriam até a loja abrir no dia seguinte',
          'Vendedores esquecem de retornar orçamentos de maior valor',
          'Base de clientes antigos fica inativa esperando o cliente passar na rua',
        ],
        afterTitle: 'Loja Física com Arquitetura Domino (IA + n8n)',
        afterItems: [
          'Consulta imediata de disponibilidade, preço e reserva para retirada em loja',
          'Roleta inteligente de distribuição de leads qualificados para os vendedores',
          'Campanhas automáticas de pós-venda, aniversário e recompra (60/90 dias)',
        ],
      },
      workflowSteps: [
        { step: '01', title: 'Clique no Anúncio / Bio', tech: 'Instagram -> WhatsApp', desc: 'Cliente pergunta de produto visto nos Stories ou Reels.' },
        { step: '02', title: 'Pré-Venda & Estoque', tech: 'Gemini 2.5 + Python/ERP', desc: 'Informa tamanhos, cores, parcelamento e sugere item complementar.' },
        { step: '03', title: 'Reserva ou Roleta de Vendedores', tech: 'n8n Router', desc: 'Reserva para retirada em loja ou aciona o vendedor da vez.' },
        { step: '04', title: 'Pós-Venda & Recompra', tech: 'Automação de CRM', desc: 'Avalia satisfação em 7 dias e reativa o cliente aos 60 dias.' },
      ],
    },
    simulator: {
      economicModelType: 'varejo-vendas-recompra',
      sectionTag: 'Simulador Econômico • Vendas WhatsApp & Recompra de Base',
      headlineMain: 'Calcule Quanto Sua Loja Pode Vender a Mais',
      headlineHighlight: 'Todos os Meses pelo WhatsApp',
      subtitle: 'Simule em 3 cenários o impacto de responder clientes em segundos e reativar compradores antigos:',
      slider1: { label: 'Contatos de clientes no WhatsApp/Direct por mês', unit: 'contatos/mês', min: 100, max: 3000, step: 50, defaultValue: 500 },
      slider2: { label: 'Ticket Médio por venda na loja', unit: 'R$', min: 50, max: 1500, step: 25, defaultValue: 180 },
      slider3: { label: 'Orçamentos abertos / Clientes inativos reativados por semana', unit: 'clientes/sem', min: 3, max: 60, step: 2, defaultValue: 12 },
      resultLabel: 'Impacto Econômico Estimado na Loja / Mês',
      conversionRate1: 0.14,
      recoveryRate3: 0.35,
      defaultMarginPct: 45,
      hourlyOperationalValue: 35,
      weeklyHoursSavedBase: 8,
      baselineRevenueMultiplier: 1.5,
      metric1Suffix: 'vendas extras pelo WhatsApp/mês',
      metric3Suffix: 'clientes reativados voltando a comprar/mês',
    },
    form: {
      sectionTag: 'Diagnóstico Comercial • Lojas Físicas & Varejo',
      headlineMain: 'Acelere as Vendas da Sua',
      headlineHighlight: 'Loja Física com IA e Automação',
      subtitle: 'Conte-nos o ramo da sua loja abaixo para prepararmos o plano de automação de vendas:',
      orgLabel: 'Nome da Loja / Empresa Comercial',
      orgPlaceholder: 'Ex: Loja Central Moda / Casa & Construção',
      subTypes: [
        'Moda, Vestuário, Calçados & Acessórios',
        'Móveis, Decoração, Colchões & Eletro',
        'Autopeças, Pneus, Oficinas & Concessionárias',
        'Materiais de Construção, Tintas & Ferragens',
        'Pet Shop, Suplementos, Presentes & Varejo Geral',
      ],
      painsList: [
        'Demora para responder clientes no WhatsApp quando a loja está cheia',
        'Perda de vendas à noite, domingos e feriados no WhatsApp/Instagram',
        'Cadastro de clientes antigos parado sem ações de recompra',
        'Vendedores que esquecem de dar retorno em orçamentos abertos',
        'Falta de pós-venda automático e lembrete de aniversário',
        'Preciso integrar nosso sistema/planilha de estoque ao atendimento',
      ],
      demandLabel: 'Vendedor IA WhatsApp + Automação N8N para Loja Física',
    },
    faqs: [
      {
        q: 'Como a IA trabalha junto com a minha equipe de vendedores da loja física?',
        a: 'A IA faz o atendimento imediato (em menos de 5 segundos), descobre exatamente o que o cliente procura, responde dúvidas iniciais e pode fechar o pedido ou distribuir o cliente já qualificado na fila da sua equipe de vendas.',
      },
      {
        q: 'Serve tanto para quem vende produtos de giro rápido quanto para produtos sob orçamento?',
        a: 'Sim! Configuramos a árvore de atendimento e o tom de voz exatamente para o seu ramo — seja moda e calçados, móveis planejados, autopeças, materiais de construção ou pet shop.',
      },
      {
        q: 'Como funciona a reativação de clientes que já compraram na loja?',
        a: 'Conectamos sua lista de clientes ao n8n para disparar comunicações personalizadas de pós-venda, mês de aniversário e avisos quando o cliente completa 60 ou 90 dias sem comprar.',
      },
      {
        q: 'É possível consultar estoque ou tabela de preços automaticamente?',
        a: 'Sim! Com nossos conectores em Python e n8n, a IA pode consultar sua planilha atualizada, banco de dados ou API do seu sistema ERP para informar disponibilidade e preços com precisão.',
      },
    ],
    chatConfig: {
      welcomeBubbleTitle: 'Consultor IA',
      welcomeBubbleHighlight: 'Varejo & Lojas 🛍️',
      headerTitle: 'Consultor IA • Lojas Comerciais Físicas',
      initialMessage: 'Olá! 🛍️ Sou o consultor da vertical de Varejo & Lojas Físicas da Domino Automate. Ajudo lojistas a venderem 24/7 pelo WhatsApp com IA, acabarem com a perda de clientes por demora no atendimento e reativarem a base de clientes antigos com automação n8n. Qual é o ramo da sua loja hoje?',
      collectNamePrompt: 'Show! Para eu preparar o diagnóstico comercial da sua loja, qual é o seu nome e o nome da sua Loja?',
      successMessage: 'Tudo pronto! 🛍️ Já registrei os dados da sua loja na nossa automação N8N e nosso especialista vai falar com você no WhatsApp!',
    },
  },
};
