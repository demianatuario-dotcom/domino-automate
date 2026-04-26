'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente virtual da Domino Automate. Ajudo empresas a venderem mais e trabalharem menos usando tecnologia. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef(messages);

  // Sync ref with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if(isOpen) scrollToBottom();
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
          
          // Envio automático após transcrição com um pequeno delay visual
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

    // Lógica de captura de leads no frontend
    if (leadStage !== 'neutral') {
      processLeadCapture(userMessage);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messagesRef.current.slice(1), message: userMessage })
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

        // Detectar se a IA perguntou sobre o orçamento
        if (cleanReply.toLowerCase().includes('posso fazer seu pedido de orçamento')) {
          // O fluxo de confirmação será tratado na próxima resposta do usuário
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, meu sistema está passando por uma manutenção no momento.' }]);
      }
    } catch(err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops! Ocorreu um erro de rede.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processLeadCapture = (text: string) => {
    if (leadStage === 'neutral') return;

    if (leadStage === 'collect_name') {
      setLeadData(prev => ({ ...prev, nome: text }));
      setMessages(prev => [...prev, { role: 'assistant', content: 'Perfeito! Qual o melhor e-mail para enviarmos a proposta?' }]);
      setLeadStage('collect_email');
    } else if (leadStage === 'collect_email') {
      setLeadData(prev => ({ ...prev, email: text }));
      setMessages(prev => [...prev, { role: 'assistant', content: 'E por último, qual o seu WhatsApp? (Se preferir não informar, basta digitar "não")' }]);
      setLeadStage('collect_phone');
    } else if (leadStage === 'collect_phone') {
      const phone = text.toLowerCase().includes('não') ? '' : text;
      const finalData = { ...leadData, telefone: phone };
      setLeadData(finalData);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Tudo pronto! O formulário será analisado pela Domino Automate e entraremos em contato após a análise.' }]);
      setLeadStage('neutral');
      
      // Disparar Automação Silenciosa
      window.dispatchEvent(new CustomEvent('automate-budget', { detail: finalData }));
    }
  };

  // Interceptar respostas de confirmação do orçamento
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user' && leadStage === 'neutral') {
      const lastAssistant = messages[messages.length - 2];
      if (lastAssistant?.content.toLowerCase().includes('posso fazer seu pedido de orçamento')) {
        const text = lastMessage.content.toLowerCase();
        if (text.includes('sim') || text.includes('pode') || text.includes('claro') || text.includes('com certeza')) {
          setLeadStage('collect_name');
          setMessages(prev => [...prev, { role: 'assistant', content: 'Ótimo! Para começar, qual o nome da sua empresa ou o seu nome de contato?' }]);
        }
      }
    }
  }, [messages, leadStage]);

  const formatMessage = (text: string) => {
    // Remove tags de automação da exibição
    const cleanText = text.replace(/\[\[AUTOMATE: .*?\]\]/g, '').trim();
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ color: 'var(--secondary)' }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button Container */}
      <div 
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: isOpen ? 'none' : 'flex', alignItems: 'flex-end', gap: '1rem' }}
      >
        {/* Welcome Message Bubble */}
        <div 
          className="glass-panel"
          style={{ padding: '0.75rem 1.25rem', borderRadius: '1rem 1rem 0 1rem', backgroundColor: 'var(--surface-container-highest)', border: '1px solid var(--secondary)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', position: 'relative', top: '-10px' }}
          onClick={() => setIsOpen(true)}
        >
          <p className="body-sm" style={{ margin: 0, fontWeight: 500, color: 'var(--on-surface)', textAlign: 'center' }}>Fale com nosso<br/><span style={{color: 'var(--secondary)'}}>assistente virtual!</span></p>
        </div>

        {/* Floating Button */}
        <div 
          className="floating-shadow glass-panel"
          style={{ width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-container)', border: '2px solid var(--secondary)', animation: 'pulse 2s infinite' }}
          onClick={() => setIsOpen(true)}
        >
          <span style={{ fontSize: '1.75rem' }}>💬</span>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="card-base floating-shadow ghost-border" 
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '350px', height: '500px', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ backgroundColor: 'var(--primary-container)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
            <span className="label-md" style={{ color: 'var(--secondary)' }}>Consultor Estratégico</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'var(--on-surface)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', backgroundColor: m.role === 'user' ? 'var(--primary-container)' : 'var(--surface-container)', padding: '0.75rem 1rem', borderRadius: '8px', border: m.role === 'user' ? '1px solid var(--secondary)' : '1px solid var(--outline-variant)' }}>
                <p className="body-sm">{formatMessage(m.content)}</p>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--surface-container)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                <p className="body-sm" style={{ opacity: 0.6 }}>Digitando...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: 'var(--surface-container-highest)', borderTop: '1px solid var(--outline-variant)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="input-field" 
              style={{ flex: 1, minHeight: '40px', padding: '0.5rem 1rem' }} 
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
              <span style={{ fontSize: '1.2rem', color: isListening ? 'var(--error)' : 'var(--secondary)' }}>
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
