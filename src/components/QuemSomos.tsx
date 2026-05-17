import React from 'react';

export default function QuemSomos() {
  return (
    <section id="quem-somos" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="display-lg" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Quem Somos</h2>
          <p className="body-md" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
            Trajetória, senioridade e paixão por tecnologia. Conheça a história que fundamenta a Domino Automate.
          </p>
        </div>

        <div className="card-base" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-container) 0%, transparent 70%)', opacity: 0.5, filter: 'blur(40px)', zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <h3 className="headline-sm" style={{ color: 'var(--on-surface)' }}>Uma Vida Dedicada à Tecnologia</h3>
            
            <p className="body-md" style={{ opacity: 0.9 }}>
              Minha jornada com a tecnologia começou cedo, ainda na <strong>década de 1990</strong>, movida por uma profunda curiosidade e interesse pela programação de computadores. Essa paixão inicial rapidamente se transformou em vocação.
            </p>
            
            <p className="body-md" style={{ opacity: 0.9 }}>
              Para consolidar essa base, formei-me no curso técnico em <strong>microinformática pela Escola Técnica de Comércio da Universidade Federal do Rio Grande do Sul (UFRGS)</strong>, uma instituição de excelência que me forneceu o rigor técnico necessário para os desafios que viriam.
            </p>
            
            <p className="body-md" style={{ opacity: 0.9 }}>
              A senioridade e a disciplina na entrega de resultados foram forjadas ao longo de uma carreira sólida como <strong>funcionário concursado da Caixa Econômica Federal</strong>. Durante essa trajetória corporativa de alto nível, fiz o <strong>uso intensivo de programação e Inteligência Artificial</strong> para otimizar, automatizar e resolver os mais diversos propósitos na realização das minhas atividades diárias, gerando eficiência em larga escala.
            </p>

            <p className="body-md" style={{ opacity: 0.9 }}>
              Sendo um verdadeiro <strong>apaixonado por tecnologia, com foco principal na Inteligência Artificial e na sua constante evolução</strong>, decidi expandir o alcance dessa expertise para ajudar outros negócios a alcançarem seu potencial máximo no ambiente digital.
            </p>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--outline-variant)' }}>
              <h4 className="label-md" style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>O Nascimento da Domino Automate</h4>
              <p className="body-sm" style={{ opacity: 0.8 }}>
                Foi com essa bagagem técnica e corporativa que fundei oficialmente a <strong>DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA</strong> (CNPJ: 66.699.218/0001-94). Nosso objetivo é claro: desenvolver programas de computador sob encomenda e construir ecossistemas de IA autônomos com a mais alta confiabilidade, segurança e eficiência, aplicando a mesma excelência exigida nas maiores instituições do país.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
