import { motion } from "framer-motion";
import { User, Copy, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
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
      <div
        className={`flex items-start max-w-3xl gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isUser ? "bg-[#3B3F4E]" : "bg-transparent p-0"
          }`}
        >
          {isUser ? (
            <User size={16} weight="duotone" className="text-gray-300" />
          ) : (
            <img src="/blockai.svg" alt="AI" className="w-8 h-8" />
          )}
        </div>

        {/* Content */}
        <div
          className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
          <span className="text-xs text-gray-500 mb-1 px-1">
            {isUser ? "You" : "BlockAI 4.0"}
          </span>
          <div
            className={`px-6 py-4 rounded-[32px] text-[15px] leading-relaxed shadow-sm ${
              isUser
                ? "bg-[#13151C] border border-white/5 text-gray-100 rounded-tr-sm"
                : "bg-transparent text-gray-200 px-0 pt-0"
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap m-0">
                {message.content}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none
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
              ">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-5 bg-[#14F195] rounded-sm ml-0.5 animate-pulse" />
                )}
              </div>
            )}
          </div>

          {!isUser && !message.isStreaming && message.content && (
            <div className="flex items-center gap-2 mt-2 ml-1">
              <button 
                onClick={() => navigator.clipboard.writeText(message.content)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
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
