import React, { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import {
  ShieldCheck,
  Code,
  ArrowRight,
  Sparkle,
  CircleNotch,
  Copy,
  Check,
  Eraser,
  DownloadSimple,
  FileCode,
  ClockCounterClockwise,
  FileArrowDown,
  Warning,
} from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";
import { Highlight, themes } from "prism-react-renderer";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-dark.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "audit" | "generate";

const MODES = [
  {
    id: "audit" as Mode,
    label: "Audit",
    icon: ShieldCheck,
    description: "Analyze for vulnerabilities",
    color: "#14F195",
    placeholder: `// Paste your smart contract code here or drop a .sol file...\n// Example:\npragma solidity ^0.8.0;\n\ncontract MyToken {\n    mapping(address => uint256) public balances;\n    \n    function transfer(address to, uint256 amount) public {\n        balances[msg.sender] -= amount;\n        balances[to] += amount;\n    }\n}`,
  },
  {
    id: "generate" as Mode,
    label: "Generate",
    icon: Code,
    description: "Create from description",
    color: "#9945FF",
    placeholder: `Describe the smart contract you want to generate...\n\nExample:\nCreate an ERC-20 token called "BlockAI Token" (BKAI) with:\n- 1 billion total supply\n- Owner can mint and burn\n- Transfer fee of 2% to a treasury wallet\n- Pausable by owner\n- OpenZeppelin standards`,
  },
];

const EXAMPLES = {
  audit: `pragma solidity ^0.8.0;

contract VulnerableToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}

// Missing: Reentrancy guard, overflow checks, access control`,
  generate: `Create an ERC-20 token called "BlockAI Token" (BKAI) with:
- 1 billion total supply
- Owner can mint and burn
- Transfer fee of 2% to a treasury wallet
- Pausable by owner
- OpenZeppelin standards`,
};

const TEMPLATES = [
  { id: "erc20", name: "ERC-20 Token", prompt: `Create a standard ERC-20 token with:\n- Mintable and burnable by owner\n- Pausable\n- 18 decimals\n- OpenZeppelin v4` },
  { id: "erc721", name: "ERC-721 NFT", prompt: `Create an ERC-721 NFT collection with:\n- Minting by owner\n- Max supply limit\n- Base URI for metadata\n- OpenZeppelin standards` },
  { id: "staking", name: "Staking Contract", prompt: `Create a staking contract with:\n- Stake tokens and earn rewards\n- Configurable APR\n- Unstake with cooldown\n- Emergency withdraw` },
  { id: "vesting", name: "Token Vesting", prompt: `Create a token vesting contract with:\n- Linear vesting over configurable period\n- Cliff period\n- Revocable by owner` },
  { id: "dao", name: "DAO Governance", prompt: `Create a simple DAO governance contract with:\n- Proposal creation\n- Voting with token weight\n- Timelock for execution\n- Quorum requirement` },
];

const HISTORY_KEY = "smart_contracts_history";
const MAX_HISTORY = 20;

type HistoryEntry = {
  id: string;
  mode: Mode;
  input: string;
  result: string;
  timestamp: number;
};

function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entry: Omit<HistoryEntry, "id" | "timestamp">) {
  const history = getHistory();
  const newEntry: HistoryEntry = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";
const SEVERITY_STYLES: Record<SeverityLevel, { color: string; bg: string; border: string }> = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)" },
  medium: { color: "#eab308", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)" },
  low: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
  info: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)" },
};

function parseSeverity(text: string): SeverityLevel | null {
  const lower = text.toLowerCase();
  if (lower.includes("critical") || lower.includes("🔴")) return "critical";
  if (lower.includes("high") || lower.includes("🟠")) return "high";
  if (lower.includes("medium") || lower.includes("🟡")) return "medium";
  if (lower.includes("low") || lower.includes("🟢")) return "low";
  if (lower.includes("info") || lower.includes("ℹ️")) return "info";
  return null;
}

function getPrismLang(className?: string): string {
  if (!className) return "javascript";
  const m = className.match(/language-(\w+)/);
  if (!m) return "javascript";
  const lang = m[1].toLowerCase();
  if (lang === "sol" || lang === "solidity") return "solidity";
  return Prism.languages[lang] ? lang : "javascript";
}

function CodeBlockWrapper({ children, className, onCopy }: { children?: string; className?: string; onCopy: () => void }) {
  const [blockCopied, setBlockCopied] = useState(false);
  const code = String(children || "").replace(/\n$/, "");
  const lang = getPrismLang(className);
  const copyBlock = async () => {
    await navigator.clipboard.writeText(code);
    setBlockCopied(true);
    onCopy();
    setTimeout(() => setBlockCopied(false), 2000);
  };
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0c14]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[11px] font-medium text-neutral-500 uppercase">{lang}</span>
        <button onClick={copyBlock} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-[#14F195] hover:bg-white/5 rounded-lg transition-colors">
          {blockCopied ? <><Check size={14} className="text-[#14F195]" />Copied</> : <><Copy size={14} />Copy</>}
        </button>
      </div>
      <div className="overflow-x-auto">
        <Highlight theme={themes.vsDark} code={code} language={lang} prism={Prism}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="!m-0 !p-4 !bg-transparent text-[13px] font-mono leading-[1.6]" style={style}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-8 text-right pr-4 text-neutral-600 select-none">{i + 1}</span>
                    {line.map((token, k) => (
                      <span key={k} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export default function SmartContractsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("audit");
  const [auditInput, setAuditInput] = useState("");
  const [auditResult, setAuditResult] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditStreaming, setAuditStreaming] = useState(false);
  const [generateInput, setGenerateInput] = useState("");
  const [generateResult, setGenerateResult] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateStreaming, setGenerateStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const auditStreamRef = useRef(false);
  const generateStreamRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLDivElement | null>(null);

  const currentMode = MODES.find((m) => m.id === mode)!;
  const input = mode === "audit" ? auditInput : generateInput;
  const setInput = mode === "audit" ? setAuditInput : setGenerateInput;
  const result = mode === "audit" ? auditResult : generateResult;
  const isLoading = mode === "audit" ? auditLoading : generateLoading;
  const isStreaming = mode === "audit" ? auditStreaming : generateStreaming;

  useEffect(() => setHistory(getHistory()), []);

  const scrollToResult = () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => { if (result) scrollToResult(); }, [result]);

  const streamText = useCallback((fullText: string, targetMode: Mode) => {
    const isAudit = targetMode === "audit";
    if (isAudit) {
      auditStreamRef.current = true;
      setAuditStreaming(true);
    } else {
      generateStreamRef.current = true;
      setGenerateStreaming(true);
    }
    const words = fullText.split(/(\s+)/);
    let i = 0;
    const setResult = isAudit ? setAuditResult : setGenerateResult;
    const streamRef = isAudit ? auditStreamRef : generateStreamRef;
    const setStreaming = isAudit ? setAuditStreaming : setGenerateStreaming;
    const tick = () => {
      if (!streamRef.current) return;
      i = Math.min(i + Math.ceil(Math.random() * 3) + 1, words.length);
      setResult(words.slice(0, i).join(""));
      if (i < words.length) setTimeout(tick, 15 + Math.random() * 25);
      else { streamRef.current = false; setStreaming(false); }
    };
    tick();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const isAudit = mode === "audit";
    if (isAudit) {
      setAuditLoading(true);
      setAuditResult("");
      auditStreamRef.current = false;
    } else {
      setGenerateLoading(true);
      setGenerateResult("");
      generateStreamRef.current = false;
    }
    try {
      const response = await api.smartContract({ content: input, mode });
      const answer = response.answer || "No response received.";
      if (isAudit) setAuditLoading(false);
      else setGenerateLoading(false);
      streamText(answer, mode);
      saveHistory({ mode, input, result: answer });
      setHistory(getHistory());
      try {
        const { user: u } = await api.getMe(localStorage.getItem("auth_token") || "");
        if (u) updateUser({ points: u.points });
      } catch {}
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      if (isAudit) {
        setAuditResult("❌ " + errMsg);
        setAuditLoading(false);
      } else {
        setGenerateResult("❌ " + errMsg);
        setGenerateLoading(false);
      }
    }
  };

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmitRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast({ description: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (mode === "audit") {
      setAuditInput("");
      setAuditResult("");
      auditStreamRef.current = false;
      setAuditStreaming(false);
    } else {
      setGenerateInput("");
      setGenerateResult("");
      generateStreamRef.current = false;
      setGenerateStreaming(false);
    }
    (inputRef.current as HTMLTextAreaElement)?.focus?.();
  };

  const handleLoadExample = () => {
    setInput(EXAMPLES[mode]);
    if (mode === "audit") setAuditResult("");
    else setGenerateResult("");
    toast({ description: "Example loaded" });
  };

  const handleLoadTemplate = (t: (typeof TEMPLATES)[0]) => {
    setMode("generate");
    setGenerateInput(t.prompt);
    setGenerateResult("");
    setShowTemplates(false);
    toast({ description: "Template loaded" });
  };

  const handleLoadHistory = (e: HistoryEntry) => {
    setMode(e.mode);
    if (e.mode === "audit") {
      setAuditInput(e.input);
      setAuditResult(e.result);
    } else {
      setGenerateInput(e.input);
      setGenerateResult(e.result);
    }
    setShowHistory(false);
  };

  const handleExport = () => {
    const ext = mode === "audit" ? "md" : "sol";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([result], { type: "text/plain" }));
    a.download = `smart-contract-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast({ description: "Downloaded" });
  };

  const readFile = (file: File) => {
    const r = new FileReader();
    r.onload = (e) => { const t = e.target?.result as string; if (t) setInput(t); };
    r.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".sol") || f.name.endsWith(".rs") || f.type === "text/plain")) {
      readFile(f);
      toast({ description: "File loaded" });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    for (const item of Array.from(e.clipboardData?.items || [])) {
      if (item.kind === "file") {
        const f = item.getAsFile();
        if (f && (f.name.endsWith(".sol") || f.name.endsWith(".rs"))) {
          e.preventDefault();
          e.stopPropagation();
          readFile(f);
          toast({ description: "File pasted" });
          break;
        }
      }
    }
  };

  const charCount = mode === "generate" ? input.split(/\s+/).filter(Boolean).length : input.length;
  const countLabel = mode === "generate" ? "words" : "chars";

  const renderHeading = (Tag: "h1" | "h2" | "h3", props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === "string" ? props.children : String(React.Children.toArray(props.children).join(""));
    const sev = parseSeverity(text);
    if (!sev) return <Tag {...props} />;
    const s = SEVERITY_STYLES[sev];
    return (
      <Tag {...props} className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase"
          style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
        >
          <Warning size={12} weight="fill" />
          {sev}
        </span>
        <span>{props.children}</span>
      </Tag>
    );
  };

  const mdComponents = {
    pre: ({ children }: { children?: React.ReactNode }) => {
      const el = React.Children.toArray(children)[0] as React.ReactElement & { props?: { className?: string; children?: string } };
      if (el?.props?.className?.includes?.("language-") && typeof el?.props?.children === "string") {
        return <CodeBlockWrapper className={el.props.className} onCopy={() => toast({ description: "Copied" })}>{el.props.children}</CodeBlockWrapper>;
      }
      return <pre>{children}</pre>;
    },
    h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => renderHeading("h1", p),
    h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => renderHeading("h2", p),
    h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => renderHeading("h3", p),
  };

  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-4rem)] bg-[#0d0f18] relative">
        <div className="absolute top-4 right-6 z-30">
          <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
            <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
            <span className="text-xs font-bold text-white">{user?.points || 0} PTS</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 pt-14">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Smart Contract Tools</h1>
            <p className="text-neutral-500 text-sm max-w-md mx-auto">Audit your contracts for vulnerabilities or generate new ones from a description.</p>
          </div>

          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-[#13151C] border border-white/[0.06] rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1">
              {MODES.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active ? "bg-white text-black shadow-lg shadow-white/5" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"}`}
                  >
                    <m.icon size={18} weight={active ? "fill" : "regular"} className={active ? "text-black" : ""} />
                    <span>{m.label}</span>
                    <span className="hidden sm:inline text-[10px] font-normal text-neutral-600">{m.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`rounded-2xl border overflow-hidden mb-6 transition-all ${isDragging ? "border-[#14F195]/50 bg-[#14F195]/5" : "bg-[#13151C]/60 border-white/[0.06]"}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); mode === "audit" && setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.04] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMode.color }} />
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {mode === "audit" ? "Contract Code" : "Contract Description"}
                </span>
                {mode === "audit" && <span className="text-[10px] text-neutral-600 hidden sm:inline">• Drop .sol file</span>}
                {mode === "generate" && (
                  <div className="relative">
                    <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-[#9945FF] hover:bg-white/5 rounded-lg">
                      <FileCode size={12} />Templates
                    </button>
                    {showTemplates && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
                        <div className="absolute left-0 top-full mt-1 z-50 w-56 bg-[#13151C] border border-white/10 rounded-xl shadow-xl">
                          {TEMPLATES.map((t) => (
                            <button key={t.id} onClick={() => handleLoadTemplate(t)} className="w-full text-left px-4 py-2.5 hover:bg-white/5 border-b border-white/5 last:border-0 text-sm text-white">
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleLoadExample} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-[#14F195] hover:bg-white/5 rounded-lg">Load example</button>
                  </TooltipTrigger>
                  <TooltipContent>Load a sample</TooltipContent>
                </Tooltip>
                {history.length > 0 && (
                  <div className="relative">
                    <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-[#9945FF] hover:bg-white/5 rounded-lg">
                      <ClockCounterClockwise size={12} />History
                    </button>
                    {showHistory && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 w-72 max-h-56 overflow-y-auto bg-[#13151C] border border-white/10 rounded-xl shadow-xl">
                          {history.map((e) => (
                            <button key={e.id} onClick={() => handleLoadHistory(e)} className="w-full text-left px-4 py-2.5 hover:bg-white/5 border-b border-white/5 last:border-0">
                              <div className="text-xs font-medium text-white truncate">{e.mode === "audit" ? "Audit" : "Generate"} • {new Date(e.timestamp).toLocaleDateString()}</div>
                              <div className="text-[11px] text-neutral-500 truncate">{e.input.slice(0, 50)}...</div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {input && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={handleClear} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg"><Eraser size={12} />Clear</button>
                    </TooltipTrigger>
                    <TooltipContent>Clear input</TooltipContent>
                  </Tooltip>
                )}
                <span className="text-[11px] text-neutral-600 font-mono">{charCount} {countLabel}</span>
              </div>
            </div>

            {mode === "audit" ? (
              <div ref={inputRef as React.RefObject<HTMLDivElement>} className="relative min-h-[260px]" onPaste={handlePaste}>
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0d0f18]/90 z-10 rounded-b-2xl">
                    <div className="flex flex-col items-center gap-2 text-[#14F195]">
                      <FileArrowDown size={36} weight="duotone" />
                      <span className="text-sm font-medium">Drop .sol file here</span>
                    </div>
                  </div>
                )}
                <Editor
                  value={input}
                  onValueChange={setInput}
                  highlight={(code) => Prism.highlight(code, Prism.languages.solidity, "solidity")}
                  padding={20}
                  style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: 13, minHeight: 260, background: "transparent", color: "#e5e7eb" }}
                  textareaClassName="focus:outline-none focus:ring-2 focus:ring-[#14F195]/25 focus:ring-inset bg-transparent text-gray-200"
                  preClassName="!m-0 !bg-transparent"
                  className="min-h-[260px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full"
                />
              </div>
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                placeholder={currentMode.placeholder}
                className="w-full h-[260px] bg-transparent text-sm text-gray-200 font-mono placeholder:text-neutral-600 px-4 sm:px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#9945FF]/25 focus:ring-inset [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full"
              />
            )}

            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-white/[0.04] bg-white/[0.01] flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[11px] text-neutral-600">
                <span>{mode === "audit" ? "Paste or drop Solidity, Rust, Move" : "Describe token, DAO, NFT, DeFi"}</span>
                <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-500">⌘↵</kbd>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!input.trim() || isLoading ? "bg-white/5 text-neutral-600 cursor-not-allowed" : "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10"}`}
              >
                {isLoading ? <><CircleNotch size={16} className="animate-spin" />{mode === "audit" ? "Auditing..." : "Generating..."}</> : <>{mode === "audit" ? <ShieldCheck size={16} weight="bold" /> : <Code size={16} weight="bold" />}{mode === "audit" ? "Run Audit" : "Generate"}<ArrowRight size={14} /></>}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {(result || isLoading) && (
              <motion.div ref={resultRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#13151C]/60">
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMode.color }} />
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{mode === "audit" ? "Audit Report" : "Generated Contract"}</span>
                    {isStreaming && <span className="text-[10px] text-[#14F195] font-mono animate-pulse">streaming...</span>}
                  </div>
                  {result && !isLoading && (
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={handleExport} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg"><DownloadSimple size={12} />Export</button>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg">
                            {copied ? <><Check size={12} className="text-[#14F195]" />Copied</> : <><Copy size={12} />Copy</>}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>

                <div className="px-4 sm:px-5 py-4 max-h-[560px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {isLoading && !result ? (
                    <div className="space-y-3">
                      <div className="flex gap-2"><Skeleton className="h-4 w-4 rounded-full bg-white/10" /><Skeleton className="h-4 w-24 bg-white/10" /></div>
                      <Skeleton className="h-4 w-full bg-white/10" />
                      <Skeleton className="h-4 w-[90%] bg-white/10" />
                      <Skeleton className="h-4 w-[75%] bg-white/10" />
                      <Skeleton className="h-16 w-full rounded-lg bg-white/10 mt-3" />
                      <div className="flex items-center gap-2 pt-2"><CircleNotch size={18} className="animate-spin text-[#14F195]" /><span className="text-sm text-neutral-400">{mode === "audit" ? "Analyzing..." : "Generating..."}</span></div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-3 prose-strong:text-white prose-headings:text-white prose-headings:mb-2 prose-headings:mt-4 prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-ul:my-2 prose-ol:my-2 prose-li:text-gray-200 prose-code:text-[#14F195] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:!bg-transparent prose-pre:!border-0 prose-pre:!p-0 prose-pre:!my-0 prose-a:text-[#14F195] prose-a:no-underline prose-blockquote:border-l-[#14F195] prose-blockquote:text-gray-400 prose-hr:border-white/10 prose-table:border-collapse prose-th:text-white prose-th:border-b prose-th:border-white/10 prose-td:text-gray-300 prose-td:border-b prose-td:border-white/5 text-sm">
                      <ReactMarkdown components={mdComponents}>{result}</ReactMarkdown>
                      {isStreaming && <span className="inline-block w-2 h-4 bg-[#14F195] rounded-sm ml-0.5 animate-pulse" />}
                    </div>
                  )}
                </div>

                {result && !isLoading && !isStreaming && (
                  <div className="px-4 sm:px-5 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2"><Sparkle size={12} weight="fill" className="text-[#9945FF]" /><span className="text-[11px] text-neutral-500">+15 points earned</span></div>
                    <span className="text-[11px] text-neutral-600 font-mono">{result.length} chars</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
