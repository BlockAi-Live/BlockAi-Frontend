"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Ticker() {
  const tickerItems = [
    "WHITELIST",
    "BLOCK AI",
    "EARLY ACCESS",
    "JOIN WAITLIST ↗"
  ];

  return (
    <div className="w-full bg-[#0d0f18] border-b border-white/5 py-3 relative z-50 overflow-hidden group cursor-pointer">
      <Link to="/waitlist" className="block">
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: "-50%" }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={index} className="flex items-center gap-12">
                <span className={`font-bold tracking-[0.2em] text-sm transition-colors uppercase ${
                  item === "JOIN WAITLIST ↗" 
                    ? "text-[#14F195] drop-shadow-[0_0_8px_rgba(20,241,149,0.5)]" 
                    : "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:text-white"
                }`}>
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
              </div>
            ))}
          </motion.div>
          <motion.div
             className="flex gap-12 items-center"
             animate={{ x: "-50%" }}
             transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
             }}
          >
              {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`dup-${index}`} className="flex items-center gap-12">
                <span className={`font-bold tracking-[0.2em] text-sm transition-colors uppercase ${
                  item === "JOIN WAITLIST ↗" 
                    ? "text-[#14F195] drop-shadow-[0_0_8px_rgba(20,241,149,0.5)]" 
                    : "text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:text-white"
                }`}>
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
              </div>
            ))}
          </motion.div>
        </div>
      </Link>
    </div>
  );
}
