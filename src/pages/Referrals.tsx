"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Copy, Users, Trophy, CurrencyCircleDollar, ShareNetwork, ChartLineUp, 
  Gift, CheckCircle, WhatsappLogo, TwitterLogo, TelegramLogo,
  TreeStructure, Network, User, MagnifyingGlass, Funnel, Clock, ArrowUpRight
} from "@phosphor-icons/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "../context/AuthContext";

// --- MOCK DATA ---

const levelsData = [
  { level: 1, title: "Direct Referrals", commission: "7%", users: 45, earnings: "$4,050.00", color: "#6366F1", icon: User },
  { level: 2, title: "Indirect Referrals", commission: "5%", users: 58, earnings: "$2,835.00", color: "#14F195", icon: Network },
  { level: 3, title: "Extended Network", commission: "3%", users: 92, earnings: "$1,620.00", color: "#9945FF", icon: TreeStructure }
];

const earningData = [
  { name: 'Mon', l1: 400, l2: 240, l3: 100 },
  { name: 'Tue', l1: 300, l2: 139, l3: 200 },
  { name: 'Wed', l1: 200, l2: 980, l3: 200 },
  { name: 'Thu', l1: 278, l2: 390, l3: 150 },
  { name: 'Fri', l1: 189, l2: 480, l3: 100 },
  { name: 'Sat', l1: 239, l2: 380, l3: 250 },
  { name: 'Sun', l1: 349, l2: 430, l3: 210 },
];

const transactionsData = [
  { id: 1, date: "2023-11-28 14:30", user: "crypto_king", level: 1, amount: 450.00, status: "paid", hash: "0x123...abc" },
  { id: 2, date: "2023-11-28 12:15", user: "nft_queen", level: 2, amount: 125.50, status: "pending", hash: "0x456...def" },
  { id: 3, date: "2023-11-27 09:45", user: "defi_degen", level: 1, amount: 900.00, status: "paid", hash: "0x789...ghi" },
  { id: 4, date: "2023-11-26 18:20", user: "web3_wizard", level: 3, amount: 45.00, status: "paid", hash: "0xabc...jkl" },
  { id: 5, date: "2023-11-26 16:10", user: "hodl_gang", level: 2, amount: 210.00, status: "pending", hash: "0xdef...mno" },
];

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="relative p-6 rounded-[24px] bg-[#16181f] border border-white/5 overflow-hidden group hover:bg-[#1c1e26] transition-all duration-300"
  >
    <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
           {React.cloneElement(icon, { size: 28, color: color, weight: "fill" })}
        </div>
        <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{label}</p>
    </div>
    
    <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-bold text-white tracking-tight">
            {value}
        </h3>
    </div>
    
    {/* Permanent Glow Bar (Requested by User) */}
    <div 
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80" 
        style={{ color: color }} 
    />
  </motion.div>
);

// Unified Node Component for Charts
const FlowNode = ({ x, y, label, subLabel, color, icon: Icon, isRoot }: any) => (
    <motion.g 
        initial={{ opacity: 0, scale: 0 }} 
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
    >
        {/* Connection Dot Top (Input) */}
        {!isRoot && <circle cx={x} cy={y - 28} r={3} fill={color} />}

        {/* Card Body */}
        <rect x={x - 60} y={y - 28} width={120} height={56} rx={16} fill="#0d0f18" stroke={color} strokeWidth={isRoot ? 2 : 1} strokeOpacity={0.5} />
        
        {/* Icon & Label */}
        <foreignObject x={x - 60} y={y - 28} width={120} height={56}>
            <div className="w-full h-full flex flex-col items-center justify-center p-1">
                {isRoot && <div className="mb-1"><Icon size={16} color={color} weight="fill" /></div>}
                <div className="text-white font-bold text-[10px] uppercase tracking-wider">{label}</div>
                {subLabel && <div className="text-[9px] text-gray-400" >{subLabel}</div>}
            </div>
        </foreignObject>

        {/* Connection Dot Bottom (Output) */}
        <circle cx={x} cy={y + 28} r={3} fill={color} />
    </motion.g>
);

const FlowLine = ({ x1, y1, x2, y2, color }: any) => (
    <motion.path
        d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1 }}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
    />
);

export function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("All Levels");
  const referralLink = `https://blockai.com/ref/${user?.fullName?.toLowerCase().replace(/\s+/g, '') || "user"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white font-sans overflow-x-hidden relative flex flex-col pb-24">
       {/* Background Ambience */}
       <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.03) 0%, rgba(13, 15, 24, 0) 50%)"
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 space-y-12">
        
        {/* HEADER & LINK */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8">
            <div>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/20 text-[#14F195] text-xs font-bold mb-4">
                     <Gift weight="fill" /> Referral Program
                 </motion.div>
                 <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-bold text-white mb-2">
                     Grow Your Network
                 </motion.h1>
                 <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-400">
                     Earn up to <span className="text-[#14F195] font-bold">15% commission</span> across 3 levels.
                 </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-auto p-4 rounded-2xl bg-[#13151C] border border-white/10 flex flex-col md:flex-row gap-4 items-center shadow-2xl"
            >
                <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 font-mono text-gray-300 w-full md:w-80 truncate text-center md:text-left">
                    {referralLink}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={handleCopy} className="flex-1 md:flex-none px-4 py-2 bg-[#14F195] text-black font-bold rounded-xl hover:bg-[#14F195]/90 transition-colors flex items-center justify-center gap-2">
                         {copied ? <CheckCircle weight="fill" /> : <Copy weight="bold" />} {copied ? "Copied" : "Copy"}
                    </button>
                    <button className="p-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl hover:bg-[#1DA1F2] hover:text-white transition-colors"><TwitterLogo size={20} weight="fill" /></button>
                    <button className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white transition-colors"><WhatsappLogo size={20} weight="fill" /></button>
                </div>
            </motion.div>
        </div>

        {/* CLEAN STATS GRID (Permanent Glow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Earnings" value="$8,505.00" icon={<CurrencyCircleDollar />} color="#14F195" delay={0.2} />
            <StatCard label="Network Size" value="195 Users" icon={<Users />} color="#6366F1" delay={0.3} />
            <StatCard label="Pending Rewards" value="$450.50" icon={<ChartLineUp />} color="#F7931A" delay={0.4} />
            <StatCard label="Global Rank" value="#156" icon={<Trophy />} color="#FFD700" delay={0.5} />
        </div>

        {/* LEVEL BREAKDOWN */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-white mb-6">Commission Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levelsData.map((lvl, i) => (
                    <motion.div 
                        key={lvl.level}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[32px] bg-[#13151C] border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/5" style={{ color: lvl.color, borderColor: `${lvl.color}33` }}>
                                Level {lvl.level}
                            </span>
                            <lvl.icon size={28} color={lvl.color} weight="duotone" />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-white mb-1">{lvl.commission}</h3>
                            <p className="text-gray-400 text-sm mb-6">{lvl.title}</p>
                            
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Users</span>
                                    <span className="text-white font-bold">{lvl.users}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Earnings</span>
                                    <span className="text-white font-bold">{lvl.earnings}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>

        {/* CHART & SIMPLE FLOW CHART */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* EARNINGS CHART */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="p-8 rounded-[32px] bg-[#13151C] border border-white/5 flex flex-col h-[500px]"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Earnings Analytics</h3>
                    <div className="flex gap-2 bg-black/20 p-1 rounded-xl overflow-x-auto no-scrollbar">
                        {["All Levels", "Level 1", "Level 2", "Level 3"].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? "bg-[#3B82F6] text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={earningData}>
                            <defs>
                                <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorL2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14F195" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorL3" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9945FF" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#9945FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0d0f18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            {(activeTab === "All Levels" || activeTab === "Level 1") && (
                                <Area type="monotone" dataKey="l1" stroke="#6366F1" strokeWidth={3} fill="url(#colorL1)" name="Direct" />
                            )}
                            {(activeTab === "All Levels" || activeTab === "Level 2") && (
                                <Area type="monotone" dataKey="l2" stroke="#14F195" strokeWidth={3} fill="url(#colorL2)" name="Indirect" />
                            )}
                            {(activeTab === "All Levels" || activeTab === "Level 3") && (
                                <Area type="monotone" dataKey="l3" stroke="#9945FF" strokeWidth={3} fill="url(#colorL3)" name="Extended" />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* FLOW CHART (Simple Organization Tree) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="p-8 rounded-[32px] bg-[#13151C] border border-white/5 flex flex-col h-[500px] relative overflow-hidden items-center"
            >
                <div className="absolute top-8 left-8 z-10">
                    <h3 className="text-xl font-bold text-white">Network Flow</h3>
                    <p className="text-xs text-gray-500">Tier Hierarchy</p>
                </div>

                <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 600 400" className="w-full h-full">
                        <g transform="translate(300, 50)">
                            {/* Connections - Top Down */}
                            {/* You -> L1 Left */}
                            <FlowLine x1={0} y1={28} x2={-150} y2={122} color="#6366F1" />
                            {/* You -> L1 Right */}
                            <FlowLine x1={0} y1={28} x2={150} y2={122} color="#6366F1" />
                            
                            {/* L1 Left -> L2 Left */}
                             <FlowLine x1={-150} y1={178} x2={-220} y2={272} color="#14F195" />
                             <FlowLine x1={-150} y1={178} x2={-80} y2={272} color="#14F195" />

                            {/* L1 Right -> L3 */}
                            <FlowLine x1={150} y1={178} x2={150} y2={272} color="#9945FF" />

                            {/* NODES */}
                            {/* Root */}
                            <FlowNode x={0} y={0} isRoot icon={User} label="You" subLabel="Root" color="#FFFFFF" />

                            {/* Tier 1 Level */}
                            <FlowNode x={-150} y={150} label="Tier 1" subLabel="7% Comm" color="#6366F1" />
                            <FlowNode x={150} y={150} label="Tier 1" subLabel="7% Comm" color="#6366F1" />

                            {/* Tier 2 Level */}
                            <FlowNode x={-220} y={300} label="Tier 2" subLabel="5% Comm" color="#14F195" />
                            <FlowNode x={-80} y={300} label="Tier 2" subLabel="5% Comm" color="#14F195" />

                            {/* Tier 3 Level */}
                            <FlowNode x={150} y={300} label="Tier 3" subLabel="3% Comm" color="#9945FF" />
                        </g>
                    </svg>
                </div>
                
                <div className="absolute bottom-6 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md text-[10px] text-gray-400 font-mono">
                    VISUALIZATION ONLY
                </div>

            </motion.div>
        </div>

        {/* TRANSACTION HISTORY */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Latest Commissions</h3>
                 <div className="relative">
                     <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                     <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl bg-[#13151C] border border-white/5 text-sm text-white focus:outline-none focus:border-[#6366F1]" />
                 </div>
            </div>

            <div className="bg-[#13151C] rounded-[24px] border border-white/5 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-8">Time</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider pr-8">Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactionsData.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-8 font-mono text-xs text-gray-400">{tx.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {tx.user.substring(0, 2)}
                                            </div>
                                            <span className="font-medium text-white text-sm">{tx.user}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                                            tx.level === 1 ? "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" :
                                            tx.level === 2 ? "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20" :
                                            "bg-[#9945FF]/10 text-[#9945FF] border-[#9945FF]/20"
                                        }`}>
                                            Level {tx.level}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-white text-sm">${tx.amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit text-[10px] font-bold uppercase ${
                                            tx.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            {tx.status === "paid" ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-8 font-mono text-xs text-gray-500 truncate max-w-[120px] group-hover:text-[#6366F1] transition-colors cursor-pointer">{tx.hash}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-4">
                    {transactionsData.map((tx) => (
                        <div key={tx.id} className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20 flex items-center justify-center text-xs font-bold text-white uppercase border border-white/10">
                                        {tx.user.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{tx.user}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                                    tx.level === 1 ? "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" :
                                    tx.level === 2 ? "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20" :
                                    "bg-[#9945FF]/10 text-[#9945FF] border-[#9945FF]/20"
                                }`}>
                                    Level {tx.level}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Commission</p>
                                    <div className="text-xl font-bold text-white">${tx.amount.toFixed(2)}</div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit text-[10px] font-bold uppercase ml-auto ${
                                        tx.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    }`}>
                                        {tx.status === "paid" ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>

      </main>
    </div>
  );
}
