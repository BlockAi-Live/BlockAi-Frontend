import { FaTelegram, FaDiscord, FaTwitter } from "react-icons/fa";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../ScrollReveal";

export default function Community() {
  return (
    <section id="community" className="mt-32 px-6 md:px-0 relative z-10 max-w-6xl mx-auto">
      <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0B0E1A]/50 backdrop-blur-xl p-12 md:p-20 text-center group">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-emerald-900/20 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Animated Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700" />

        <div className="relative z-10">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9B59B6]">Revolution</span>
          </h3>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Be part of the fastest-growing community of alpha hunters. Get real-time alerts, share insights, and stay ahead of the market.
          </p>

          <StaggerContainer className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {/* Telegram */}
            <StaggerItem>
            <a
              href="https://t.me/BlockAiOrg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-[#229ED9] hover:border-[#229ED9] transition-all duration-300 group/btn hover:-translate-y-1 hover:shadow-lg hover:shadow-[#229ED9]/20"
            >
              <FaTelegram className="w-6 h-6 text-[#229ED9] group-hover/btn:text-white transition-colors" />
              <span className="font-bold text-white text-lg">Telegram</span>
            </a>
            </StaggerItem>

            {/* Discord */}
            <StaggerItem>
            <a
              href="https://discord.gg/7XR2kafsAT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-[#5865F2] hover:border-[#5865F2] transition-all duration-300 group/btn hover:-translate-y-1 hover:shadow-lg hover:shadow-[#5865F2]/20"
            >
              <FaDiscord className="w-6 h-6 text-[#5865F2] group-hover/btn:text-white transition-colors" />
              <span className="font-bold text-white text-lg">Discord</span>
            </a>
            </StaggerItem>

            {/* Twitter/X */}
            <StaggerItem>
            <a
              href="https://x.com/BlockAi_live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-black hover:border-white/20 transition-all duration-300 group/btn hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
            >
              <FaTwitter className="w-6 h-6 text-white transition-colors" />
              <span className="font-bold text-white text-lg">Twitter</span>
            </a>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
