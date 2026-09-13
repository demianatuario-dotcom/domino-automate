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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <Image src="/logo.png" alt="Domino Automate Logo" width={150} height={50} className="mobile-logo-img" style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(233, 193, 118, 0.2))' }} priority />
        </Link>
        <nav className="header-nav" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          <a href="#pilares" className="label-md desktop-only">Pilares</a>
          <a href="#autoridade" className="label-md desktop-only">Autoridade</a>
          <a href="#atuaria-riscos" className="label-md desktop-only">Atuária & Riscos</a>
          <a href="#automacao-ia" className="label-md desktop-only">Automação & IA</a>
          <a href="#casos-solucoes" className="label-md desktop-only">Obras & Estudos</a>
          <a href="#orcamento" className="btn-primary header-btn desktop-only" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
            Solicitar Parecer / Diagnóstico Estratégico
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

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />

      {/* Mobile menu */}
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#pilares" onClick={closeMenu}>Pilares</a>
        <a href="#autoridade" onClick={closeMenu}>Autoridade</a>
        <a href="#atuaria-riscos" onClick={closeMenu}>Atuária & Riscos</a>
        <a href="#automacao-ia" onClick={closeMenu}>Automação & IA</a>
        <a href="#casos-solucoes" onClick={closeMenu}>Obras & Estudos</a>
        <a href="#orcamento" onClick={closeMenu} style={{ color: 'var(--secondary)', fontWeight: 700 }}>
          Solicitar Parecer / Diagnóstico
        </a>
      </nav>
    </>
  );
}
