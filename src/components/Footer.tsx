import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '4rem 2rem', marginTop: '6rem', borderTop: '1px solid var(--outline-variant)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 className="headline-sm" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Domino Automate</h4>
            <p className="body-sm" style={{ maxWidth: '300px', opacity: 0.7 }}>Desenvolvimento Web, Integrações com Python & Agentes de IA autônomos para escalar seu negócio.</p>
          </div>
          <div style={{ maxWidth: '400px' }}>
            <h4 className="label-md" style={{ marginBottom: '1rem', color: 'var(--on-surface)' }}>Conformidade & Segurança (LGPD)</h4>
            <p className="body-sm" style={{ opacity: 0.7 }}>
              Nossos modelos de arquitetura garantem que os dados de seus clientes fiquem sob sua governança. 
              Ao utilizar Inteligência Artificial e integrações N8N, atuamos estritamente nos limites da LGPD, 
              sem treinar modelos públicos com suas informações confidenciais.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', opacity: 0.5, borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem' }}>
          <p className="body-sm">© {new Date().getFullYear()} Domino Automate. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
