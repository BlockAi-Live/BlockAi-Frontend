import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  launch: () => void;
}

export default function Hero({ launch }: HeroProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-visible pt-32 md:pt-48 pb-12">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none select-none 
                   w-[350px] md:w-[480px] 
                   absolute left-20 -top-10 
                   -translate-x-1/4 
                   z-[1] mix-blend-screen
                   [mask-image:radial-gradient(circle_at_center,white_60%,transparent_95%)]"
      >
        <source src="/sphere-render.webm" type="video/webm" />
      </video>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none select-none 
                   w-[600px] md:w-[800px] 
                   absolute right-0 top-32 
                   translate-x-1/3 
                   z-[1] mix-blend-screen
                   [mask-image:radial-gradient(circle_at_center,white_60%,transparent_95%)]"
      >
        <source src="/sphere-render2.webm" type="video/webm" />
      </video>

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Talk to AI. Discover Alpha.
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#FFFFFF] via-[#794F9D] to-[#FFFFFF] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent pb-2">
          Track Everything.
        </h2>

        <p className="mt-12 text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
          Real-time on-chain analytics, alpha discovery & wallet alerts – all decentralized.
        </p>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
            className="group relative px-8 py-4 rounded-full text-base font-bold text-white shadow-lg hover:shadow-[#9945FF]/25 hover:scale-105 transition-all duration-300 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              {isAuthenticated ? "Go to Dashboard" : "Start Your Journey"} 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
