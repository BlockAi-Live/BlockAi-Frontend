import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ChatEmptyState from "../components/chat/ChatEmptyState";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage, { Message } from "../components/chat/ChatMessage";

export default function ChatPage() {
  // Force HMR Update
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Simulate AI Delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (input: string) => {
    if (input.toLowerCase().includes("solana")) {
      return "Solana (SOL) is currently showing bullish momentum with a 24h volume increase of 15%. \n\nKey support levels: $142.50\nResistance: $155.00\n\nThe on-chain metrics suggest high daily active user activity.";
    }
    return `I've processed your request: "${input}". \n\nScanning the blockchain for relevant data...\n\nNo anomalies found. The market sentiment appears neutral in this sector. Would you like a deeper analysis?`;
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] relative font-sans bg-[#0d0f18]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
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
      <div className="relative z-20 pb-6 px-4">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

    </div>
  );
}
