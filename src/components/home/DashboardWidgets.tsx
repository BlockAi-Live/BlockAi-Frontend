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
    <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-32 px-6 max-w-5xl mx-auto">
      
      {/* Card 1: Portfolio */}
      <StaggerItem className="lg:col-span-1">
        <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-6 h-full hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div className="p-2.5 bg-neutral-800 rounded-lg">
              <Wallet className="w-5 h-5 text-[#14F195]" />
            </div>
            <span className="text-xs font-medium text-[#14F195] bg-[#14F195]/10 px-2.5 py-1 rounded-md">
              <Counter value={12.4} prefix="+" suffix="%" decimals={1} />
            </span>
          </div>
          <p className="text-neutral-500 text-xs font-medium mb-1">Portfolio Value</p>
          <h3 className="text-2xl font-bold text-white">
            <Counter value={428420} prefix="$" />
          </h3>
          
          {/* Mini chart */}
          <div className="h-16 w-full flex items-end gap-0.5 mt-4">
            {[40, 65, 50, 80, 60, 90, 75, 95, 85, 100, 70, 92].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                className="flex-1 bg-[#14F195]/20 rounded-[2px] hover:bg-[#14F195]/40 transition-colors"
              />
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Card 2: Trending */}
      <StaggerItem className="lg:col-span-1">
        <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-6 h-full hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-neutral-800 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#9945FF]" />
              </div>
              <h3 className="font-semibold text-white text-sm">Trending</h3>
            </div>
            <Activity className="w-4 h-4 text-neutral-600 animate-pulse" />
          </div>

          <div className="space-y-3">
            {[
              { name: "BONK", change: 42 },
              { name: "WIF", change: 28 },
              { name: "POPCAT", change: 19 },
            ].map((token, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                    {token.name[0]}
                  </div>
                  <span className="font-medium text-sm text-neutral-300">${token.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#14F195]">
                  <Counter value={token.change} prefix="+" suffix="%" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Card 3: AI Chat */}
      <StaggerItem className="lg:col-span-1">
        <div className="bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-5 h-full hover:border-neutral-700 transition-colors flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-neutral-800/60">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#14F195]" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs">BlockAI Chat</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]" />
                <span className="text-[10px] text-neutral-500">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 flex flex-col justify-center">
            <div className="flex justify-end">
              <div className="bg-neutral-800 text-white text-xs font-medium py-2.5 px-3.5 rounded-lg rounded-tr-sm max-w-[85%]">
                What's the next 100x?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-neutral-800 text-white text-xs font-medium py-2.5 px-3.5 rounded-lg rounded-tr-sm max-w-[85%]">
                Analyze wallet 8sdf...
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-neutral-800/50 border border-neutral-700/50 text-white text-xs py-2.5 px-3.5 rounded-lg rounded-tl-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              className="w-full bg-neutral-800/50 border border-neutral-800 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              readOnly
            />
          </div>
        </div>
      </StaggerItem>

    </StaggerContainer>
  );
}
