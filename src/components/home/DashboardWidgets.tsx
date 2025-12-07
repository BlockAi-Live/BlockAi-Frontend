import { ArrowUpRight, TrendingUp, MessageSquare, Wallet, Activity } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [value, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function DashboardWidgets() {
  return (
    <StaggerContainer className="flex flex-col lg:flex-row gap-8 items-center justify-center mt-32 px-6 max-w-7xl mx-auto">
      
      {/* Card 1: Portfolio Growth */}
      <StaggerItem className="relative group w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#10e291] to-[#9b59b6] rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative bg-[#0B0E1A]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-[320px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-[#10e291]/10 rounded-xl">
                <Wallet className="w-6 h-6 text-[#10e291]" />
              </div>
              <span className="text-xs font-medium text-[#10e291] bg-[#10e291]/10 px-3 py-1 rounded-full border border-[#10e291]/20">
                <Counter value={12.4} prefix="+" suffix="% today" decimals={1} />
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">Wallet Portfolio</p>
              <h3 className="text-4xl font-bold text-white">
                <Counter value={428420} prefix="$" />
              </h3>
              <div className="flex items-center gap-2 text-[#10e291] text-sm font-bold mt-2">
                <span className="bg-[#10e291]/10 px-2 py-0.5 rounded text-xs">
                  <Counter value={12.4} prefix="+" suffix="%" decimals={1} />
                </span>
                <span>
                  <Counter value={47290.10} prefix="+$" decimals={2} />
                </span>
              </div>
            </div>
          </div>
          
          {/* Simplified Chart Visualization */}
          <div className="h-24 w-full flex items-end gap-1">
            {[40, 65, 50, 80, 60, 90, 75, 95, 85, 100].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-[#10e291]/20 to-[#10e291] rounded-t-sm hover:opacity-80"
              />
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Card 2: Trending Tokens (Elevated) */}
      <StaggerItem className="relative group w-full max-w-md lg:-mt-12">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b59b6] to-[#10e291] rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative bg-[#0B0E1A]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#9b59b6]/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-[#9b59b6]" />
              </div>
              <h3 className="font-bold text-white text-lg">Trending tokens</h3>
            </div>
            <Activity className="w-5 h-5 text-gray-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            {[
              { name: "BONK", price: "$0.000024", change: 42, color: "text-[#10e291]" },
              { name: "WIF", price: "$3.45", change: 28, color: "text-[#10e291]" },
              { name: "POPCAT", price: "$0.45", change: 19, color: "text-[#10e291]" },
            ].map((token, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    {token.name[0]}
                  </div>
                  <span className="font-bold text-gray-200">${token.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${token.color}`}>
                    <Counter value={token.change} prefix="+" suffix="%" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Card 3: AI Chat */}
      <StaggerItem className="relative group w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#10e291] to-[#9b59b6] rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative bg-[#0B0E1A]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-[320px] flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10e291] to-[#9b59b6] p-[1px]">
               <div className="w-full h-full rounded-full bg-[#0B0E1A] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#10e291]" />
               </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Recent chats</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10e291] animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 space-y-4 overflow-hidden relative flex flex-col justify-center">
             {/* User Message 1 */}
             <div className="flex justify-end">
                <div className="bg-blue-600 text-white text-sm font-medium py-3 px-4 rounded-2xl rounded-tr-sm max-w-[90%] shadow-lg">
                  What's the next 100x?
                </div>
                <span className="text-[10px] text-gray-500 self-end ml-2 mb-1">5h ago</span>
             </div>

             {/* User Message 2 */}
             <div className="flex justify-end">
                <div className="bg-blue-600 text-white text-sm font-medium py-3 px-4 rounded-2xl rounded-tr-sm max-w-[90%] shadow-lg">
                  Analyze wallet 8sdf...
                </div>
                <span className="text-[10px] text-gray-500 self-end ml-2 mb-1">2h ago</span>
             </div>

             {/* AI Typing Indicator */}
             <div className="flex justify-start">
                <div className="bg-white/10 text-white text-sm font-medium py-3 px-4 rounded-2xl rounded-tl-sm shadow-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
             </div>
          </div>

          {/* Input Area */}
          <div className="mt-3 relative">
            <input 
              type="text" 
              placeholder="Ask BlockAI anything..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#10e291]/50 transition-colors"
              readOnly
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
          </div>
        </div>
      </StaggerItem>

    </StaggerContainer>
  );
}
