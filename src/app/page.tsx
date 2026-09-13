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

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <SocialProof />
      <Pillars />
      <QuemSomos />
      <ROISimulator />
      <Portfolio />
      <AIAssistantHighlight />
      <VideoGallery />
      <BudgetModule />
      <CommentsSection />
      <FAQ />
      <Footer />
      <AIChat />
    </>
  );
}
