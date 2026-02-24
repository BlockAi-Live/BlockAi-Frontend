"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Copy, 
  CreditCard,
  QrCode,
  ClockCounterClockwise,
  TrendUp,
  ShieldCheck,
  Check,
  Eye,
  EyeSlash
} from "@phosphor-icons/react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { ConnectButton, darkTheme, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { client } from "../client";
import { coingecko } from "@/lib/coingecko";

// Wallets for ThirdWeb
const thirdwebWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

// --- Whale Watch Mock Data (keeping as mock per request) ---

const whaleWallets = [
  {
    label: "Smart Money #1",
    short: "W1",
    address: "0x7a...9b2",
    value: "$1.24M",
    change: "+240%",
    changeUp: true,
    winRate: "68%",
    latestAction: { text: "Swapped", amount: "50 ETH", target: "PEPE", time: "2m ago", color: "#14F195" },
    gradient: "from-[#9945FF] to-blue-600",
    accent: "#9945FF",
  },
  {
    label: "Vitalik.eth",
    short: "W2",
    address: "0xd8...004",
    value: "$4.50M",
    change: "-2.4%",
    changeUp: false,
    topHold: "ETH",
    latestAction: { text: "Bridged", amount: "100 ETH", target: "Base", time: "1d ago", color: "#3B82F6" },
    gradient: "from-blue-500 to-cyan-500",
    accent: "#3B82F6",
  },
];

const mockTransactions = [
  { id: 1, type: "Receive", asset: "ETH", amount: "1.5", value: "$3,200", from: "0x88...9a", time: "2h ago" },
  { id: 2, type: "Send", asset: "USDT", amount: "500", value: "$500", to: "Binance", time: "5h ago" },
  { id: 3, type: "Swap", asset: "SOL", amount: "200", value: "$18,400", from: "USDC", time: "1d ago" },
];

// --- Helpers ---

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function WalletsPage() {
  const [activeAsset, setActiveAsset] = useState<any>(null);
  const [ethPrice, setEthPrice] = useState(0);
  const [copied, setCopied] = useState(false);
  const [chartData, setChartData] = useState<{ v: number }[]>([]);
  
  const thirdwebAccount = useActiveAccount();
  const { data: walletBalanceData } = useWalletBalance({
    chain: base,
    address: thirdwebAccount?.address,
    client,
  });

  const walletBalance = walletBalanceData ? parseFloat(walletBalanceData.displayValue) : 0;
  const walletBalanceUsd = walletBalance * ethPrice;
  const [demoMode, setDemoMode] = useState(false);

  // Demo mode overrides
  const d_connected = demoMode ? true : !!thirdwebAccount?.address;
  const d_walletBalance = demoMode ? 12.4821 : walletBalance;
  const d_ethPrice = demoMode ? 3421.87 : ethPrice;
  const d_walletBalanceUsd = demoMode ? 12.4821 * 3421.87 : walletBalanceUsd;
  const d_address = demoMode ? "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" : thirdwebAccount?.address || "";

  // Allocation — when wallet connected or demo, show data
  const allocationData = d_connected
    ? (demoMode
      ? [
          { name: "BTC", value: 45, color: "#F7931A" },
          { name: "ETH", value: 30, color: "#627EEA" },
          { name: "SOL", value: 15, color: "#14F195" },
          { name: "USDT", value: 10, color: "#26A17B" },
        ]
      : [{ name: "ETH", value: 100, color: "#627EEA" }])
    : [
        { name: "BTC", value: 45, color: "#F7931A" },
        { name: "ETH", value: 30, color: "#627EEA" },
        { name: "SOL", value: 15, color: "#14F195" },
        { name: "USDT", value: 10, color: "#26A17B" },
      ];

  // Portfolio history chart (7d ETH chart if connected, mock otherwise)
  const portfolioHistory = chartData.length > 0
    ? chartData
    : [40, 45, 42, 48, 44, 52, 50, 55, 53, 60, 58, 62].map(v => ({ v }));

  useEffect(() => {
    const load = async () => {
      try {
        const markets = await coingecko.getMarkets("usd", 4, 1);
        const eth = markets?.find((c: any) => c.id === "ethereum");
        if (eth) setEthPrice(eth.current_price);

        // Get 7d ETH chart for the sparkline
        const points = await coingecko.getMarketChart("ethereum", "7");
        if (points?.length) {
          const step = Math.max(1, Math.floor(points.length / 30));
          setChartData(
            points.filter((_: any, i: number) => i % step === 0).map((p: any) => ({ v: p.price }))
          );
        }
      } catch (err) {
        console.error("Failed to load market data:", err);
      }
    };
    load();
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalNetWorth = d_connected ? d_walletBalanceUsd : 0;

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
           
           <div className="flex gap-3 items-center">
             {/* Demo Mode Toggle */}
             <button
               onClick={() => setDemoMode(!demoMode)}
               className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                 demoMode
                   ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
                   : "bg-[#13151C] border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
               }`}
             >
               {demoMode ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} />}
               {demoMode ? "Demo On" : "Demo"}
             </button>
             <ConnectButton
             client={client}
             wallets={thirdwebWallets}
             theme={darkTheme({ colors: { primaryButtonBg: "#14F195", primaryButtonText: "#000" } })}
             connectButton={{ 
               label: "Connect Wallet", 
               style: { 
                 borderRadius: "20px", 
                 fontWeight: "bold", 
                 fontSize: "14px", 
                 padding: "12px 24px",
                 boxShadow: "0 0 20px rgba(20,241,149,0.2)"
               } 
             }}
             connectModal={{ size: "compact", titleIcon: "https://blockai-frontend-v1.vercel.app/blockai.svg", showThirdwebBranding: false }}
            />
           </div>
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
                   
                   {d_connected ? (
                      <>
                        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-1">
                          {d_walletBalance.toFixed(4)} <span className="text-2xl text-gray-500">ETH</span>
                        </h2>
                        {d_ethPrice > 0 && (
                          <p className="text-xl text-gray-500 mb-4">≈ {fmt(d_walletBalanceUsd)}</p>
                       )}
                       <div className="flex items-center gap-3">
                           <div className="px-3 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/20 flex items-center gap-1.5">
                               <ShieldCheck size={14} className="text-[#14F195]" weight="bold" />
                               <span className="text-[#14F195] font-bold text-xs">Connected on Base</span>
                           </div>
                            <span className="text-gray-600 text-xs font-mono">
                              {d_address.slice(0, 6)}...{d_address.slice(-4)}
                            </span>
                       </div>
                     </>
                   ) : (
                     <>
                       <h2 className="text-5xl md:text-6xl font-bold text-gray-600 tracking-tight mb-4">—</h2>
                       <p className="text-gray-500 text-sm">Connect your wallet to see your balance</p>
                     </>
                   )}
               </div>

                {/* --- Chart Area --- */}
                <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={portfolioHistory}>
                             <defs>
                                <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14F195" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#14F195" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke="#14F195" fill="url(#colorMain)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
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
                </div>

                <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={allocationData.length > 1 ? 6 : 0}
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

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                            {activeAsset ? activeAsset.name : allocationData[0]?.name}
                        </span>
                        <h4 className="text-3xl font-bold text-white transition-all">
                            {activeAsset ? `${activeAsset.value}%` : `${allocationData[0]?.value}%`}
                        </h4>
                        <span className="text-xs text-gray-500" style={{ color: activeAsset?.color || allocationData[0]?.color }}>
                             Allocation
                        </span>
                    </div>
                </div>

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

        {/* --- CONNECTED WALLET --- */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Connected Wallets</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thirdwebAccount?.address ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group p-6 rounded-[24px] bg-[#16181f] border border-white/5 hover:border-[#14F195]/30 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5">
                                <Wallet size={24} className="text-[#14F195] group-hover:text-white transition-colors" />
                            </div>
                            <div className="px-2 py-1 rounded-lg bg-[#14F195]/10 border border-[#14F195]/20">
                                <span className="text-xs font-bold text-[#14F195]">Base</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-500 text-sm mb-1">Main Wallet</p>
                            <h4 className="text-2xl font-bold text-white">{walletBalance.toFixed(4)} ETH</h4>
                            {ethPrice > 0 && (
                              <p className="text-sm text-gray-500 mt-1">≈ {fmt(walletBalanceUsd)}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <button 
                              onClick={() => handleCopy(thirdwebAccount.address)}
                              className="flex items-center gap-2 text-gray-500 text-xs font-mono bg-black/20 px-2 py-1 rounded cursor-pointer hover:text-white transition-colors"
                            >
                                {thirdwebAccount.address.slice(0, 6)}...{thirdwebAccount.address.slice(-4)} 
                                {copied ? <Check size={14} className="text-[#14F195]" /> : <Copy size={14} />}
                            </button>
                            <div className="flex items-center gap-1 text-[#14F195]">
                              <ShieldCheck size={14} weight="bold" />
                              <span className="text-xs font-bold">Active</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-[24px] bg-[#13151C] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 min-h-[200px]"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Wallet size={28} className="text-gray-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm font-medium mb-1">No wallet connected</p>
                          <p className="text-gray-600 text-xs">Use the button above to connect</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>

        {/* --- WHALE WATCH (TRACKED WALLETS) --- Mock, keeping as-is --- */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">Whale Watch</h3>
                    <span className="px-2 py-0.5 rounded-lg bg-[#9945FF]/10 text-[#9945FF] text-[10px] font-bold uppercase tracking-wide border border-[#9945FF]/20">Beta</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Add New Tracker Card */}
                <div className="p-6 rounded-[24px] bg-[#13151C] border border-white/5 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#14F195]/10 flex items-center justify-center text-[#14F195]">
                            <QrCode size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Track Wallet</h4>
                            <p className="text-gray-500 text-xs">Monitor any address</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Enter Wallet Address (0x...)" 
                            className="w-full bg-[#0d0f18] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#14F195] transition-colors"
                        />
                         <input 
                            type="text" 
                            placeholder="Label (e.g. Whale 1)" 
                            className="w-full bg-[#0d0f18] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#14F195] transition-colors"
                        />
                        <button className="w-full py-3 rounded-xl bg-[#14F195] text-black font-bold text-sm hover:opacity-90 transition-opacity">
                            Start Tracking
                        </button>
                    </div>
                </div>

                {/* Tracked Whale Wallets */}
                {whaleWallets.map((whale, i) => (
                  <div key={i} className="group p-6 rounded-[24px] bg-[#16181f] border border-white/5 hover:border-opacity-30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between" style={{ ['--hover-color' as any]: whale.accent }}>
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} style={{ color: whale.accent }} />
                    </div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                             <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${whale.gradient} flex items-center justify-center text-sm font-bold text-white border border-white/10 shadow-lg`}>
                                {whale.short}
                             </div>
                             <div>
                                 <h4 className="font-bold text-white text-base">{whale.label}</h4>
                                 <div className="flex items-center gap-2 mt-0.5">
                                     <span className="text-gray-500 text-xs font-mono bg-black/30 px-1.5 py-0.5 rounded">{whale.address}</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="space-y-4 relative z-10 mb-6">
                        <div>
                             <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Total Value</p>
                             <h3 className="text-3xl font-bold text-white tracking-tight">{whale.value}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">24h Change</p>
                                 <div className={`flex items-center gap-1 ${whale.changeUp ? "text-[#14F195]" : "text-red-400"} font-bold text-sm`}>
                                    {whale.changeUp ? <ArrowUpRight weight="bold" /> : <ArrowDownRight weight="bold" />} {whale.change}
                                </div>
                             </div>
                             <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{whale.winRate ? "Win Rate" : "Top Hold"}</p>
                                 <div className="flex items-center gap-1 text-white font-bold text-sm">
                                    {whale.winRate ? (
                                      <><TrendUp weight="bold" className="text-[#9945FF]" /> {whale.winRate}</>
                                    ) : (
                                      <><div className="w-3 h-3 rounded-full bg-[#627EEA]" /> {whale.topHold}</>
                                    )}
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Latest Activity Footer */}
                    <div className="mt-auto pt-4 border-t border-white/5 relative z-10">
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Latest Activity</p>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                             <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: whale.latestAction.color }} />
                             {whale.latestAction.text} <span className="text-white font-bold">{whale.latestAction.amount}</span> for <span className="font-bold" style={{ color: whale.latestAction.color }}>{whale.latestAction.target}</span>
                             <span className="text-gray-600 ml-auto font-mono">{whale.latestAction.time}</span>
                        </div>
                    </div>
                  </div>
                ))}

            </div>
        </div>

        {/* --- RECENT ACTIVITY (Mock) --- */}
        <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ClockCounterClockwise size={20} className="text-gray-400" />
                Recent Activity
            </h3>
            
            <div className="bg-[#13151C] rounded-[32px] border border-white/5 p-2">
                {mockTransactions.map((tx) => (
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
