import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import React from 'react';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://domino-automate.com.br'),
  title: {
    default: 'Domino Automate | Engenharia de Sistemas, Inteligência Analítica e Automações com IA',
    template: '%s | Domino Automate',
  },
  description:
    'Software house e consultoria de engenharia aplicada em Brasília-DF. Desenvolvemos ecossistemas digitais, motores analíticos em Python/n8n e agentes de IA privada para 10 verticais de negócios.',
  alternates: {
    canonical: 'https://domino-automate.com.br',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://domino-automate.com.br',
    siteName: 'Domino Automate',
    title: 'Domino Automate | Engenharia de Sistemas, Automação n8n & IA Aplicada',
    description:
      'Arquitetura de software, motores analíticos em Python, orquestração em n8n e agentes de IA no WhatsApp para operações corporativas e verticais especializadas.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Domino Automate Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domino Automate | Engenharia de Sistemas, Automação n8n & IA Aplicada',
    description:
      'Arquitetura de software, motores analíticos em Python, orquestração em n8n e agentes de IA no WhatsApp.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Domino Automate',
  legalName: 'DOMINO AUTOMATE DESENVOLVIMENTO DE SERVICOS DE AUTOMACAO LTDA',
  taxID: '66.699.218/0001-94',
  url: 'https://domino-automate.com.br',
  logo: 'https://domino-automate.com.br/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    addressCountry: 'BR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-61-98117-1564',
    contactType: 'sales',
    areaServed: 'BR',
    availableLanguage: ['Portuguese'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
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

          gtag('config', 'G-NMQX5ZBVXX', { anonymize_ip: true });
        `}
      </Script>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
