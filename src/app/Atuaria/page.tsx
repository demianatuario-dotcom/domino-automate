import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Pillars from '@/components/Pillars';
import QuemSomos from '@/components/QuemSomos';
import ROISimulator from '@/components/ROISimulator';
import Portfolio from '@/components/Portfolio';
import AIAssistantHighlight from '@/components/AIAssistantHighlight';
import VideoGallery from '@/components/VideoGallery';
import BudgetModule from '@/components/BudgetModule';
import CommentsSection from '@/components/CommentsSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AIChat from '@/components/AIChat';

export const metadata: Metadata = {
  title: 'Perícia Judicial, Assistência Técnica & Atuária CPC 33 | MIBA 1807 | Domino Automate',
  description:
    'Perícia Judicial e Assistência Técnica Atuarial/Financeira (TRT10, TJDFT e atuação nacional/remota). Quesitos, impugnação de laudos, liquidação de sentença e auditoria de bases de dados em Python/R/VBA. Consultoria CPC 33 (R1) / IAS 19 e conformidade PREVIC por Demian Lisboa Pereira (MIBA 1807).',
  alternates: {
    canonical: 'https://domino-automate.com.br/Atuaria',
  },
  openGraph: {
    title: 'Perícia Judicial, Assistência Técnica & Consultoria Atuarial (MIBA 1807)',
    description:
      'Suporte técnico especializado para escritórios de advocacia, varas judiciais e EFPCs: quesitos, impugnação de laudos, liquidação de sentença, auditoria de bases em Python/R/VBA e consultoria CPC 33 (R1) / IAS 19 e PREVIC.',
    url: 'https://domino-automate.com.br/Atuaria',
    siteName: 'Domino Automate',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 538,
        alt: 'Domino Automate | Perícia Judicial, Assistência Técnica & Atuária (MIBA 1807)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perícia Judicial & Assistência Técnica Atuarial (MIBA 1807)',
    description:
      'Perícia Judicial (TRT10, TJDFT e atuação nacional/remota), quesitos, impugnação de laudos, liquidação de sentença, auditoria de bases em Python/R/VBA e consultoria CPC 33 / PREVIC.',
  },
};

const atuariaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      name: 'Domino Automate - Perícia Judicial, Assistência Técnica & Consultoria Atuarial (MIBA 1807)',
      description:
        'Perícia Judicial e Assistência Técnica Atuarial/Financeira (TRT10, TJDFT e atuação nacional/remota). Formulação de quesitos, impugnação técnica de laudos, liquidação de sentença, auditoria de bases de dados em Python/R/VBA e consultoria CPC 33 (R1) / IAS 19 e conformidade PREVIC.',
      url: 'https://domino-automate.com.br/Atuaria',
      areaServed: 'BR',
      founder: {
        '@type': 'Person',
        name: 'Demian Lisboa Pereira',
        jobTitle: 'Atuário Responsável Técnico (MIBA 1807) & Ex-Perito Judicial (TRT10/TJDFT)',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Domino Automate',
          item: 'https://domino-automate.com.br',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Perícia Judicial, Assistência Técnica & Atuária',
          item: 'https://domino-automate.com.br/Atuaria',
        },
      ],
    },
  ],
};

export default function AtuariaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(atuariaJsonLd) }}
      />
      <Header />
      <Hero />
      <SocialProof />
      <Pillars />
      <QuemSomos />
      <Portfolio />
      <ROISimulator />
      <AIAssistantHighlight />
      <VideoGallery />
      <BudgetModule />
      <CommentsSection />
      <FAQ />
      <Footer />
      <AIChat niche="atuaria" />
    </>
  );
}
