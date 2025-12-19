"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Copy, 
  DotsThree,
  CreditCard,
  QrCode,
  ClockCounterClockwise,
  TrendUp
} from "@phosphor-icons/react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip 
} from "recharts";

// --- Mock Data ---

const wallets = [
  {
    id: "1",
    name: "Main Vault",
    type: "Ledger",
    address: "0x4d...b29",
    balance: 84200.50,
    change: 12.5,
    color: "#14F195"
  },
  {
    id: "2",
    name: "Hot Wallet",
    type: "Metamask",
    address: "0xac...0ad",
    balance: 5073.20,
    change: -2.4,
    color: "#9945FF"
  },
  {
    id: "3",
    name: "Solana Degen",
    type: "Phantom",
    address: "H7f...9xP",
    balance: 16404.50,
    change: 33.7,
    color: "#F7931A"
  }
];

const allocationData = [
  { name: "BTC", value: 45, color: "#F7931A" },
  { name: "ETH", value: 30, color: "#627EEA" },
  { name: "SOL", value: 15, color: "#14F195" },
  { name: "USDT", value: 10, color: "#26A17B" },
];

const transactions = [
  { id: 1, type: "Receive", asset: "ETH", amount: "1.5", value: "$3,200", from: "0x88...9a", time: "2h ago" },
  { id: 2, type: "Send", asset: "USDT", amount: "500", value: "$500", to: "Binance", time: "5h ago" },
  { id: 3, type: "Swap", asset: "SOL", amount: "200", value: "$18,400", from: "USDC", time: "1d ago" },
];

export function WalletsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAsset, setActiveAsset] = useState<any>(null);

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white font-sans overflow-x-hidden relative flex flex-col pb-24">
       {/* Global Background Ambience */}
       <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 80% 0%, rgba(153, 69, 255, 0.05) 0%, rgba(13, 15, 24, 0) 60%), radial-gradient(circle at 20% 100%, rgba(20, 241, 149, 0.05) 0%, rgba(13, 15, 24, 0) 60%)"
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Wallets</h1>
              <p className="text-gray-400">Track your assets across all chains.</p>
           </div>
           
           <button className="group relative px-6 py-3 rounded-[20px] bg-[#14F195] text-black font-bold flex items-center gap-2 overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgba(20,241,149,0.2)]">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               <Plus size={20} className="relative z-10" />
               <span className="relative z-10">Connect Wallet</span>
           </button>
        </div>

        {/* --- HERO SECTION: NET WORTH & CHART --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Total Balance Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="lg:col-span-2 p-8 rounded-[32px] bg-[#13151C] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]"
            >
               {/* Ambient Glow */}
               <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-[#14F195]/10 to-transparent blur-[80px] pointer-events-none" />

               <div>
                   <div className="flex items-center gap-2 text-gray-400 mb-2">
                       <CreditCard size={18} />
                       <span className="text-sm font-medium uppercase tracking-wider">Total Net Worth</span>
                   </div>
                   <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                       ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h2>
                   <div className="flex items-center gap-3">
                       <div className="px-3 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/20 flex items-center gap-1.5">
                           <TrendUp size={14} className="text-[#14F195]" />
                           <span className="text-[#14F195] font-bold text-xs">+12.4%</span>
                       </div>
                       <span className="text-gray-500 text-sm">vs last month</span>
                   </div>
               </div>

               <div className="flex items-end gap-2 mt-8">
                   <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                       Send
                   </button>
                   <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                       Receive
                   </button>
                   <button className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                       Swap
                   </button>
                   <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-gray-400">
                       <DotsThree size={20} />
                   </button>
               </div>
            </motion.div>

            {/* Allocation Chart */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="p-8 rounded-[32px] bg-[#13151C] border border-white/5 shadow-xl flex flex-col relative"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg">Allocation</h3>
                    <button className="text-xs text-gray-500 hover:text-white transition-colors">See Details</button>
                </div>

                <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
                    {/* Ring Chart */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={6}
                                cornerRadius={8}
                                dataKey="value"
                                stroke="none"
                                onMouseEnter={(_, index) => setActiveAsset(allocationData[index])}
                                onClick={(_, index) => setActiveAsset(allocationData[index])}
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color} 
                                        strokeWidth={0}
                                        className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none"
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                            {activeAsset ? activeAsset.name : "Top Asset"}
                        </span>
                        <h4 className="text-3xl font-bold text-white transition-all">
                            {activeAsset ? `${activeAsset.value}%` : "45%"}
                        </h4>
                        <span className="text-xs text-gray-500" style={{ color: activeAsset?.color || "#F7931A" }}>
                             {activeAsset ? "Allocation" : "Bitcoin"}
                        </span>
                    </div>
                </div>

                {/* Refined Legend */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {allocationData.map(item => (
                        <div 
                            key={item.name} 
                            className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer group ${activeAsset?.name === item.name ? "bg-white/10" : "hover:bg-white/5"}`}
                            onMouseEnter={() => setActiveAsset(item)}
                            onClick={() => setActiveAsset(item)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full ring-2 ring-transparent group-hover:ring-white/20 transition-all" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-400 text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-white font-mono text-sm font-bold">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* --- WALLETS GRID --- */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Connected Wallets</h3>
                <button className="text-sm text-[#14F195] hover:underline">Manage</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet, i) => (
                    <motion.div
                        key={wallet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="group p-6 rounded-[24px] bg-[#16181f] border border-white/5 hover:border-[#14F195]/30 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5">
                                <Wallet size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <div className={`px-2 py-1 rounded-lg bg-[${wallet.color}]/10 border border-[${wallet.color}]/20`}>
                                <span className={`text-xs font-bold`} style={{ color: wallet.color }}>
                                    {wallet.type}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-500 text-sm mb-1">{wallet.name}</p>
                            <h4 className="text-2xl font-bold text-white">${wallet.balance.toLocaleString()}</h4>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono bg-black/20 px-2 py-1 rounded cursor-pointer hover:text-white">
                                {wallet.address} <Copy size={16} />
                            </div>
                            <span className={`text-xs font-bold ${wallet.change >= 0 ? "text-[#14F195]" : "text-red-400"}`}>
                                {wallet.change >= 0 ? "+" : ""}{wallet.change}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ClockCounterClockwise size={20} className="text-gray-400" />
                Recent Activity
            </h3>
            
            <div className="bg-[#13151C] rounded-[32px] border border-white/5 p-2">
                {transactions.map((tx, i) => (
                    <div 
                        key={tx.id}
                        className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border border-white/5
                                ${tx.type === "Receive" ? "bg-green-500/10 text-green-500" : 
                                  tx.type === "Send" ? "bg-red-500/10 text-red-500" : 
                                  "bg-blue-500/10 text-blue-500"}
                            `}>
                                {tx.type === "Receive" && <ArrowDownRight size={18} />}
                                {tx.type === "Send" && <ArrowUpRight size={18} />}
                                {tx.type === "Swap" && <QrCode size={18} />}
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">{tx.type} {tx.asset}</h4>
                                <p className="text-gray-500 text-xs">{tx.time} • {tx.from || tx.to}</p>
                            </div>
                        </div>
                        
                        <div className="text-right">
                             <p className={`font-bold text-sm ${tx.type === "Receive" ? "text-[#14F195]" : "text-white"}`}>
                                 {tx.type === "Receive" ? "+" : "-"}{tx.amount} {tx.asset}
                             </p>
                             <p className="text-gray-500 text-xs">{tx.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}
