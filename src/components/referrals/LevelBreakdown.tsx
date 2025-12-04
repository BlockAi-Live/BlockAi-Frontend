"use client";

import { ReferralCard } from "./ReferralCard";
import { Network, Users, ChevronRight, TreePine } from "lucide-react";
import { motion } from "framer-motion";

const levels = [
  {
    level: 1,
    title: "Direct Referrals",
    commission: "7%",
    users: 45,
    earnings: "$4,050.00",
    color: "text-[#9945FF]",
    borderColor: "border-[#9945FF]/30",
    bg: "bg-[#9945FF]/20",
    icon: TreePine,
    gradientBorder: true
  },
  {
    level: 2,
    title: "Indirect Referrals",
    commission: "5%",
    users: 58,
    earnings: "$2,835.00",
    color: "text-[#14F195]",
    borderColor: "border-[#14F195]/30",
    bg: "bg-[#14F195]/20",
    icon: Network,
    gradientBorder: true
  },
  {
    level: 3,
    title: "Extended Network",
    commission: "3%",
    users: 92,
    earnings: "$1,620.00",
    color: "text-[#9945FF]",
    borderColor: "border-[#9945FF]/30",
    bg: "bg-[#9945FF]/20",
    icon: Users,
    gradientBorder: true
  }
];

export default function LevelBreakdown() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Level Breakdown</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((lvl, index) => (
          <motion.div
            key={lvl.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ReferralCard 
              hoverEffect
              gradientBorder={lvl.gradientBorder}
              className={`h-full p-8 flex flex-col justify-between group`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${lvl.color} mb-2 block`}>
                    Level {lvl.level}
                  </span>
                  <h3 className="text-xl font-medium text-white">{lvl.title}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${lvl.bg} ${lvl.color} ring-1 ring-white/5`}>
                  <lvl.icon size={28} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-bold ${lvl.color}`}>
                    {lvl.commission}
                  </span>
                  <span className="text-gray-400 font-medium">Commission</span>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Users</p>
                    <p className="text-2xl font-bold text-white">{lvl.users}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Earnings</p>
                    <p className="text-2xl font-mono text-white">{lvl.earnings}</p>
                  </div>
                </div>

                <button className="w-full py-4 flex items-center justify-center gap-2 rounded-xl bg-[#0d0f18]/60 backdrop-blur-sm border border-white/5 hover:bg-[#0d0f18]/80 hover:border-white/10 transition-all text-sm font-bold text-white group-hover:shadow-lg">
                  View Details <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </ReferralCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
