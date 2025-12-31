import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChatEmptyState from "../components/chat/ChatEmptyState";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage, { Message } from "../components/chat/ChatMessage";
import { api } from "@/lib/api";
import { Lightning } from "@phosphor-icons/react";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
function syntaxToHTML(text: string): string {
  const lines = text.split('\n');
  const htmlBlocks: string[] = [];
  let isInsideList = false;


  const parseInlineFormatting = (str: string): string => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
      .trim();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (isInsideList) {
        htmlBlocks.push('</ul>');
        isInsideList = false;
      }
      continue;
    }

    if (line.startsWith('* ')) {
      if (!isInsideList) {
        htmlBlocks.push('<ul>');
        isInsideList = true;
      }
      
      const content = line.replace(/^\*\s*/, '');
      htmlBlocks.push(`  <li>${parseInlineFormatting(content)}</li>`);
    } else {
      if (isInsideList) {
        htmlBlocks.push('</ul>');
        isInsideList = false;
      }
      
      const parsedLine = parseInlineFormatting(line);
      htmlBlocks.push(`<p>${parsedLine}</p>`);
    }
  }
  if (isInsideList) {
    htmlBlocks.push('</ul>');
  }

  return htmlBlocks.join('\n');
}
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Optimistic Check
    if (credits !== null && credits < 1 && !isPaid) {
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant", 
            content: "⚠️ **Insufficient Credits**. You need at least 1 credit to send a message. Please upgrade or top up in Settings.",
            timestamp: new Date()
         }]);
         return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await api.chatQuestion({ content });
      
      // Deduct credit locally for instant feedback
      if (!isPaid && credits) setCredits(c => c ? c - 1 : 0);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: syntaxToHTML(response.answer) ,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      
      let errorText = "Sorry, I couldn't process your request.";
      if (error.message.includes("Payment Required") || error.message.includes("Insufficient Credits")) {
          errorText = "💳 **Payment Required**: You have run out of free credits. [Upgrade to Pro](/settings) to continue chatting without limits.";
      }

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      // Refresh actual stats
      fetchBilling(); 
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] relative font-sans bg-[#0d0f18]">
      
      {/* Credit Badge */}
      <div className="absolute top-4 right-6 z-30 pointer-events-none">
         <div className="bg-[#13151C]/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg">
             <Lightning size={14} weight="fill" className={isPaid ? "text-purple-400" : "text-[#14F195]"} />
             <span className="text-xs font-bold text-white">
                 {isPaid ? "PRO UNLIMITED" : `${credits ?? '...'} Credits`}
             </span>
             {!isPaid && <span className="text-[10px] text-gray-500 border-l border-white/10 pl-2 ml-1">1 Cost/Msg</span>}
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
          <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pt-10 pb-0">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
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
