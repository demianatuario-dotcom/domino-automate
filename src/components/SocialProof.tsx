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

    const isPercentage = target.includes('%');
    const prefix = target.startsWith('+') ? '+' : target.startsWith('-') ? '-' : '';
    const numericStr = target.replace(/[^0-9.]/g, '');
    const end = parseFloat(numericStr);

    if (target === '24/7') {
      setDisplay('24/7');
      return;
    }

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
      setDisplay(`${prefix}${current}${isPercentage ? '%' : ''}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);

  return { display, ref };
}

export default function SocialProof() {
  const stats = [
    { label: "Tempo de Resposta", value: "-90%", description: "Leads atendidos em segundos." },
    { label: "Custo Operacional", value: "-40%", description: "Redução em tarefas repetitivas." },
    { label: "Conversão Comercial", value: "+28%", description: "Aumento médio em fechamentos." },
    { label: "Disponibilidade", value: "24/7", description: "Sua empresa nunca dorme." }
  ];

  return (
    <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--primary-container)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, i) => {
            const { display, ref } = useCountUp(stat.value);
            return (
              <div key={i} ref={ref} style={{ textAlign: 'center' }}>
                <p className="display-sm" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{display}</p>
                <p className="label-md" style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.label}</p>
                <p className="body-sm" style={{ opacity: 0.7 }}>{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Tech Logos */}
        <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid var(--outline-variant)', textAlign: 'center' }}>
          <p className="label-sm" style={{ opacity: 0.5, textTransform: 'uppercase', marginBottom: '2rem' }}>Tecnologias que dominamos</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', alignItems: 'center' }}>
            {/* N8N */}
            <svg width="80" height="32" viewBox="0 0 120 40" fill="none" style={{ opacity: 0.5, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
              <text x="0" y="30" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="28" fontWeight="700">n8n</text>
            </svg>
            {/* Python */}
            <svg width="120" height="32" viewBox="0 0 160 40" fill="none" style={{ opacity: 0.5, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
              <circle cx="14" cy="20" r="10" fill="#3776AB" opacity="0.8"/>
              <circle cx="22" cy="20" r="10" fill="#FFD43B" opacity="0.6"/>
              <text x="38" y="28" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="600">Python</text>
            </svg>
            {/* OpenAI */}
            <svg width="110" height="32" viewBox="0 0 150 40" fill="none" style={{ opacity: 0.5, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
              <circle cx="16" cy="20" r="12" stroke="var(--on-surface)" strokeWidth="2" fill="none"/>
              <path d="M10 20 L16 14 L22 20 L16 26 Z" fill="var(--on-surface)" opacity="0.7"/>
              <text x="34" y="27" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="600">OpenAI</text>
            </svg>
            {/* Anthropic */}
            <svg width="130" height="32" viewBox="0 0 170 40" fill="none" style={{ opacity: 0.5, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
              <path d="M8 30 L18 10 L28 30" stroke="var(--on-surface)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="36" y="28" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="600">Anthropic</text>
            </svg>
            {/* Google Gemini */}
            <svg width="110" height="32" viewBox="0 0 150 40" fill="none" style={{ opacity: 0.5, transition: 'opacity 0.3s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
              <circle cx="10" cy="16" r="6" fill="#4285F4" opacity="0.8"/>
              <circle cx="22" cy="24" r="6" fill="#34A853" opacity="0.8"/>
              <circle cx="16" cy="12" r="4" fill="#FBBC04" opacity="0.8"/>
              <text x="34" y="27" fill="var(--on-surface)" fontFamily="Space Grotesk, sans-serif" fontSize="20" fontWeight="600">Gemini</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
