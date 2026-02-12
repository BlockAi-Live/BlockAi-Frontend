"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Ticker() {
  const tickerItems = [
    "PUBLIC BETA",
    "BLOCK AI",
    "EARLY ACCESS",
    "JOIN NOW ↗"
  ];

  return (
    <div className="w-full bg-[#09090b] border-b border-neutral-800/50 py-2.5 relative z-50 overflow-hidden group cursor-pointer">
      <Link to="/waitlist" className="block">
        <div className="flex whitespace-nowrap">
          <motion.div
            className="flex gap-10 items-center"
            animate={{ x: "-50%" }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={index} className="flex items-center gap-10">
                <span className={`font-medium tracking-[0.15em] text-xs transition-colors uppercase ${
                  item === "JOIN NOW ↗" 
                    ? "text-[#14F195]" 
                    : "text-neutral-600 group-hover:text-neutral-400"
                }`}>
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full bg-neutral-700" />
              </div>
            ))}
          </motion.div>
          <motion.div
            className="flex gap-10 items-center"
            animate={{ x: "-50%" }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`dup-${index}`} className="flex items-center gap-10">
                <span className={`font-medium tracking-[0.15em] text-xs transition-colors uppercase ${
                  item === "JOIN NOW ↗" 
                    ? "text-[#14F195]" 
                    : "text-neutral-600 group-hover:text-neutral-400"
                }`}>
                  {item}
                </span>
                <div className="w-1 h-1 rounded-full bg-neutral-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </Link>
    </div>
  );
}
