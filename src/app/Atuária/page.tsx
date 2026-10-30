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
  title: 'Domino Automate | Vertical Atuária, Perícia Judicial & Governança CPC 33 (MIBA 1807)',
  description: 'Auditoria independente CPC 33 (R1) / IAS 19, conformidade PREVIC, perícia atuarial judicial (TRT10 / TJDFT) e motores de cálculo em Python conduzidos por Demian Lisboa Pereira (MIBA 1807).',
};

export default function AtuariaPage() {
  return (
    <>
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

