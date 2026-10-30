import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Domino Automate | Engenharia de Sistemas, Inteligência Analítica e Automações com IA',
  description: 'Software house e consultoria de engenharia aplicada em Brasília-DF. Desenvolvemos ecossistemas digitais, motores analíticos em Python/n8n e agentes de IA privada para as verticais de Atuária e Estúdios de Beleza.',
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
