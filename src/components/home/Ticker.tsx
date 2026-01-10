"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Ticker() {
  const tickerItems = [
    "WHITELIST",
    "BLOCK AI",
    "EARLY ACCESS",
  ];

  return (
    <div className="w-full bg-[#0d0f18] border-b border-white/5 py-3 relative z-50 overflow-hidden">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-bold tracking-[0.2em] text-sm hover:text-[#14F195] transition-colors uppercase">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 font-bold tracking-[0.2em] text-sm hover:text-[#14F195] transition-colors uppercase">
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
