import { motion } from "framer-motion";
import { Sparkle, TrendUp, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";

interface ChatEmptyStateProps {
  userName?: string;
  onSuggestionClick: (suggestion: string) => void;
}


export default function ChatEmptyState({ userName = "Trader", onSuggestionClick }: ChatEmptyStateProps) {
  const suggestions = [
    {
      icon: <TrendUp size={24} weight="duotone" className="text-white" />,
      bg: "bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_4px_10px_rgba(16,185,129,0.3)]",
      title: "Market Analysis",
      prompt: "Analyze the current market trend for Solana."
    },
    {
      icon: <Sparkle size={24} weight="duotone" className="text-white" />,
      bg: "bg-gradient-to-br from-purple-400 to-indigo-600 shadow-[0_4px_10px_rgba(124,58,237,0.3)]",
      title: "Creative Ideas",
      prompt: "Suggest 5 variations for a DeFi protocol name."
    },
    {
      icon: <ShieldCheck size={24} weight="duotone" className="text-white" />,
      bg: "bg-gradient-to-br from-blue-400 to-cyan-600 shadow-[0_4px_10px_rgba(59,130,246,0.3)]",
      title: "Smart Contract Audit",
      prompt: "Review this solidity code for vulnerabilities..."
    },
    {
      icon: <MagnifyingGlass size={24} weight="duotone" className="text-white" />,
      bg: "bg-gradient-to-br from-orange-400 to-red-600 shadow-[0_4px_10px_rgba(249,115,22,0.3)]",
      title: "Deep Research",
      prompt: "Explain the consensus mechanism of Kaspa."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Logo Only (No Orb) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative mb-8"
      >
        <img src="/blockai.svg" alt="BlockAI" className="w-16 h-16" />
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Good evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">{userName}</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-light">
            How can I assist your trading journey today?
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl"
      >
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(item.prompt)}
            className="flex flex-col items-start gap-3 p-3 md:p-6 rounded-[24px] md:rounded-[32px] bg-[#13151C] border border-white/5 hover:border-white/10 hover:bg-[#1E222B] transition-all text-left group h-full shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            <div className={`p-2 md:p-3 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
            </div>
            <div>
                 <span className="block text-gray-200 font-semibold text-xs md:text-sm mb-1 group-hover:text-white transition-colors">{item.title}</span>
                 <span className="block text-[10px] md:text-xs text-gray-500 leading-relaxed font-light line-clamp-2 md:line-clamp-none">{item.prompt}</span>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
