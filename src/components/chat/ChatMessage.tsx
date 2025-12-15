import { motion } from "framer-motion";
import { User, Copy, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div className={`flex items-start max-w-3xl gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isUser ? "bg-[#3B3F4E]" : "bg-transparent p-0"
        }`}>
            {isUser ? (
                <User size={16} weight="duotone" className="text-gray-300" />
            ) : (
                <img src="/blockai.svg" alt="AI" className="w-8 h-8" />
            )}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <span className="text-xs text-gray-500 mb-1 px-1">
                {isUser ? "You" : "BlockAI 4.0"}
            </span>
            <div className={`px-6 py-4 rounded-[32px] text-[15px] leading-relaxed shadow-sm ${
                isUser 
                    ? "bg-[#13151C] border border-white/5 text-gray-100 rounded-tr-sm" 
                    : "bg-transparent text-gray-200 px-0 pt-0" 
            }`}>
                {isUser ? (
                    message.content
                ) : (
                    <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                )}
            </div>
            
            {!isUser && (
                <div className="flex items-center gap-2 mt-2 ml-1">
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Copy size={16} weight="duotone" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ThumbsUp size={16} weight="duotone" />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ThumbsDown size={16} weight="duotone" />
                    </button>
                </div>
            )}
        </div>

      </div>
    </motion.div>
  );
}
