import { FaTelegram, FaDiscord, FaTwitter } from "react-icons/fa";
import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import { ArrowRight } from "lucide-react";

const socials = [
  {
    name: "Telegram",
    desc: "Chat with the community",
    href: "https://t.me/BlockAiOrg",
    icon: FaTelegram,
    color: "#26A5E4",
  },
  {
    name: "Discord",
    desc: "Join the conversation",
    href: "https://discord.gg/FuPn3FbkG9",
    icon: FaDiscord,
    color: "#5865F2",
  },
  {
    name: "Twitter",
    desc: "Follow for updates",
    href: "https://x.com/BlockAi_live",
    icon: FaTwitter,
    color: "#1DA1F2",
  },
];

export default function Community() {
  return (
    <section id="community" className="mt-32 px-6 md:px-0 relative z-10 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5">
          Join the community
        </h3>
        <p className="text-neutral-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Connect with traders and builders. Get early alpha, share insights, and be part of the future of on-chain intelligence.
        </p>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {socials.map((s, i) => (
          <StaggerItem key={i}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-neutral-900/50 border border-neutral-800/60 p-6 hover:border-neutral-700 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 80%, ${s.color}08 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${s.color}15`,
                    border: `1px solid ${s.color}25`,
                  }}
                >
                  <s.icon
                    className="w-6 h-6 transition-colors duration-300"
                    style={{ color: s.color }}
                  />
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{s.name}</h4>
                <p className="text-sm text-neutral-500 mb-5">{s.desc}</p>

                <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                  <span>Join now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
