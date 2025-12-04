"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, User, LogOut, AlertTriangle, Activity, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Mock chart data
const chartData = [
  { time: "00:00", price: 1.15 },
  { time: "04:00", price: 1.18 },
  { time: "08:00", price: 1.12 },
  { time: "12:00", price: 1.25 },
  { time: "16:00", price: 1.20 },
  { time: "20:00", price: 1.35 },
  { time: "24:00", price: 1.42 },
];

// Trending tokens data
const trendingTokens = [
  {
    symbol: "SUI",
    change: "+15%",
    signal: "High Smart Money Inflow",
    textColor: "#30E3FF",
    changeColor: "#E9CE02",
    borderColor: "#000000",
    glowColor: "#FF8800",
    buttonColor: "#14F195",
    hasGradientBorder: false,
  },
  {
    symbol: "SOL",
    change: "+5.7%",
    signal: "High Smart Money Inflow",
    textColor: "#FFFFFF",
    changeColor: "#14F195",
    borderColor: "",
    glowColor: "#FFFFFF",
    buttonColor: "#14F195",
    hasGradientBorder: true,
  },
  {
    symbol: "ETH",
    change: "+7%",
    signal: "High Smart Money Inflow",
    textColor: "#D2FFFF",
    changeColor: "#D2FFFF",
    borderColor: "#D2FFFF",
    glowColor: "#FFFFFF",
    buttonColor: "#14F195",
    hasGradientBorder: false,
  },
];

const quickActions = ["Macro Report", "Whale Movement", "Technical Analysis"];

export function MarketAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState(trendingTokens[0]);

  const handleLogout = () => {
    window.location.href = "/home";
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white relative">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />
      
      <div className="p-6 lg:p-10 relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-6 mb-10">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-4xl">
            <div 
              className="p-[1px] rounded-2xl"
              style={{ background: "linear-gradient(90deg, #14F195 0%, #9945FF 100%)" }}
            >
              <div className="relative bg-[#1a1d2e] rounded-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent rounded-2xl pl-11 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-11 w-11 rounded-full p-0 border border-white/10 hover:border-white/20"
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-[#16181f] text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#16181f] border-white/10" align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-gray-300 hover:text-white focus:text-white focus:bg-white/5"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Market Intelligence Section */}
        <section className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
          >
            Market Intelligence
          </motion.h1>

          {/* AI Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col mb-6"
          >
            <div className="relative w-full max-w-2xl mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Sparkles size={14} />
              </div>
              <input
                type="text"
                placeholder="Ask AI to generate a market report, analyze a trend, or find alpha..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-[#16181f]/50 border border-[#14F195] rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195]/30 transition-all"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3 justify-center max-w-2xl">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setActiveFilter(activeFilter === action ? null : action)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    activeFilter === action
                      ? "bg-white text-[#0d0f18] border-white"
                      : "bg-transparent text-gray-300 border-[#7737C4] hover:border-[#9945FF] hover:text-white"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Potential Alpha / Trending Section */}
        <section className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl lg:text-3xl font-bold text-white mb-6"
          >
            Potential Alpha / Trending
          </motion.h2>

          <div className="flex flex-wrap gap-8">
            {trendingTokens.map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedToken(token)}
                className="relative cursor-pointer"
              >
                {/* Gradient border wrapper for SOL */}
                {token.hasGradientBorder ? (
                  <div 
                    className="p-[1px] rounded-lg w-32 h-32"
                    style={{
                      background: "linear-gradient(180deg, #14F195 0%, #9945FF 100%)",
                      boxShadow: selectedToken.symbol === token.symbol ? `0 0 20px ${token.glowColor}50` : undefined
                    }}
                  >
                    <div className="rounded-lg p-3 h-full flex flex-col justify-between bg-[#1a1d2e]"
                    >
                      {/* Token Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: token.textColor }}>{token.symbol}</span>
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ color: token.changeColor, backgroundColor: `${token.changeColor}20` }}
                        >
                          {token.change}
                        </span>
                      </div>

                      {/* Signal */}
                      <p className="text-[10px] text-white text-center leading-tight">{token.signal}</p>

                      {/* View Chart Button */}
                      <button
                        className="px-2 py-1 rounded text-[10px] font-bold text-black transition-all hover:opacity-80 self-center"
                        style={{ backgroundColor: token.buttonColor }}
                      >
                        View Chart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="rounded-lg p-3 border w-32 h-32 flex flex-col justify-between bg-[#1a1d2e]"
                    style={{ 
                      borderColor: token.borderColor,
                      boxShadow: selectedToken.symbol === token.symbol ? `0 0 20px ${token.glowColor}50` : `0 0 15px ${token.glowColor}20`
                    }}
                  >
                    {/* Token Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: token.textColor }}>{token.symbol}</span>
                      <span 
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: token.changeColor, backgroundColor: `${token.changeColor}20` }}
                      >
                        {token.change}
                      </span>
                    </div>

                    {/* Signal */}
                    <p className="text-[10px] text-white text-center leading-tight">{token.signal}</p>

                    {/* View Chart Button */}
                    <button
                      className="px-2 py-1 rounded text-[10px] font-bold text-black transition-all hover:opacity-80 self-center"
                      style={{ backgroundColor: token.buttonColor }}
                    >
                      View Chart
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#16181f] to-[#0d0f18] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Chart Area */}
            <div className="lg:col-span-3 p-6 lg:p-8">
              <div className="h-[300px] lg:h-[350px] relative">
                {/* Glow effect behind chart */}
                <div 
                  className="absolute inset-0 opacity-30 blur-3xl"
                  style={{ 
                    background: `radial-gradient(ellipse at center, ${selectedToken.buttonColor}40 0%, transparent 70%)` 
                  }}
                />
                
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={selectedToken.buttonColor} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={selectedToken.buttonColor} stopOpacity={0} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(22, 24, 31, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(8px)",
                      }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#9CA3AF" }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={selectedToken.buttonColor}
                      strokeWidth={3}
                      fill="url(#chartGradient)"
                      filter="url(#glow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="lg:col-span-1 p-6 lg:p-8 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="flex flex-col justify-center h-full space-y-8">
                {/* Risk Level */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Risk Level</p>
                    <p className="text-xl font-bold text-white">Medium</p>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Sentiment</p>
                    <p className="text-xl font-bold text-emerald-400">Bullish</p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Support</p>
                    <p className="text-xl font-bold text-white">$1.20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default MarketAnalysisPage;
