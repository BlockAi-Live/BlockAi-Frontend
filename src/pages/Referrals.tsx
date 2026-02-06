"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Copy, Users, CheckCircle, Gift, ShareNetwork,
  TwitterLogo, WhatsappLogo
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

export function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    referralCode: "",
    referralCount: 0
  });

  const referralLink = `${window.location.origin}/genesis?ref=${stats.referralCode || user?.fullName?.toLowerCase().replace(/\s+/g, '') || "user"}`;

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('blockai_token');
            if (token) {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/referrals/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            }
        } catch (e) {
            console.error("Failed to load referral stats", e);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

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
                     Your Referral Hub
                 </motion.h1>
                 <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-400">
                     Share your link and track your community growth.
                 </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-auto p-4 rounded-2xl bg-[#13151C] border border-white/10 flex flex-col md:flex-row gap-4 items-center shadow-2xl"
            >
                <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 font-mono text-gray-300 w-full md:w-80 truncate text-center md:text-left">
                    {loading ? "Loading link..." : referralLink}
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative p-6 rounded-[24px] bg-[#16181f] border border-white/5 overflow-hidden group hover:bg-[#1c1e26] transition-all duration-300"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <Users size={28} color="#6366F1" weight="fill" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Total Referrals</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                        {loading ? "..." : stats.referralCount}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium">Users</span>
                </div>
                
                <div 
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6366F1] to-transparent opacity-80" 
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative p-6 rounded-[24px] bg-[#16181f] border border-white/5 overflow-hidden group hover:bg-[#1c1e26] transition-all duration-300"
            >
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <ShareNetwork size={28} color="#14F195" weight="fill" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Status</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-bold text-[#14F195] tracking-tight">
                        Active
                    </h3>
                </div>
                 <div 
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14F195] to-transparent opacity-80" 
                />
            </motion.div>
        </div>

      </main>
    </div>
  );
}
