import type { Metadata } from 'next';
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
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
