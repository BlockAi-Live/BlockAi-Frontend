import { useNavigate } from "react-router-dom";
import Head from "../assets/icons/Head.jsx";
import LightningIcon from "../assets/icons/Lightning.jsx";
import NotisIcon from "../assets/icons/Notis.jsx";
import SearchIcon from "../assets/icons/Search.jsx";
import TrendIcon from "../assets/icons/Trend.jsx";
import FunnelIcon from "../assets/icons/Funnel.jsx";
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
  Footer
} from "@/components/home";

export default function Home() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");

  const features = [
    {
      icon: <LightningIcon />,
      text: "Real-time data from Solana & beyond, decoded instantly.",
      label: "ON-CHAIN ANALYTICS",
    },
    {
      icon: <Head />,
      text: "The more the chain moves, the smarter BlockAI gets — forever.",
      label: "CONTINUOUS LEARNING",
    },
    {
      icon: <NotisIcon />,
      text: "Instant notifications on whale moves & smart-money activity.",
      label: "WALLET ALERTS",
    },
    {
      icon: <SearchIcon />,
      text: "Hidden gems, airdrops, and early DeFi plays — delivered first.",
      label: "ALPHA DISCOVERY",
    },
    {
      icon: <TrendIcon />,
      text: "AI-powered forecasts on tokens, trends, and market shifts.",
      label: "PREDICTIVE INSIGHTS",
    },
    {
      icon: <FunnelIcon />,
      text: "Cuts through misinformation and shills so you see only truth.",
      label: "NOISE FILTERING",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d0f18] text-white font-inter relative overflow-x-hidden">
      {/* Background gradient overlay - absolute positioning so it scrolls with content */}
      <div 
        className="fixed inset-0 pointer-events-none w-full"
        style={{
            background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.05) 0%, rgba(13, 15, 24, 0) 50%)",
            minHeight: '100%'
        }}
      />
      
      <div className="relative z-10">
        <Navbar launch={launch} />
        <main className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <Hero launch={launch} />
        </ScrollReveal>
        
        <section className="mt-20 px-6 md:px-0 relative z-30 isolate">
          <ScrollReveal>
            <h3 className="text-[#10e291] font-bold text-3xl md:text-4xl lg:text-5xl text-center tracking-wide mb-24">The Full Power of BlockAI</h3>
          </ScrollReveal>
          <FeaturesGrid features={features} />
        </section>

        <ScrollReveal>
          <SeeItLive />
        </ScrollReveal>
        
        <ScrollReveal>
          <ThreeSteps />
        </ScrollReveal>
        
        <ScrollReveal>
          <DashboardWidgets />
        </ScrollReveal>
        
        <ScrollReveal>
          <Community />
        </ScrollReveal>
        
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
      </main>
      <Footer />
      </div>
    </div>
  );
}


