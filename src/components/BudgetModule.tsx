'use client';
import React, { useState, useEffect } from 'react';

export default function BudgetModule() {
  const [dores, setDores] = useState<{dor: string, justificativa: string}[]>([]);

  useEffect(() => {
    fetch('/api/servicos')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          // Mapeamos gargalo para dor, mantendo compatibilidade com o layout existente
          setDores(data.map((item: any) => ({ dor: item.gargalo, justificativa: item.justificativa })));
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

  const toggleDor = (dor: string) => {
    setSelectedDores(prev => prev.includes(dor) ? prev.filter(d => d !== dor) : [...prev, dor]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, descricao, dores: selectedDores.join(', ') })
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
          Selecione os gargalos da sua operação. Nossa inteligência desenhará a solução exata e 
          lhe enviaremos uma proposta comercial inteligente direto no e-mail.
        </p>

        {success ? (
          <div className="card-base ghost-border" style={{ textAlign: 'center', padding: '4rem' }}>
            <h3 className="headline-sm" style={{ color: 'var(--secondary)' }}>Solicitação Recebida!</h3>
            <p className="body-md" style={{ marginTop: '1rem' }}>Sua proposta será gerada e enviada via N8N para o seu contato de e-mail em instantes.</p>
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

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? 'Calculando Arquitetura...' : 'Solicitar Proposta Analítica'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
