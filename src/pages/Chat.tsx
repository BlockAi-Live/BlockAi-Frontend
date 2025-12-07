import React from "react";
import { Mic, Plus, Send } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] relative font-sans">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(20, 241, 149, 0.2) 100%)"
        }}
      />

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-10">
        
        {/* AI Message */}
        <div className="flex flex-col items-start max-w-xl">
          <span className="text-xs text-gray-400 mb-2 ml-1">BlockAI</span>
          <div className="bg-[#1e2029] text-gray-100 p-5 rounded-[24px] rounded-tl-none text-lg leading-relaxed shadow-lg border border-white/5">
            <p>Hello! I've analyzed the market.</p>
            <p>Would you like to see the latest trending tokens?</p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex flex-col items-end ml-auto max-w-xl">
          <span className="text-xs text-gray-400 mb-2 mr-1">You</span>
          <div className="bg-[#14F195] text-black p-5 rounded-[24px] rounded-tr-none text-lg font-medium leading-relaxed shadow-[0_0_20px_rgba(20,241,149,0.2)]">
            <p>Yes, show me high-volume tokens.</p>
          </div>
        </div>

      </div>

      {/* Input Area */}
      <div className="p-6 md:p-10 relative z-10">
        <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
          
          {/* Plus Button */}
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <Plus size={24} />
          </button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ask about a token, wallet, or market trend..."
              className="w-full bg-transparent border border-white/20 rounded-full py-4 pl-6 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#14F195]/50 focus:ring-1 focus:ring-[#14F195]/50 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <Mic size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
