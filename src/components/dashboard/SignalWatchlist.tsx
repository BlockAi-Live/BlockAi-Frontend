import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import {
  TrendUp,
  ArrowsClockwise,
  Lightning,
} from "@phosphor-icons/react";

export default function SignalWatchlist() {
  const [signals, setSignals] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamText = useCallback((fullText: string) => {
    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;
    setIsStreaming(true);

    const tick = () => {
      const wordsPerTick = Math.ceil(Math.random() * 3) + 1;
      currentIndex = Math.min(currentIndex + wordsPerTick, words.length);
      setSignals(words.slice(0, currentIndex).join(""));

      if (currentIndex < words.length) {
        setTimeout(tick, 15 + Math.random() * 20);
      } else {
        setIsStreaming(false);
      }
    };
    tick();
  }, []);

  const fetchSignals = async () => {
    setIsLoading(true);
    setError(null);
    setSignals("");

    try {
      const result = await api.getSignals();
      setIsLoading(false);
      streamText(result.signals || "No signals available.");
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Signal fetch error:", err);
      setError(err.message || "Failed to load signals");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="bg-[#13151C]/60 border border-white/[0.06] rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-2">
          <Lightning size={16} weight="fill" className="text-[#14F195]" />
          <span className="text-sm font-bold text-white">AI Signals</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-neutral-600 font-mono">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchSignals}
            disabled={isLoading}
            className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
          >
            <ArrowsClockwise size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-800
        [&::-webkit-scrollbar-thumb]:rounded-full">
        {isLoading && !signals ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <TrendUp size={24} className="text-[#14F195] animate-pulse" />
            <p className="text-xs text-neutral-500">Fetching AI signals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-xs text-red-400">{error}</p>
            <button onClick={fetchSignals} className="text-[11px] text-[#14F195] mt-2 hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-xs
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-2
            prose-strong:text-white prose-strong:font-bold
            prose-headings:text-white prose-headings:font-bold prose-headings:mb-1.5 prose-headings:mt-3
            prose-h1:text-sm prose-h2:text-sm prose-h3:text-xs
            prose-ul:my-1 prose-ol:my-1
            prose-li:text-gray-300 prose-li:leading-relaxed prose-li:mb-0.5
            prose-code:text-[#14F195] prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px]
          ">
            <ReactMarkdown>{signals}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-[#14F195] rounded-sm ml-0.5 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
