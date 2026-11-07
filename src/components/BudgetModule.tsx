'use client';
import React, { useState, useEffect } from 'react';
import { trackDominoEvent, type LeadDeliveryAnalyticsStatus } from '@/lib/analytics';

const TIPOS_ORGANIZACAO = [
  'Escritório de Advocacia',
  'Patrocinadora / EFPC',
  'Consultoria / Perícia',
  'Empresa / Startup',
];

const DEMANDAS_PRINCIPAIS = [
  'Assistência Técnica / Parecer Judicial',
  'Auditoria Independente CPC 33',
  'Automação n8n / Agentes de IA',
  'Outro',
];

interface ServicoItem {
  gargalo: string;
  justificativa: string;
  pergunta?: string;
}

interface AutomateBudgetDetail {
  nome?: string;
  email?: string;
  telefone?: string;
  detalhes?: string;
  dores?: string[];
}

interface SimuladorSnapshot {
  val1: number;
  val2: number;
  val3: number;
  scenario: 'conservador' | 'referencia' | 'otimista';
  impactoMensal: number;
}

export default function BudgetModule() {
  const [dores, setDores] = useState<{ dor: string; justificativa: string; pergunta?: string }[]>([]);
  const [tipoOrganizacao, setTipoOrganizacao] = useState<string>('Escritório de Advocacia');
  const [demanda, setDemanda] = useState<string>('Assistência Técnica / Parecer Judicial');
  const [selectedDores, setSelectedDores] = useState<string[]>([]);
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [formStarted, setFormStarted] = useState(false);
  const [simSnapshot, setSimSnapshot] = useState<SimuladorSnapshot>({
    val1: 25,
    val2: 250,
    val3: 12,
    scenario: 'referencia',
    impactoMensal: 48750,
  });

  const notifyFormStart = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackDominoEvent('form_start', { vertical: '/Atuaria', section: 'budget_form' });
    }
  };

  useEffect(() => {
    fetch('/api/servicos')
      .then((res) => res.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setDores(
            (data as ServicoItem[]).map((item) => ({
              dor: item.gargalo,
              justificativa: item.justificativa,
              pergunta: item.pergunta,
            }))
          );
        }
      })
      .catch((err) => console.error('Error fetching servicos:', err));
  }, []);

  useEffect(() => {
    const handleRoiUpdate = (e: Event) => {
      const customEv = e as CustomEvent<SimuladorSnapshot>;
      if (customEv.detail) {
        setSimSnapshot(customEv.detail);
      }
    };
    window.addEventListener('atuaria-roi-update', handleRoiUpdate);
    return () => window.removeEventListener('atuaria-roi-update', handleRoiUpdate);
  }, []);

  const toggleDor = (dor: string) => {
    notifyFormStart();
    setSelectedDores((prev) => (prev.includes(dor) ? prev.filter((d) => d !== dor) : [...prev, dor]));
    if (selectedDores.includes(dor)) {
      setRespostas((prev) => {
        const next = { ...prev };
        delete next[dor];
        return next;
      });
    }
  };

  useEffect(() => {
    const handleAutomate = (e: Event) => {
      const customEvent = e as CustomEvent<AutomateBudgetDetail>;
      const data = customEvent.detail;
      if (data) {
        setNome(data.nome || '');
        setEmail(data.email || '');
        setTelefone(data.telefone || '');
        setDescricao(data.detalhes || '');
        setSelectedDores(data.dores || []);
        setLgpdConsent(true);
        setSuccess(true);
        trackDominoEvent('chat_lead_captured', { vertical: '/Atuaria', section: 'ai_chat' });
      }
    };

    window.addEventListener('automate-budget', handleAutomate);
    return () => window.removeEventListener('automate-budget', handleAutomate);
  }, [tipoOrganizacao, demanda]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lgpdConsent) {
      setFormError('Confirme o consentimento LGPD para prosseguir.');
      return;
    }
    setFormError('');
    setLoading(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: '/Atuaria',
          origem: '/Atuaria',
          nome,
          empresa,
          email,
          telefone,
          tipo_organizacao: tipoOrganizacao,
          demanda,
          descricao,
          dores: selectedDores.join(', '),
          doresArray: selectedDores,
          perguntas_respostas: respostas,
          lgpdConsent: true,
          simulador: simSnapshot,
        }),
      });

      if (res.ok) {
        const resData = (await res.json().catch(() => ({}))) as {
          deduplicated?: boolean;
          deliveryStatus?: LeadDeliveryAnalyticsStatus;
        };
        setSuccess(true);
        if (!resData.deduplicated) {
          trackDominoEvent('form_submit', {
            vertical: '/Atuaria',
            section: 'budget_form',
            scenario: simSnapshot.scenario,
            estimatedMonthlyImpact: simSnapshot.impactoMensal,
            deliveryStatus: resData.deliveryStatus || 'delivered',
          });
        }
      } else {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        setFormError(errData.error || 'Não foi possível registrar agora. Tente pelo WhatsApp.');
      }
    } catch {
      setFormError('Erro de conexão ao enviar diagnóstico. Tente novamente ou acione o WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="orcamento" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-container)', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Primeira Reunião Técnica
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Solicite Seu Diagnóstico Estratégico
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '680px', margin: '0 auto' }}>
            Apresente sua demanda para análise técnica atuarial ou de engenharia de automação. Entraremos em contato com um diagnóstico fundamentado e sigilo absoluto.
          </p>
        </div>

        {success ? (
          <div role="status" aria-live="polite" className="card-base ghost-border" style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🏛️</div>
            <h3 className="headline-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Demanda Registrada com Sucesso!</h3>
            <p className="body-md" style={{ maxWidth: '500px', margin: '0 auto 1.75rem', opacity: 0.9 }}>
              Seu cenário será analisado pelo atuário responsável <strong>Demian Lisboa Pereira (MIBA 1807)</strong>. Entraremos em contato em até 24 horas úteis.
            </p>
            <a
              href={`https://wa.me/5561981171564?text=${encodeURIComponent(`Olá, Demian! Acabei de registrar a solicitação de diagnóstico técnico na vertical de Atuária (${demanda}) em nome de ${nome || 'minha organização'}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDominoEvent('whatsapp_click', { vertical: '/Atuaria', section: 'post_form_success' })}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.75rem', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <span>Adiantar Atendimento no WhatsApp</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : (
          <form className="card-base ghost-border floating-shadow" onSubmit={handleSubmit} aria-busy={loading} style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', padding: '3rem' }}>
            {/* 1. Tipo de Organização */}
            <div role="group" aria-labelledby="atuaria-label-org">
              <span id="atuaria-label-org" className="label-md" style={{ marginBottom: '0.85rem', display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>
                1. Tipo de Organização:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {TIPOS_ORGANIZACAO.map((tipo) => (
                  <button
                    type="button"
                    key={tipo}
                    aria-pressed={tipoOrganizacao === tipo}
                    className={`chip-filter ${tipoOrganizacao === tipo ? 'active' : ''}`}
                    onClick={() => { notifyFormStart(); setTipoOrganizacao(tipo); }}
                    style={{ textAlign: 'center', padding: '0.75rem 1rem', minHeight: '44px', fontSize: '0.875rem' }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Seleção de Demanda */}
            <div role="group" aria-labelledby="atuaria-label-demanda">
              <span id="atuaria-label-demanda" className="label-md" style={{ marginBottom: '0.85rem', display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>
                2. Demanda Principal:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {DEMANDAS_PRINCIPAIS.map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-pressed={demanda === item}
                    className={`chip-filter ${demanda === item ? 'active' : ''}`}
                    onClick={() => { notifyFormStart(); setDemanda(item); }}
                    style={{ textAlign: 'center', padding: '0.75rem 1rem', minHeight: '44px', fontSize: '0.875rem' }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Vulnerabilidades / Gargalos dinâmicos da tabela SQL servicos */}
            {dores.length > 0 && (
              <div role="group" aria-labelledby="atuaria-label-dores">
                <span id="atuaria-label-dores" className="label-md" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--on-surface)' }}>
                  3. Selecione os Tópicos / Vulnerabilidades de Interesse:
                </span>
                <p className="body-xs" style={{ opacity: 0.6, marginBottom: '0.75rem' }}>
                  (Itens dinâmicos integrados ao banco de dados):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {dores.map((d) => {
                    const active = selectedDores.includes(d.dor);
                    return (
                      <button
                        type="button"
                        key={d.dor}
                        aria-pressed={active}
                        className={`chip-filter ${active ? 'active' : ''}`}
                        onClick={() => toggleDor(d.dor)}
                        title={d.justificativa}
                        style={{ fontSize: '0.85rem', minHeight: '44px' }}
                      >
                        {d.dor}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questionamentos específicos condicionados aos itens selecionados */}
            {selectedDores.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--surface-container-high)', borderRadius: '8px' }}>
                {selectedDores.map((dor, idx) => {
                  const dObj = dores.find((d) => d.dor === dor);
                  if (!dObj || !dObj.pergunta) return null;
                  const fieldId = `atuaria-pergunta-${idx}`;
                  return (
                    <div key={`resp-${dor}`}>
                      <label htmlFor={fieldId} className="label-md" style={{ marginBottom: '0.4rem', display: 'block', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                        {dObj.pergunta} (Obrigatório)
                      </label>
                      <textarea
                        id={fieldId}
                        required
                        placeholder="Sua resposta..."
                        className="input-field"
                        style={{ resize: 'vertical', minHeight: '75px', fontSize: '0.875rem' }}
                        value={respostas[dor] || ''}
                        onChange={(e) => setRespostas((prev) => ({ ...prev, [dor]: e.target.value }))}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. Breve descrição do litígio ou gargalo operacional */}
            <div>
              <label htmlFor="atuaria-descricao" className="label-md" style={{ marginBottom: '0.5rem', display: 'block' }}>
                4. Resumo Técnico da Demanda ou Gargalo Operacional (Sem dados pessoais sensíveis):
              </label>
              <textarea
                id="atuaria-descricao"
                placeholder="Descreva brevemente o escopo técnico (ex: modalidade do plano CD/BD/CV, tese discutida, necessidade de auditoria CPC 33 ou automação de cálculos). Não insira CPF de partes ou dados sob segredo de justiça neste formulário inicial."
                className="input-field"
                style={{ resize: 'vertical', minHeight: '110px', fontSize: '0.9rem' }}
                value={descricao}
                onChange={(e) => { notifyFormStart(); setDescricao(e.target.value); }}
              />
            </div>

            {/* 5. Dados para Contato */}
            <div>
              <span className="label-md" style={{ marginBottom: '0.85rem', display: 'block' }}>
                5. Identificação & Contato Corporativo:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="atuaria-nome" className="label-sm" style={{ display: 'block', marginBottom: '0.3rem', opacity: 0.8 }}>Nome Completo *</label>
                  <input id="atuaria-nome" required type="text" placeholder="Nome Completo do Solicitante" className="input-field" value={nome} onChange={(e) => { notifyFormStart(); setNome(e.target.value); }} />
                </div>
                <div>
                  <label htmlFor="atuaria-empresa" className="label-sm" style={{ display: 'block', marginBottom: '0.3rem', opacity: 0.8 }}>Organização / EFPC</label>
                  <input id="atuaria-empresa" type="text" placeholder="Empresa / Escritório / EFPC" className="input-field" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="atuaria-email" className="label-sm" style={{ display: 'block', marginBottom: '0.3rem', opacity: 0.8 }}>E-mail Corporativo *</label>
                  <input id="atuaria-email" required type="email" placeholder="E-mail Corporativo" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="atuaria-telefone" className="label-sm" style={{ display: 'block', marginBottom: '0.3rem', opacity: 0.8 }}>WhatsApp / Telefone</label>
                  <input id="atuaria-telefone" type="tel" placeholder="WhatsApp / Telefone Direto" className="input-field" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Consentimento LGPD Explícito */}
            <label htmlFor="atuaria-lgpd-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.8rem', opacity: 0.85, cursor: 'pointer' }}>
              <input
                id="atuaria-lgpd-consent"
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                required
                style={{ marginTop: '0.2rem', accentColor: 'var(--secondary)', minWidth: '18px', minHeight: '18px' }}
              />
              <span>
                Concordo com o tratamento dos dados corporativos informados acima exclusivamente para retorno técnico e comercial da Domino Automate, sob sigilo atuarial e em conformidade com a LGPD (Lei nº 13.709/2018).
              </span>
            </label>

            {formError && (
              <p role="alert" aria-live="assertive" style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {formError}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', borderTop: '1px solid var(--outline-variant)', paddingTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !lgpdConsent}
                style={{ padding: '1rem 2rem', minHeight: '48px', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(10,14,20,0.3)', borderTopColor: 'var(--on-secondary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Processando com Segurança...
                  </>
                ) : (
                  'Solicitar Diagnóstico Estratégico'
                )}
              </button>
              <p className="body-xs" style={{ opacity: 0.7, marginTop: '0.5rem' }}>
                Análise técnica conduzida por atuário registrado (MIBA 1807).
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
