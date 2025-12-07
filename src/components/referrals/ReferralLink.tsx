"use client";

import { ReferralCard } from "./ReferralCard";
import { Copy, Check, Twitter, Send, Globe } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ReferralLink() {
  const [copied, setCopied] = useState(false);
  const referralLink = "block.ai/ref/User123";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-[#9945FF] to-[#14F195]">
          <div className="relative rounded-3xl overflow-hidden bg-[#0d0f18]">
            {/* Gradient blobs on dark background */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#9945FF]/40 rounded-full blur-[150px]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14F195]/30 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#9945FF]/20 rounded-full blur-[120px]" />
            
            <div className="relative p-8 md:p-20">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight italic">
                  Share And Earn
                </h2>
                
                <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Invite friends to BLOCKAI and earn up to <span className="text-[#14F195] font-bold">15% commission</span> across 3 Levels of your network.
                </p>

                {/* Referral Link Input */}
                <div className="flex justify-center max-w-xl mx-auto">
                  <div className="flex items-center w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1.5">
                    <input 
                      type="text" 
                      readOnly 
                      value={referralLink}
                      className="flex-1 bg-transparent border-none py-3 px-4 md:px-6 text-white/70 font-mono text-xs md:text-sm focus:outline-none focus:ring-0 min-w-0"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={copyToClipboard}
                      className="px-4 md:px-6 py-3 bg-[#14F195] text-black rounded-full font-bold flex items-center gap-2 hover:bg-[#14F195]/90 transition-colors shrink-0 text-sm md:text-base"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      <span>Copy</span>
                    </motion.button>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 pt-2">
                  <motion.button 
                    whileHover={{ y: -2 }} 
                    className="p-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Twitter size={24} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -2 }} 
                    className="p-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Send size={24} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -2 }} 
                    className="p-3 text-white/60 hover:text-white transition-colors"
                  >
                    <Globe size={24} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
