"use client";

import { ReferralCard } from "./ReferralCard";
import { Copy, Check, Wallet, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function HeroStats() {
  const [copied, setCopied] = useState(false);
  const referralLink = "block.ai/ref/blockai_trader";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="relative w-full py-4">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Earnings */}
        <motion.div variants={item} className="md:col-span-1">
          <ReferralCard gradientBorder className="h-full p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-[#9945FF]/10 text-[#9945FF] ring-1 ring-[#9945FF]/20">
                <Wallet size={24} />
              </div>
              <span className="text-xs font-mono text-[#14F195] bg-[#14F195]/10 px-3 py-1 rounded-full border border-[#14F195]/20">
                +12.5%
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Earnings</p>
              <h2 className="text-5xl font-bold text-white tracking-tight group-hover:text-[#9945FF] transition-colors">
                $12,450.00
              </h2>
            </div>
          </ReferralCard>
        </motion.div>

        {/* Active Referrals */}
        <motion.div variants={item} className="md:col-span-1">
          <ReferralCard gradientBorder className="h-full p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-[#9945FF]/10 text-[#9945FF] ring-1 ring-[#9945FF]/20">
                <Users size={24} />
              </div>
              <span className="text-xs font-mono text-[#14F195] bg-[#14F195]/10 px-3 py-1 rounded-full border border-[#14F195]/20">
                Active
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Active Referrals</p>
              <h2 className="text-5xl font-bold text-white tracking-tight group-hover:text-[#9945FF] transition-colors">
                145
              </h2>
            </div>
          </ReferralCard>
        </motion.div>

        {/* Referral Link */}
        <motion.div variants={item} className="md:col-span-1">
          <ReferralCard gradientBorder className="h-full p-8 flex flex-col justify-center gap-6">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-[#0d0f18]/60 backdrop-blur-sm p-2 rounded-xl border border-white/10 group-hover:border-[#06B6D4]/30 transition-colors">
                <code className="flex-1 font-mono text-sm text-white px-3 truncate">
                  {referralLink}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="p-2.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-lg hover:opacity-80 transition-opacity shadow-lg shadow-[#9945FF]/20"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </motion.button>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-gray-400 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
              <span>Share to earn <span className="text-[#14F195] font-bold">9% commission</span></span>
            </div>
          </ReferralCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
