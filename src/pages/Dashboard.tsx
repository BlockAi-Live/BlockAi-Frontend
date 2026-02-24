"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendUp, TrendDown, Lightning, Wallet, Bell, CaretRight, 
  Sparkle, ChartLineUp, Clock, ShieldCheck, User, Plus, ArrowUpRight, Eye, EyeSlash
} from "@phosphor-icons/react";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { coingecko } from "@/lib/coingecko";
import { api } from "@/lib/api";
import SignalWatchlist from "@/components/dashboard/SignalWatchlist";
import { ConnectButton, darkTheme, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { client } from "../client";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
];

// --- TYPES ---

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface ChartPoint {
  v: number;
}

interface ActivityItem {
  id: string;
  action: string;
  cost: number;
  timestamp: string;
}

// --- COMPONENTS ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#13151C] border border-white/5 rounded-[32px] overflow-hidden ${className}`}>
        {children}
    </div>
);

const MiniChart = ({ data, color }: { data: ChartPoint[], color: string }) => (
    <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill="none" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// Format a number as currency
const fmt = (n: number) => {
  if (n >= 1) return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toPrecision(4)}`;
};

// Format relative time
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// Map activity action strings to display info
const activityMeta = (action: string) => {
  switch (action) {
    case "AI_MESSAGE": return { title: "AI Chat Query", icon: Sparkle, color: "#9945FF" };
    case "API_REQUEST": return { title: "API Request", icon: Lightning, color: "#14F195" };
    default: return { title: action, icon: Clock, color: "#3B82F6" };
  }
};

// --- DEMO MODE MOCK DATA ---
const DEMO_WATCHLIST: CoinData[] = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 97842.31, price_change_percentage_24h: 2.4, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3421.87, price_change_percentage_24h: -1.2, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { id: "solana", symbol: "sol", name: "Solana", current_price: 189.45, price_change_percentage_24h: 5.8, image: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { id: "chainlink", symbol: "link", name: "Chainlink", current_price: 18.92, price_change_percentage_24h: 3.1, image: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
];

const DEMO_CHARTS: Record<string, ChartPoint[]> = {
  bitcoin: [42,44,43,46,48,45,47,50,49,52,51,54,53,55,57,56,58,60,59,61].map(v => ({ v: v * 1000 })),
  ethereum: [30,32,31,33,35,34,32,33,35,36,34,35,37,36,38,39,37,38,40,39].map(v => ({ v: v * 100 })),
  solana: [15,16,15,17,18,17,19,20,19,21,22,21,23,22,24,25,24,26,25,27].map(v => ({ v: v * 10 })),
  chainlink: [14,15,14,16,15,17,16,18,17,19,18,19,20,19,18,19,20,19,18,19].map(v => ({ v })),
};

const DEMO_ACTIVITY: ActivityItem[] = [
  { id: "1", action: "AI_MESSAGE", cost: 1, timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "2", action: "WALLET_SCAN", cost: 2, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: "3", action: "CONTRACT_GEN", cost: 3, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", action: "TX_DECODE", cost: 1, timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "5", action: "AI_MESSAGE", cost: 1, timestamp: new Date(Date.now() - 28800000).toISOString() },
];

const DEMO_NEWS = [
  { title: "Ethereum Foundation Announces Major L2 Scaling Roadmap for 2026", url: "#", source: { title: "CoinDesk" }, createdAt: new Date().toISOString() },
  { title: "Bitcoin ETF Inflows Hit $2.1B Weekly Record as Institutions Pile In", url: "#", source: { title: "The Block" }, createdAt: new Date().toISOString() },
  { title: "Solana DeFi TVL Surpasses $15B Following Major Protocol Upgrades", url: "#", source: { title: "Decrypt" }, createdAt: new Date().toISOString() },
  { title: "ChainGPT Partners with Leading DEXs for AI-Powered Trading Intelligence", url: "#", source: { title: "CryptoSlate" }, createdAt: new Date().toISOString() },
];

export function DashboardPage() {
  const { user } = useAuth();
  const thirdwebAccount = useActiveAccount();
  
  // Wallet balance via ThirdWeb
  const { data: walletBalanceData } = useWalletBalance({
    chain: base,
    address: thirdwebAccount?.address,
    client,
  });

  // State
  const [watchlist, setWatchlist] = useState<CoinData[]>([]);
  const [charts, setCharts] = useState<Record<string, ChartPoint[]>>({});
  const [credits, setCredits] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [news, setNews] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(false);

  // Demo mode overrides
  const d_watchlist = demoMode ? DEMO_WATCHLIST : watchlist;
  const d_charts = demoMode ? DEMO_CHARTS : charts;
  const d_credits = demoMode ? 45 : credits;
  const d_activity = demoMode ? DEMO_ACTIVITY : activity;
  const d_news = demoMode ? DEMO_NEWS : news;
  const d_ethPrice = demoMode ? 3421.87 : ethPrice;
  const d_walletBalance = demoMode ? "12.4821" : (walletBalanceData ? parseFloat(walletBalanceData.displayValue).toFixed(4) : null);
  const d_walletConnected = demoMode ? true : !!thirdwebAccount?.address;

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Fetch all dashboard data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Watchlist — top coins from CoinGecko
        const markets = await coingecko.getMarkets("usd", 4, 1);
        if (markets?.length) {
          setWatchlist(markets);
          const eth = markets.find((c: CoinData) => c.id === "ethereum");
          if (eth) setEthPrice(eth.current_price);
        }

        // Mini charts — 7d sparklines
        if (markets?.length) {
          const chartData: Record<string, ChartPoint[]> = {};
          await Promise.all(
            markets.slice(0, 4).map(async (coin: CoinData) => {
              const points = await coingecko.getMarketChart(coin.id, "7");
              if (points?.length) {
                // Sample ~20 points for the sparkline
                const step = Math.max(1, Math.floor(points.length / 20));
                chartData[coin.id] = points
                  .filter((_: any, i: number) => i % step === 0)
                  .map((p: any) => ({ v: p.price }));
              }
            })
          );
          setCharts(chartData);
        }

        // AI Credits from billing
        try {
          const billing = await api.getBillingStats();
          setCredits(billing?.billing?.credits ?? 0);
        } catch { setCredits(0); }

        // Activity from backend
        try {
          const actData = await api.getActivity();
          setActivity(actData?.activity ?? []);
        } catch { setActivity([]); }

        // ChainGPT News
        try {
          const newsData = await api.getNews(4);
          setNews(newsData?.data ?? newsData ?? []);
        } catch (e) { console.error("News fetch failed:", e); }

      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derive notifications from activity
  const notifications = d_activity.slice(0, 3).map(a => {
    const meta = activityMeta(a.action);
    return {
      text: `${meta.title} — ${a.cost} credit${a.cost !== 1 ? "s" : ""} used`,
      time: timeAgo(a.timestamp),
      color: meta.color,
    };
  });

  // Wallet balance formatted
  const walletBalance = d_walletBalance;

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white font-sans overflow-x-hidden relative pb-24">
       {/* Background Ambience */}
       <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(20, 241, 149, 0.04) 0%, rgba(13, 15, 24, 0) 50%)"
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
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 items-center">
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
                <Link to="/chat" className="px-6 py-3 bg-[#14F195] text-black font-bold rounded-xl hover:bg-[#14F195]/90 transition-all shadow-[0_0_20px_rgba(20,241,149,0.3)] flex items-center gap-2">
                    <Sparkle weight="fill" /> New Chat
                </Link>
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  theme={darkTheme({ colors: { primaryButtonBg: "#13151C", primaryButtonText: "#fff" } })}
                  connectButton={{ label: "Connect Wallet", style: { borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", fontWeight: "bold", fontSize: "14px", padding: "12px 24px" } }}
                  connectModal={{ size: "compact", titleIcon: "https://blockai-frontend-v1.vercel.app/blockai.svg", showThirdwebBranding: false }}
                />
            </motion.div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance (Wallet) */}
            <GlassCard className="p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Wallet size={48} color="#14F195" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Wallet Balance</p>
                {d_walletConnected ? (
                  <>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {walletBalance ?? "0.0000"} <span className="text-lg text-gray-500">ETH</span>
                    </h3>
                    {d_ethPrice > 0 && (
                      <p className="text-sm text-gray-500 mb-2">≈ ${(parseFloat(walletBalance ?? "0") * d_ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                    )}
                    <div className="flex items-center gap-2 text-[#14F195] text-sm font-bold bg-[#14F195]/10 w-fit px-2 py-1 rounded-lg">
                        <ShieldCheck weight="bold" /> Connected
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-500 mb-2">Not connected</h3>
                    <p className="text-xs text-gray-600">Connect wallet to see balance</p>
                  </>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14F195] to-transparent opacity-80" />
            </GlassCard>

            {/* AI Credits */}
            <GlassCard className="p-6 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Lightning size={48} color="#9945FF" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Credits</p>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {d_credits !== null ? d_credits : <span className="text-gray-600">—</span>} <span className="text-lg text-[#9945FF]">credits</span>
                </h3>
                <Link to="/settings" className="flex items-center gap-2 text-gray-400 text-sm font-medium bg-white/5 w-fit px-2 py-1 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    Manage <CaretRight weight="bold" />
                </Link>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9945FF] to-transparent opacity-80" />
            </GlassCard>

            {/* Activity Count */}
             <GlassCard className="p-6 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <ChartLineUp size={48} color="#3B82F6" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Actions</p>
                <h3 className="text-3xl font-bold text-white mb-2">{d_activity.length}</h3>
                 <div className="flex items-center gap-2 text-gray-400 text-sm font-medium w-fit px-2 py-1 rounded-lg">
                   AI chats & API calls
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-80" />
            </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* MAIN CONTENT (2 Cols) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* AI NEWS FEED — Powered by ChainGPT */}
                <div className="rounded-[32px] bg-[#13151C] border border-white/5 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 pt-7 pb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                            <h3 className="text-lg font-bold text-white tracking-tight">AI News</h3>
                            <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase border border-neutral-800 rounded-full px-2 py-0.5">ChainGPT</span>
                        </div>
                        <Link to="/market" className="text-xs text-neutral-500 hover:text-[#14F195] transition-colors font-medium">
                            View all →
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="mx-8 mt-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                    {/* Articles */}
                    <div className="p-4">
                        {d_news.length === 0 && loading && (
                            <div className="space-y-1">
                              {[1,2,3].map(i => (
                                <div key={i} className="flex items-center gap-4 px-4 py-4 rounded-2xl">
                                    <div className="w-6 h-4 rounded bg-white/5 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-white/5 rounded-full w-3/4 animate-pulse" />
                                        <div className="h-2.5 bg-white/5 rounded-full w-1/3 animate-pulse" />
                                    </div>
                                </div>
                              ))}
                            </div>
                        )}
                        {d_news.length === 0 && !loading && (
                            <p className="text-neutral-600 text-sm text-center py-8">No news available.</p>
                        )}
                        {d_news.slice(0, 4).map((article: any, i: number) => (
                            <a
                                key={i}
                                href={article.url || article.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 px-4 py-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                            >
                                {/* Index number */}
                                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-500 to-neutral-700 tabular-nums shrink-0 pt-0.5 w-5 text-right">
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-semibold text-neutral-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {article.category && (
                                            <span className="text-[10px] text-[#14F195]/70 font-medium">
                                                {article.category?.name || article.category}
                                            </span>
                                        )}
                                        {article.category && article.createdAt && (
                                            <span className="text-neutral-700">·</span>
                                        )}
                                        {article.createdAt && (
                                            <span className="text-[10px] text-neutral-600">
                                                {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <ArrowUpRight size={14} className="text-neutral-700 group-hover:text-[#14F195] transition-colors shrink-0 mt-0.5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div>
                     <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                     <div className="space-y-4">
                        {activity.length === 0 && !loading && (
                          <div className="p-6 rounded-2xl bg-[#13151C] border border-white/5 text-center">
                            <p className="text-gray-500 text-sm">No activity yet. Start a chat to see your history here.</p>
                          </div>
                        )}
                        {activity.slice(0, 5).map((item, i) => {
                            const meta = activityMeta(item.action);
                            return (
                              <motion.div 
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  key={item.id} 
                                  className="p-4 rounded-2xl bg-[#13151C] border border-white/5 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                              >
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                                          <meta.icon size={20} weight="fill" />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-white text-sm group-hover:text-[#14F195] transition-colors">{meta.title}</h4>
                                          <p className="text-xs text-gray-500">{timeAgo(item.timestamp)} · {item.cost} credit{item.cost !== 1 ? "s" : ""}</p>
                                      </div>
                                  </div>
                                  <CaretRight className="text-gray-600 group-hover:text-white transition-colors" />
                              </motion.div>
                            );
                        })}
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
                        {loading && d_watchlist.length === 0 && (
                          <div className="space-y-4">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/5" />
                                  <div>
                                    <div className="w-10 h-3 bg-white/5 rounded mb-1" />
                                    <div className="w-16 h-2 bg-white/5 rounded" />
                                  </div>
                                </div>
                                <div className="w-16 h-3 bg-white/5 rounded" />
                              </div>
                            ))}
                          </div>
                        )}
                        {d_watchlist.map(coin => (
                             <div key={coin.symbol} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{coin.symbol.toUpperCase()}</h4>
                                        <p className="text-xs text-gray-500">{coin.name}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    {d_charts[coin.id] && (
                                      <MiniChart 
                                        data={d_charts[coin.id]} 
                                        color={coin.price_change_percentage_24h >= 0 ? "#14F195" : "#EF4444"} 
                                      />
                                    )}
                                    <div className="text-right">
                                        <h4 className="font-bold text-white text-sm">{fmt(coin.current_price)}</h4>
                                        <p className={`text-xs font-bold ${coin.price_change_percentage_24h >= 0 ? "text-[#14F195]" : "text-red-500"}`}>
                                          {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(1)}%
                                        </p>
                                    </div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </GlassCard>

                {/* AI SIGNALS */}
                <SignalWatchlist />

                {/* NOTIFICATIONS */}
                <GlassCard className="p-6 bg-gradient-to-br from-[#13151C] to-[#040404]">
                     <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]"><Bell weight="fill" /></div>
                         <h3 className="font-bold text-white">Notifications</h3>
                     </div>
                     <div className="space-y-4">
                        {notifications.length === 0 && (
                          <p className="text-sm text-gray-600">No notifications yet.</p>
                        )}
                        {notifications.map((n, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: n.color }} />
                            <div>
                              <p className="text-sm text-gray-300">{n.text}</p>
                              <span className="text-xs text-gray-600">{n.time}</span>
                            </div>
                          </div>
                        ))}
                     </div>
                </GlassCard>

            </div>
        
        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
