import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "@/components/home";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Eye, Brain, Shield, Cpu, TrendingUp, Bell, Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─── Data ─── */
const pillars = [
  {
    icon: Brain,
    label: "Analytics",
    title: "AI-Powered Analysis",
    desc: "Our models learn from millions of data points across the blockchain, identifying patterns that matter before they trend.",
    color: "#14F195",
  },
  {
    icon: Zap,
    label: "Data",
    title: "Live Blockchain Signals",
    desc: "Every second, the chain changes. BlockAI updates with it, capturing whale movements, liquidity shifts, and emerging opportunities.",
    color: "#9945FF",
  },
  {
    icon: Eye,
    label: "Insights",
    title: "Instant Intelligence",
    desc: "No waiting hours for analysis. BlockAI surfaces high-probability signals designed to give you an early advantage.",
    color: "#1DA1F2",
  },
];

const whatWeTrack = [
  "Whale movements & smart-money flows",
  "New airdrops and hidden opportunities",
  "Liquidity changes, token metrics & early market shifts",
  "Transaction patterns across influential wallets",
  "Emerging alpha signals before they trend",
];

const modelFeatures = [
  "Learn continuously from live blockchain activity",
  "Adapt to market shifts in real time",
  "Improve with every block processed",
];

const tokenFeatures = [
  "Real-time whale alerts",
  "Advanced predictive AI models",
  "Early airdrop detection",
  "VIP analytics dashboard",
  "Exclusive community channels",
];

const whyPoints = [
  "Alpha shouldn't be locked behind centralized paywalls.",
  "On-chain data should be accessible to everyone.",
  "The future of trading intelligence is decentralized, instant, and AI-powered.",
];

export default function About() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-inter relative overflow-x-hidden">
      <div className="relative z-10">
        <Navbar launch={launch} />

        <main className="max-w-[1100px] mx-auto">

          {/* ── Hero ── */}
          <section className="relative pt-28 md:pt-36 pb-16 px-6 md:px-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#9945FF] rounded-full blur-[200px] opacity-[0.04] pointer-events-none" />

            <ScrollReveal>
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold text-[#14F195] uppercase tracking-[0.2em] mb-5">About BLOCKAI</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6">
                  On-chain intelligence,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                    for everyone.
                  </span>
                </h1>
                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                  BlockAI is a decentralized platform built for traders, founders, and on-chain explorers. We combine AI-powered analytics with live blockchain data to deliver actionable insights the moment they happen.
                </p>
              </div>
            </ScrollReveal>
          </section>

          {/* ── Mission ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                <div className="md:w-1/3">
                  <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-3">Our Mission</h2>
                  <div className="w-10 h-0.5 bg-[#14F195]" />
                </div>
                <p className="md:w-2/3 text-neutral-300 text-lg md:text-xl leading-relaxed">
                  Alpha shouldn't be locked behind centralized paywalls. BlockAI gives every user — from beginners to advanced traders — a statistical edge powered by AI, transparency, and decentralization.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* ── Three Pillars ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">What BlockAI Delivers</h2>
              <p className="text-neutral-500 text-base mb-12">Three pillars power the platform.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pillars.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-6 hover:border-neutral-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${p.color}12` }}>
                      <p.icon className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{p.label}</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-2">{p.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ── What We Track ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                <div className="md:w-1/3">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">What We Track</h2>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    BlockAI continuously scans the blockchain to identify patterns, trends, and early signals that matter.
                  </p>
                </div>
                <div className="md:w-2/3 space-y-4">
                  {whatWeTrack.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 py-3 border-b border-neutral-800/40"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] shrink-0" />
                      <span className="text-neutral-300 text-sm md:text-base">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ── How We Discover Alpha ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <div className="rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">How BlockAI Discovers Alpha</h2>
                <p className="text-neutral-400 text-base leading-relaxed max-w-3xl mb-8">
                  Our AI models analyze smart-money wallet behavior, token creation patterns, unusual transaction spikes, and flow imbalances — all processed in real time. With models trained on historical and live on-chain data, BlockAI surfaces high-probability insights designed to give you an early advantage.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modelFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 px-4 rounded-xl bg-neutral-900/50 border border-neutral-800/30">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#14F195", "#3B82F6", "#9945FF"][i] }} />
                      <span className="text-sm text-neutral-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ── Supported Chains ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1 rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Supported Chains</h2>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-4xl md:text-5xl font-bold text-[#14F195]">Solana</span>
                      <span className="text-neutral-700 text-2xl">+</span>
                      <span className="text-4xl md:text-5xl font-bold text-[#0052FF]">Base</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">With more L1s and L2s launching soon.</p>
                </div>

                <div className="flex-1 rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-8">
                  <h3 className="text-xl font-bold text-white mb-3">Built for Solana & Base, expanding everywhere</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Our vision is becoming the universal intelligence layer across all major blockchains. Every chain has alpha — and BlockAI will find it.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ── Token Access ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                <div className="md:w-1/2">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 text-[#9945FF]" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">The BlockAI Token</h2>
                  </div>
                  <p className="text-neutral-400 text-base leading-relaxed mb-6">
                    Everyone gets access to core analytics for free. Holding the BlockAI Token unlocks premium features:
                  </p>
                  <div className="space-y-3">
                    {tokenFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9945FF]" />
                        <span className="text-sm text-neutral-300">{f}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white font-semibold text-sm mt-6">
                    The more tokens you hold, the more powerful your tools become.
                  </p>
                </div>

                <div className="md:w-1/2">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-[#14F195]" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Predictions You Can Trust</h2>
                  </div>
                  <p className="text-neutral-400 text-base leading-relaxed">
                    While no tool can guarantee perfect accuracy in crypto markets, BlockAI provides probability-based insights grounded in hard data. Our models are transparent about confidence levels, so you always know the strength of each signal.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ── Why BlockAI Exists ── */}
          <ScrollReveal>
            <section className="py-16 px-6 md:px-0">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-8">Why BlockAI Exists</h2>
              <div className="space-y-4">
                {whyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="mt-2 w-2 h-2 rounded-full bg-white shrink-0" />
                    <p className="text-neutral-300 text-lg md:text-xl leading-relaxed">{point}</p>
                  </div>
                ))}
                <p className="text-white font-semibold text-lg md:text-xl mt-4 pl-6">
                  BlockAI gives you the clarity, speed, and insight needed to navigate crypto with confidence.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* ── CTA ── */}
          <ScrollReveal>
            <section className="py-20 px-6 md:px-0 text-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#9945FF] rounded-full blur-[180px] opacity-[0.03] pointer-events-none" />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 relative z-10">
                Real-time intelligence.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">Built for speed.</span>
              </h2>
              <p className="text-neutral-500 text-lg max-w-lg mx-auto mb-8 relative z-10">
                Join traders and founders who stay ahead with on-chain AI.
              </p>
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
                className="group relative z-10 px-8 py-3.5 rounded-xl text-sm font-semibold text-black bg-[#14F195] hover:bg-[#12d883] transition-colors duration-200 inline-flex items-center gap-2"
              >
                {isAuthenticated ? "Open Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </section>
          </ScrollReveal>

        </main>
        <Footer />
      </div>
    </div>
  );
}
