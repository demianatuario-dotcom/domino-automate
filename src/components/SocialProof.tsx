'use client';
import React, { useState, useEffect, useRef } from 'react';

function useCountUp(target: string, duration: number = 1500) {
  const [display, setDisplay] = useState('0');
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    if (target.includes('Milhões')) {
      setDisplay(target);
      return;
    }

    const isPercentage = target.includes('%');
    const prefix = target.startsWith('+') ? '+' : '';
    const numericStr = target.replace(/[^0-9.]/g, '');
    const end = parseFloat(numericStr);

    if (isNaN(end)) {
      setDisplay(target);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * end);
      const suffix = target.includes('Anos') ? ' Anos' : target.includes('Perícias') ? ' Perícias' : '';
      setDisplay(`${prefix}${current}${isPercentage ? '%' : ''}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);

  return { display, ref };
}

export default function SocialProof() {
  const stats = [
    { 
      label: "Governança & Previdência", 
      value: "+15 Anos", 
      description: "Experiência em governança de previdência complementar e balanços patrocinadores." 
    },
    { 
      label: "Passivos Atuariais", 
      value: "Milhões Auditados", 
      description: "Mitigação e auditoria independente em passivos atuariais (CPC 33 / IAS 19)." 
    },
    { 
      label: "Auditoria Judicial Precisa", 
      value: "10 Perícias", 
      description: "Histórico consolidado em perícias atuariais e financeiras no TRT10 e TJDFT." 
    },
    { 
      label: "Automação Segura & LGPD", 
      value: "100%", 
      description: "Agentes de IA locais e orquestrações n8n sem vazamento de dados corporativos." 
    }
  ];

  return (
    <section style={{ padding: '4.5rem 2rem', backgroundColor: 'var(--primary-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, i) => {
            const { display, ref } = useCountUp(stat.value);
            return (
              <div key={i} ref={ref} className="card-base ghost-border" style={{ textAlign: 'center', backgroundColor: 'rgba(10, 14, 20, 0.4)', padding: '2rem 1.5rem' }}>
                <p className="display-sm" style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontWeight: 700, fontSize: '2rem' }}>{display}</p>
                <p className="label-md" style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--on-surface)' }}>{stat.label}</p>
                <p className="body-sm" style={{ opacity: 0.8, fontSize: '0.875rem', lineHeight: 1.5 }}>{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Tech Logos & Regulatory Frameworks */}
        <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--outline-variant)', textAlign: 'center' }}>
          <p className="label-sm" style={{ opacity: 0.6, textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '0.1em' }}>
            Domínio Regulatório, Científico e Tecnológico
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem', alignItems: 'center' }}>
            {/* CPC 33 / IAS 19 */}
            <div style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--outline-variant)', opacity: 0.8, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
              CPC 33 (R1) / IAS 19
            </div>
            {/* PREVIC */}
            <div style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--outline-variant)', opacity: 0.8, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
              Normativos PREVIC
            </div>
            {/* Python */}
            <svg width="110" height="30" viewBox="0 0 160 40" fill="none" style={{ opacity: 0.7, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}>
              <circle cx="14" cy="20" r="10" fill="#3776AB" opacity="0.8"/>
              <circle cx="22" cy="20" r="10" fill="#FFD43B" opacity="0.6"/>
              <text x="38" y="28" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="600">Python</text>
            </svg>
            {/* R Project */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.7 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: '#276DC3' }}>R</span>
              <span style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'Space Grotesk' }}>Project</span>
            </div>
            {/* N8N */}
            <svg width="70" height="30" viewBox="0 0 120 40" fill="none" style={{ opacity: 0.7, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}>
              <text x="0" y="30" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="28" fontWeight="700">n8n</text>
            </svg>
            {/* OpenAI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.7 }}>
              <span style={{ fontSize: '1.1rem' }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Space Grotesk' }}>OpenAI</span>
            </div>
            {/* Anthropic */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.7 }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Space Grotesk' }}>Anthropic</span>
            </div>
            {/* Google Gemini */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.7 }}>
              <span style={{ fontSize: '1.1rem' }}>✦</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Space Grotesk' }}>Gemini</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
