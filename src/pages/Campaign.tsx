"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Lightning, Lock, LockOpen, Check, Copy, ArrowRight,
  TwitterLogo, TelegramLogo, DiscordLogo, GithubLogo, LinkedinLogo,
  ChartBar, Sparkle, Fire, Gift, Eye, ChatCircleDots, FileCode,
  PaintBrush, Detective, CheckCircle, Clock, XCircle, Megaphone
} from "@phosphor-icons/react";
import { useCampaign } from "@/context/CampaignContext";
import { useAuth } from "@/context/AuthContext";

// ─── CONSTANTS ───────────────────────────────────────────
const SECTIONS = [
  { key: "chat", label: "AI Chat", icon: ChatCircleDots, stage: 1 },
  { key: "market", label: "Market Analysis", icon: ChartBar, stage: 2 },
  { key: "smart-contracts", label: "Smart Contracts", icon: FileCode, stage: 3 },
  { key: "nft", label: "NFT Generator", icon: PaintBrush, stage: 4 },
  { key: "wallet-intel", label: "Chain Scanner", icon: Detective, stage: 5 },
];

const SOCIAL_TASKS = [
  { key: "follow_x", label: "Follow Block AI on X", points: 50, icon: TwitterLogo, url: "https://twitter.com/BlockAI_Live" },
  { key: "follow_cmc", label: "Follow CoinMarketCap", points: 75, icon: ChartBar, url: "https://coinmarketcap.com" },
  { key: "follow_linkedin", label: "Follow LinkedIn", points: 75, icon: LinkedinLogo, url: "https://www.linkedin.com/company/blockai-live/" },
  { key: "follow_github", label: "Follow GitHub", points: 75, icon: GithubLogo, url: "https://github.com/BlockAi-Live" },
  { key: "join_tg_group", label: "Join Telegram Group", points: 75, icon: TelegramLogo, url: "https://t.me/BlockAiOrg" },
  { key: "join_tg_channel", label: "Join Telegram Channel", points: 75, icon: TelegramLogo, url: "https://t.me/BlockAiOfficial" },
  { key: "join_discord", label: "Join Discord Server", points: 75, icon: DiscordLogo, url: "https://discord.com/invite/FuPn3FbkG9" },
];

const REWARDS = [
  { rank: "🥇 1st", prize: "$300 (Token/USDT) + Free Mint: Block AI NFT + Genesis NFT" },
  { rank: "🥈 2nd", prize: "$200 (Token/USDT) + Free Mint: Block AI NFT + Genesis NFT" },
  { rank: "🥉 3rd", prize: "$100 (Token/USDT) + Free Mint: Block AI NFT + Genesis NFT" },
  { rank: "4th", prize: "$80 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "5th", prize: "$70 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "6th", prize: "$60 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "7th", prize: "$30 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "8th", prize: "$25 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "9th", prize: "$20 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "10th", prize: "$15 (Token/USDT) + Free Mint: Genesis NFT" },
  { rank: "11–30", prize: "Free Mint: Genesis NFT" },
];

const ACCESS_CODE_COST = 500;

export function CampaignPage() {
  const { user } = useAuth();
  const campaign = useCampaign();
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [feedbackUrls, setFeedbackUrls] = useState<Record<string, string>>({});
  const [feedbackData, setFeedbackData] = useState<Record<string, { status: string; url: string; id: string }>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("auth_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // Load feedback data + refresh campaign data
  const loadFeedback = async () => {
    try {
      const res = await fetch(`${API_URL}/api/campaign/progress`, { headers });
      if (res.ok) {
        const data = await res.json();
        const fbData: Record<string, { status: string; url: string; id: string }> = {};
        data.feedbacks?.forEach((f: any) => {
          if (f.platform === "twitter" && !fbData[f.section]) {
            fbData[f.section] = { status: f.status, url: f.tweetUrl, id: f.id };
          }
        });
        setFeedbackData(fbData);
      }
    } catch (e) { console.error(e); }
  };

  // Refresh campaign progress + feedback on mount, on window focus, and every 15s
  useEffect(() => {
    campaign.refresh();
    loadFeedback();

    const interval = setInterval(() => {
      campaign.refresh();
      loadFeedback();
    }, 15000);

    const onFocus = () => {
      campaign.refresh();
      loadFeedback();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Complete social task
  const handleCompleteTask = async (taskKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/campaign/complete-task`, {
        method: "POST", headers, body: JSON.stringify({ taskKey }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(`+${data.pointsAwarded} PTS earned!`, "success");
        await campaign.refresh();
      } else {
        showMessage(data.error, "error");
      }
    } catch (e) { showMessage("Failed to complete task", "error"); }
    setLoading(false);
  };

  // Generate access code
  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/campaign/generate-code`, {
        method: "POST", headers,
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedCode(data.code);
        showMessage(data.existing ? "You already have a code" : "Access code generated!", "success");
        await campaign.refresh();
      } else {
        showMessage(data.error, "error");
      }
    } catch (e) { showMessage("Failed to generate code", "error"); }
    setLoading(false);
  };

  // Redeem code
  const handleRedeemCode = async () => {
    if (!codeInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/campaign/redeem-code`, {
        method: "POST", headers, body: JSON.stringify({ code: codeInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, "success");
        setCodeInput("");
        await campaign.refresh();
      } else {
        showMessage(data.error, "error");
      }
    } catch (e) { showMessage("Failed to redeem code", "error"); }
    setLoading(false);
  };

  // Submit feedback
  const handleSubmitFeedback = async (section: string) => {
    const url = feedbackUrls[section];
    if (!url?.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/campaign/submit-feedback`, {
        method: "POST", headers,
        body: JSON.stringify({ section, tweetUrl: url.trim(), platform: "twitter" }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage("Feedback submitted! Awaiting review.", "success");
        setFeedbackData(prev => ({ ...prev, [section]: { status: "PENDING", url: url.trim(), id: data.submission?.id || "" } }));
        setFeedbackUrls(prev => ({ ...prev, [section]: "" }));
        setEditingSection(null);
        await campaign.refresh();
      } else {
        showMessage(data.error, "error");
      }
    } catch (e) { showMessage("Failed to submit feedback", "error"); }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const socialPoints = SOCIAL_TASKS.reduce((sum, t) => {
    return campaign.completedTasks.includes(t.key) ? sum + t.points : sum;
  }, 0);
  const maxSocialPoints = SOCIAL_TASKS.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="min-h-screen bg-[#0a0c14] px-4 sm:px-8 py-8 max-w-5xl mx-auto">

      {/* Toast */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-bold border ${
            message.type === "success"
              ? "bg-[#14F195]/10 border-[#14F195]/20 text-[#14F195]"
              : "bg-red-400/10 border-red-400/20 text-red-400"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#9945FF]/10 flex items-center justify-center">
            <Megaphone size={24} weight="fill" className="text-[#9945FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Early Access Feedback Campaign</h1>
            <p className="text-sm text-neutral-500">Help shape BlockAI before launch — earn PTS & prizes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-neutral-600">
          <span>📅 Start: April 24, 2026</span>
          <span>⏱ Duration: 6 weeks</span>
          <span>🏆 Top 30 win prizes</span>
        </div>
      </motion.div>

      {/* ── PROGRESS OVERVIEW ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Your Points", value: campaign.totalPoints.toLocaleString(), icon: Lightning, color: "#F59E0B" },
          { label: "Sections Unlocked", value: `${campaign.unlockedStage}/5`, icon: LockOpen, color: "#14F195" },
          { label: "X Feedbacks", value: `${campaign.totalXFeedbacks}/10`, icon: TwitterLogo, color: "#1DA1F2" },
          { label: "Status", value: campaign.isInvestor ? "Investor" : campaign.hasRedeemedCode ? "Active" : "Pending", icon: Sparkle, color: "#9945FF" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-[#111318] border border-white/[0.04]">
            <stat.icon size={15} weight="fill" className="mb-2 opacity-50" style={{ color: stat.color }} />
            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{stat.value}</p>
          </div>
        ))}
      </motion.div>


      {/* ── STEP 1: SOCIAL TASKS ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Step 1 — Complete Social Tasks</h2>
          <span className="text-xs text-neutral-500 font-mono">{socialPoints}/{maxSocialPoints} PTS</span>
        </div>
        <div className="space-y-2">
          {SOCIAL_TASKS.map((task) => {
            const isDone = campaign.completedTasks.includes(task.key);
            return (
              <div key={task.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDone ? "bg-[#14F195]/[0.03] border-[#14F195]/10" : "bg-[#111318] border-white/[0.04]"}`}>
                <div className="flex items-center gap-3">
                  <task.icon size={18} weight="fill" className={isDone ? "text-[#14F195]" : "text-neutral-600"} />
                  <span className={`text-sm font-medium ${isDone ? "text-neutral-300" : "text-white"}`}>{task.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#F59E0B] font-bold font-mono">+{task.points}</span>
                  {isDone ? (
                    <div className="w-8 h-8 rounded-lg bg-[#14F195]/10 flex items-center justify-center">
                      <Check size={14} weight="bold" className="text-[#14F195]" />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        window.open(task.url, "_blank");
                        setTimeout(() => handleCompleteTask(task.key), 2000);
                      }}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-bold text-white hover:bg-white/[0.08] transition-all disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── STEP 2: GENERATE & REDEEM CODE ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Step 2 — Get Your Access Code</h2>
        <div className="p-6 rounded-xl bg-[#111318] border border-white/[0.04]">
          {campaign.hasRedeemedCode ? (
            <div className="flex items-center gap-3">
              <CheckCircle size={20} weight="fill" className="text-[#14F195]" />
              <span className="text-sm text-[#14F195] font-bold">
                {campaign.isInvestor ? "Investor access — all sections unlocked" : "Early access activated!"}
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Generate */}
              <div>
                <p className="text-sm text-neutral-400 mb-3">
                  Collect <span className="text-[#F59E0B] font-bold">500 PTS</span> to generate your Early Access Code. 500 PTS will be deducted.
                </p>
                {generatedCode ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-white/[0.03] border border-[#14F195]/20 text-[#14F195] font-mono text-sm font-bold">{generatedCode}</div>
                    <button onClick={copyCode} className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all">
                      {codeCopied ? <Check size={16} className="text-[#14F195]" /> : <Copy size={16} className="text-white" />}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateCode}
                    disabled={loading || campaign.totalPoints < ACCESS_CODE_COST}
                    className="px-5 py-2.5 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20 text-[#14F195] font-bold text-sm hover:bg-[#14F195]/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Generate Code ({campaign.totalPoints}/{ACCESS_CODE_COST} PTS)
                  </button>
                )}
              </div>
              {/* Redeem */}
              <div className="pt-4 border-t border-white/[0.04]">
                <p className="text-sm text-neutral-500 mb-3">Have a code? Enter it here:</p>
                <div className="flex items-center gap-2">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="BLOCKAI-EA-XXXXXX"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm font-mono placeholder:text-neutral-700 focus:outline-none focus:border-[#14F195]/30"
                  />
                  <button
                    onClick={handleRedeemCode}
                    disabled={loading || !codeInput.trim()}
                    className="px-5 py-2.5 rounded-lg bg-white/[0.06] text-white font-bold text-sm hover:bg-white/[0.1] transition-all disabled:opacity-30"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── STEP 3: FEEDBACK & SECTION PROGRESS ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Step 3 — Test & Submit Feedback</h2>
        <p className="text-xs text-neutral-500 mb-4">
          Share your honest experience on X. Tag <span className="text-white">@BlockAI_Live</span> and include <span className="text-[#1DA1F2]">#BlockAIEarlyAccess</span>. Paste the tweet link below.
        </p>
        <div className="space-y-3">
          {SECTIONS.map((sec) => {
            const isUnlocked = campaign.unlockedStage >= sec.stage || campaign.isInvestor;
            const fb = feedbackData[sec.key];
            const fbStatus = fb?.status;
            const isEditing = editingSection === sec.key;

            // Determine subtitle text
            const getSubtitle = () => {
              if (!isUnlocked) return "Locked";
              if (fbStatus === "APPROVED") return "Feedback approved ✓";
              if (fbStatus === "PENDING") return "Under review — please wait";
              if (fbStatus === "REJECTED") return "Rejected — please re-submit";
              return "Submit feedback to unlock next section";
            };

            // Handle edit save
            const handleEditSave = async () => {
              const newUrl = feedbackUrls[sec.key];
              if (!newUrl?.trim() || !fb?.id) return;
              setLoading(true);
              try {
                const res = await fetch(`${API_URL}/api/campaign/edit-feedback`, {
                  method: "PUT", headers,
                  body: JSON.stringify({ submissionId: fb.id, tweetUrl: newUrl.trim() }),
                });
                const data = await res.json();
                if (res.ok) {
                  showMessage("Feedback link updated!", "success");
                  setFeedbackData(prev => ({ ...prev, [sec.key]: { ...prev[sec.key], url: newUrl.trim() } }));
                  setFeedbackUrls(prev => ({ ...prev, [sec.key]: "" }));
                  setEditingSection(null);
                } else {
                  showMessage(data.error, "error");
                }
              } catch (e) { showMessage("Failed to update feedback", "error"); }
              setLoading(false);
            };

            return (
              <div
                key={sec.key}
                className={`p-5 rounded-xl border transition-all ${
                  isUnlocked
                    ? "bg-[#111318] border-white/[0.04]"
                    : "bg-[#0d0f18] border-white/[0.02] opacity-50"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isUnlocked ? "bg-[#14F195]/10" : "bg-white/[0.03]"}`}>
                      {isUnlocked
                        ? <sec.icon size={18} weight="fill" className="text-[#14F195]" />
                        : <Lock size={16} className="text-neutral-700" />
                      }
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Section {sec.stage}: {sec.label}</h3>
                      <p className="text-[10px] text-neutral-600">{getSubtitle()}</p>
                    </div>
                  </div>
                  {fbStatus && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      fbStatus === "APPROVED" ? "bg-[#14F195]/10 text-[#14F195]" :
                      fbStatus === "PENDING" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                      "bg-red-400/10 text-red-400"
                    }`}>
                      {fbStatus === "APPROVED" ? <CheckCircle size={10} /> : fbStatus === "PENDING" ? <Clock size={10} /> : <XCircle size={10} />}
                      {fbStatus}
                    </span>
                  )}
                </div>

                {/* ── APPROVED: done, no action needed ── */}
                {isUnlocked && fbStatus === "APPROVED" && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#14F195]/[0.04] border border-[#14F195]/10">
                    <CheckCircle size={14} weight="fill" className="text-[#14F195] shrink-0" />
                    <a href={fb.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 font-mono truncate hover:text-[#1DA1F2]">{fb.url}</a>
                  </div>
                )}

                {/* ── PENDING: show submitted URL + edit option + wait message ── */}
                {isUnlocked && fbStatus === "PENDING" && !isEditing && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F59E0B]/[0.04] border border-[#F59E0B]/10">
                      <Clock size={14} weight="fill" className="text-[#F59E0B] shrink-0" />
                      <a href={fb.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 font-mono truncate hover:text-[#1DA1F2] flex-1">{fb.url}</a>
                      <button
                        onClick={() => { setEditingSection(sec.key); setFeedbackUrls(prev => ({ ...prev, [sec.key]: fb.url })); }}
                        className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-bold text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-600 leading-relaxed">
                      ⏳ Your feedback is being reviewed by the team. Please allow up to 24 hours. 
                      Need faster support? Message us in <a href="https://t.me/BlockAiOrg" target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] hover:underline">Telegram</a>.
                    </p>
                  </div>
                )}

                {/* ── PENDING + EDITING: show edit input ── */}
                {isUnlocked && fbStatus === "PENDING" && isEditing && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        value={feedbackUrls[sec.key] || ""}
                        onChange={(e) => setFeedbackUrls(prev => ({ ...prev, [sec.key]: e.target.value }))}
                        placeholder="https://x.com/YourName/status/..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-[#F59E0B]/20 text-white text-xs font-mono placeholder:text-neutral-700 focus:outline-none focus:border-[#F59E0B]/40"
                      />
                      <button
                        onClick={handleEditSave}
                        disabled={loading || !feedbackUrls[sec.key]?.trim()}
                        className="px-3 py-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] font-bold text-xs hover:bg-[#F59E0B]/15 transition-all disabled:opacity-30"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingSection(null); setFeedbackUrls(prev => ({ ...prev, [sec.key]: "" })); }}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-neutral-500 font-bold text-xs hover:bg-white/[0.08] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* ── REJECTED: allow re-submit ── */}
                {isUnlocked && fbStatus === "REJECTED" && (
                  <div className="mt-3 space-y-2">
                    {fb.url && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-400/[0.04] border border-red-400/10">
                        <XCircle size={14} weight="fill" className="text-red-400 shrink-0" />
                        <span className="text-xs text-neutral-500 font-mono truncate">{fb.url}</span>
                        <span className="text-[10px] text-red-400">Rejected</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        value={feedbackUrls[sec.key] || ""}
                        onChange={(e) => setFeedbackUrls(prev => ({ ...prev, [sec.key]: e.target.value }))}
                        placeholder="https://x.com/YourName/status/..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs font-mono placeholder:text-neutral-700 focus:outline-none focus:border-[#14F195]/20"
                      />
                      <button
                        onClick={() => handleSubmitFeedback(sec.key)}
                        disabled={loading || !feedbackUrls[sec.key]?.trim()}
                        className="px-4 py-2 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] font-bold text-xs hover:bg-[#1DA1F2]/15 transition-all disabled:opacity-30"
                      >
                        Re-submit
                      </button>
                    </div>
                  </div>
                )}

                {/* ── NO FEEDBACK YET: show input ── */}
                {isUnlocked && !fbStatus && (
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      value={feedbackUrls[sec.key] || ""}
                      onChange={(e) => setFeedbackUrls(prev => ({ ...prev, [sec.key]: e.target.value }))}
                      placeholder="https://x.com/YourName/status/..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs font-mono placeholder:text-neutral-700 focus:outline-none focus:border-[#14F195]/20"
                    />
                    <button
                      onClick={() => handleSubmitFeedback(sec.key)}
                      disabled={loading || !feedbackUrls[sec.key]?.trim()}
                      className="px-4 py-2 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] font-bold text-xs hover:bg-[#1DA1F2]/15 transition-all disabled:opacity-30"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── REWARDS TABLE ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-lg font-bold text-white mb-4">Rewards & Prizes</h2>
        <div className="rounded-xl bg-[#111318] border border-white/[0.04] overflow-hidden">
          <div className="grid grid-cols-[80px_1fr] gap-4 px-5 py-3 border-b border-white/[0.04]">
            <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Rank</span>
            <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.15em]">Reward</span>
          </div>
          {REWARDS.map((r, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr] gap-4 px-5 py-3 border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
              <span className="text-sm font-bold text-white">{r.rank}</span>
              <span className="text-sm text-neutral-400">{r.prize}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-600 mt-3">
          All participants receive the <span className="text-white font-semibold">OG Role</span> + <span className="text-white font-semibold">Early User</span> badge in Discord.
          Rewards distributed within 72 hours after TGE.
        </p>
      </motion.div>
    </div>
  );
}
