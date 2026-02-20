import React, { useState, useRef, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import {
  ShieldCheck,
  Code,
  Lightning,
  ArrowRight,
  Sparkle,
  CircleNotch,
  Copy,
  Check,
  Eraser,
} from "@phosphor-icons/react";

type Mode = "audit" | "generate";

const MODES = [
  {
    id: "audit" as Mode,
    label: "Audit",
    icon: ShieldCheck,
    description: "Analyze for vulnerabilities",
    color: "#14F195",
    placeholder: `// Paste your smart contract code here...\n// Example:\npragma solidity ^0.8.0;\n\ncontract MyToken {\n    mapping(address => uint256) public balances;\n    \n    function transfer(address to, uint256 amount) public {\n        balances[msg.sender] -= amount;\n        balances[to] += amount;\n    }\n}`,
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

export default function SmartContractsPage() {
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState<Mode>("audit");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMode = MODES.find((m) => m.id === mode)!;

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (result) scrollToResult();
  }, [result]);

  /**
   * Typewriter streaming
   */
  const streamText = useCallback((fullText: string) => {
    streamingRef.current = true;
    setIsStreaming(true);
    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;

    const tick = () => {
      if (!streamingRef.current) return;
      const wordsPerTick = Math.ceil(Math.random() * 3) + 1;
      currentIndex = Math.min(currentIndex + wordsPerTick, words.length);
      const partialText = words.slice(0, currentIndex).join("");
      setResult(partialText);

      if (currentIndex < words.length) {
        setTimeout(tick, 15 + Math.random() * 25);
      } else {
        streamingRef.current = false;
        setIsStreaming(false);
      }
    };
    tick();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResult("");
    streamingRef.current = false;

    try {
      const response = await api.smartContract({ content: input, mode });
      const answer = response.answer || "No response received.";
      setIsLoading(false);
      streamText(answer);

      // Refresh points
      try {
        const { user: updatedUser } = await api.getMe(
          localStorage.getItem("auth_token") || ""
        );
        if (updatedUser) updateUser({ points: updatedUser.points });
      } catch {}
    } catch (error: any) {
      console.error("Smart Contract Error:", error);
      setResult("❌ " + (error.message || "Something went wrong."));
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    streamingRef.current = false;
    setIsStreaming(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0d0f18] relative">
      {/* Points badge */}
      <div className="absolute top-4 right-6 z-30">
        <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
          <span className="text-xs font-bold text-white">
            {user?.points || 0} PTS
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 pt-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Smart Contract Tools
          </h1>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Audit your contracts for vulnerabilities or generate new ones from a
            description.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#13151C] border border-white/[0.06] rounded-2xl p-1.5 flex gap-1">
            {MODES.map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setResult("");
                    streamingRef.current = false;
                    setIsStreaming(false);
                  }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/5"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <m.icon
                    size={18}
                    weight={isActive ? "fill" : "regular"}
                    className={isActive ? "text-black" : ""}
                  />
                  <span>{m.label}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isActive ? "text-neutral-600" : "text-neutral-600"
                    }`}
                  >
                    {m.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
          {/* Input Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentMode.color }}
              />
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {mode === "audit"
                  ? "Contract Code"
                  : "Contract Description"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {input && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Eraser size={12} />
                  Clear
                </button>
              )}
              <span className="text-[11px] text-neutral-600 font-mono">
                {input.length} chars
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentMode.placeholder}
            className="w-full h-[280px] bg-transparent text-sm text-gray-200 font-mono placeholder:text-neutral-600 px-5 py-4 resize-none focus:outline-none
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-700
              [&::-webkit-scrollbar-thumb]:rounded-full"
          />

          {/* Submit Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] bg-white/[0.01]">
            <div className="text-[11px] text-neutral-600">
              {mode === "audit"
                ? "Paste Solidity, Rust, or Move contracts"
                : "Describe token, DAO, NFT, or DeFi contracts"}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                !input.trim() || isLoading
                  ? "bg-white/5 text-neutral-600 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10"
              }`}
            >
              {isLoading ? (
                <>
                  <CircleNotch
                    size={16}
                    className="animate-spin"
                  />
                  {mode === "audit" ? "Auditing..." : "Generating..."}
                </>
              ) : (
                <>
                  {mode === "audit" ? (
                    <ShieldCheck size={16} weight="bold" />
                  ) : (
                    <Code size={16} weight="bold" />
                  )}
                  {mode === "audit"
                    ? "Run Audit"
                    : "Generate Contract"}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        {(result || isLoading) && (
          <div
            ref={resultRef}
            className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentMode.color }}
                />
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {mode === "audit" ? "Audit Report" : "Generated Contract"}
                </span>
                {isStreaming && (
                  <span className="text-[10px] text-[#14F195] font-mono animate-pulse">
                    streaming...
                  </span>
                )}
              </div>
              {result && !isLoading && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-[#14F195]" />
                      <span className="text-[#14F195]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Results Content */}
            <div className="px-5 py-5 max-h-[600px] overflow-y-auto
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-700
              [&::-webkit-scrollbar-thumb]:rounded-full">
              {isLoading && !result ? (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <CircleNotch
                    size={24}
                    className="animate-spin text-[#14F195]"
                  />
                  <span className="text-sm text-neutral-400">
                    {mode === "audit"
                      ? "Analyzing contract for vulnerabilities..."
                      : "Generating your smart contract..."}
                  </span>
                </div>
              ) : (
                <div
                  className="prose prose-invert max-w-none
                  prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-3
                  prose-strong:text-white prose-strong:font-bold
                  prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-ul:my-2 prose-ol:my-2
                  prose-li:text-gray-200 prose-li:leading-relaxed prose-li:mb-1
                  prose-code:text-[#14F195] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-[#0a0c14] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3
                  prose-a:text-[#14F195] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-[#14F195] prose-blockquote:text-gray-400 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                  prose-hr:border-white/10
                  prose-table:border-collapse
                  prose-th:text-left prose-th:text-white prose-th:border-b prose-th:border-white/10 prose-th:px-3 prose-th:py-2
                  prose-td:text-gray-300 prose-td:border-b prose-td:border-white/5 prose-td:px-3 prose-td:py-2
                  text-sm"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 bg-[#14F195] rounded-sm ml-0.5 animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {/* Points earned footer */}
            {result && !isLoading && !isStreaming && (
              <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle
                    size={12}
                    weight="fill"
                    className="text-[#9945FF]"
                  />
                  <span className="text-[11px] text-neutral-500">
                    +15 points earned
                  </span>
                </div>
                <span className="text-[11px] text-neutral-600 font-mono">
                  {result.length} chars
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
