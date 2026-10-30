'use client';
import React, { useState, useRef, useEffect } from 'react';

interface AIChatProps {
  niche?: 'atuaria' | 'estudios';
}

export default function AIChat({ niche = 'atuaria' }: AIChatProps) {
  const isEstudios = niche === 'estudios';

  const initialMessage = isEstudios
    ? 'Olá! ✨ Sou a consultora de IA da Domino Automate para Estúdios de Beleza e Clínicas de Estética. Ajudo você a lotar sua agenda pelo WhatsApp 24/7, reduzir faltas (No-Show) e ter uma página de alta conversão. Qual é o foco do seu estúdio hoje?'
    : 'Olá! Sou o assistente técnico da vertical de Atuária da Domino Automate. Presto consultoria preliminar sobre cálculos atuariais (MIBA 1807), perícias judiciais (TRT10/TJDFT), conformidade CPC 33 / PREVIC e automação analítica de riscos. Como posso orientar sua demanda hoje?';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef(messages);

  const accentColor = isEstudios ? '#D4AF37' : 'var(--secondary)';
  const headerBg = isEstudios ? '#1A1416' : 'var(--primary-container)';

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
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'pt-BR';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);

          setTimeout(() => {
            handleSendInternal(transcript);
          }, 500);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Desculpe, seu navegador não suporta reconhecimento de voz.");
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendInternal(input);
  };

  const [leadStage, setLeadStage] = useState<'neutral' | 'collect_name' | 'collect_email' | 'collect_phone'>('neutral');
  const [leadData, setLeadData] = useState({ nome: '', email: '', telefone: '', dores: [] as string[], detalhes: '' });

  const handleSendInternal = async (text: string) => {
    if (!text.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    if (leadStage !== 'neutral') {
      processLeadCapture(userMessage);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messagesRef.current.slice(1),
          message: userMessage,
          niche
        })
      });
      const data = await res.json();

      if (res.ok && data.reply) {
        let cleanReply = data.reply;
        const automateMatch = cleanReply.match(/\[\[AUTOMATE: (.*?)\]\]/);

        if (automateMatch) {
          try {
            const automateData = JSON.parse(automateMatch[1]);
            setLeadData(prev => ({ ...prev, dores: automateData.gargalos, detalhes: automateData.detalhes }));
            cleanReply = cleanReply.replace(/\[\[AUTOMATE: .*?\]\]/, '').trim();
          } catch (e) {
            console.error("Erro ao processar dados de automação", e);
          }
        }

        setMessages(prev => [...prev, { role: 'assistant', content: cleanReply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, meu sistema está passando por uma atualização rápida. Você também pode falar diretamente conosco pelo botão de WhatsApp da página!' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops! Ocorreu um erro de rede. Tente novamente em instantes.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLeadCapture = (text: string) => {
    if (leadStage === 'neutral') return;

    if (leadStage === 'collect_name') {
      setLeadData(prev => ({ ...prev, nome: text }));
      setMessages(prev => [...prev, { role: 'assistant', content: 'Perfeito! Qual o melhor e-mail para enviarmos a proposta e o diagnóstico?' }]);
      setLeadStage('collect_email');
    } else if (leadStage === 'collect_email') {
      setLeadData(prev => ({ ...prev, email: text }));
      setMessages(prev => [...prev, { role: 'assistant', content: 'E por último, qual o seu WhatsApp com DDD? (Se preferir não informar, basta digitar "não")' }]);
      setLeadStage('collect_phone');
    } else if (leadStage === 'collect_phone') {
      const phone = text.toLowerCase().includes('não') ? '' : text;
      const finalData = { ...leadData, telefone: phone };
      setLeadData(finalData);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isEstudios
            ? 'Tudo pronto! ✨ Já registrei seu pedido na nossa automação N8N e nossa equipe vai entrar em contato com o plano personalizado para o seu estúdio!'
            : 'Tudo pronto! O diagnóstico foi registrado via N8N e será analisado pelo atuário Demian Lisboa Pereira (MIBA 1807).'
        }
      ]);
      setLeadStage('neutral');

      window.dispatchEvent(new CustomEvent('automate-budget', { detail: finalData }));
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user' && leadStage === 'neutral') {
      const lastAssistant = messages[messages.length - 2];
      if (lastAssistant?.content.toLowerCase().includes('posso fazer seu pedido de orçamento')) {
        const text = lastMessage.content.toLowerCase();
        if (text.includes('sim') || text.includes('pode') || text.includes('claro') || text.includes('com certeza') || text.includes('quero')) {
          setLeadStage('collect_name');
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: isEstudios
                ? 'Maravilha! ✨ Para começar, qual é o seu nome e o nome do seu Estúdio/Clínica?'
                : 'Ótimo! Para começar, qual o nome da sua empresa/escritório ou o seu nome de contato?'
            }
          ]);
        }
      }
    }
  }, [messages, leadStage, isEstudios]);

  const formatMessage = (text: string) => {
    const cleanText = text.replace(/\[\[AUTOMATE: .*?\]\]/g, '').trim();
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: accentColor }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <div
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: isOpen ? 'none' : 'flex', alignItems: 'flex-end', gap: '1rem' }}
      >
        <div
          className="glass-panel chat-welcome-bubble"
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '1rem 1rem 0 1rem',
            backgroundColor: isEstudios ? '#1A1416' : 'var(--surface-container-highest)',
            border: `1px solid ${accentColor}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            position: 'relative',
            top: '-10px'
          }}
          onClick={() => setIsOpen(true)}
        >
          <p className="body-sm" style={{ margin: 0, fontWeight: 500, color: 'var(--on-surface)', textAlign: 'center' }}>
            {isEstudios ? (
              <>Consultora IA<br /><span style={{ color: accentColor }}>para Estúdios ✨</span></>
            ) : (
              <>Consultor IA<br /><span style={{ color: accentColor }}>Atuária & Riscos 🏛️</span></>
            )}
          </p>
        </div>

        <div
          className="floating-shadow glass-panel"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: headerBg,
            border: `2px solid ${accentColor}`,
            animation: 'pulse 2s infinite'
          }}
          onClick={() => setIsOpen(true)}
        >
          <span style={{ fontSize: '1.75rem' }}>{isEstudios ? '✨' : '💬'}</span>
        </div>
      </div>

      {isOpen && (
        <div
          className="card-base floating-shadow ghost-border chat-window-mobile"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '370px',
            height: '520px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            border: `1px solid ${accentColor}`
          }}
        >
          <div style={{ backgroundColor: headerBg, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
            <span className="label-md" style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{isEstudios ? '✨' : '🏛️'}</span>
              {isEstudios ? 'Consultora IA • Estúdios de Beleza' : 'Consultor Técnico • Atuária & IA'}
            </span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'var(--on-surface)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: isEstudios ? '#110D0F' : 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: m.role === 'user' ? headerBg : (isEstudios ? '#1D1619' : 'var(--surface-container)'),
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: m.role === 'user' ? `1px solid ${accentColor}` : '1px solid var(--outline-variant)'
                }}
              >
                <p className="body-sm">{formatMessage(m.content)}</p>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: isEstudios ? '#1D1619' : 'var(--surface-container)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                <p className="body-sm" style={{ opacity: 0.6 }}>Digitando...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: isEstudios ? '#1A1416' : 'var(--surface-container-highest)', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              style={{ flex: 1, minHeight: '40px', padding: '0.5rem 1rem', backgroundColor: isEstudios ? '#110D0F' : undefined }}
              placeholder={isListening ? "Ouvindo..." : "Digite sua dúvida..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListen}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                background: 'transparent',
                border: isListening ? '1px solid var(--error)' : '1px solid var(--outline-variant)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40px',
                minHeight: '40px',
                animation: isListening ? 'pulse 2s infinite' : 'none'
              }}
              title={isListening ? "Parar gravação" : "Falar"}
            >
              <span style={{ fontSize: '1.2rem', color: isListening ? 'var(--error)' : accentColor }}>
                {isListening ? '🛑' : '🎤'}
              </span>
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ▶
            </button>
          </form>
        </div>
      )}
    </>
  );
}
