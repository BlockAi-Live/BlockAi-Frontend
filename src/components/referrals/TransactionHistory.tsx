"use client";

import { ReferralCard } from "./ReferralCard";
import { ArrowUpRight, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: 1, date: "2023-11-28 14:30", user: "crypto_king", level: 1, amount: 450.00, status: "paid", hash: "0x123...abc" },
  { id: 2, date: "2023-11-28 12:15", user: "nft_queen", level: 2, amount: 125.50, status: "pending", hash: "0x456...def" },
  { id: 3, date: "2023-11-27 09:45", user: "defi_degen", level: 1, amount: 900.00, status: "paid", hash: "0x789...ghi" },
  { id: 4, date: "2023-11-26 18:20", user: "web3_wizard", level: 3, amount: 45.00, status: "paid", hash: "0xabc...jkl" },
  { id: 5, date: "2023-11-26 16:10", user: "hodl_gang", level: 2, amount: 210.00, status: "pending", hash: "0xdef...mno" },
];

export default function TransactionHistory() {
  const [filter, setFilter] = useState("all");

  return (
    <section className="py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Transaction History</h2>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search username..." 
              className="w-full bg-[#0d0f18]/60 backdrop-blur-sm border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/50 transition-all placeholder:text-gray-500"
            />
          </div>
          <button className="p-3 bg-[#0d0f18]/60 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-[#0d0f18]/80 hover:border-white/20 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <ReferralCard gradientBorder className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Date/Time</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Level</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Commission</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="p-6 font-mono text-sm text-gray-400">{tx.date}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white">
                        {tx.user.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{tx.user}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                      tx.level === 1 ? "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" :
                      tx.level === 2 ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" :
                      "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20"
                    }`}>
                      Level {tx.level}
                    </span>
                  </td>
                  <td className="p-6 font-mono font-bold text-white">${tx.amount.toFixed(2)}</td>
                  <td className="p-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-bold uppercase ${
                      tx.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {tx.status === "paid" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      <span>{tx.status}</span>
                    </div>
                  </td>
                  <td className="p-6 font-mono text-xs text-gray-400 group-hover:text-[#6366F1] transition-colors">
                    {tx.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white/[0.02] rounded-xl p-4 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white">
                    {tx.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-white block">{tx.user}</span>
                    <span className="text-xs text-gray-400 font-mono">{tx.date}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                  tx.level === 1 ? "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" :
                  tx.level === 2 ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" :
                  "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20"
                }`}>
                  L{tx.level}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Commission</p>
                  <p className="font-mono font-bold text-white text-lg">${tx.amount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase mb-1">Status</p>
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase ${
                    tx.status === "paid" ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {tx.status === "paid" ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                    <span>{tx.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 flex justify-center bg-white/[0.02]">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            Load More Transactions <ArrowUpRight size={14} />
          </button>
        </div>
      </ReferralCard>
    </section>
  );
}
