import { useRef, useState, useEffect } from "react";
import { Paperclip, PaperPlaneRight, Microphone, Sparkle, CaretDown, ChartLineUp, Lightning, Image as ImageIcon, FileText, DotsThreeCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}


export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const models = [
    { id: "v4", name: "BlockAI 4.0", icon: <Sparkle size={16} weight="duotone" className="text-[#9945FF]" /> },
    { id: "beta", name: "Alpha Sniffer (Beta)", icon: <Lightning size={16} weight="duotone" className="text-[#14F195]" /> },
    { id: "legacy", name: "Market Analyst", icon: <ChartLineUp size={16} weight="duotone" className="text-blue-400" /> },
  ];

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 z-20 relative">
      <div className="bg-[#13151C] border border-white/5 rounded-[32px] p-5 shadow-2xl relative transition-all focus-within:ring-1 focus-within:ring-[#14F195]/20 focus-within:border-[#14F195]/30">
        
        {/* Main Input */}
        <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can BlockAI help you today?"
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-gray-200 placeholder-gray-500 text-[15px] leading-relaxed min-h-[60px] max-h-[200px] overflow-y-auto custom-scrollbar"
        />

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/5">
            
            {/* Left: Model Selector & Features */}
            <div className="flex items-center gap-2 relative">
                <div className="relative">
                    <button
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151C] hover:bg-[#1E222B] text-xs font-medium text-gray-300 transition-all border border-white/5 hover:border-[#14F195]/50 shadow-sm hover:shadow-[0_0_10px_rgba(20,241,149,0.1)]"
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14F195]"></span>
                            </span>
                            <span className="group-hover:text-white transition-colors tracking-wide">{selectedModel.name}</span>
                        </div>
                        <CaretDown size={12} weight="bold" className={`text-gray-500 group-hover:text-white transition-all duration-300 ${showModelMenu ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {showModelMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-3 w-56 bg-[#13151C] border border-white/5 rounded-[24px] shadow-2xl overflow-hidden z-50 py-2"
                            >
                                <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Model</div>
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            setSelectedModel(model);
                                            setShowModelMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left transition-colors ${
                                            selectedModel.id === model.id ? "bg-[#1E222B] text-[#14F195]" : "text-gray-400 hover:bg-[#1E222B] hover:text-gray-200"
                                        }`}
                                    >
                                        {model.icon}
                                        <div className="flex flex-col">
                                            <span className="font-medium">{model.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button 
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={`p-2 transition-colors ${showAttachMenu ? "text-[#14F195] bg-[#14F195]/10 rounded-xl" : "text-gray-500 hover:text-gray-300"}`} 
                        title="Attach file"
                    >
                        <Paperclip size={20} weight="duotone" />
                    </button>

                    <AnimatePresence>
                        {showAttachMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full right-0 mb-3 w-48 bg-[#13151C] border border-white/5 rounded-[24px] shadow-2xl overflow-hidden z-50 p-1.5"
                            >
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left text-gray-300 hover:bg-[#1E222B] hover:text-white rounded-xl transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-[#1E222B] group-hover:bg-[#2A2D3A] text-[#14F195] transition-colors">
                                        <ImageIcon size={16} weight="duotone" />
                                    </div>
                                    <span className="font-medium">Upload Image</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left text-gray-300 hover:bg-[#1E222B] hover:text-white rounded-xl transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-[#1E222B] group-hover:bg-[#2A2D3A] text-blue-400 transition-colors">
                                        <FileText size={16} weight="duotone" />
                                    </div>
                                    <span className="font-medium">Upload File</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-left text-gray-300 hover:bg-[#1E222B] hover:text-white rounded-xl transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-[#1E222B] group-hover:bg-[#2A2D3A] text-purple-400 transition-colors">
                                        <DotsThreeCircle size={16} weight="duotone" />
                                    </div>
                                    <span className="font-medium">More Options</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors" title="Voice input">
                    <Microphone size={20} weight="duotone" />
                </button>
                
                <div className="w-px h-6 bg-[#2A2D3A] mx-1" />

                <button 
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                        message.trim() && !isLoading
                            ? "bg-[#14F195] text-black hover:bg-[#14F195]/90 hover:scale-105 shadow-[0_0_15px_rgba(20,241,149,0.3)]"
                            : "bg-[#2A2D3A] text-gray-500 cursor-not-allowed"
                    }`}
                >
                    <PaperPlaneRight size={18} weight="fill" className={message.trim() && !isLoading ? "text-black" : "text-gray-500"} />
                </button>
            </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-600 mt-4 font-medium">
        BlockAI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
