import React, { useState, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import {
  MagnifyingGlass,
  Sparkle,
  CircleNotch,
  Copy,
  Check,
  Cube,
  Coins,
  ArrowRight,
  Lightning,
  ShieldWarning,
  Detective,
  Receipt,
  ArrowsLeftRight,
} from "@phosphor-icons/react";

type Mode = "wallet" | "tx";

const EXAMPLE_WALLETS = [
  { label: "Binance Cold", address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8", tag: "~2M ETH Whale" },
  { label: "Wintermute", address: "0x0000006daea1723962647b7e189d311d757Fb793", tag: "Market Maker" },
  { label: "Kraken", address: "0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0", tag: "Exchange" },
  { label: "Vitalik.eth", address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", tag: "ETH Co-founder" },
];

const EXAMPLE_TXS = [
  { label: "USDT Transfer", hash: "0xb1376c1e116eeba338dcc2da8ad93383b0ea73657bd4611b7202754f83647f58", tag: "Stablecoin" },
  { label: "MEV Bot Trade", hash: "0xfef941abe94fd1a769e209a3953fab4ff7e56bff964e3d491a688a0c639e39dd", tag: "Arbitrage" },
];

interface WalletRawData {
  address: string;
  ethBalance: string;
  txCount: number;
  tokenCount: number;
  tokens: { name: string; symbol: string; lastSeen: string }[];
  internalTxCount: number;
}

interface TxRawData {
  txHash: string;
  from: string;
  to: string;
  value: string;
  status: string;
  gasUsed: string;
  gasCost: string;
  function: string;
  logsCount: number;
  blockNumber: string;
}

export default function WalletIntelPage() {
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState<Mode>("wallet");
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [walletData, setWalletData] = useState<WalletRawData | null>(null);
  const [txData, setTxData] = useState<TxRawData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef(false);

  const WALLET_PHASES = [
    "Fetching on-chain data...",
    "Analyzing transaction history...",
    "Scanning token holdings...",
    "Detecting DeFi interactions...",
    "Generating intelligence report...",
  ];

  const TX_PHASES = [
    "Fetching transaction details...",
    "Parsing receipt & logs...",
    "Identifying function calls...",
    "Generating decoded report...",
  ];

  const phases = mode === "wallet" ? WALLET_PHASES : TX_PHASES;

  const streamText = useCallback((fullText: string) => {
    streamingRef.current = true;
    setIsStreaming(true);
    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;

    const tick = () => {
      if (!streamingRef.current) return;
      const wordsPerTick = Math.ceil(Math.random() * 3) + 1;
      currentIndex = Math.min(currentIndex + wordsPerTick, words.length);
      setReport(words.slice(0, currentIndex).join(""));

      if (currentIndex < words.length) {
        setTimeout(tick, 15 + Math.random() * 25);
      } else {
        streamingRef.current = false;
        setIsStreaming(false);
      }
    };
    tick();
  }, []);

  const handleAnalyze = async () => {
    const val = input.trim();
    if (!val || isLoading) return;

    if (mode === "wallet") {
      if (!/^0x[a-fA-F0-9]{40}$/.test(val)) {
        setError("Invalid Ethereum address. Must be 0x followed by 40 hex characters.");
        return;
      }
    } else {
      if (!/^0x[a-fA-F0-9]{64}$/.test(val)) {
        setError("Invalid transaction hash. Must be 0x followed by 64 hex characters.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setReport("");
    setWalletData(null);
    setTxData(null);
    streamingRef.current = false;

    setLoadingPhase(0);
    const phaseInterval = setInterval(() => {
      setLoadingPhase(p => Math.min(p + 1, phases.length - 1));
    }, 3000);

    try {
      let result: any;

      if (mode === "wallet") {
        result = await api.analyzeWallet(val);
        if (result.rawData) setWalletData(result.rawData);
      } else {
        result = await api.decodeTx(val);
        if (result.rawData) setTxData(result.rawData);
      }

      clearInterval(phaseInterval);
      setIsLoading(false);

      const reportText = result.report || "No report generated.";
      streamText(reportText);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      try {
        const { user: u } = await api.getMe(localStorage.getItem("auth_token") || "");
        if (u) updateUser({ points: u.points });
      } catch {}

    } catch (err: any) {
      clearInterval(phaseInterval);
      setError(err.message || "Analysis failed.");
      setIsLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setInput("");
    setReport("");
    setWalletData(null);
    setTxData(null);
    setError(null);
    streamingRef.current = false;
    setIsStreaming(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0f18] relative">
      {/* Points */}
      <div className="absolute top-4 right-6 z-30">
        <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
          <span className="text-xs font-bold text-white">{user?.points || 0} PTS</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14F195]/[0.06] border border-[#14F195]/10 mb-4">
            <Detective size={14} weight="fill" className="text-[#14F195]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#14F195]/80">
              On-Chain Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Chain Scanner
          </h1>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            Investigate any wallet or decode any transaction with AI-powered analysis.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-xl p-1 flex gap-1">
            <button
              onClick={() => switchMode("wallet")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "wallet"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Detective size={16} weight={mode === "wallet" ? "fill" : "regular"} />
              Wallet Scanner
            </button>
            <button
              onClick={() => switchMode("tx")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "tx"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Receipt size={16} weight={mode === "tx" ? "fill" : "regular"} />
              Tx Decoder
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4">
            <MagnifyingGlass size={20} className="text-neutral-500 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder={
                mode === "wallet"
                  ? "0x... Enter any Ethereum wallet address"
                  : "0x... Enter any transaction hash"
              }
              className="flex-1 bg-transparent text-white text-sm font-mono placeholder:text-neutral-600 focus:outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shrink-0 ${
                !input.trim() || isLoading
                  ? "bg-white/5 text-neutral-600 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10"
              }`}
            >
              {isLoading ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : mode === "wallet" ? (
                <><Detective size={16} weight="bold" />Scan</>
              ) : (
                <><Receipt size={16} weight="bold" />Decode</>
              )}
            </button>
          </div>

          {/* Quick picks */}
          <div className="flex items-center gap-2 px-5 py-3 border-t border-white/[0.04] bg-white/[0.01] overflow-x-auto">
            <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-bold shrink-0">Try:</span>
            {mode === "wallet"
              ? EXAMPLE_WALLETS.map((w) => (
                  <button
                    key={w.address}
                    onClick={() => setInput(w.address)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-[#14F195]/30 hover:bg-[#14F195]/[0.03] transition-all text-[11px]"
                  >
                    <span className="text-white font-semibold">{w.label}</span>
                    <span className="text-neutral-600">· {w.tag}</span>
                  </button>
                ))
              : EXAMPLE_TXS.map((t) => (
                  <button
                    key={t.hash}
                    onClick={() => setInput(t.hash)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-[#9945FF]/30 hover:bg-[#9945FF]/[0.03] transition-all text-[11px]"
                  >
                    <span className="text-white font-semibold">{t.label}</span>
                    <span className="text-neutral-600">· {t.hash.substring(0, 10)}...</span>
                  </button>
                ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
            <ShieldWarning size={20} className="text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl p-10 mb-6">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-[#14F195]/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#14F195] animate-spin" />
                <div className="absolute inset-3 rounded-full border border-[#14F195]/10" />
                <div className="absolute inset-3 rounded-full border border-transparent border-t-[#9945FF] animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  {mode === "wallet" ? (
                    <Detective size={28} weight="duotone" className="text-[#14F195]" />
                  ) : (
                    <Receipt size={28} weight="duotone" className="text-[#9945FF]" />
                  )}
                </div>
              </div>
              <div className="text-center max-w-sm">
                <p className="text-white font-semibold mb-3">
                  {mode === "wallet" ? "Scanning Wallet" : "Decoding Transaction"}
                </p>
                <div className="space-y-2">
                  {phases.map((phase, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                      i < loadingPhase ? "text-[#14F195]" : i === loadingPhase ? "text-white" : "text-neutral-700"
                    }`}>
                      {i < loadingPhase ? (
                        <Check size={12} weight="bold" className="text-[#14F195]" />
                      ) : i === loadingPhase ? (
                        <CircleNotch size={12} className="animate-spin" />
                      ) : (
                        <div className="w-3 h-3" />
                      )}
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-neutral-600">
                {mode === "wallet" ? "This may take 15-30 seconds" : "This may take 10-20 seconds"}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats — Wallet */}
        {walletData && !isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "ETH Balance", value: `${walletData.ethBalance} ETH`, icon: Coins, color: "#14F195" },
              { label: "Transactions", value: `${walletData.txCount}+`, icon: ArrowRight, color: "#9945FF" },
              { label: "Tokens Found", value: String(walletData.tokenCount), icon: Cube, color: "#3B82F6" },
              { label: "Internal Txns", value: String(walletData.internalTxCount), icon: Lightning, color: "#F59E0B" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#13151C]/60 border border-white/[0.06] rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} weight="fill" style={{ color: stat.color }} />
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-white font-mono">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats — Tx */}
        {txData && !isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Status", value: txData.status, icon: Check, color: txData.status === "SUCCESS" ? "#14F195" : "#EF4444" },
              { label: "Value", value: txData.value, icon: Coins, color: "#9945FF" },
              { label: "Gas Cost", value: txData.gasCost, icon: Lightning, color: "#F59E0B" },
              { label: "Function", value: txData.function.split("(")[0] || txData.function, icon: ArrowsLeftRight, color: "#3B82F6" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#13151C]/60 border border-white/[0.06] rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} weight="fill" style={{ color: stat.color }} />
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">{stat.label}</span>
                </div>
                <p className="text-sm font-bold text-white font-mono truncate">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Report */}
        {(report || isStreaming) && (
          <div ref={resultRef} className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                {mode === "wallet" ? (
                  <Detective size={16} weight="fill" className="text-[#14F195]" />
                ) : (
                  <Receipt size={16} weight="fill" className="text-[#9945FF]" />
                )}
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {mode === "wallet" ? "Intelligence Report" : "Decoded Transaction"}
                </span>
                {isStreaming && (
                  <span className="text-[10px] text-[#14F195] font-mono animate-pulse">analyzing...</span>
                )}
              </div>
              {report && !isStreaming && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {copied ? (
                    <><Check size={12} className="text-[#14F195]" /><span className="text-[#14F195]">Copied</span></>
                  ) : (
                    <><Copy size={12} />Copy</>
                  )}
                </button>
              )}
            </div>

            <div className="px-6 py-6 max-h-[700px] overflow-y-auto
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-700
              [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="prose prose-invert max-w-none text-sm
                prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-3
                prose-strong:text-white prose-strong:font-bold
                prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-5
                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                prose-ul:my-2 prose-ol:my-2
                prose-li:text-gray-200 prose-li:leading-relaxed prose-li:mb-1
                prose-code:text-[#14F195] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
                prose-pre:bg-[#0a0c14] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3
                prose-a:text-[#14F195] prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-[#14F195] prose-blockquote:text-gray-400 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                prose-hr:border-white/10
                prose-th:text-left prose-th:text-white prose-th:border-b prose-th:border-white/10 prose-th:px-3 prose-th:py-2
                prose-td:text-gray-300 prose-td:border-b prose-td:border-white/5 prose-td:px-3 prose-td:py-2
              ">
                <ReactMarkdown>{report}</ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-2 h-5 bg-[#14F195] rounded-sm ml-0.5 animate-pulse" />
                )}
              </div>
            </div>

            {report && !isStreaming && (
              <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle size={12} weight="fill" className="text-[#9945FF]" />
                  <span className="text-[11px] text-neutral-500">
                    +{mode === "wallet" ? "25" : "15"} points earned
                  </span>
                </div>
                <span className="text-[11px] text-neutral-600 font-mono">
                  {input.substring(0, 10)}...{input.substring(input.length - 4)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!report && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#14F195]/5 border border-[#14F195]/10 flex items-center justify-center mx-auto mb-4">
              {mode === "wallet" ? (
                <Detective size={28} weight="duotone" className="text-[#14F195]/50" />
              ) : (
                <Receipt size={28} weight="duotone" className="text-[#9945FF]/50" />
              )}
            </div>
            <p className="text-neutral-600 text-sm mb-1">
              {mode === "wallet"
                ? "Enter an Ethereum address to begin"
                : "Enter a transaction hash to decode"
              }
            </p>
            <p className="text-neutral-700 text-xs">
              {mode === "wallet"
                ? "Get AI-powered analysis of any wallet's on-chain activity"
                : "Get a plain-English explanation of what any transaction did"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
