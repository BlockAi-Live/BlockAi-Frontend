"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { 
  MagnifyingGlass, 
  Sparkle, 
  TrendUp, 
  TrendDown, 
  CaretRight,
  Lightning,
  ChartLineUp,
  Globe,
  XCircle,
  FileText
} from "@phosphor-icons/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  CartesianGrid 
} from "recharts";
import { coingecko } from "@/lib/coingecko";

export default function MarketAnalysisPage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("1"); // 1 Day default
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // -- AI State --
  const [viewMode, setViewMode] = useState<'chart' | 'ai'>('chart');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Fetch Markets on Mount
  useEffect(() => {
    const fetchMarkets = async () => {
        setIsLoading(true);
        const data = await coingecko.getMarkets();
        if (data.length > 0) {
            // Map API data to our UI needs (add colors)
            const processed = data.map((coin: any) => ({
                ...coin,
                color: coingecko.getColor(coin.symbol),
                price: coin.current_price,
                change: coin.price_change_percentage_24h
            }));
            setCoins(processed);
            setSelectedCoin(processed[0]); // Default to first
        }
        setIsLoading(false);
    };
    fetchMarkets();
  }, []);

  // Fetch Chart when Coin or Tab changes
  useEffect(() => {
      if (!selectedCoin) return;
      const fetchChart = async () => {
          const days = activeTab === "ALL" ? "max" : activeTab; 
          const data = await coingecko.getMarketChart(selectedCoin.id, days);
          setChartData(data);
      };
      fetchChart();
  }, [selectedCoin, activeTab]);


  const handleAiAction = (action: string) => {
    setAiAction(action);
    setViewMode('ai');
    setIsAiLoading(true);
    setAiResponse("");

    // Simulate AI generation with variable speed
    setTimeout(() => {
        setIsAiLoading(false);
        const report = `## ${action} for ${selectedCoin.name}\n\n**Analysis:** Strong accumulation detected in the **$${(selectedCoin.price * 0.95).toFixed(2)}** zone. RSI is resetting on the 4H timeframe, suggesting pending volatility.\n\n**Outlook:** Bullish divergence on OBV confirms institute buying. Target: **$${(selectedCoin.price * 1.1).toFixed(2)}**.\n\n> *Market sentiment is shifting rapidly. Recommended to set tight stop-losses.*`;
        
        let i = 0;
        const typeChar = () => {
            if (i < report.length) {
                setAiResponse(report.slice(0, i + 1));
                i++;
                const char = report[i];
                let delay = 20; 
                if (char === '.' || char === '?' || char === '!') delay = 400; // Pause at sentences
                else if (char === ',') delay = 150; // Pause at commas
                else delay = Math.random() * 30 + 10; // Random typing jitter

                setTimeout(typeChar, delay);
            }
        };
        typeChar();
    }, 1500);
  };

  if (isLoading) {
      return (
          <div className="min-h-screen bg-[#0d0f18] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#14F195] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#14F195] font-mono animate-pulse">Initializing Market Data...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white font-sans overflow-x-hidden relative flex flex-col">
      {/* Global Background Ambience */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 10%, rgba(20, 241, 149, 0.03) 0%, rgba(13, 15, 24, 0) 60%)"
        }}
      />

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-16 pb-12 px-6 flex flex-col items-center text-center">
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
         >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Get the edge on the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">market with precision</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
               Real-time AI analysis, institutional-grade data, and seamless execution. 
               Level the playing field.
            </p>
         </motion.div>

         {/* Hero Search Bar */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-lg relative group flex flex-col items-center gap-4 z-50"
         >
            <div className="w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-full opacity-30 group-hover:opacity-60 blur-md transition-opacity duration-300" />
                <div className="relative bg-[#13151C] rounded-2xl transition-all duration-300 shadow-2xl border border-white/10 flex flex-col">
                   <div className="flex items-center px-4 py-3">
                       <MagnifyingGlass size={20} className="text-gray-400 mr-3" />
                       <input 
                          type="text" 
                          placeholder="Ask AI or Search symbol..." 
                          className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-gray-500 text-sm md:text-base h-full"
                          value={searchQuery}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
                          onChange={(e) => setSearchQuery(e.target.value)}
                       />
                       <div className="flex gap-2 text-[10px] text-gray-500 font-mono border border-white/5 px-2 py-1 rounded bg-black/20">
                          <span>⌘</span><span>K</span>
                       </div>
                   </div>

                   {/* Search Suggestions Dropdown */}
                   <AnimatePresence>
                       {isSearchFocused && (
                           <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: "auto" }}
                               exit={{ opacity: 0, height: 0 }}
                               className="overflow-hidden border-t border-white/5"
                           >
                               <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                                   {coins.filter(c => 
                                       c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                                   ).map((coin) => (
                                       <button
                                           key={coin.id}
                                           onClick={() => {
                                               setSelectedCoin(coin);
                                               setSearchQuery(""); // Optional: clear or set to name
                                               setIsSearchFocused(false);
                                               setViewMode('chart');
                                           }}
                                           className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group/item"
                                       >
                                           <div className="flex items-center gap-3">
                                               <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                               <div className="text-left">
                                                   <p className="text-white font-bold text-sm">{coin.name}</p>
                                                   <p className="text-gray-500 text-xs uppercase">{coin.symbol}</p>
                                               </div>
                                           </div>
                                           <div className="flex flex-col items-end">
                                               <span className="text-white font-mono text-sm">${coin.current_price.toLocaleString()}</span>
                                               <span className={`text-xs ${coin.price_change_percentage_24h >= 0 ? "text-[#14F195]" : "text-red-400"}`}>
                                                   {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                                               </span>
                                           </div>
                                       </button>
                                   ))}
                                   {coins.filter(c => 
                                       c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                                   ).length === 0 && (
                                       <div className="p-4 text-center text-gray-500 text-sm">
                                           No coins found. Try "Bitcoin"
                                       </div>
                                   )}
                               </div>
                           </motion.div>
                       )}
                   </AnimatePresence>
                </div>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => handleAiAction("Market Report")} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151C] border border-white/10 hover:border-[#14F195] hover:text-[#14F195] transition-all text-xs font-medium text-gray-300">
                    <FileText weight="duotone" />
                    Generate Report
                </button>
                <button onClick={() => handleAiAction("Alpha Finder")} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151C] border border-white/10 hover:border-[#9945FF] hover:text-[#9945FF] transition-all text-xs font-medium text-gray-300">
                    <Sparkle weight="duotone" />
                    Find Alpha
                </button>
                <button onClick={() => handleAiAction("Technical Analysis")} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151C] border border-white/10 hover:border-blue-400 hover:text-blue-400 transition-all text-xs font-medium text-gray-300">
                    <ChartLineUp weight="duotone" />
                    Technical Analysis
                </button>
            </div>
         </motion.div>
      </div>


      {/* --- MARQUEE TICKER --- */}
      <div className="w-full overflow-hidden py-8 relative z-10">
         <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0f18] to-transparent z-20 pointer-events-none" />
         <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0f18] to-transparent z-20 pointer-events-none" />
         
         <motion.div 
            className="flex gap-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
         >
            {[...coins, ...coins, ...coins].map((coin, index) => (
               <div 
                  key={`${coin.id}-${index}`}
                  onClick={() => {
                        setSelectedCoin(coin);
                        setViewMode('chart'); // Reset to chart when coin clicked
                  }}
                  className={`
                     relative w-64 p-4 rounded-[24px] cursor-pointer transition-all duration-300 group
                     ${selectedCoin?.id === coin.id ? "bg-[#1A1D26] border-[#14F195]/30 shadow-[0_0_20px_rgba(20,241,149,0.1)]" : "bg-[#13151C]/50 border-white/5 hover:bg-[#13151C]"}
                     border
                  `}
               >
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                           <h3 className="font-bold text-sm text-white uppercase">{coin.symbol}</h3>
                           <p className="text-xs text-gray-500">{coin.name}</p>
                        </div>
                     </div>
                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${coin.price_change_percentage_24h >= 0 ? "text-[#14F195] bg-[#14F195]/10" : "text-red-400 bg-red-400/10"}`}>
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}{coin.price_change_percentage_24h.toFixed(2)}%
                     </span>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-lg font-bold text-white">${coin.current_price.toLocaleString()}</span>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <CaretRight size={16} className="text-gray-400" />
                     </div>
                  </div>
               </div>
            ))}
         </motion.div>
      </div>


      {/* --- MAIN CHART & CONTENT --- */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 transition-all">
         
         {/* DYNAMIC MAIN CARD */}
         <AnimatePresence mode="wait">
            {viewMode === 'chart' && selectedCoin ? (
                <motion.div 
                    key="chart"
                    initial={{ opacity: 0, rotateX: -15 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: 15 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-2 p-6 md:p-8 rounded-[32px] bg-[#13151C] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]"
                >
                    {/* Dynamic Gradient Background for the card */}
                    <div 
                    className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none"
                    style={{ backgroundColor: selectedCoin.color }}
                    />

                    {/* Chart Header */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {selectedCoin.name} 
                                    <span className="text-sm text-gray-500 font-normal">/ USD</span>
                                </h2>
                                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    ${selectedCoin.current_price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex bg-black/30 p-1 rounded-full border border-white/5 backdrop-blur-sm self-start md:self-auto">
                            {[{l:'24H', v:'1'}, {l:'7D', v:'7'}, {l:'30D', v:'30'}, {l:'Max', v:'max'}].map((tab) => (
                                <button 
                                    key={tab.v}
                                    onClick={() => setActiveTab(tab.v)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab.v ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {tab.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 w-full relative z-10 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={selectedCoin.color} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={selectedCoin.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6B7280', fontSize: 11 }} 
                                    dy={10}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6B7280', fontSize: 11 }} 
                                    tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1) + 'k' : val.toFixed(2)}`}
                                    dx={-10}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0d0f18', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: selectedCoin.color }}
                                    formatter={(value: number) => [`$${value > 100 ? value.toLocaleString() : value.toFixed(4)}`, "Price"]}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke={selectedCoin.color} 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#coinGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="ai"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-2 p-8 rounded-[32px] bg-[#13151C] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]"
                >
                     <div className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
                                 <img src="/blockai.svg" alt="BlockAI" className="w-6 h-6" />
                             </div>
                             <div>
                                 <h2 className="text-xl font-bold text-white">BlockAI Intelligence</h2>
                                 <p className="text-sm text-gray-400">Processing: {aiAction}</p>
                             </div>
                         </div>
                         <button 
                            onClick={() => setViewMode('chart')}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                         >
                             <XCircle size={24} weight="fill" />
                         </button>
                     </div>

                     <div className="flex-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-inner p-8 text-base leading-relaxed overflow-y-auto relative custom-scrollbar">
                        {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-70">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#14F195] blur-xl opacity-20 animate-pulse"></div>
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    >
                                        <Sparkle size={48} className="text-[#14F195] relative z-10" weight="fill" />
                                    </motion.div>
                                </div>
                                <p className="animate-pulse font-medium text-[#14F195] tracking-widest text-xs uppercase">Processing On-Chain Data...</p>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-[#14F195] prose-strong:font-bold prose-blockquote:border-l-[#14F195] prose-blockquote:bg-[#14F195]/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg">
                                <ReactMarkdown>
                                    {aiResponse}
                                </ReactMarkdown>
                                <span className="inline-block w-2.5 h-5 bg-[#14F195] ml-1 align-middle animate-pulse shadow-[0_0_10px_#14F195]"/>
                            </div>
                        )}
                     </div>
                </motion.div>
            )}
         </AnimatePresence>


         {/* STATS & AI PANEL */}
         {selectedCoin && (
         <motion.div 
             className="flex flex-col gap-6"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
         >
             {/* AI Insight Card */}
             <div className="p-6 rounded-[32px] bg-gradient-to-b from-[#13151C] to-[#0d0f18] border border-white/5 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                   <Lightning size={80} weight="fill" className="text-[#14F195]" />
                </div>
                
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                      <span className="text-[#14F195] text-xs font-bold uppercase tracking-wider">AI Recommendation</span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-white mb-2">
                      {selectedCoin.change > 0 ? "Strong Buy Signal" : "Accumulation Zone"}
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      AI models detect {selectedCoin.change > 0 ? "bullish momentum" : "consolidation"} on {selectedCoin.name}. 
                      On-chain volume is {selectedCoin.change > 0 ? "surging" : "steady"}, suggesting a move {selectedCoin.change > 0 ? "higher" : "soon"}.
                   </p>
                   
                   <button 
                        onClick={() => handleAiAction("Deep Analysis")}
                        className="w-full py-3 rounded-xl bg-[#14F195] text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                   >
                      <span>Execute Deep Scan</span>
                      <ChartLineUp size={16} weight="bold" />
                   </button>
                </div>
             </div>

             {/* Dynamic Stats */}
             <div className="flex-1 p-6 rounded-[32px] bg-[#13151C] border border-white/5 flex flex-col">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                   <Globe size={20} className="text-blue-400" />
                   Network Stats
                </h3>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                   {/* Market Cap */}
                   <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-500 text-xs font-medium">Market Cap</span>
                          <TrendUp className="text-[#14F195]" size={16} />
                      </div>
                      <div>
                          <p className="text-white font-mono font-bold text-base leading-none mb-1">
                              ${(selectedCoin.market_cap / 1e9).toFixed(2)}B
                          </p>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full w-[70%] bg-[#14F195] rounded-full" />
                          </div>
                      </div>
                   </div>

                   {/* Volume */}
                   <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-500 text-xs font-medium">24h Vol</span>
                          <Sparkle className="text-[#9945FF]" size={16} weight="fill" />
                      </div>
                      <div>
                          <p className="text-white font-mono font-bold text-base leading-none mb-1">
                              ${(selectedCoin.total_volume / 1e9).toFixed(2)}B
                          </p>
                          <div className="text-xs text-[#9945FF] font-medium">+12.5%</div>
                      </div>
                   </div>

                   {/* Dominance/Rank */}
                   <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-500 text-xs font-medium">Rank</span>
                          <ChartLineUp className="text-blue-400" size={16} />
                      </div>
                      <div>
                          <p className="text-white font-mono font-bold text-3xl leading-none mb-1">#{selectedCoin.market_cap_rank}</p>
                          <span className="text-[10px] text-gray-500">Global Rank</span>
                      </div>
                   </div>

                    {/* Sentiment - Mocked since API doesnt have it */}
                   <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-medium">Sentiment</span>
                            <Lightning className="text-yellow-400" size={16} weight="fill" />
                        </div>
                        <div>
                             <p className="text-white font-bold text-lg leading-none mb-1">Greed</p>
                             <div className="flex gap-1 mt-2">
                                 <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                 <span className="text-[10px] text-green-500 uppercase font-bold tracking-wider">Bullish</span>
                             </div>
                        </div>
                   </div>
                </div>
             </div>
         </motion.div>
         )}

      </div>
    </div>
  );
}
