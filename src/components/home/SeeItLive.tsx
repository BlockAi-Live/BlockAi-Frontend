import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import { Activity, Zap, Search, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function SeeItLive() {
  return (
    <section className="mt-32 px-6 md:px-0 relative overflow-hidden">
       {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="flex items-center justify-center gap-3 mb-20 relative z-10">
        <h3 className="text-[#10e291] text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">See It Live</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-red-500 tracking-wider">LIVE</span>
        </div>
      </div>

      <StaggerContainer className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 max-w-7xl mx-auto relative z-10">
        {/* Left Text */}
        <StaggerItem className="flex-1 text-left space-y-8">
          <div className="relative">
             <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#10e291]/10 rounded-full blur-xl" />
             <p className="text-2xl md:text-3xl font-semibold text-white leading-tight relative z-10">
                Live chain intelligence,<br />updated every second:
             </p>
          </div>
          
          <div className="space-y-6">
            {[
                { icon: <Activity className="w-5 h-5 text-[#10e291]" />, text: "Whale movements & smart-money flows" },
                { icon: <Search className="w-5 h-5 text-[#9b59b6]" />, text: "New airdrops and hidden opportunities" },
                { icon: <Bell className="w-5 h-5 text-[#10e291]" />, text: "Instant wallet & token alerts" }
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#10e291]/30 transition-colors group">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#10e291]/10 transition-colors">
                        {item.icon}
                    </div>
                    <p className="text-gray-300 font-medium">{item.text}</p>
                </div>
            ))}
          </div>
          
          <div className="text-base md:text-lg text-[#10e291] font-bold tracking-wider uppercase flex items-center gap-2">
            <Zap className="w-5 h-5 animate-pulse" />
            Your alpha advantage starts here.
          </div>
        </StaggerItem>

        {/* Center Image */}
        <StaggerItem className="flex-[2] flex justify-center w-full relative">
          <div className="relative w-full max-w-[1000px] group perspective-1000">
            {/* Green Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#10e291] blur-[100px] opacity-20 rounded-full pointer-events-none animate-pulse"></div>
            
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <img
                src="/laptop.png"
                alt="Live preview"
                className="relative w-full h-auto drop-shadow-2xl z-10 transform transition-transform duration-700 hover:scale-105"
                />
            </motion.div>

            {/* Floating Cards */}
            <motion.div 
                className="absolute -right-12 top-20 z-20 hidden lg:block"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className="bg-[#0B0E1A]/90 backdrop-blur-xl border border-[#10e291]/30 p-4 rounded-xl shadow-2xl flex items-center gap-3 w-64">
                    <div className="w-10 h-10 rounded-full bg-[#10e291]/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[#10e291]" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">New Alert</p>
                        <p className="text-sm font-bold text-white">Whale bought $BONK</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="absolute -left-12 bottom-20 z-20 hidden lg:block"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <div className="bg-[#0B0E1A]/90 backdrop-blur-xl border border-[#9b59b6]/30 p-4 rounded-xl shadow-2xl flex items-center gap-3 w-64">
                    <div className="w-10 h-10 rounded-full bg-[#9b59b6]/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-[#9b59b6]" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Market Update</p>
                        <p className="text-sm font-bold text-white">Solana Volume +150%</p>
                    </div>
                </div>
            </motion.div>

          </div>
        </StaggerItem>

        {/* Right Text */}
        <StaggerItem className="flex-1 text-right space-y-8">
          <p className="text-3xl md:text-4xl font-bold text-white">BlockAI never sleeps.</p>
          <div className="space-y-4">
             {[
                { text: "Whales moving", color: "text-[#10e291]" },
                { text: "Airdrops dropping", color: "text-[#9b59b6]" },
                { text: "Smart money loading", color: "text-[#10e291]" },
             ].map((item, i) => (
                 <div key={i} className="flex items-center justify-end gap-3 group">
                    <span className={`text-lg md:text-xl font-medium text-gray-400 group-hover:text-white transition-colors`}>{item.text}</span>
                    <div className={`w-2 h-2 rounded-full ${item.color === 'text-[#10e291]' ? 'bg-[#10e291]' : 'bg-[#9b59b6]'} shadow-[0_0_10px_currentColor]`} />
                 </div>
             ))}
             <p className="text-white font-semibold pt-4 text-xl border-t border-white/10 mt-6 inline-block">
                All in real time — all on-chain.
             </p>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
