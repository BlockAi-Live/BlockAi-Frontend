import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import { Activity, Search, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function SeeItLive() {
  return (
    <section className="mt-32 px-6 md:px-0 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            See it in action
          </h3>
          <p className="text-neutral-500 text-base md:text-lg max-w-lg mx-auto">
            Live chain intelligence, updated every second. Your command center for on-chain data.
          </p>
        </div>

        {/* Product showcase — contained */}
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 overflow-hidden rounded-xl"
            style={{ aspectRatio: "16/8" }}
          >
            <img
              src="/blockaimockup.png"
              alt="BlockAI Dashboard"
              className="w-[115%] h-auto ml-[2%] -mt-[10%]"
            />
          </motion.div>

          {/* Floating notification cards — solid, compact */}
          <motion.div
            className="absolute -right-16 top-[20%] z-20 hidden lg:block"
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="bg-[#111113] border border-neutral-800 p-3 rounded-lg flex items-center gap-2.5 w-44 shadow-xl shadow-black/40">
              <div className="w-7 h-7 rounded-md bg-[#14F195]/10 flex items-center justify-center shrink-0">
                <Bell className="w-3.5 h-3.5 text-[#14F195]" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-500">Alert</p>
                <p className="text-[11px] font-semibold text-white">Whale bought $BONK</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -left-16 bottom-[20%] z-20 hidden lg:block"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="bg-[#111113] border border-neutral-800 p-3 rounded-lg flex items-center gap-2.5 w-44 shadow-xl shadow-black/40">
              <div className="w-7 h-7 rounded-md bg-[#9945FF]/10 flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5 text-[#9945FF]" />
              </div>
              <div>
                <p className="text-[9px] text-neutral-500">Market</p>
                <p className="text-[11px] font-semibold text-white">SOL Volume +150%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature pills below */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { icon: <Activity className="w-3.5 h-3.5 text-[#14F195]" />, text: "Whale tracking" },
            { icon: <Search className="w-3.5 h-3.5 text-[#9945FF]" />, text: "Alpha discovery" },
            { icon: <Bell className="w-3.5 h-3.5 text-[#14F195]" />, text: "Instant alerts" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900/50 border border-neutral-800/60 text-xs text-neutral-400"
            >
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
