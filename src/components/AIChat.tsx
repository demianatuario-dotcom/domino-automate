'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SEGMENTS_CONFIG, SegmentNicheKey } from '@/config/segmentsConfig';
import { trackDominoEvent } from '@/lib/analytics';

interface AIChatProps {
  niche?: SegmentNicheKey;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: {
    0: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function AIChat({ niche = 'atuaria' }: AIChatProps) {
  const isAtuaria = niche === 'atuaria';
  const isEstudios = niche === 'estudios';
  const customSegment = !isAtuaria && !isEstudios ? SEGMENTS_CONFIG[niche] : null;

  const initialMessage = customSegment
    ? customSegment.chatConfig.initialMessage
    : isEstudios
      ? 'Olá! ✨ Sou a consultora de IA da Domino Automate para Estúdios de Beleza e Clínicas de Estética. Ajudo você a lotar sua agenda pelo WhatsApp 24/7, reduzir faltas (No-Show) e ter uma página de alta conversão. Qual é o foco do seu estúdio hoje?'
      : 'Olá! Sou o assistente técnico da vertical de Atuária da Domino Automate. Presto consultoria preliminar sobre cálculos atuariais (MIBA 1807), perícias judiciais (TRT10/TJDFT), conformidade CPC 33 / PREVIC e automação analítica de riscos. Como posso orientar sua demanda hoje?';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingOfferDiagnostic, setPendingOfferDiagnostic] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const messagesRef = useRef(messages);

  const accentColor = customSegment
    ? customSegment.theme.accentPrimary
    : isEstudios
      ? '#D4AF37'
      : 'var(--secondary)';

  const headerBg = customSegment
    ? customSegment.theme.cardBg
    : isEstudios
      ? '#1A1416'
      : 'var(--primary-container)';

  const chatBodyBg = customSegment
    ? customSegment.theme.bgPrimary
    : isEstudios
      ? '#110D0F'
      : 'var(--surface)';

  const assistantMsgBg = customSegment
    ? customSegment.theme.bgSecondary
    : isEstudios
      ? '#1D1619'
      : 'var(--surface-container)';

  const iconSymbol = customSegment ? customSegment.icon : isEstudios ? '✨' : '🏛️';

  const headerTitle = customSegment
    ? customSegment.chatConfig.headerTitle
    : isEstudios
      ? 'Consultora IA • Estúdios de Beleza'
      : 'Consultor Técnico • Atuária & IA';

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setTimeout(() => openButtonRef.current?.focus(), 20);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionCtor) {
        const instance = new SpeechRecognitionCtor();
        instance.continuous = false;
        instance.interimResults = false;
        instance.lang = 'pt-BR';

        instance.onresult = (event: SpeechRecognitionEventLike) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);

          setTimeout(() => {
            handleSendInternal(transcript);
          }, 400);
        };

        instance.onerror = () => {
          setIsListening(false);
        };

        instance.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = instance;
      }
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const [leadStage, setLeadStage] = useState<
    'neutral' | 'collect_name' | 'collect_email' | 'collect_phone' | 'collect_consent'
  >('neutral');
  const [leadData, setLeadData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dores: [] as string[],
    detalhes: '',
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendInternal(input);
  };

  const handleSendInternal = async (text: string) => {
    if (!text.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    if (leadStage !== 'neutral') {
      await processLeadCapture(userMessage);
      return;
    }

    // Check if user confirmed diagnostic offer
    if (pendingOfferDiagnostic) {
      const lower = userMessage.toLowerCase();
      if (
        lower.includes('sim') ||
        lower.includes('pode') ||
        lower.includes('claro') ||
        lower.includes('quero')
      ) {
        setPendingOfferDiagnostic(false);
        setLeadStage('collect_name');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: customSegment
              ? customSegment.chatConfig.collectNamePrompt
              : isEstudios
                ? 'Maravilha! ✨ Para começar, qual é o seu nome e o nome do seu Estúdio/Clínica?'
                : 'Ótimo! Para começar, qual o nome da sua empresa/escritório ou o seu nome de contato?',
          },
        ]);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messagesRef.current.slice(1).slice(-10),
          message: userMessage,
          niche,
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        qualification?: {
          shouldOfferDiagnostic?: boolean;
          gargalos?: string[];
          detalhes?: string;
        };
      };

      if (res.ok && data.reply) {
        const cleanReply = data.reply.replace(/\[\[AUTOMATE: .*?\]\]/g, '').trim();

        if (data.qualification?.shouldOfferDiagnostic) {
          setPendingOfferDiagnostic(true);
          setLeadData((prev) => ({
            ...prev,
            dores: data.qualification?.gargalos ?? prev.dores,
            detalhes: data.qualification?.detalhes ?? prev.detalhes,
          }));
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: cleanReply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Você também pode falar diretamente com nossa equipe pelo botão de WhatsApp da página.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Ocorreu uma oscilação de rede. Tente novamente em instantes.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLeadCapture = async (text: string) => {
    if (leadStage === 'neutral') return;

    const trimmed = text.trim();

    if (leadStage === 'collect_name') {
      if (trimmed.length < 2) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Por favor, informe um nome válido (mínimo 2 caracteres).' },
        ]);
        return;
      }
      setLeadData((prev) => ({ ...prev, nome: trimmed }));
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Perfeito! Qual o melhor e-mail para enviarmos o diagnóstico?' },
      ]);
      setLeadStage('collect_email');
    } else if (leadStage === 'collect_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'O e-mail informado parece inválido. Por favor, informe um e-mail válido (ex: contato@suaempresa.com.br):',
          },
        ]);
        return;
      }
      setLeadData((prev) => ({ ...prev, email: trimmed }));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'E por último, qual o seu WhatsApp com DDD? (Se preferir não informar, digite "não")',
        },
      ]);
      setLeadStage('collect_phone');
    } else if (leadStage === 'collect_phone') {
      const lower = trimmed.toLowerCase();
      const skippedPhone = lower === 'não' || lower === 'nao' || lower === 'n';
      const phoneRegex = /^[0-9+\-()\s]{8,22}$/;
      const digitsOnly = trimmed.replace(/\D/g, '');

      if (!skippedPhone && (!phoneRegex.test(trimmed) || digitsOnly.length < 8 || digitsOnly.length > 15)) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'O telefone informado parece inválido. Informe um número com DDD (ex: 61 99999-9999) ou digite "não" para continuar:',
          },
        ]);
        return;
      }

      const phone = skippedPhone ? '' : trimmed;
      setLeadData((prev) => ({ ...prev, telefone: phone }));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Para concluir em conformidade com a LGPD (Lei nº 13.709/2018): você autoriza o uso desses dados exclusivamente para o retorno do diagnóstico comercial pela Domino Automate? Responda **"sim"** para confirmar o envio.',
        },
      ]);
      setLeadStage('collect_consent');
    } else if (leadStage === 'collect_consent') {
      const lower = trimmed.toLowerCase();
      const isNo = lower === 'não' || lower === 'nao' || lower.includes('cancelar') || lower === 'n';
      const isYes =
        lower === 'sim' ||
        lower.startsWith('sim') ||
        lower.includes('concordo') ||
        lower.includes('autorizo') ||
        lower.includes('aceito') ||
        lower === 'ok' ||
        lower === 'pode';

      if (isNo) {
        setLeadStage('neutral');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Envio cancelado conforme solicitado. Nenhum dado foi salvo. Caso deseje atendimento direto, utilize o botão de WhatsApp da página.',
          },
        ]);
        return;
      }

      if (!isYes) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Por favor, responda **"sim"** para confirmar o consentimento LGPD e enviar o diagnóstico, ou **"não"** para cancelar.',
          },
        ]);
        return;
      }

      setLeadStage('neutral');
      setIsLoading(true);

      const verticalSlug = customSegment
        ? customSegment.slug
        : isEstudios
          ? '/Estudios'
          : '/Atuaria';
      const demandaLabel = customSegment
        ? customSegment.form.demandLabel
        : isEstudios
          ? 'Automação IA + N8N para Estúdio de Beleza'
          : 'Diagnóstico Estratégico';

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vertical: verticalSlug,
            origem: `${verticalSlug} (Chat IA)`,
            nome: leadData.nome,
            email: leadData.email,
            telefone: leadData.telefone,
            demanda: demandaLabel,
            dores: leadData.dores.join(', '),
            doresArray: leadData.dores,
            descricao: leadData.detalhes || `Solicitado via Consultor IA na vertical ${verticalSlug}`,
            lgpdConsent: true,
          }),
        });

        if (res.ok) {
          const resData = (await res.json().catch(() => ({}))) as {
            deliveryStatus?: string;
            n8nDelivered?: boolean;
          };
          const statusMsg =
            resData.deliveryStatus === 'queued_outbox'
              ? 'Tudo pronto! Seu diagnóstico foi salvo com segurança em nossa fila prioritária e nossa equipe entrará em contato em breve.'
              : customSegment
                ? customSegment.chatConfig.successMessage
                : isEstudios
                  ? 'Tudo pronto! ✨ Já registrei seu pedido na nossa automação N8N e nossa equipe vai entrar em contato!'
                  : 'Tudo pronto! O diagnóstico foi registrado e será analisado pelo atuário Demian Lisboa Pereira (MIBA 1807).';

          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: statusMsg,
            },
          ]);
          window.dispatchEvent(new CustomEvent('automate-budget', { detail: leadData }));
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Não foi possível registrar seu pedido agora. Por favor, acione nossa equipe diretamente pelo botão de WhatsApp da página.',
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Não foi possível concluir o envio por oscilação de conexão. Você pode falar conosco diretamente no WhatsApp da página.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatMessage = (text: string) => {
    const cleanText = text.replace(/\[\[AUTOMATE: .*?\]\]/g, '').trim();
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} style={{ color: accentColor }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 1000,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          className="glass-panel chat-welcome-bubble"
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '12px 12px 0 12px',
            backgroundColor: headerBg,
            border: `1px solid ${accentColor}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
          onClick={() => {
            setIsOpen(true);
            trackDominoEvent('chat_open', { vertical: niche, section: 'floating_bubble' });
          }}
        >
          <p className="body-sm" style={{ margin: 0, fontWeight: 600, color: '#F8FAFC', fontSize: '0.8rem' }}>
            {customSegment ? (
              <>
                {customSegment.chatConfig.welcomeBubbleTitle}{' '}
                <span style={{ color: accentColor }}>{customSegment.chatConfig.welcomeBubbleHighlight}</span>
              </>
            ) : isEstudios ? (
              <>
                Consultora IA <span style={{ color: accentColor }}>Estúdios ✨</span>
              </>
            ) : (
              <>
                Consultor IA <span style={{ color: accentColor }}>Atuária 🏛️</span>
              </>
            )}
          </p>
        </div>

        <button
          ref={openButtonRef}
          type="button"
          aria-label="Abrir Consultor de IA"
          aria-expanded={isOpen}
          aria-controls="domino-ai-chat-dialog"
          className="floating-shadow glass-panel"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: headerBg,
            border: `2px solid ${accentColor}`,
          }}
          onClick={() => {
            setIsOpen(true);
            trackDominoEvent('chat_open', { vertical: niche, section: 'floating_button' });
          }}
        >
          <span style={{ fontSize: '1.6rem' }} aria-hidden="true">{iconSymbol}</span>
        </button>
      </div>

      {isOpen && (
        <div
          id="domino-ai-chat-dialog"
          role="dialog"
          aria-modal="false"
          aria-label={headerTitle}
          className="card-base floating-shadow ghost-border chat-window-mobile"
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            width: '370px',
            height: '510px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            border: `1px solid ${accentColor}`,
          }}
        >
          <div
            style={{
              backgroundColor: headerBg,
              padding: '0.9rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--outline-variant)',
            }}
          >
            <span
              className="label-md"
              style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span aria-hidden="true">{iconSymbol}</span>
              {headerTitle}
            </span>
            <button
              type="button"
              aria-label="Fechar chat"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => openButtonRef.current?.focus(), 20);
              }}
              style={{
                background: 'transparent',
                color: '#F8FAFC',
                cursor: 'pointer',
                fontSize: '1.5rem',
                lineHeight: 1,
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              ×
            </button>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-busy={isLoading}
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              backgroundColor: chatBodyBg,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  backgroundColor: m.role === 'user' ? headerBg : assistantMsgBg,
                  color: '#F8FAFC',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '8px',
                  border:
                    m.role === 'user' ? `1px solid ${accentColor}` : '1px solid var(--outline-variant)',
                }}
              >
                <p className="body-sm" style={{ color: '#F8FAFC' }}>
                  {formatMessage(m.content)}
                </p>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: assistantMsgBg,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                <p className="body-sm" style={{ opacity: 0.7, color: '#F8FAFC' }}>
                  Analisando...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            style={{
              padding: '0.85rem',
              backgroundColor: headerBg,
              borderTop: '1px solid var(--outline-variant)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              ref={inputRef}
              id="domino-ai-chat-input"
              aria-label="Mensagem para o consultor de IA"
              type="text"
              className="input-field"
              style={{
                flex: 1,
                minHeight: '44px',
                padding: '0.5rem 0.9rem',
                backgroundColor: chatBodyBg,
                color: '#F8FAFC',
              }}
              placeholder={isListening ? 'Ouvindo...' : 'Digite sua dúvida...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListen}
              aria-label={isListening ? 'Parar gravação de voz' : 'Falar por voz'}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                background: 'transparent',
                border: isListening ? '1px solid var(--error)' : '1px solid var(--outline-variant)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px',
              }}
              title={isListening ? 'Parar gravação' : 'Falar por voz'}
            >
              <span style={{ fontSize: '1.15rem', color: isListening ? 'var(--error)' : accentColor }} aria-hidden="true">
                {isListening ? '🛑' : '🎤'}
              </span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Enviar mensagem"
              className="btn-primary"
              style={{
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ▶
            </button>
          </form>
        </div>
      )}
    </>
  );
}
