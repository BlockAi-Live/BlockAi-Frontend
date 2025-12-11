import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "@/components/home";
import AboutHero from "@/components/about/AboutHero";
import Mission from "@/components/about/Mission";
import CoreValues from "@/components/about/CoreValues";
import WhatWeDo from "@/components/about/WhatWeDo";
import Discovery from "@/components/about/Discovery";
import OurModels from "@/components/about/OurModels";
import WhyBlockAIExists from "@/components/about/WhyBlockAIExists";
import AboutCTA from "@/components/about/AboutCTA";
import TokenAccess from "@/components/about/TokenAccess";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function About() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#0B0E1A] text-white font-inter relative overflow-x-hidden">
      {/* Background gradient overlay - reused from Home */}
      <div 
        className="absolute inset-0 pointer-events-none w-full"
        style={{
          background: 'linear-gradient(136deg, rgba(155, 89, 182, 0.2) 0%, rgba(155, 89, 182, 0.2) 25%, rgba(20, 241, 149, 0.2) 50%, rgba(11, 14, 26, 0) 75%)',
          minHeight: '100%'
        }}
      />
      
      <div className="relative z-10">
        <Navbar launch={launch} />
        
        <main className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <AboutHero />
          </ScrollReveal>

          <ScrollReveal>
            <Mission />
          </ScrollReveal>

          <ScrollReveal>
            <CoreValues />
          </ScrollReveal>

          <ScrollReveal>
            <WhatWeDo />
          </ScrollReveal>

          <ScrollReveal>
            <Discovery />
          </ScrollReveal>

          <ScrollReveal>
            <TokenAccess />
          </ScrollReveal>

          <ScrollReveal>
            <OurModels />
          </ScrollReveal>

          <ScrollReveal>
            <WhyBlockAIExists />
          </ScrollReveal>

          <ScrollReveal>
            <AboutCTA />
          </ScrollReveal>
        </main>

        <Footer />
      </div>
    </div>
  );
}
