'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Image src="/logo.png" alt="Domino Automate Logo" width={140} height={46} className="mobile-logo-img" style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(233, 193, 118, 0.2))' }} priority />
          </Link>
          <span className="desktop-only" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '4px', backgroundColor: 'rgba(233, 193, 118, 0.14)', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Unidade Atuária • MIBA 1807
          </span>
        </div>

        <nav className="header-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" className="label-sm desktop-only" style={{ opacity: 0.75 }}>← Portal Domino</Link>
          <a href="#escopo-atuarial" className="label-md desktop-only">Escopo Técnico</a>
          <a href="#lideranca-atuarial" className="label-md desktop-only">Liderança MIBA</a>
          <a href="#laudos-estudos" className="label-md desktop-only">Laudos & Estudos</a>
          <a href="#simulador" className="label-md desktop-only">Simulador</a>
          <a href="#orcamento" className="btn-primary header-btn desktop-only" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
            Solicitar Parecer / Diagnóstico
          </a>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={closeMenu} style={{ opacity: 0.8 }}>← Voltar ao Portal Domino</Link>
        <a href="#escopo-atuarial" onClick={closeMenu}>Escopo Técnico Atuarial</a>
        <a href="#lideranca-atuarial" onClick={closeMenu}>Liderança MIBA 1807</a>
        <a href="#laudos-estudos" onClick={closeMenu}>Laudos & Estudos</a>
        <a href="#simulador" onClick={closeMenu}>Simulador de Passivos</a>
        <a href="#orcamento" onClick={closeMenu} style={{ color: 'var(--secondary)', fontWeight: 700 }}>
          Solicitar Parecer / Diagnóstico
        </a>
      </nav>
    </>
  );
}
