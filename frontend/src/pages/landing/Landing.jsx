import { Helmet } from 'react-helmet-async';
import { HeroSection } from './components/HeroSection';
import { SupportedBrokersBar } from './components/SupportedBrokersBar';
import { VolumeProfilingSection } from './components/VolumeProfilingSection';
import { FeaturesGridSection } from './components/FeaturesGridSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BottomCtaSection } from './components/BottomCtaSection';
import { FooterSection } from './components/FooterSection';

export const Landing = () => {
  return (
    <>
      <Helmet>
        <title>IndexPulse - Institutional Index Intelligence & Volume Profile Execution</title>
        <meta 
          name="description" 
          content="Stop trading blind derivative candles. Deconstruct Nifty 50, Bank Nifty & Sensex in real-time through underlying constituent orderflow, real volume nodes, and multi-broker routing." 
        />
      </Helmet>
      
      <div 
        style={{ 
          backgroundColor: '#070a12',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.12), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(16, 185, 129, 0.05), transparent 70%)',
          minHeight: '100vh',
          color: 'var(--text-primary)',
          overflowX: 'hidden'
        }}
      >
        <HeroSection />
        <SupportedBrokersBar />
        <VolumeProfilingSection />
        <FeaturesGridSection />
        <PricingSection />
        <TestimonialsSection />
        <BottomCtaSection />
        <FooterSection />
      </div>
    </>
  );
};
