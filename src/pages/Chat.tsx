import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import ChatEmptyState from "../components/chat/ChatEmptyState";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage, { Message } from "../components/chat/ChatMessage";
import { api } from "@/lib/api";
import { Lightning, Sparkle, CaretDown, Check } from "@phosphor-icons/react";

type AIModel = {
  id: string;
  label: string;
  description: string;
  color: string;
};

const MODELS: AIModel[] = [
  { id: "chaingpt", label: "ChainGPT", description: "Crypto-native AI", color: "#14F195" },
  { id: "blockai3", label: "BlockAI 3.0", description: "Gemini-powered", color: "#9945FF" },
];

export default function ChatPage() {
  const { user, updateUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(MODELS[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const modelPickerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef(false);

  const fetchBilling = async () => {
      try {
          const stats = await api.getBillingStats();
          if (stats?.billing) {
              setCredits(stats.billing.credits);
              setIsPaid(stats.billing.tier === 'PAID');
          }
      } catch (e) {
          console.error("Failed to load billing", e);
      }
  };

  useEffect(() => {
      fetchBilling();
  }, []);

  // Close model picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
        setShowModelPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Typewriter streaming: reveals text word-by-word with a natural pace
   */
  const streamText = useCallback((fullText: string, messageId: string) => {
    streamingRef.current = true;
    const words = fullText.split(/(\s+)/); // split preserving whitespace
    let currentIndex = 0;

    const tick = () => {
      if (!streamingRef.current) return;
      
      // Reveal 1-3 words per tick for natural pacing
      const wordsPerTick = Math.ceil(Math.random() * 2) + 1;
      currentIndex = Math.min(currentIndex + wordsPerTick, words.length);
      const partialText = words.slice(0, currentIndex).join('');
      
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, content: partialText, isStreaming: currentIndex < words.length }
          : m
      ));

      if (currentIndex < words.length) {
        // Variable delay: faster for whitespace, slower for content
        const delay = 20 + Math.random() * 30;
        setTimeout(tick, delay);
      } else {
        streamingRef.current = false;
        setIsLoading(false);
      }
    };

    tick();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();

    try {
      const response = await api.chatQuestion({ content, provider: selectedModel.id } as any);
      
      const answerText = response.answer || "No response received.";

      // Add empty AI message placeholder
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      }]);

      // Start typewriter streaming
      streamText(answerText, aiMsgId);

    } catch (error: any) {
      console.error("Chat Error:", error);
      setIsLoading(false);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. " + (error.message || ""),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      // Refresh billing & points 
      fetchBilling();
      try {
          const { user: updatedUser } = await api.getMe(localStorage.getItem('auth_token') || '');
          if (updatedUser) {
              updateUser({ points: updatedUser.points });
          }
      } catch (e) {
          console.error("Failed to refresh points", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] relative font-sans bg-[#0d0f18]">
      
      {/* Top Bar — Model Selector + Badges */}
      <div className="absolute top-4 left-6 right-6 z-30 pointer-events-none flex items-start justify-between">
        
        {/* Model Selector */}
        <div className="pointer-events-auto relative" ref={modelPickerRef}>
          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-2 px-4 py-2 bg-[#13151C]/90 backdrop-blur-md border border-white/10 rounded-full hover:border-white/20 transition-all"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedModel.color }} />
            <span className="text-sm font-semibold text-white">{selectedModel.label}</span>
            <CaretDown size={12} className={`text-neutral-400 transition-transform ${showModelPicker ? 'rotate-180' : ''}`} />
          </button>

          {showModelPicker && (
            <div className="absolute top-full mt-2 left-0 w-56 bg-[#13151C] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { setSelectedModel(model); setShowModelPicker(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: model.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{model.label}</div>
                    <div className="text-[11px] text-neutral-500">{model.description}</div>
                  </div>
                  {selectedModel.id === model.id && (
                    <Check size={14} weight="bold" className="text-[#14F195] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Badges */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
           {/* Points Badge */}
           <div className="bg-[#13151C]/80 backdrop-blur-md border border-[#9945FF]/30 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 shadow-lg">
               <Sparkle size={14} weight="fill" className="text-[#9945FF]" />
               <span className="text-xs font-bold text-white">{user?.points || 0} PTS</span>
           </div>

           {/* Credits Badge */}
           <div className="bg-[#13151C]/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg">
               <Lightning size={14} weight="fill" className={isPaid ? "text-purple-400" : "text-[#14F195]"} />
               <span className="text-xs font-bold text-white">
                   {isPaid ? "PRO UNLIMITED" : `${credits ?? '...'} Credits`}
               </span>
               {!isPaid && <span className="text-[10px] text-gray-500 border-l border-white/10 pl-2 ml-1">1 Cost/Msg</span>}
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto
[&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-gray-700
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-700
  
  [scrollbar-width:thin]
  [scrollbar-color:theme(colors.gray.700)_transparent] relative z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center">
            <ChatEmptyState 
              userName={user?.fullName?.split(" ")[0]} 
              onSuggestionClick={handleSendMessage} 
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pt-16 pb-0">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && !streamingRef.current && (
              <div className="flex items-start gap-4 mb-6 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-[#3B3F4E] flex items-center justify-center shrink-0">
                  <img src="/blockai.svg" alt="Thinking" className="w-5 h-5 animate-spin-slow" />
                </div>
                <div className="text-sm text-gray-400 pt-2">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative z-20 pb-0 px-4">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
