"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
}

const books: Book[] = [
  {
    id: 'lana-wolf',
    title: 'Lana Wolf Art',
    description: 'Plataforma Avançada de Micropigmentação Integrada com Agente de IA e Automações N8N para Orçamentação.',
    coverImage: '/Book_Lana/Site1.png',
    images: [
      '/Book_Lana/Site1.png',
      '/Book_Lana/Site2.png',
      '/Book_Lana/Site3.png',
      '/Book_Lana/Site4.png',
      '/Book_Lana/Site5.png',
      '/Book_Lana/Fluxo N8N.png',
      '/Book_Lana/Fluxos N8N.png'
    ]
  }
];

export default function Portfolio() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const openBook = (book: Book) => {
    setActiveBook(book);
    setCurrentImageIdx(0);
    // Prevent background scrolling
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBook = () => {
    setActiveBook(null);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBook && currentImageIdx < activeBook.images.length - 1) {
      setCurrentImageIdx((prev) => prev + 1);
    }
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBook && currentImageIdx > 0) {
      setCurrentImageIdx((prev) => prev - 1);
    }
  };

  return (
    <section id="portfolio" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Obras de Engenharia Digital</h2>
        <p className="body-md" style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0.8 }}>Nossos "Books" de desenvolvimento e integração.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {books.map(book => (
            <div 
              key={book.id} 
              className="card-base ghost-border" 
              style={{ cursor: 'pointer', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              onClick={() => openBook(book)}
            >
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image src={book.coverImage} alt={book.title} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Ver Book
                  </span>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', color: 'var(--secondary)' }}>{book.title}</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>{book.description}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--on-surface)', opacity: 0.6 }}>
                  {book.images.length} capturas da plataforma
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal */}
      {activeBook && (
        <div 
          onClick={closeBook}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, 
            backgroundColor: 'rgba(10, 14, 20, 0.95)', backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}
        >
           {/* Header do modal */}
           <div style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', zIndex: 1001, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
              <div style={{ color: '#fff' }}>
                <h3 className="headline-sm">{activeBook.title}</h3>
                <p className="body-sm" style={{ opacity: 0.7 }}>Visualizando Imagem {currentImageIdx + 1} de {activeBook.images.length}</p>
              </div>
              <button onClick={closeBook} style={{ background: 'var(--surface-variant-glass)', border: '1px solid var(--outline-variant)', borderRadius: '50%', color: '#fff', fontSize: '1.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                &times;
              </button>
           </div>

           {/* Imagem Central */}
           <div style={{ position: 'relative', width: '85%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4rem' }} onClick={(e) => e.stopPropagation()}>
              
              {/* Botão Prev */}
              <button onClick={prevImg} disabled={currentImageIdx === 0} style={{ 
                position: 'absolute', left: '-5%', background: 'var(--surface-variant-glass)',
                border: '1px solid var(--outline-variant)', borderRadius: '50%', width: '50px', height: '50px',
                color: '#fff', fontSize: '1.5rem', cursor: currentImageIdx === 0 ? 'not-allowed' : 'pointer', zIndex: 10,
                opacity: currentImageIdx === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>&#10094;</button>

              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={activeBook.images[currentImageIdx]} alt={`${activeBook.title} imagem ${currentImageIdx + 1}`} fill style={{ objectFit: 'contain' }} />
              </div>

              {/* Botão Next */}
              <button onClick={nextImg} disabled={currentImageIdx === activeBook.images.length - 1} style={{ 
                position: 'absolute', right: '-5%', background: 'var(--surface-variant-glass)',
                border: '1px solid var(--outline-variant)', borderRadius: '50%', width: '50px', height: '50px',
                color: '#fff', fontSize: '1.5rem', cursor: currentImageIdx === activeBook.images.length - 1 ? 'not-allowed' : 'pointer', zIndex: 10,
                opacity: currentImageIdx === activeBook.images.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>&#10095;</button>

           </div>
        </div>
      )}
    </section>
  );
}
