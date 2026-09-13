'use client';
import React, { useState, useEffect } from 'react';

const TIPOS_ORGANIZACAO = [
  'Escritório de Advocacia',
  'Patrocinadora / EFPC',
  'Consultoria / Perícia',
  'Empresa / Startup'
];

const DEMANDAS_PRINCIPAIS = [
  'Assistência Técnica / Parecer Judicial',
  'Auditoria Independente CPC 33',
  'Automação n8n / Agentes de IA',
  'Outro'
];

export default function BudgetModule() {
  const [dores, setDores] = useState<{dor: string, justificativa: string, pergunta?: string}[]>([]);
  const [tipoOrganizacao, setTipoOrganizacao] = useState<string>('Escritório de Advocacia');
  const [demanda, setDemanda] = useState<string>('Assistência Técnica / Parecer Judicial');
  const [selectedDores, setSelectedDores] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [respostas, setRespostas] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetch('/api/servicos')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setDores(data.map((item: any) => ({ dor: item.gargalo, justificativa: item.justificativa, pergunta: item.pergunta })));
        }
      })
      .catch(err => console.error("Error fetching servicos:", err));
  }, []);

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
              tipo_organizacao: tipoOrganizacao,
              demanda: demanda,
              dores: (data.dores || []).join(', '), 
              doresArray: data.dores || [], 
              perguntas_respostas: {} 
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
  }, [tipoOrganizacao, demanda]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome, 
          empresa,
          email, 
          telefone, 
          tipo_organizacao: tipoOrganizacao,
          demanda: demanda,
          descricao, 
          dores: selectedDores.join(', '), 
          doresArray: selectedDores, 
          perguntas_respostas: respostas 
        })
      });
      
      if(res.ok) setSuccess(true);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="orcamento" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container)', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Atendimento Consultivo
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Projete Sua Solução / Proposta Analítica
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '680px', margin: '0 auto' }}>
            Apresente sua demanda para análise técnica atuarial ou de engenharia de automação. Entraremos em contato com um diagnóstico fundamentado e sigilo absoluto.
          </p>
        </div>

        {success ? (
          <div className="card-base ghost-border" style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h3 className="headline-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Demanda Registrada com Sucesso!</h3>
            <p className="body-md" style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.9 }}>
              Seu cenário será analisado pelo atuário responsável <strong>Demian Lisboa Pereira (MIBA 1807)</strong>. Entraremos em contato em até 24 horas úteis.
            </p>
          </div>
        ) : (
          <form className="card-base ghost-border floating-shadow" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', padding: '3rem' }}>
            
            {/* 1. Tipo de Organização */}
            <div>
              <label className="label-md" style={{ marginBottom: '0.85rem', display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>
                1. Tipo de Organização:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {TIPOS_ORGANIZACAO.map(tipo => (
                  <button
                    type="button"
                    key={tipo}
                    className={`chip-filter ${tipoOrganizacao === tipo ? 'active' : ''}`}
                    onClick={() => setTipoOrganizacao(tipo)}
                    style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Seleção de Demanda */}
            <div>
              <label className="label-md" style={{ marginBottom: '0.85rem', display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>
                2. Demanda Principal:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {DEMANDAS_PRINCIPAIS.map(item => (
                  <button
                    type="button"
                    key={item}
                    className={`chip-filter ${demanda === item ? 'active' : ''}`}
                    onClick={() => setDemanda(item)}
                    style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Vulnerabilidades / Gargalos dinâmicos da tabela SQL servicos */}
            {dores.length > 0 && (
              <div>
                <label className="label-md" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--on-surface)' }}>
                  3. Selecione os Tópicos / Vulnerabilidades de Interesse:
                </label>
                <p className="body-xs" style={{ opacity: 0.6, marginBottom: '0.75rem' }}>
                  (Itens dinâmicos integrados ao banco de dados):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {dores.map(d => (
                    <div 
                      key={d.dor} 
                      className={`chip-filter ${selectedDores.includes(d.dor) ? 'active' : ''}`} 
                      onClick={() => toggleDor(d.dor)}
                      title={d.justificativa}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {d.dor}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questionamentos específicos condicionados aos itens selecionados */}
            {selectedDores.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--surface-container-high)', borderRadius: '8px' }}>
                {selectedDores.map(dor => {
                  const dObj = dores.find(d => d.dor === dor);
                  if(!dObj || !dObj.pergunta) return null;
                  return (
                    <div key={`resp-${dor}`}>
                      <label className="label-md" style={{ marginBottom: '0.4rem', display: 'block', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                        {dObj.pergunta} (Obrigatório)
                      </label>
                      <textarea
                        required
                        placeholder="Sua resposta..."
                        className="input-field"
                        style={{ resize: 'vertical', minHeight: '75px', fontSize: '0.875rem' }}
                        value={respostas[dor] || ''}
                        onChange={e => setRespostas(prev => ({ ...prev, [dor]: e.target.value }))}
                      ></textarea>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. Breve descrição do litígio ou gargalo operacional */}
            <div>
              <label className="label-md" style={{ marginBottom: '0.5rem', display: 'block' }}>
                4. Descrição do Litígio, Laudo ou Gargalo Operacional:
              </label>
              <textarea 
                placeholder="Informe particularidades do processo, número dos autos (se houver), parâmetros do plano de benefícios ou gargalos dos sistemas atuais..." 
                className="input-field" 
                style={{ resize: 'vertical', minHeight: '110px', fontSize: '0.9rem' }}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              ></textarea>
            </div>

            {/* 5. Dados para Contato */}
            <div>
              <label className="label-md" style={{ marginBottom: '0.85rem', display: 'block' }}>
                5. Identificação & Contato Corporativo:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <input required type="text" placeholder="Nome Completo do Solicitante" className="input-field" value={nome} onChange={e => setNome(e.target.value)} />
                <input type="text" placeholder="Empresa / Escritório / EFPC" className="input-field" value={empresa} onChange={e => setEmpresa(e.target.value)} />
                <input required type="email" placeholder="E-mail Corporativo" className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="WhatsApp / Telefone Direto" className="input-field" value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading} 
                style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(10,14,20,0.3)', borderTopColor: 'var(--on-secondary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Processando com Segurança...
                  </>
                ) : 'Solicitar Contato Consultivo com Atuário Especialista'}
              </button>
              <p className="body-xs" style={{ opacity: 0.6 }}>
                🔒 Dados protegidos sob sigilo atuarial e em conformidade estrita com a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
