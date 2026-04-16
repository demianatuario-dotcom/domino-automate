import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="glass-panel" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <Image src="/logo.png" alt="Domino Automate Logo" width={150} height={50} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(233, 193, 118, 0.2))' }} priority />
      </Link>
      <nav style={{ display: 'flex', gap: '2rem' }}>
        <a href="#solucoes" className="label-md">Soluções</a>
        <a href="#portfolio" className="label-md">Casos Reais</a>
        <a href="#orcamento" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Solicitar Proposta</a>
      </nav>
    </header>
  );
}
