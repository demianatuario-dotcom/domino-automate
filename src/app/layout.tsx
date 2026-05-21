import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Domino Automate | Automação, IA e Web',
  description: 'Arquitetura de soluções web focadas na conversão. N8N, Python e Assistentes de IA para modernizar sua PME.',
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
