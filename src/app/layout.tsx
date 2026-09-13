import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Domino Automate | Inteligência Atuarial, Governança de Riscos e Engenharia de IA',
  description: 'Boutique de Engenharia Digital, Inteligência Atuarial (MIBA 1807), Mitigação de Passivos (CPC 33 / IAS 19), Perícias Judiciais e Automação de Riscos com IA para o mercado jurídico e corporativo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <Script 
        async 
        src="https://www.googletagmanager.com/gtag/js?id=G-NMQX5ZBVXX" 
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NMQX5ZBVXX');
        `}
      </Script>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
