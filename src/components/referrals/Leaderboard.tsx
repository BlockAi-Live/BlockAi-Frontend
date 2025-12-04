"use client";

import { ReferralCard } from "./ReferralCard";
import { Crown, Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";

const leaders = [
  { rank: 1, user: "alpha_wolf", direct: 89, team: 245, earnings: "$18,920" },
  { rank: 2, user: "btc_baron", direct: 72, team: 198, earnings: "$15,450" },
  { rank: 3, user: "eth_empire", direct: 65, team: 156, earnings: "$12,800" },
  { rank: 4, user: "solana_surfer", direct: 54, team: 120, earnings: "$9,500" },
  { rank: 5, user: "chain_link", direct: 48, team: 98, earnings: "$8,200" },
  { rank: 6, user: "polka_dot", direct: 42, team: 85, earnings: "$7,100" },
];

export default function Leaderboard() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Top Referrers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((leader, index) => {
          const isTop3 = index < 3;
          const borderColor = 
            index === 0 ? "border-yellow-500/50 shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]" :
            index === 1 ? "border-gray-300/50 shadow-[0_0_30px_-10px_rgba(209,213,219,0.3)]" :
            index === 2 ? "border-orange-700/50 shadow-[0_0_30px_-10px_rgba(194,65,12,0.3)]" :
            "border-white/5";
          
          const icon = 
            index === 0 ? <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={28} /> :
            index === 1 ? <Trophy className="text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]" size={28} /> :
            index === 2 ? <Medal className="text-orange-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]" size={28} /> :
            <span className="text-xl font-bold text-gray-400 font-mono">#{leader.rank}</span>;

          return (
            <motion.div
              key={leader.rank}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ReferralCard 
                gradientBorder
                hoverEffect 
                className={`p-8 flex flex-col gap-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${
                      index === 0 ? "bg-yellow-500/10" :
                      index === 1 ? "bg-gray-300/10" :
                      index === 2 ? "bg-orange-700/10" :
                      "bg-[#0d0f18]/60 backdrop-blur-sm"
                    }`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{leader.user}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Rank #{leader.rank}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full uppercase border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      Leader
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-medium">Direct Referrals</span>
                    <span className="font-bold text-white bg-white/5 px-2 py-1 rounded">{leader.direct}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-medium">Total Team</span>
                    <span className="font-bold text-white bg-white/5 px-2 py-1 rounded">{leader.team}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-400 font-medium">Total Earnings</span>
                    <span className="font-mono font-bold text-[#6366F1] text-lg">{leader.earnings}</span>
                  </div>
                </div>
              </ReferralCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
