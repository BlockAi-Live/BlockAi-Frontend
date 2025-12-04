"use client";

import { ReferralCard } from "./ReferralCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { motion } from "framer-motion";

const data = [
  { name: 'Mon', l1: 400, l2: 240, l3: 100 },
  { name: 'Tue', l1: 300, l2: 139, l3: 200 },
  { name: 'Wed', l1: 200, l2: 980, l3: 200 },
  { name: 'Thu', l1: 278, l2: 390, l3: 150 },
  { name: 'Fri', l1: 189, l2: 480, l3: 100 },
  { name: 'Sat', l1: 239, l2: 380, l3: 250 },
  { name: 'Sun', l1: 349, l2: 430, l3: 210 },
];

const tabs = ["All Levels", "Level 1", "Level 2", "Level 3"];

export default function EarningsChart() {
  const [activeTab, setActiveTab] = useState("All Levels");

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Earnings Analytics</h2>
          </div>
          
          <ReferralCard gradientBorder className="p-8 h-[400px] flex flex-col">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? "bg-white text-[#0d0f18] shadow-lg shadow-white/10" 
                      : "bg-[#0d0f18]/60 backdrop-blur-sm border border-white/5 text-gray-400 hover:bg-[#0d0f18]/80 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorL2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorL3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 500 }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  {(activeTab === "All Levels" || activeTab === "Level 1") && (
                    <Area type="monotone" dataKey="l1" stroke="#6366F1" fillOpacity={1} fill="url(#colorL1)" strokeWidth={3} />
                  )}
                  {(activeTab === "All Levels" || activeTab === "Level 2") && (
                    <Area type="monotone" dataKey="l2" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorL2)" strokeWidth={3} />
                  )}
                  {(activeTab === "All Levels" || activeTab === "Level 3") && (
                    <Area type="monotone" dataKey="l3" stroke="#06B6D4" fillOpacity={1} fill="url(#colorL3)" strokeWidth={3} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ReferralCard>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-1 flex flex-col gap-6 justify-end">
          {[
            { label: "Level 1", amount: "$4,050", percent: "9%", color: "text-[#6366F1]", bg: "bg-[#6366F1]/10", border: "border-[#6366F1]/20" },
            { label: "Level 2", amount: "$2,835", percent: "7%", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
            { label: "Level 3", amount: "$1,620", percent: "4%", color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10", border: "border-[#06B6D4]/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <ReferralCard gradientBorder className={`p-6 flex items-center justify-between hover:border-white/20 transition-all group`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
                    <p className={`text-xs font-bold uppercase tracking-widest text-gray-400`}>{stat.label}</p>
                  </div>
                  <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{stat.amount}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${stat.bg} ${stat.color} border ${stat.border} font-mono font-bold text-lg`}>
                  {stat.percent}
                </div>
              </ReferralCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
