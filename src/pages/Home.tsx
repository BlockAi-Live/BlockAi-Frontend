import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

import {
  Navbar,
  Hero,
  FeaturesGrid,
  SeeItLive,
  ThreeSteps,
  DashboardWidgets,
  Community,
  FAQ,
  Footer,
  Ticker,
  LogoCloud,
  FinalCTA
} from "@/components/home";

export default function Home() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-inter relative overflow-x-hidden">
      <div className="relative z-10">
        <Ticker />
        <Navbar launch={launch} />
        <main className="max-w-[1100px] mx-auto">
          <Hero launch={launch} />

          <ScrollReveal>
            <LogoCloud />
          </ScrollReveal>

          <section id="features" className="mt-24 px-6 md:px-0 relative z-30">
            <ScrollReveal>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center tracking-tight text-white mb-3">
                Everything you need
              </h3>
              <p className="text-neutral-500 text-center text-base md:text-lg max-w-md mx-auto">
                Interactive tools that give you the edge.
              </p>
            </ScrollReveal>
            <FeaturesGrid />
          </section>

          <ScrollReveal>
            <SeeItLive />
          </ScrollReveal>

          <ScrollReveal>
            <ThreeSteps />
          </ScrollReveal>

          <ScrollReveal>
            <Community />
          </ScrollReveal>

          <ScrollReveal>
            <FAQ />
          </ScrollReveal>

          <ScrollReveal>
            <FinalCTA />
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    </div>
  );
}
