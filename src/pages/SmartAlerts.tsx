import React, { useState } from "react";
import {
  Bell,
  Plus,
  Pause,
  Play,
  Trash,
  Lightning,
  CurrencyEth,
  Wallet,
  ChartLineUp,
  ShieldWarning,
  Check,
  Sparkle,
  Robot,
  TelegramLogo,
  DiscordLogo,
  WhatsappLogo,
  ArrowRight,
  Gear,
  Eye,
  Timer,
  Globe,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

interface Alert {
  id: string;
  name: string;
  type: "price" | "wallet" | "gas" | "whale";
  condition: string;
  value: string;
  status: "active" | "paused" | "triggered";
  createdAt: string;
  triggeredAt?: string;
  icon: typeof Bell;
  color: string;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: "1", name: "ETH Price Drop", type: "price",
    condition: "ETH drops below", value: "$2,000",
    status: "active", createdAt: "2h ago",
    icon: CurrencyEth, color: "#14F195",
  },
  {
    id: "2", name: "Binance Cold Wallet", type: "wallet",
    condition: "0xBE0e...33E8 transfers >", value: "100 ETH",
    status: "active", createdAt: "1d ago",
    icon: Wallet, color: "#9945FF",
  },
  {
    id: "3", name: "Low Gas Window", type: "gas",
    condition: "Gas drops below", value: "10 Gwei",
    status: "triggered", createdAt: "3d ago", triggeredAt: "5 min ago",
    icon: Lightning, color: "#F59E0B",
  },
  {
    id: "4", name: "BTC $100K Breakout", type: "price",
    condition: "BTC rises above", value: "$100,000",
    status: "paused", createdAt: "1w ago",
    icon: ChartLineUp, color: "#3B82F6",
  },
  {
    id: "5", name: "Vitalik Activity", type: "wallet",
    condition: "0xd8dA...6045 any", value: "outgoing tx",
    status: "active", createdAt: "5d ago",
    icon: Eye, color: "#14F195",
  },
  {
    id: "6", name: "Whale DEX Swap", type: "whale",
    condition: "Uniswap swap >", value: "$500K",
    status: "triggered", createdAt: "2d ago", triggeredAt: "1h ago",
    icon: ShieldWarning, color: "#EF4444",
  },
];

const ALERT_TYPES = [
  { value: "price", label: "Price Alert", icon: CurrencyEth, color: "#14F195", desc: "Token hits a price target" },
  { value: "wallet", label: "Wallet Watch", icon: Eye, color: "#9945FF", desc: "Monitor wallet activity" },
  { value: "gas", label: "Gas Tracker", icon: Lightning, color: "#F59E0B", desc: "Low gas fee windows" },
  { value: "whale", label: "Whale Alert", icon: ShieldWarning, color: "#EF4444", desc: "Large on-chain moves" },
];

export default function SmartAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [showCreate, setShowCreate] = useState(false);

  const activeCount = alerts.filter(a => a.status === "active").length;
  const triggeredCount = alerts.filter(a => a.status === "triggered").length;

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === "active" ? "paused" as const : "active" as const } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0f18] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#14F195]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9945FF]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Points */}
      <div className="absolute top-4 right-6 z-30">
        <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
          <span className="text-xs font-bold text-white">{user?.points || 0} PTS</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 pt-16 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/[0.08] border border-[#F59E0B]/15 mb-3">
              <Bell size={12} weight="fill" className="text-[#F59E0B]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]/80">
                AI Agent · Always On
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1.5 tracking-tight">
              Smart Alerts
            </h1>
            <p className="text-neutral-500 text-sm max-w-md">
              Your autonomous AI agent monitors prices, wallets, gas, and whales 24/7.
            </p>
          </div>

          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-3 bg-[#13151C]/80 border border-white/[0.06] rounded-xl px-4 py-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-[#14F195]" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#14F195] animate-ping opacity-40" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Agent Running</p>
              <p className="text-[10px] text-neutral-500">{activeCount} alerts active</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Rules", value: alerts.length, color: "#fff", bg: "white/[0.03]" },
            { label: "Active", value: activeCount, color: "#14F195", bg: "[#14F195]/[0.04]" },
            { label: "Triggered", value: triggeredCount, color: "#F59E0B", bg: "[#F59E0B]/[0.04]" },
            { label: "Channels", value: "3", color: "#9945FF", bg: "[#9945FF]/[0.04]" },
          ].map((s, i) => (
            <div key={i} className={`bg-${s.bg} border border-white/[0.06] rounded-xl px-4 py-3`}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ═══════════ OpenClaw Integration Banner ═══════════ */}
        <div className="mb-8 relative overflow-hidden rounded-2xl border border-[#9945FF]/20 bg-gradient-to-r from-[#9945FF]/[0.06] via-[#13151C]/80 to-[#14F195]/[0.06]">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />

          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Left — Icon + Brand */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#9945FF]/15 border border-[#9945FF]/20 flex items-center justify-center">
                  <Robot size={26} weight="duotone" className="text-[#9945FF]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">OpenClaw Integration</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text border border-[#9945FF]/20 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">Autonomous AI agents on every messaging platform</p>
                </div>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed mb-4 max-w-lg">
                Receive real-time alert notifications through your favorite messaging apps.
                OpenClaw's AI agents will execute actions, monitor positions, and manage your
                portfolio autonomously — all from a simple chat message.
              </p>

              {/* Channel badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { icon: TelegramLogo, label: "Telegram", color: "#229ED9" },
                  { icon: WhatsappLogo, label: "WhatsApp", color: "#25D366" },
                  { icon: DiscordLogo, label: "Discord", color: "#5865F2" },
                ].map((ch) => (
                  <div
                    key={ch.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                  >
                    <ch.icon size={14} weight="fill" style={{ color: ch.color }} />
                    <span className="text-[11px] text-neutral-400 font-medium">{ch.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Feature list */}
            <div className="shrink-0 space-y-2.5 w-full md:w-auto">
              {[
                { icon: Globe, text: "Multi-platform notifications" },
                { icon: Robot, text: "Autonomous trade execution" },
                { icon: Timer, text: "24/7 real-time monitoring" },
                { icon: Gear, text: "Custom agent workflows" },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#14F195]/10 flex items-center justify-center">
                    <feat.icon size={13} weight="fill" className="text-[#14F195]" />
                  </div>
                  <span className="text-xs text-neutral-300">{feat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Alert */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              showCreate
                ? "bg-white/5 border border-white/10 text-white"
                : "border border-dashed border-white/10 hover:border-[#14F195]/30 hover:bg-[#14F195]/[0.02] text-neutral-500 hover:text-[#14F195]"
            }`}
          >
            {showCreate ? <Check size={16} /> : <Plus size={16} weight="bold" />}
            {showCreate ? "Close" : "Create New Alert"}
          </button>

          {showCreate && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {ALERT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setShowCreate(false)}
                  className="group p-4 rounded-xl border border-white/[0.06] bg-[#13151C]/60 hover:bg-white/[0.03] transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-[0.06]" style={{ backgroundColor: t.color }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${t.color}15` }}>
                    <t.icon size={22} weight="duotone" style={{ color: t.color }} />
                  </div>
                  <p className="text-sm font-semibold text-white mb-0.5">{t.label}</p>
                  <p className="text-[11px] text-neutral-600 leading-snug">{t.desc}</p>
                  <ArrowRight size={14} className="absolute bottom-4 right-4 text-neutral-700 group-hover:text-white/30 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Your Alerts</h3>
            <span className="text-[10px] text-neutral-600">{alerts.length} rules</span>
          </div>

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`group bg-[#13151C]/60 border rounded-xl px-5 py-4 flex items-center gap-4 transition-all hover:bg-[#13151C]/80 ${
                alert.status === "triggered"
                  ? "border-[#F59E0B]/20"
                  : alert.status === "paused"
                  ? "border-white/[0.04] opacity-50 hover:opacity-70"
                  : "border-white/[0.06]"
              }`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${alert.color}12` }}
              >
                <alert.icon size={20} weight="duotone" style={{ color: alert.color }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white truncate">{alert.name}</p>
                  {alert.status === "triggered" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 flex items-center gap-1">
                      <Lightning size={8} weight="fill" />Triggered
                    </span>
                  )}
                  {alert.status === "active" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20">
                      Active
                    </span>
                  )}
                  {alert.status === "paused" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-500 border border-white/10">
                      Paused
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {alert.condition} <span className="text-white font-semibold">{alert.value}</span>
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-neutral-600">{alert.createdAt}</span>
                  {alert.triggeredAt && (
                    <span className="text-[10px] text-[#F59E0B] flex items-center gap-1">
                      <Lightning size={8} weight="fill" />{alert.triggeredAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
                  title={alert.status === "active" ? "Pause" : "Resume"}
                >
                  {alert.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {alerts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#F59E0B]/5 border border-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
              <Bell size={28} weight="duotone" className="text-[#F59E0B]/50" />
            </div>
            <p className="text-neutral-600 text-sm mb-1">No alerts set up yet</p>
            <p className="text-neutral-700 text-xs">Create your first alert to start monitoring</p>
          </div>
        )}
      </div>
    </div>
  );
}
