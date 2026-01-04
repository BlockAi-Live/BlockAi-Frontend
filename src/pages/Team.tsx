import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "@/components/home";
import { ScrollReveal } from "@/components/ScrollReveal";
import { XLogo, LinkedinLogo, TelegramLogo, GithubLogo } from "@phosphor-icons/react";

// Team Data
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
    bio: "Siamak is an experienced Web3 Founder with over seven years of hands-on involvement in the blockchain industry. He drives product vision and ecosystem strategy across DeFi, AI, and analytics to ensure successful project execution and growth",
    socials: {
        twitter: "https://x.com/Siamakkhoshnod",
        linkedin: "https://www.linkedin.com/in/siamakkhoshnood",
        telegram: "https://t.me/Siamakkhoshnood"
    }
  },
  {
    id: 2,
    name: "Raymond Henry (Mr. Eagle)",
    role: "Chief Operating Officer (COO)",
    bio: "Raymond is an experienced Web3 COO with over five years of expertise in blockchain coordination. He executes project roadmaps and manages cross-functional sprints, acting as the primary liaison between technical and marketing teams to ensure all deliverables align with the project’s long-term vision.",
    socials: {
        twitter: "https://x.com/web3eaglealpha",
        telegram: "https://t.me/web3eaglealpha"
    }
  },
  {
    id: 8,
    name: "ImmortalSui",
    role: "Frontend/Full-stack Engineer",
    bio: "ImmortalSul is an experienced engineer with over 4.5 years of expertise in building scalable web applications. He manages the full development lifecycle, from high-performance frontends to robust backend APIs. By leading architectural decisions, he ensures code quality, security, and rapid feature prototyping to meet tight production timelines.",
    socials: {
        twitter: "https://x.com/ImmortalSul",
        telegram: "https://t.me/ImmortalSul",
        github: "https://github.com/ImmortalSul/"
    }
  },
  {
    id: 5,
    name: "Kufre Asuquo",
    role: "BDM",
    bio: "Kufre is a Business Development Lead specializing in exchange relations and ecosystem expansion. He accelerates product adoption by securing high-value partnerships and investor collaborations, driving the strategic market positioning and growth of the BlockAI.live ecosystem.",
    socials: {
        telegram: "https://t.me/kufreezy",
        linkedin: "https://www.linkedin.com/in/kufre-a-217693223/"
    }
  },
  {
    id: 99,
    name: "Preetham AK",
    role: "Smart Contract Engineer & Auditor",
    bio: "Preetham is a seasoned Solidity engineer specializing in smart contract security and gas optimization. With a background in auditing core DeFi protocols, he ensures the integrity of BlockAI's on-chain infrastructure through rigorous testing and formal verification methods.",
    customImage: "https://ui-avatars.com/api/?name=Preetham+AK&background=10e291&color=000&size=200",
    socials: {}
  }
];

// Team Card Component
const TeamCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="group relative bg-[#13151C] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center hover:border-[#10e291]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,226,145,0.1)] h-full overflow-hidden">
      {/* Avatar with Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#10e291]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-32 h-32 rounded-full p-1 border-2 border-white/10 relative z-10 group-hover:border-[#10e291]/50 transition-colors overflow-hidden bg-gray-900">
           <img 
             src={member.customImage || `/pfps/${member.id}.png`} 
             alt={member.name}
             className="w-full h-full object-cover rounded-full"
           />
        </div>
      </div>

      {/* Info */}
      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
      <span className="text-[#10e291] text-sm font-semibold tracking-wide mb-4 uppercase inline-block min-h-[1.25rem]">{member.role}</span>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        {member.bio}
      </p>

      {/* Socials */}
      <div className="mt-auto flex gap-4 pt-4 border-t border-white/5 w-full justify-center">
        {member.socials.twitter && (
            <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <XLogo size={18} weight="fill" />
            </a>
        )}
        {member.socials.linkedin && (
            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <LinkedinLogo size={18} weight="fill" />
            </a>
        )}
        {member.socials.telegram && (
            <a href={member.socials.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <TelegramLogo size={18} weight="fill" /> 
            </a>
        )}
        {member.socials.github && (
            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <GithubLogo size={18} weight="fill" /> 
            </a>
        )}
      </div>
    </div>
  );
};

export default function Team() {
  const navigate = useNavigate();
  const launch = () => navigate("/dashboard");

  return (
    <div className="min-h-screen w-full bg-[#0B0E1A] text-white font-inter relative overflow-x-hidden">
      {/* Background gradient overlay - reused from Home */}
      <div 
        className="absolute inset-0 pointer-events-none w-full"
        style={{
          background: 'linear-gradient(136deg, rgba(155, 89, 182, 0.2) 0%, rgba(155, 89, 182, 0.2) 25%, rgba(20, 241, 149, 0.2) 50%, rgba(11, 14, 26, 0) 75%)',
          minHeight: '100vh',
          height: '100%'
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar launch={launch} />
        
        <main className="flex-grow max-w-[1200px] mx-auto px-6 md:px-0 w-full pt-24 md:pt-40">
          
          {/* Header Section */}
          <section className="text-center mb-24">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Driving Innovation at the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b59b6] to-[#10e291]">
                  Edge of AI
                </span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal>
              <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
                A decentralized team united by one goal: making BlockAI the global standard for on-chain intelligence.
              </p>
            </ScrollReveal>
          </section>

          {/* Core Team Divider */}
          <div className="flex items-center justify-center mb-16">
            <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="text-xl font-semibold text-white tracking-wide">Core Team</span>
            </div>
          </div>

          {/* Team Grid */}
          <div className="pb-20 flex justify-center">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full">
              {teamMembers.map((member) => (
                <ScrollReveal key={member.id}>
                  <TeamCard member={member} />
                </ScrollReveal>
              ))}
            </section>
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
