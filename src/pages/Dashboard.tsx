"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendUp, TrendDown, Lightning, Wallet, Bell, CaretRight, 
  Sparkle, ChartLineUp, Clock, ShieldCheck, User, Plus
} from "@phosphor-icons/react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

// --- MOCK DATA ---

const portfolioData = [
  { data: [30, 45, 35, 55, 45, 60, 50, 70, 65, 80] },
];

const watchlist = [
  { symbol: "BTC", name: "Bitcoin", price: "$43,250.00", change: "+2.5%", isUp: true },
  { symbol: "ETH", name: "Ethereum", price: "$2,250.00", change: "+1.8%", isUp: true },
  { symbol: "SOL", name: "Solana", price: "$98.50", change: "-0.5%", isUp: false },
  { symbol: "AI", name: "BlocKAi", price: "$0.45", change: "+12.4%", isUp: true },
];

const activity = [
    { type: "analyzed", title: "Analyzed ETH Wallet", time: "2 mins ago", icon: Sparkle, color: "#9945FF" },
    { type: "deposit", title: "Deposited 500 USDT", time: "2 hours ago", icon: Wallet, color: "#14F195" },
    { type: "security", title: "2FA Enabled", time: "Yesterday", icon: ShieldCheck, color: "#3B82F6" },
];

// --- COMPONENTS ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#13151C] border border-white/5 rounded-[32px] overflow-hidden ${className}`}>
        {children}
    </div>
);

const MiniChart = ({ color }: { color: string }) => (
    <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioData[0].data.map(v => ({ v }))}>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill="none" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export function DashboardPage() {
  const { user } = useAuth();
  
  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white font-sans overflow-x-hidden relative pb-24">
       {/* Background Ambience */}
       <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.03) 0%, rgba(13, 15, 24, 0) 50%)"
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 md:pt-10 space-y-8">
        
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                    System Operational
                </motion.div>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl md:text-5xl font-bold text-white">
                    {greeting}, <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">{user?.fullName?.split(' ')[0] || "Trader"}</span>
                </motion.h1>
            </div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3">
                <Link to="/chat" className="px-6 py-3 bg-[#14F195] text-black font-bold rounded-xl hover:bg-[#14F195]/90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.3)] flex items-center gap-2">
                    <Sparkle weight="fill" /> New Chat
                </Link>
                <button className="px-6 py-3 bg-[#13151C] border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2">
                    <Plus weight="bold" /> Deposit
                </button>
            </motion.div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance */}
            <GlassCard className="p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Wallet size={48} color="#14F195" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</p>
                <h3 className="text-3xl font-bold text-white mb-2">$24,562.00</h3>
                <div className="flex items-center gap-2 text-[#14F195] text-sm font-bold bg-[#14F195]/10 w-fit px-2 py-1 rounded-lg">
                    <TrendUp weight="bold" /> +5.4% <span className="text-gray-400 font-normal">vs last week</span>
                </div>
                {/* Permanent Glow Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14F195] to-transparent opacity-80" />
            </GlassCard>

            {/* AI Credits */}
            <GlassCard className="p-6 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Lightning size={48} color="#9945FF" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Credits</p>
                <h3 className="text-3xl font-bold text-white mb-2">1,250 <span className="text-lg text-[#9945FF]">XTK</span></h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium bg-white/5 w-fit px-2 py-1 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    Get More <CaretRight weight="bold" />
                </div>
                {/* Permanent Glow Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9945FF] to-transparent opacity-80" />
            </GlassCard>

            {/* Profit/Loss */}
             <GlassCard className="p-6 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <ChartLineUp size={48} color="#3B82F6" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">24h Profit</p>
                <h3 className="text-3xl font-bold text-white mb-2">+$1,240.50</h3>
                 <div className="flex items-center gap-2 text-gray-400 text-sm font-medium w-fit px-2 py-1 rounded-lg">
                   Daily PnL
                </div>
                {/* Permanent Glow Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-80" />
            </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* MAIN CONTENT (2 Cols) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* AI DAILY BRIEF */}
                <div className="relative p-1 rounded-[32px] bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20">
                    <div className="bg-[#0d0f18] rounded-[30px] p-8 h-full relative overflow-hidden">
                        {/* Background mesh */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9945FF]/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14F195] to-[#9945FF] p-[2px]">
                                 <div className="w-full h-full bg-[#0d0f18] rounded-[14px] flex items-center justify-center">
                                     <Sparkle weight="fill" className="text-white" size={24} />
                                 </div>
                             </div>
                             <div>
                                 <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-white">Market Intelligence</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] text-[10px] font-bold uppercase tracking-wider border border-[#14F195]/20">Live</span>
                                 </div>
                                 <p className="text-xs text-gray-400">AI analysis of your portfolio & trends</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Market Sentiment</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-[#14F195]">Bullish</span>
                                        <span className="text-sm text-gray-500">Confidence: 87%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#14F195] w-[87%]" />
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    "Bitcoin's break above <span className="text-white font-bold">$43k</span> signals strong momentum. Your <span className="text-[#9945FF] font-bold">SOL</span> position is outperforming the market."
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center gap-3">
                                <div className="flex items-start gap-3">
                                    <Lightning className="text-[#9945FF] mt-1 shrink-0" size={20} weight="fill" />
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Opportunity Detected</h4>
                                        <p className="text-xs text-gray-400 mt-1">AI tokens are seeing increased volume. Check analysis.</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-[#9945FF]/10 text-[#9945FF] text-xs font-bold rounded-lg hover:bg-[#9945FF]/20 transition-colors border border-[#9945FF]/20">
                                    View Detailed Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div>
                     <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                     <div className="space-y-4">
                        {activity.map((item, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="p-4 rounded-2xl bg-[#13151C] border border-white/5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                        <item.icon size={20} weight="fill" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm group-hover:text-[#14F195] transition-colors">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                    </div>
                                </div>
                                <CaretRight className="text-gray-600 group-hover:text-white transition-colors" />
                            </motion.div>
                        ))}
                     </div>
                </div>

            </div>

            {/* SIDE PANEL (Right) */}
            <div className="space-y-8">
                
                {/* WATCHLIST */}
                <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white">Watchlist</h3>
                        <Link to="/market" className="text-xs font-bold text-[#14F195] hover:underline">View All</Link>
                    </div>
                    <div className="space-y-6">
                        {watchlist.map(coin => (
                             <div key={coin.symbol} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     {/* Mock Icon */}
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">{coin.symbol[0]}</div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{coin.symbol}</h4>
                                        <p className="text-xs text-gray-500">{coin.name}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                     <h4 className="font-bold text-white text-sm">{coin.price}</h4>
                                     <p className={`text-xs font-bold ${coin.isUp ? "text-[#14F195]" : "text-red-500"}`}>{coin.change}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        <Plus weight="bold" /> Add Asset
                    </button>
                </GlassCard>

                {/* NOTIFICATIONS / TEASER */}
                <GlassCard className="p-6 bg-gradient-to-br from-[#13151C] to-[#040404]">
                     <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]"><Bell weight="fill" /></div>
                         <h3 className="font-bold text-white">Notifications</h3>
                     </div>
                     <div className="space-y-4">
                         <div className="flex gap-3 items-start">
                             <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                             <div>
                                 <p className="text-sm text-gray-300">Market Alert: BTC crossed $44k.</p>
                                 <span className="text-xs text-gray-600">10 mins ago</span>
                             </div>
                         </div>
                         <div className="flex gap-3 items-start">
                              <div className="w-2 h-2 rounded-full bg-[#14F195] mt-2 flex-shrink-0" />
                             <div>
                                 <p className="text-sm text-gray-300">Referral reward received: $45.00</p>
                                 <span className="text-xs text-gray-600">2 hours ago</span>
                             </div>
                         </div>
                     </div>
                </GlassCard>

            </div>
        
        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
