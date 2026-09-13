import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '4rem 2rem', marginTop: '6rem', borderTop: '1px solid var(--outline-variant)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 className="headline-sm" style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.4rem' }}>Domino Automate</h4>
            <p className="body-sm" style={{ maxWidth: '380px', opacity: 0.8, marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Boutique de Engenharia Digital, Inteligência Atuarial (MIBA 1807), Mitigação de Riscos e Hiperautomação com IA Corporativa.
            </p>
            <div className="body-sm" style={{ opacity: 0.75, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--on-surface)' }}>DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA</strong>
              <span>CNPJ: 66.699.218/0001-94</span>
              <span>Brasília - DF</span>
              <span>demian.pereira@gmail.com | (61) 98117-1564</span>
            </div>
            
            {/* Social & Contact Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="https://wa.me/5561981171564" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Institucional" style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/demian-lisboa-pereira-a33b8417/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Fundador" style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://domino-automate.com.br/curriculo/" target="_blank" rel="noopener noreferrer" aria-label="Portal de Estudos" style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-container)', border: '1px solid var(--outline-variant)', color: 'var(--secondary)', transition: 'all 0.2s', fontWeight: 700, fontSize: '1.1rem' }}>
                CV
              </a>
            </div>
          </div>

          <div style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 className="label-md" style={{ color: 'var(--secondary)' }}>Selo de Governança, LGPD e Sigilo Bancário</h4>
            <p className="body-sm" style={{ opacity: 0.8, lineHeight: 1.6 }}>
              Atuamos estritamente sob os parâmetros éticos e regulatórios do <strong>Instituto Brasileiro de Atuária (IBA)</strong>, normativos da <strong>PREVIC</strong> e padrões de segurança bancária e proteção de dados da <strong>LGPD (Lei 13.709/2018)</strong>.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)' }}>
                ✓ MIBA 1807 Homologado
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)' }}>
                ✓ Sigilo Profissional e Bancário
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)' }}>
                ✓ IA Privada & LGPD
              </span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', opacity: 0.6, borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem' }}>
          <p className="body-sm">© {new Date().getFullYear()} Domino Automate Desenvolvimento de Serviços de Automação Ltda. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
