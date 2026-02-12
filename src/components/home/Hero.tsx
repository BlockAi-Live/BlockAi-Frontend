import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "../ui/AnimatedGridPattern";

interface HeroProps {
  launch: () => void;
}

export default function Hero({ launch }: HeroProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-20 md:pt-28 pb-12 md:pb-16">
      {/* Animated grid — subtle, behind everything */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={1}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] fill-neutral-700/20 stroke-neutral-700/20"
      />

      {/* Single soft top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#14F195] rounded-full blur-[200px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
        {/* Small status pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-neutral-300 mb-10 overflow-hidden"
        >
          {/* Animated border */}
          <span className="absolute inset-0 rounded-full border border-neutral-700/60" />
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
          <span className="relative flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
            Public Beta
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] tracking-[-0.03em] text-white"
        >
          AI-powered
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
            on-chain intelligence
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 text-neutral-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
        >
          Real-time analytics, alpha discovery, and wallet tracking.
          <br className="hidden md:block" />
          Everything you need in one place.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
            className="group px-7 py-3 rounded-lg text-sm font-semibold text-black bg-[#14F195] hover:bg-[#12d883] transition-colors duration-200 flex items-center gap-2"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <a
            href="/about"
            className="px-7 py-3 rounded-lg text-sm font-semibold text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-all duration-200"
          >
            Learn More
          </a>
        </motion.div>

        {/* Minimal stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 flex items-center justify-center gap-8 md:gap-16 text-sm"
        >
          {[
            { value: "$2.1B+", label: "Volume Tracked" },
            { value: "24/7", label: "Monitoring" },
            { value: "< 1s", label: "Latency" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-semibold text-lg">{stat.value}</div>
              <div className="text-neutral-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
