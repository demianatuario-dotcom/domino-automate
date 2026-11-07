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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vertical Atuária, Perícia Judicial & Governança CPC 33 (MIBA 1807)',
  description:
    'Auditoria independente CPC 33 (R1) / IAS 19, conformidade PREVIC, perícia atuarial judicial (TRT10 / TJDFT) e motores de cálculo em Python conduzidos por Demian Lisboa Pereira (MIBA 1807).',
  alternates: {
    canonical: 'https://domino-automate.com.br/Atuaria',
  },
  openGraph: {
    title: 'Domino Automate | Vertical Atuária, Perícia Judicial & Governança CPC 33 (MIBA 1807)',
    description:
      'Auditoria independente CPC 33 (R1) / IAS 19, conformidade PREVIC, perícia atuarial judicial e automação analítica em Python.',
    url: 'https://domino-automate.com.br/Atuaria',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domino Automate | Vertical Atuária & Governança CPC 33 (MIBA 1807)',
    description:
      'Auditoria independente CPC 33, conformidade PREVIC e perícia atuarial judicial conduzida por Demian Lisboa Pereira (MIBA 1807).',
  },
};

const atuariaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      name: 'Domino Automate - Consultoria Atuarial e Perícia Judicial (MIBA 1807)',
      description:
        'Auditoria atuarial independente CPC 33 (R1) / IAS 19, governança PREVIC, assistência técnica judicial e automação analítica em Python.',
      url: 'https://domino-automate.com.br/Atuaria',
      areaServed: 'BR',
      founder: {
        '@type': 'Person',
        name: 'Demian Lisboa Pereira',
        jobTitle: 'Atuário Responsável Técnico (MIBA 1807)',
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
          name: 'Atuária & Previdência Complementar',
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
