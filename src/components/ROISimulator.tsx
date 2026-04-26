'use client';
import React, { useState, useEffect } from 'react';

export default function ROISimulator() {
  const [leads, setLeads] = useState(100);
  const [ticket, setTicket] = useState(1000);
  const [conversao, setConversao] = useState(5);
  
  const [perdaAnual, setPerdaAnual] = useState(0);
  const [ganhoPotencial, setGanhoPotencial] = useState(0);

  useEffect(() => {
    // Premissa: 30% dos leads são perdidos por demora no atendimento manual
    const leadsPerdidosPelaDemora = leads * 0.3;
    const vendasPerdidasMes = leadsPerdidosPelaDemora * (conversao / 100);
    const valorPerdidoMes = vendasPerdidasMes * ticket;
    
    setPerdaAnual(valorPerdidoMes * 12);
    
    // Ganho potencial: Melhoria de 20% na conversão total por follow-up automático
    const novaConversao = conversao * 1.2;
    const novasVendasMes = leads * (novaConversao / 100);
    const ganhoExtraMes = (novasVendasMes - (leads * conversao / 100)) * ticket;
    
    setGanhoPotencial(ganhoExtraMes * 12);
  }, [leads, ticket, conversao]);

  return (
    <section id="simulador" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="display-lg">Simulador de <span style={{ color: 'var(--secondary)' }}>Lucro Oculto</span></h2>
          <p className="body-md" style={{ opacity: 0.8, maxWidth: '600px', margin: '1rem auto' }}>
            Descubra quanto dinheiro sua empresa está deixando na mesa por causa de processos manuais e demora no atendimento.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Inputs */}
          <div className="card-base ghost-border" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <label className="label-md" style={{ display: 'block', marginBottom: '1rem' }}>Leads Mensais: <span style={{ color: 'var(--secondary)' }}>{leads}</span></label>
              <input 
                type="range" 
                min="10" 
                max="2000" 
                step="10" 
                value={leads} 
                onChange={(e) => setLeads(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
            </div>
            
            <div>
              <label className="label-md" style={{ display: 'block', marginBottom: '1rem' }}>Ticket Médio (R$): <span style={{ color: 'var(--secondary)' }}>{ticket.toLocaleString()}</span></label>
              <input 
                type="range" 
                min="100" 
                max="50000" 
                step="100" 
                value={ticket} 
                onChange={(e) => setTicket(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
            </div>

            <div>
              <label className="label-md" style={{ display: 'block', marginBottom: '1rem' }}>Conversão Atual (%): <span style={{ color: 'var(--secondary)' }}>{conversao}%</span></label>
              <input 
                type="range" 
                min="0.5" 
                max="20" 
                step="0.5" 
                value={conversao} 
                onChange={(e) => setConversao(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card-base glass-panel" style={{ borderLeft: '4px solid var(--error)', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
              <p className="label-sm" style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Perda Anual Estimada (Inércia)</p>
              <h3 className="display-sm" style={{ color: 'var(--error)', margin: '0.5rem 0' }}>- R$ {perdaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <p className="body-sm" style={{ opacity: 0.6 }}>Dinheiro perdido por demora no atendimento inicial.</p>
            </div>

            <div className="card-base glass-panel" style={{ borderLeft: '4px solid var(--secondary)', backgroundColor: 'rgba(0, 255, 0, 0.05)' }}>
              <p className="label-sm" style={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Ganho Extra Anual (Automação)</p>
              <h3 className="display-sm" style={{ color: 'var(--secondary)', margin: '0.5rem 0' }}>+ R$ {ganhoPotencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <p className="body-sm" style={{ opacity: 0.6 }}>Faturamento recuperado com follow-up e SDR 24/7.</p>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a href="#orcamento" className="btn-primary" style={{ width: '100%', display: 'block', padding: '1.25rem' }}>
                Recuperar esse Faturamento Agora
              </a>
              <p className="body-xs" style={{ marginTop: '1rem', opacity: 0.5 }}>
                *Cálculo baseado em médias de mercado para conversão assistida por IA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
