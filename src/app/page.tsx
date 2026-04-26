import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pillars from '@/components/Pillars';
import SocialProof from '@/components/SocialProof';
import ROISimulator from '@/components/ROISimulator';
import AIAssistantHighlight from '@/components/AIAssistantHighlight';
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
      <Pillars />
      <ROISimulator />
      <AIAssistantHighlight />
      <Portfolio />
      <VideoGallery />
      <BudgetModule />
      <Footer />
      <AIChat />
    </>
  );
}
