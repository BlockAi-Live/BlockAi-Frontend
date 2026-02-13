import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "@/components/home";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { XLogo, LinkedinLogo, TelegramLogo, GithubLogo, Globe } from "@phosphor-icons/react";

/* ─── Team Data ─── */
interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  customImage?: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    github?: string;
    website?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Siamak Khoshnood",
    role: "Founder & CEO",
    bio: "Experienced Web3 Founder with over seven years in the blockchain industry. Drives product vision and ecosystem strategy across DeFi, AI, and analytics.",
    socials: {
      twitter: "https://x.com/Siamakkhoshnod",
      linkedin: "https://www.linkedin.com/in/siamakkhoshnood",
      telegram: "https://t.me/Siamakkhoshnood",
    },
  },
  {
    id: 8,
    name: "ImmortalSui",
    role: "Frontend / Full-stack Engineer",
    bio: "4.5+ years building scalable web applications. Manages the full development lifecycle — from high-performance frontends to robust backend APIs and architectural decisions.",
    socials: {
      twitter: "https://x.com/ImmortalSul",
      telegram: "https://t.me/ImmortalSul",
      github: "https://github.com/ImmortalSul/",
    },
  },
  {
    id: 5,
    name: "Kufre Asuquo",
    role: "Business Development",
    bio: "Specializes in exchange relations and ecosystem expansion. Secures high-value partnerships and investor collaborations to drive strategic market positioning.",
    socials: {
      telegram: "https://t.me/kufreezy",
      linkedin: "https://www.linkedin.com/in/kufre-a-217693223/",
    },
  },
  {
    id: 15,
    name: "Preetham AK",
    role: "Smart Contract Engineer & Auditor",
    bio: "Focused on DeFi protocols and on-chain security. Develops secure, gas-optimized contracts and conducts rigorous audits to prevent vulnerabilities.",
    socials: {
      twitter: "https://x.com/preethamak17159",
      linkedin: "https://www.linkedin.com/in/preetham-a-k-18b97931b/",
      github: "https://github.com/preethamak",
      website: "https://preethamak.vercel.app",
    },
  },
];

const socialIcons = {
  twitter: XLogo,
  linkedin: LinkedinLogo,
  telegram: TelegramLogo,
  github: GithubLogo,
  website: Globe,
} as const;

export default function Team() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-inter relative overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar launch={launch} />

        <main className="flex-grow max-w-[1100px] mx-auto px-6 md:px-0 w-full">

          {/* ── Hero ── */}
          <section className="pt-28 md:pt-36 pb-16">
            <ScrollReveal>
              <p className="text-[11px] font-semibold text-[#14F195] uppercase tracking-[0.2em] mb-5">The Team</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-4">
                Built by people who{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                  live on-chain.
                </span>
              </h1>
              <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                A decentralized team united by one goal: making BlockAI the global standard for on-chain intelligence.
              </p>
            </ScrollReveal>
          </section>

          {/* ── Team Grid ── */}
          <section className="pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, i) => (
                <ScrollReveal key={member.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group rounded-2xl bg-[#0e0e11] border border-neutral-800/40 hover:border-neutral-700/60 transition-all duration-300 p-6 md:p-8 h-full flex flex-col"
                  >
                    {/* Top row: avatar + name/role */}
                    <div className="flex items-start gap-5 mb-5">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/50 group-hover:border-[#14F195]/30 transition-colors">
                          <img
                            src={member.customImage || `/pfps/${member.id}.png`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{member.name}</h3>
                        <span className="text-[11px] font-semibold text-[#14F195] uppercase tracking-wider">{member.role}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-neutral-500 leading-relaxed flex-1">
                      {member.bio}
                    </p>

                    {/* Socials */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-neutral-800/40">
                      {(Object.entries(member.socials) as [keyof typeof socialIcons, string][]).map(
                        ([platform, url]) => {
                          const Icon = socialIcons[platform];
                          if (!Icon || !url) return null;
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-600 hover:text-white transition-colors"
                            >
                              <Icon size={16} weight="fill" />
                            </a>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* ── Join CTA ── */}
          <ScrollReveal>
            <section className="pb-24">
              <div className="rounded-2xl bg-[#0e0e11] border border-neutral-800/40 p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#9945FF] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3 relative z-10">
                  Want to join the team?
                </h2>
                <p className="text-neutral-500 text-sm max-w-md mb-6 relative z-10">
                  We're always looking for talented builders passionate about AI and blockchain.
                </p>
                <a
                  href="https://t.me/BlockAiOrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 px-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#14F195] hover:bg-[#12d883] transition-colors duration-200"
                >
                  Get in Touch
                </a>
              </div>
            </section>
          </ScrollReveal>

        </main>
        <Footer />
      </div>
    </div>
  );
}
