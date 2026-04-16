import React from 'react';
import Image from 'next/image';

export default function Portfolio() {
  const imagens = [
    '/Imagens_Trabalhos/Site1.png',
    '/Imagens_Trabalhos/Site2.png',
    '/Imagens_Trabalhos/Site3.png',
    '/Imagens_Trabalhos/Site4.png',
    '/Imagens_Trabalhos/Site5.png',
    '/Imagens_Trabalhos/Fluxo N8N.png',
    '/Imagens_Trabalhos/Fluxos N8N.png'
  ];

  return (
    <section id="portfolio" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Obras de Engenharia Digital</h2>
        <p className="body-md" style={{ textAlign: 'center', marginBottom: '4rem', opacity: 0.8 }}>Soluções que transformaram operações complexas em fluxos elegantes.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {imagens.map((img, i) => (
            <div key={i} className="card-base ghost-border" style={{ padding: '0.5rem', height: '240px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                <Image src={img} alt={`Trabalho ${i+1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 30vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
