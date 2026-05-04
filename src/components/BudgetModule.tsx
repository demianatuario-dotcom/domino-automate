'use client';
import React, { useState, useEffect } from 'react';

export default function BudgetModule() {
  const [dores, setDores] = useState<{dor: string, justificativa: string, pergunta?: string}[]>([]);

  useEffect(() => {
    fetch('/api/servicos')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          // Mapeamos gargalo para dor, mantendo compatibilidade com o layout existente
          setDores(data.map((item: any) => ({ dor: item.gargalo, justificativa: item.justificativa, pergunta: item.pergunta })));
        }
      })
      .catch(err => console.error("Error fetching servicos:", err));
  }, []);

  const [selectedDores, setSelectedDores] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [respostas, setRespostas] = useState<{[key: string]: string}>({});

  const toggleDor = (dor: string) => {
    setSelectedDores(prev => prev.includes(dor) ? prev.filter(d => d !== dor) : [...prev, dor]);
    if (selectedDores.includes(dor)) {
      setRespostas(prev => { const next = {...prev}; delete next[dor]; return next; });
    }
  };

  useEffect(() => {
    const handleAutomate = (e: any) => {
      const data = e.detail;
      if (data) {
        setNome(data.nome || '');
        setEmail(data.email || '');
        setTelefone(data.telefone || '');
        setDescricao(data.detalhes || '');
        setSelectedDores(data.dores || []);
        
        // Disparar o envio após um pequeno delay para garantir que os estados foram atualizados
        setTimeout(() => {
          setLoading(true);
          fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              nome: data.nome, 
              email: data.email, 
              telefone: data.telefone, 
              descricao: data.detalhes, 
              dores: (data.dores || []).join(', '), 
              doresArray: data.dores || [], 
              perguntas_respostas: {} // O assistente preenche os detalhes no campo de descrição
            })
          })
          .then(res => {
            if(res.ok) setSuccess(true);
          })
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
        }, 100);
      }
    };

    window.addEventListener('automate-budget', handleAutomate);
    return () => window.removeEventListener('automate-budget', handleAutomate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, descricao, dores: selectedDores.join(', '), doresArray: selectedDores, perguntas_respostas: respostas })
      });
      
      if(res.ok) setSuccess(true);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="orcamento" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="display-lg" style={{ marginBottom: '1rem', fontSize: '2.5rem', textAlign: 'center' }}>Projete Sua Solução</h2>
        <p className="body-md" style={{ opacity: 0.8, textAlign: 'center', marginBottom: '3rem' }}>
          Selecione os gargalos da sua operação. Nossa equipe analisará seu cenário para desenhar a melhor solução estratégica e entraremos em contato após a análise.
        </p>

        {success ? (
          <div className="card-base ghost-border" style={{ textAlign: 'center', padding: '4rem' }}>
            <h3 className="headline-sm" style={{ color: 'var(--secondary)' }}>Solicitação Recebida!</h3>
            <p className="body-md" style={{ marginTop: '1rem' }}>Seu formulário será analisado pela Domino Automate e entraremos em contato após a análise.</p>
          </div>
        ) : (
          <form className="card-base ghost-border floating-shadow" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <label className="label-md" style={{ marginBottom: '1rem', display: 'block' }}>1. Quais vulnerabilidades afetam seu negócio?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {dores.map(d => (
                  <div 
                    key={d.dor} 
                    className={`chip-filter ${selectedDores.includes(d.dor) ? 'active' : ''}`} 
                    onClick={() => toggleDor(d.dor)}
                    title={d.justificativa}
                  >
                    {d.dor}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <input required type="text" placeholder="Nome da Empresa / Contato" className="input-field" value={nome} onChange={e => setNome(e.target.value)} />
              <input required type="email" placeholder="E-mail de Contato" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="text" placeholder="WhatsApp (Opcional)" className="input-field" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>

            {selectedDores.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedDores.map(dor => {
                  const dObj = dores.find(d => d.dor === dor);
                  if(!dObj || !dObj.pergunta) return null;
                  return (
                    <div key={`resp-${dor}`}>
                      <label className="label-md" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--secondary)' }}>
                        {dObj.pergunta} (Obrigatório)
                      </label>
                      <textarea
                        required
                        placeholder="Sua resposta..."
                        className="input-field"
                        style={{ resize: 'vertical', minHeight: '80px' }}
                        value={respostas[dor] || ''}
                        onChange={e => setRespostas(prev => ({ ...prev, [dor]: e.target.value }))}
                      ></textarea>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <label className="label-md" style={{ marginBottom: '0.5rem', display: 'block' }}>2. Detalhes Adicionais (Opcional)</label>
              <textarea 
                placeholder="Conte-nos brevemente as particularidades do seu cenário ou sistema atual..." 
                className="input-field" 
                style={{ resize: 'vertical', minHeight: '120px' }}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(10,14,20,0.3)', borderTopColor: 'var(--on-secondary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Processando...
                </>
              ) : 'Solicitar Proposta Analítica'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
