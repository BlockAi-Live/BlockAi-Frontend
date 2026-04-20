"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Crown, Medal, Lightning, User, Fire,
  PaintBrush, Megaphone, ArrowUp, ArrowDown,
  Star, Heart, Image as ImageIcon, Eye, EyeSlash,
  UsersThree, CurrencyEth, Target
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

// ─── TYPES ───────────────────────────────────────────────
interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  change: number;
  streak?: number;
  id?: string;
}

interface Campaign {
  rank: number;
  name: string;
  creator: string;
  participants: number;
  totalPoints: number;
  status: "active" | "ended" | "upcoming";
  category: string;
  prize: string;
  progress: number;
}

interface Creator {
  rank: number;
  name: string;
  avatar: string;
  nftsCreated: number;
  totalLikes: number;
  earnings: number;
  verified: boolean;
}

type TabKey = "users" | "campaigns" | "creators";

// ─── MOCK DATA ───────────────────────────────────────────
const MOCK_USERS: LeaderboardUser[] = [
  { rank: 1, name: "CryptoWhale.eth", avatar: "CW", points: 12850, change: 0, streak: 42 },
  { rank: 2, name: "DeFiKing", avatar: "DK", points: 10340, change: 2, streak: 28 },
  { rank: 3, name: "AlphaHunter", avatar: "AH", points: 9720, change: -1, streak: 35 },
  { rank: 4, name: "BlockBuilder", avatar: "BB", points: 8900, change: 1 },
  { rank: 5, name: "SolanaSurfer", avatar: "SS", points: 7650, change: -2 },
  { rank: 6, name: "NFTNinja", avatar: "NN", points: 6880, change: 3 },
  { rank: 7, name: "GasOptimizer", avatar: "GO", points: 6210, change: 0 },
  { rank: 8, name: "YieldFarmer", avatar: "YF", points: 5990, change: 1 },
  { rank: 9, name: "ChainAnalyst", avatar: "CA", points: 5540, change: -1 },
  { rank: 10, name: "SmartDev", avatar: "SD", points: 5100, change: 4 },
  { rank: 11, name: "TokenTrader", avatar: "TT", points: 4800, change: -3 },
  { rank: 12, name: "Web3Wizard", avatar: "WW", points: 4350, change: 0 },
  { rank: 13, name: "DegenTrader", avatar: "DT", points: 3920, change: 2 },
  { rank: 14, name: "SolidityNerd", avatar: "SN", points: 3670, change: -1 },
  { rank: 15, name: "BaseBuilder", avatar: "BB", points: 3410, change: 5 },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { rank: 1, name: "DeFi Sprint Challenge", creator: "BlockAI", participants: 2340, totalPoints: 185000, status: "active", category: "Trading", prize: "5,000 USDC", progress: 72 },
  { rank: 2, name: "Smart Contract Audit Race", creator: "ChainGPT", participants: 1890, totalPoints: 142000, status: "active", category: "Development", prize: "3,000 USDC", progress: 58 },
  { rank: 3, name: "NFT Creation Blitz", creator: "ArtDAO", participants: 1560, totalPoints: 98000, status: "active", category: "Creative", prize: "2 ETH", progress: 85 },
  { rank: 4, name: "Whale Tracker Week", creator: "BlockAI", participants: 1230, totalPoints: 87000, status: "ended", category: "Analytics", prize: "1,500 USDC", progress: 100 },
  { rank: 5, name: "Gas Wars Tournament", creator: "EthDevs", participants: 980, totalPoints: 72000, status: "ended", category: "Trading", prize: "1 ETH", progress: 100 },
  { rank: 6, name: "L2 Explorer Quest", creator: "Base", participants: 0, totalPoints: 0, status: "upcoming", category: "Education", prize: "2,500 USDC", progress: 0 },
  { rank: 7, name: "Solidity Speedrun", creator: "BlockAI", participants: 0, totalPoints: 0, status: "upcoming", category: "Development", prize: "3 ETH", progress: 0 },
  { rank: 8, name: "Alpha Signals Hunt", creator: "SignalDAO", participants: 650, totalPoints: 48000, status: "active", category: "Trading", prize: "1,000 USDC", progress: 41 },
];

const MOCK_CREATORS: Creator[] = [
  { rank: 1, name: "PixelMaster.eth", avatar: "PM", nftsCreated: 342, totalLikes: 28500, earnings: 12.4, verified: true },
  { rank: 2, name: "ArtisanDAO", avatar: "AD", nftsCreated: 287, totalLikes: 22100, earnings: 9.8, verified: true },
  { rank: 3, name: "CyberArtist", avatar: "CA", nftsCreated: 256, totalLikes: 19800, earnings: 8.2, verified: true },
  { rank: 4, name: "GenArtLab", avatar: "GL", nftsCreated: 198, totalLikes: 15400, earnings: 6.5, verified: false },
  { rank: 5, name: "NFTForge", avatar: "NF", nftsCreated: 176, totalLikes: 12900, earnings: 5.1, verified: true },
  { rank: 6, name: "DigitalDreams", avatar: "DD", nftsCreated: 154, totalLikes: 11200, earnings: 4.3, verified: false },
  { rank: 7, name: "ChainCanvas", avatar: "CC", nftsCreated: 132, totalLikes: 9800, earnings: 3.7, verified: true },
  { rank: 8, name: "TokenArtist", avatar: "TA", nftsCreated: 118, totalLikes: 8500, earnings: 2.9, verified: false },
  { rank: 9, name: "MetaCreator", avatar: "MC", nftsCreated: 95, totalLikes: 7200, earnings: 2.1, verified: true },
  { rank: 10, name: "BlockPainter", avatar: "BP", nftsCreated: 82, totalLikes: 6100, earnings: 1.8, verified: false },
];

// ─── STATUS/CATEGORY CONFIG ──────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active:   { bg: "bg-[#14F195]/[0.08]", text: "text-[#14F195]", dot: "bg-[#14F195]" },
  ended:    { bg: "bg-neutral-500/[0.08]", text: "text-neutral-400", dot: "bg-neutral-500" },
  upcoming: { bg: "bg-[#9945FF]/[0.08]", text: "text-[#9945FF]", dot: "bg-[#9945FF]" },
};

const categoryColors: Record<string, string> = {
  Trading: "#14F195", Development: "#9945FF", Creative: "#F59E0B",
  Analytics: "#3B82F6", Education: "#EC4899",
};

// ─── TAB CONFIG ──────────────────────────────────────────
const tabs: { key: TabKey; label: string; icon: typeof Trophy; color: string }[] = [
  { key: "users",     label: "Users",     icon: User,       color: "#14F195" },
  { key: "campaigns", label: "Campaigns", icon: Megaphone,  color: "#9945FF" },
  { key: "creators",  label: "Creators",  icon: PaintBrush, color: "#F59E0B" },
];

// ─── RANK COLORS ─────────────────────────────────────────
const rankColors = ["#FFD700", "#A8B4C0", "#CD7F32"];

// ─── MAIN COMPONENT ──────────────────────────────────────
export function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);

  // Fetch real leaderboard data
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/api/v1/leaderboard?period=${timeFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
        // campaigns and creators don't have backend yet, keep mock
        setCampaigns(MOCK_CAMPAIGNS);
        setCreators(MOCK_CREATORS);
      }
    } catch (e) {
      console.error("Leaderboard fetch failed, falling back to mock:", e);
      setUsers(MOCK_USERS);
      setCampaigns(MOCK_CAMPAIGNS);
      setCreators(MOCK_CREATORS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (demoMode) {
      setUsers(MOCK_USERS);
      setCampaigns(MOCK_CAMPAIGNS);
      setCreators(MOCK_CREATORS);
    } else {
      fetchLeaderboard();
    }
  }, [demoMode, timeFilter]);

  const currentUserRank = user ? {
    rank: demoMode ? 47 : (users.findIndex(u => u.id === user.id) + 1) || users.length + 1,
    name: user.fullName || "You",
    avatar: user.fullName?.substring(0, 2).toUpperCase() || "ME",
    points: user.points || 0,
    change: 5,
  } : null;

  const totalParticipants = users.length;
  const totalPointsPool = users.reduce((acc, u) => acc + u.points, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;

  return (
    <div className="min-h-screen bg-[#0a0c14] px-4 sm:px-8 py-8 max-w-7xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
              <Trophy size={22} weight="fill" className="text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Leaderboard</h1>
              <p className="text-sm text-neutral-500">Top performers across the BlockAI ecosystem</p>
            </div>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border
              ${demoMode
                ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/15"
                : "bg-[#14F195]/10 border-[#14F195]/30 text-[#14F195] hover:bg-[#14F195]/15"
              }
            `}
          >
            {demoMode ? <Eye size={14} weight="bold" /> : <EyeSlash size={14} weight="bold" />}
            {demoMode ? "Mock Data" : "Live Data"}
          </button>
        </div>
      </motion.div>

      {/* ── STATS ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Players", value: totalParticipants.toLocaleString(), icon: UsersThree, color: "#14F195" },
          { label: "Points Pool", value: totalPointsPool.toLocaleString(), icon: Lightning, color: "#F59E0B" },
          { label: "Active Campaigns", value: activeCampaigns.toString(), icon: Target, color: "#9945FF" },
          { label: "Your Rank", value: currentUserRank ? `#${currentUserRank.rank}` : "—", icon: Trophy, color: "#FFD700" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-[#111318] border border-white/[0.04]">
            <stat.icon size={15} weight="fill" className="mb-2 opacity-50" style={{ color: stat.color }} />
            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* ── YOUR RANK ── */}
      {currentUserRank && activeTab === "users" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 p-4 rounded-xl bg-[#111318] border border-[#14F195]/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center">
                <span className="text-xs font-bold text-[#14F195]">{currentUserRank.avatar}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-[#14F195] font-bold uppercase tracking-wider">Your Position</span>
                  {currentUserRank.change > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#14F195] font-bold">
                      <ArrowUp size={9} weight="bold" />+{currentUserRank.change}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white font-mono">#{currentUserRank.rank}</span>
                  <span className="text-sm text-neutral-500">{currentUserRank.name}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider mb-0.5">Points</p>
              <p className="text-xl font-bold text-white font-mono">{currentUserRank.points.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB BAR + TIME FILTER ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111318] border border-white/[0.04]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === tab.key ? "text-white bg-white/[0.05]" : "text-neutral-600 hover:text-neutral-400"}
              `}
            >
              <tab.icon size={15} weight={activeTab === tab.key ? "fill" : "regular"} style={{ color: activeTab === tab.key ? tab.color : undefined }} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111318] border border-white/[0.04]">
          {(["weekly", "monthly", "alltime"] as const).map((t) => (
            <button key={t} onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                timeFilter === t ? "bg-white/[0.06] text-white" : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {t === "alltime" ? "All Time" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#14F195]/30 border-t-[#14F195] rounded-full animate-spin" />
        </div>
      )}

      {/* ── CONTENT ── */}
      {!loading && (
        <AnimatePresence mode="wait">

          {/* ═══ USERS ═══ */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>

              {/* Top 3 — podium with height hierarchy */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {[1, 0, 2].map((idx, displayIdx) => {
                  const u = users[idx];
                  if (!u) return null;
                  const color = rankColors[idx];
                  const isFirst = idx === 0;
                  // Different sizes for podium effect
                  const paddings = ["px-5 pt-5 pb-6", "px-6 pt-6 pb-8", "px-5 pt-5 pb-6"];
                  const avatarSizes = ["w-12 h-12", "w-16 h-16", "w-12 h-12"];
                  const avatarText = ["text-sm", "text-lg", "text-sm"];
                  const pointsText = ["text-base", "text-xl", "text-base"];
                  const crownSize = isFirst ? 26 : 18;
                  return (
                    <motion.div
                      key={u.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: displayIdx * 0.08 }}
                      className={`
                        flex-1 max-w-[240px] rounded-xl bg-[#111318] border border-white/[0.04] text-center relative overflow-hidden
                        ${paddings[displayIdx]}
                      `}
                    >
                      {/* Colored top accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: color }} />

                      {/* Rank label */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold font-mono" style={{ color }}>#{u.rank}</span>
                      </div>

                      {/* Medal/Crown */}
                      <div className="mb-3">
                        {isFirst
                          ? <Crown size={crownSize} weight="fill" style={{ color }} className="mx-auto" />
                          : <Medal size={crownSize} weight="fill" style={{ color }} className="mx-auto" />
                        }
                      </div>

                      {/* Avatar */}
                      <div
                        className={`${avatarSizes[displayIdx]} rounded-lg mx-auto mb-3 flex items-center justify-center`}
                        style={{ background: `${color}10`, border: `1.5px solid ${color}20` }}
                      >
                        <span className={`${avatarText[displayIdx]} font-bold text-white`}>{u.avatar}</span>
                      </div>

                      {/* Name */}
                      <h3 className={`font-semibold text-white truncate mb-1 ${isFirst ? "text-base" : "text-sm"}`}>{u.name}</h3>

                      {/* Points */}
                      <p className={`${pointsText[displayIdx]} font-bold font-mono text-white`}>{u.points.toLocaleString()}</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">points</p>

                      {/* Streak */}
                      {u.streak && (
                        <div className="flex items-center justify-center gap-1 mt-3">
                          <Fire size={12} weight="fill" className="text-orange-400" />
                          <span className="text-[10px] text-orange-400/80 font-semibold">{u.streak} day streak</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Table */}
              <div className="rounded-xl bg-[#111318] border border-white/[0.04] overflow-hidden">
                <div className="grid grid-cols-[50px_1fr_120px_80px] gap-4 px-5 py-3 border-b border-white/[0.04]">
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Rank</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Player</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em] text-right">Points</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em] text-right">Trend</span>
                </div>
                {users.slice(3).map((u, i) => (
                  <motion.div
                    key={u.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.02 }}
                    className="grid grid-cols-[50px_1fr_120px_80px] gap-4 px-5 py-3.5 border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group"
                  >
                    <span className={`text-sm font-bold font-mono ${u.rank <= 5 ? "text-neutral-300" : "text-neutral-600"}`}>#{u.rank}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-neutral-500">{u.avatar}</span>
                      </div>
                      <span className="text-sm text-neutral-300 group-hover:text-white transition-colors truncate">{u.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono text-right">{u.points.toLocaleString()}</span>
                    <div className="flex items-center justify-end">
                      {u.change > 0 ? (
                        <span className="text-xs font-bold text-[#14F195]"><ArrowUp size={10} weight="bold" className="inline mr-0.5" />+{u.change}</span>
                      ) : u.change < 0 ? (
                        <span className="text-xs font-bold text-red-400"><ArrowDown size={10} weight="bold" className="inline mr-0.5" />{u.change}</span>
                      ) : (
                        <span className="text-xs text-neutral-700">—</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ CAMPAIGNS ═══ */}
          {activeTab === "campaigns" && (
            <motion.div key="campaigns" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-3">
              {campaigns.map((c, i) => {
                const status = statusConfig[c.status];
                const catColor = categoryColors[c.category] || "#14F195";
                return (
                  <motion.div
                    key={c.rank}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 rounded-xl bg-[#111318] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
                        ${c.rank <= 3 ? "text-[#FFD700] bg-[#FFD700]/[0.06]" : "text-neutral-500 bg-white/[0.03]"}
                      `}>
                        #{c.rank}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-bold text-white">{c.name}</h3>
                            <p className="text-[11px] text-neutral-600 mt-0.5">by {c.creator}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: `${catColor}10`, color: catColor }}>{c.category}</span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${status.bg} ${status.text}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${c.status === "active" ? "animate-pulse" : ""}`} />
                              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {/* Progress */}
                        {c.status !== "upcoming" && (
                          <div className="w-full h-1 rounded-full bg-white/[0.03] overflow-hidden mb-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.progress}%` }}
                              transition={{ duration: 0.8, delay: i * 0.04 + 0.2 }}
                              className="h-full rounded-full"
                              style={{ background: catColor }}
                            />
                          </div>
                        )}
                        {/* Stats */}
                        <div className="flex items-center gap-5 text-xs">
                          <span className="text-neutral-500"><UsersThree size={12} className="inline mr-1" />{c.participants.toLocaleString()} joined</span>
                          <span className="text-neutral-500"><Lightning size={12} weight="fill" className="inline mr-1 text-[#F59E0B]/40" />{c.totalPoints.toLocaleString()} pts</span>
                          <span className="text-[#14F195] font-bold ml-auto"><CurrencyEth size={12} className="inline mr-0.5" />{c.prize}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ═══ CREATORS ═══ */}
          {activeTab === "creators" && (
            <motion.div key="creators" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>

              {/* Top 3 — podium style matching users */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {[1, 0, 2].map((idx, displayIdx) => {
                  const cr = creators[idx];
                  if (!cr) return null;
                  const color = idx === 0 ? "#9945FF" : rankColors[idx];
                  const isFirst = idx === 0;
                  const paddings = ["px-5 pt-5 pb-6", "px-6 pt-6 pb-8", "px-5 pt-5 pb-6"];
                  const avatarSizes = ["w-12 h-12", "w-16 h-16", "w-12 h-12"];
                  const avatarText = ["text-sm", "text-lg", "text-sm"];
                  const crownSize = isFirst ? 26 : 18;
                  return (
                    <motion.div
                      key={cr.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: displayIdx * 0.08 }}
                      className={`
                        flex-1 max-w-[240px] rounded-xl bg-[#111318] border border-white/[0.04] text-center relative overflow-hidden
                        ${paddings[displayIdx]}
                      `}
                    >
                      {/* Colored top accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: color }} />

                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold font-mono" style={{ color: rankColors[idx] }}>#{cr.rank}</span>
                      </div>
                      <div className="mb-3">
                        {isFirst
                          ? <Crown size={crownSize} weight="fill" className="mx-auto text-[#9945FF]" />
                          : <Medal size={crownSize} weight="fill" style={{ color: rankColors[idx] }} className="mx-auto" />
                        }
                      </div>
                      <div
                        className={`${avatarSizes[displayIdx]} rounded-lg mx-auto mb-3 flex items-center justify-center`}
                        style={{ background: `${color}10`, border: `1.5px solid ${color}20` }}
                      >
                        <span className={`${avatarText[displayIdx]} font-bold text-white`}>{cr.avatar}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <h3 className={`font-semibold text-white truncate ${isFirst ? "text-base" : "text-sm"}`}>{cr.name}</h3>
                        {cr.verified && <Star size={11} weight="fill" className="text-[#9945FF] shrink-0" />}
                      </div>
                      <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-500 mb-2">
                        <span><ImageIcon size={10} className="inline mr-0.5" />{cr.nftsCreated}</span>
                        <span><Heart size={10} weight="fill" className="inline mr-0.5 text-red-400/50" />{(cr.totalLikes / 1000).toFixed(1)}k</span>
                      </div>
                      <p className={`font-bold font-mono text-[#14F195] ${isFirst ? "text-lg" : "text-sm"}`}>{cr.earnings} ETH</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Table */}
              <div className="rounded-xl bg-[#111318] border border-white/[0.04] overflow-hidden">
                <div className="grid grid-cols-[50px_1fr_80px_80px_90px] gap-4 px-5 py-3 border-b border-white/[0.04]">
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Rank</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Creator</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em] text-right">NFTs</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em] text-right">Likes</span>
                  <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em] text-right">Earned</span>
                </div>
                {creators.slice(3).map((c, i) => (
                  <motion.div
                    key={c.rank}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.02 }}
                    className="grid grid-cols-[50px_1fr_80px_80px_90px] gap-4 px-5 py-3.5 border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group"
                  >
                    <span className="text-sm font-bold text-neutral-600 font-mono">#{c.rank}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-neutral-500">{c.avatar}</span>
                      </div>
                      <span className="text-sm text-neutral-300 group-hover:text-white transition-colors truncate">{c.name}</span>
                      {c.verified && <Star size={10} weight="fill" className="text-[#9945FF] shrink-0" />}
                    </div>
                    <span className="text-sm text-neutral-400 font-mono text-right">{c.nftsCreated}</span>
                    <span className="text-sm text-neutral-400 font-mono text-right">{(c.totalLikes / 1000).toFixed(1)}k</span>
                    <span className="text-sm font-bold text-[#14F195] font-mono text-right">{c.earnings} ETH</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}
    </div>
  );
}
