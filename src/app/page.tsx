import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import ValueProposition from '@/components/ValueProposition';
import NicheSolutions from '@/components/NicheSolutions';
import Pillars from '@/components/Pillars';
import ROISimulator from '@/components/ROISimulator';
import AIAssistantHighlight from '@/components/AIAssistantHighlight';
import FAQ from '@/components/FAQ';
import BudgetModule from '@/components/BudgetModule';
import VideoGallery from '@/components/VideoGallery';
import Portfolio from '@/components/Portfolio';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <SocialProof />
      <ValueProposition />
      <NicheSolutions />
      <Pillars />
      <ROISimulator />
      <AIAssistantHighlight />
      <Portfolio />
      <FAQ />
      <VideoGallery />
      <BudgetModule />
      <Footer />
      <AIChat />
    </>
  );
}
