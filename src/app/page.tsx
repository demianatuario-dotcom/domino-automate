import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Pillars from '@/components/Pillars';
import BudgetModule from '@/components/BudgetModule';
import VideoGallery from '@/components/VideoGallery';
import Portfolio from '@/components/Portfolio';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Pillars />
      <Portfolio />
      <VideoGallery />
      <BudgetModule />
      <Footer />
      <AIChat />
    </>
  );
}
