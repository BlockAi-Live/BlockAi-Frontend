import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MessageSquare, TrendingUp, Bell, Zap, Eye } from "lucide-react";

/* ════════════════════════════════════════════════════
   BENTO GRID
   4-col layout with varied row-spans for visual rhythm

   ┌──────────┬───────────────────┬──────────┐
   │  Chat    │   Token Search    │  Stat    │
   │  (tall)  │   (wide)          │  (small) │
   │          ├───────────────────┼──────────┤
   │          │   Chart           │ Alerts   │
   │          │   (wide+visual)   │ (small)  │
   └──────────┴───────────────────┴──────────┘
   ════════════════════════════════════════════════════ */

export default function FeaturesGrid() {
  return (
    <div className="mt-14 px-6 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[200px_200px] gap-3">
        {/* Chat — tall left */}
        <Card className="md:row-span-2">
          <ChatWidget />
        </Card>

        {/* Token search — wide top center */}
        <Card className="md:col-span-2">
          <TokenSearchWidget />
        </Card>

        {/* Stat pill — small top right */}
        <Card>
          <StatWidget />
        </Card>

        {/* Chart — wide bottom center */}
        <Card className="md:col-span-2">
          <ChartWidget />
        </Card>

        {/* Alerts — small bottom right */}
        <Card>
          <AlertWidget />
        </Card>
      </div>
    </div>
  );
}

/* ── Card shell ── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-5 overflow-hidden relative group hover:border-neutral-700/50 transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
}

/* ═══ 1. Chat — minimal, one input ═══ */
function ChatWidget() {
  const [msgs, setMsgs] = useState([
    { from: "you", text: "What's trending on Solana?" },
    { from: "ai", text: "BONK is up 42% — 3 whale wallets accumulated 2.1M tokens in the last hour." },
    { from: "you", text: "Any new pools?" },
    { from: "ai", text: "POPCAT/SOL launched 12m ago with $2.1M TVL. Early LP yield is 340% APR." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    setMsgs((m) => [...m, { from: "you", text: input.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "ai", text: "Found 3 wallets with significant activity matching your query." }]);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-[#14F195]" />
        <span className="text-xs font-semibold text-neutral-400">AI CHAT</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14F195]" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none min-h-0">
        {msgs.map((m, i) => (
          <div key={i} className={`text-[11px] leading-relaxed py-2 px-3 rounded-lg max-w-[90%] ${
            m.from === "you"
              ? "ml-auto bg-[#14F195]/8 border border-[#14F195]/15 text-neutral-300"
              : "bg-neutral-800/40 text-neutral-400"
          }`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="flex gap-1 py-2 px-3 bg-neutral-800/40 rounded-lg w-fit">
            <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" />
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          className="flex-1 bg-neutral-800/30 border border-neutral-800 rounded-lg py-2 px-3 text-[11px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
        />
        <button onClick={send} className="p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors">
          <Send className="w-3 h-3 text-[#14F195]" />
        </button>
      </div>
    </div>
  );
}

/* ═══ 2. Token Search — search + live results ═══ */
const tokens = [
  { sym: "BONK", price: "$0.000034", chg: "+42.1%", up: true },
  { sym: "WIF", price: "$2.84", chg: "+28.3%", up: true },
  { sym: "SOL", price: "$187.42", chg: "+5.2%", up: true },
  { sym: "JTO", price: "$3.21", chg: "-2.1%", up: false },
];

function TokenSearchWidget() {
  const [q, setQ] = useState("");
  const filtered = tokens.filter((t) => t.sym.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-[#9945FF]" />
        <span className="text-xs font-semibold text-neutral-400">TOKEN SEARCH</span>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-600" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tokens..."
          className="w-full bg-neutral-800/30 border border-neutral-800 rounded-lg py-1.5 pl-7 pr-3 text-[11px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
        <AnimatePresence mode="popLayout">
          {filtered.map((t) => (
            <motion.div
              key={t.sym}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                  {t.sym[0]}
                </div>
                <span className="text-[11px] font-medium text-neutral-300">{t.sym}</span>
                <span className="text-[10px] text-neutral-600">{t.price}</span>
              </div>
              <span className={`text-[10px] font-semibold ${t.up ? "text-[#14F195]" : "text-red-400"}`}>{t.chg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ 3. Stat — single big number ═══ */
function StatWidget() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame: number;
    const target = 12847;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#14F195]" />
        <span className="text-xs font-semibold text-neutral-400">TRACKED</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{count.toLocaleString()}</p>
        <p className="text-[11px] text-neutral-600 mt-1">Wallets monitored</p>
      </div>
    </div>
  );
}

/* ═══ 4. Portfolio — chart + compact holdings ═══ */
function ChartWidget() {
  const data = [30, 42, 35, 58, 48, 72, 55, 80, 68, 90, 75, 95, 82, 100, 88, 97];
  const w = 500, h = 100;
  const xStep = w / (data.length - 1);
  const max = Math.max(...data), min = Math.min(...data);
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const pts = data.map((v, i) => `${i * xStep},${y(v)}`).join(" ");
  const area = `0,${h} ${pts} ${(data.length - 1) * xStep},${h}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#14F195]" />
          <span className="text-xs font-semibold text-neutral-400">PORTFOLIO</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-white">$17,530</span>
          <span className="text-[10px] text-[#14F195] font-semibold ml-1.5">+12.8%</span>
        </div>
      </div>

      {/* Chart — takes up most space */}
      <div className="flex-1 min-h-0 relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14F195" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#14F195" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#pFill)" />
          <polyline points={pts} fill="none" stroke="#14F195" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>

      {/* Compact token row */}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-neutral-800/40">
        {[
          { sym: "SOL", chg: "+5.2%", up: true },
          { sym: "BONK", chg: "+42%", up: true },
          { sym: "JTO", chg: "-2.1%", up: false },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={`w-1 h-1 rounded-full ${t.up ? "bg-[#14F195]" : "bg-red-400"}`} />
            <span className="text-[10px] text-neutral-500">{t.sym}</span>
            <span className={`text-[10px] font-semibold ${t.up ? "text-[#14F195]" : "text-red-400"}`}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ 5. Alerts — compact list ═══ */
const alerts = [
  { text: "Whale moved 500K SOL", time: "2s", color: "#14F195" },
  { text: "BONK breakout signal", time: "12s", color: "#9945FF" },
  { text: "New pool: POPCAT/SOL", time: "1m", color: "#1DA1F2" },
];

function AlertWidget() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-red-400" />
        <span className="text-xs font-semibold text-neutral-400">ALERTS</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      </div>
      <div className="flex-1 space-y-2 min-h-0">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
            <div>
              <p className="text-[11px] text-neutral-400 leading-tight">{a.text}</p>
              <p className="text-[9px] text-neutral-700">{a.time} ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
