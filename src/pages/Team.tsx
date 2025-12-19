import { useNavigate } from "react-router-dom";
import { Navbar, Footer } from "@/components/home";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Twitter, Linkedin, Github, Globe } from "lucide-react";

// Team Data
interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Siamak Khoshnood",
    role: "Founder & CEO",
    bio: "Siamak is an experienced Web3 Founder with over seven years of hands-on involvement in the blockchain industry. He drives product vision and ecosystem strategy across DeFi, AI, and analytics to ensure successful project execution and growth"
  },
  {
    id: 2,
    name: "Raymond Henry (Mr. Eagle)",
    role: "Chief Operating Officer (COO)",
    bio: "Raymond is an experienced Web3 COO with over five years of expertise in blockchain coordination. He executes project roadmaps and manages cross-functional sprints, acting as the primary liaison between technical and marketing teams to ensure all deliverables align with the project’s long-term vision."
  },
  {
    id: 3,
    name: "Ferdous",
    role: "Chief Financial Officer (CFO)",
    bio: "Ferdous is a battle-tested CFO with over seven years of experience in crypto finance. He specializes in capital structuring and treasury management to maximize runway, while overseeing tokenomics frameworks and financial governance to ensure long-term scalability and performance."
  },
  {
    id: 4,
    name: "Bima",
    role: "Chief Marketing Officer (CMO)",
    bio: "Bima is a Web3 Marketing Strategist specializing in narrative building and user acquisition. He crafts story-driven campaigns and analyzes on-chain trends to drive liquidity attraction, converting market attention into scalable community growth and long-term user engagement."
  },
  {
    id: 5,
    name: "Kufre Asuquo",
    role: "CFO/BDM",
    bio: "Kufre is a Business Development Lead specializing in exchange relations and ecosystem expansion. He accelerates product adoption by securing high-value partnerships and investor collaborations, driving the strategic market positioning and growth of the BlockAI.live ecosystem."
  },
  {
    id: 6,
    name: "Renegade",
    role: "Business Development Manager",
    bio: "Renegade has three years of experience growing crypto communities across AI, Telegram apps, and gaming. He manages BlockAI’s presence on Telegram, Discord, and X, focusing on member onboarding and KOL partnerships. Assisting the founder on strategy, he provides vital feedback on branding and sentiment to drive project improvement."
  },
  {
    id: 7,
    name: "Kiwi",
    role: "Community Manager",
    bio: "Kiwi is a certified Web3 marketer and collaboration manager specialized in promoting decentralized products. She fosters engagement on Discord, Telegram, and X, while onboarding users to blockchain concepts. By managing DAO partnerships and token-based rewards, she bridges marketing and technical teams to drive long-term ecosystem growth."
  },
  {
    id: 8,
    name: "ImmortalSui",
    role: "Frontend/Full-stack Engineer",
    bio: "ImmortalSul is an experienced engineer with over 4.5 years of expertise in building scalable web applications. He manages the full development lifecycle, from high-performance frontends to robust backend APIs. By leading architectural decisions, he ensures code quality, security, and rapid feature prototyping to meet tight production timelines."
  },
  {
    id: 9,
    name: "Promise Bamgbola",
    role: "Frontend Developer",
    bio: "Promise is a Frontend Engineer with over three years of experience building modern, high-performance web applications using React and Vite. He specializes in mobile-first interfaces and efficient state management, ensuring clean, reliable user flows and optimized performance that align with real-world product goals and user needs."
  },
  {
    id: 10,
    name: "Victor Linkie",
    role: "Product Designer & Head of Traction and Community",
    bio: "Victor is the engine behind BlockAI’s visual identity and UI, designing everything from wireframes to the real-time dashboard. He bridges product design and community execution, running questing campaigns and growth playbooks to scale BlockAI into a top-tier crypto community with rapid-speed delivery."
  },
  {
    id: 11,
    name: "Sara",
    role: "Graphic & 3D Designer",
    bio: "Sara is a 3D and Graphic Designer with three years of Web3 experience. She produces the 2D/3D visual assets that define the project's identity across all platforms. By translating complex concepts into compelling visuals, she leads creative research to strengthen the brand’s aesthetic and long-term design direction."
  },
  {
    id: 12,
    name: "Web3guy",
    role: "Content/KOL",
    bio: "Web3guy is a Web3 ambassador and content creator focused on ecosystem growth and education. He simplifies complex concepts to onboard new users while producing high-value threads and memes. By fostering positive interactions and sharing trusted perspectives, he strengthens project visibility and inspires long-term community engagement."
  },
  {
    id: 13,
    name: "Harmonious Harmony",
    role: "Content Writer / Graphic Designer",
    bio: "Harmonious harmony is a digital creator with three years of experience collaborating with projects like Arcana Network and XX Network. He specializes in clear storytelling and strong visuals, transforming complex concepts into engaging narratives that drive community trust. By focusing on user-centered communication, he fosters project awareness and deep ecosystem engagement."
  },
  {
    id: 14,
    name: "Shuaib Nurudeen Olawale",
    role: "Backend/Fullstack Developer",
    bio: "Shuaib is a Full-Stack Developer specializing in the MERN stack and React Native to build scalable web and mobile applications. An Agile-certified practitioner and Google-certified marketer, he combines technical expertise in TypeScript and Next.js with SEO strategy to deliver secure, high-impact, and user-centric digital solutions."
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
             src={`/pfps/${member.id}.png`} 
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
        <button className="text-gray-500 hover:text-white transition-colors">
          <Twitter size={18} />
        </button>
        <button className="text-gray-500 hover:text-white transition-colors">
          <Linkedin size={18} />
        </button>
        <button className="text-gray-500 hover:text-white transition-colors">
          <Globe size={18} />
        </button>
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
          <div className="pb-20 space-y-8">
            {/* Top Row - Executives (2 columns) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {teamMembers.slice(0, 2).map((member) => (
                <ScrollReveal key={member.id}>
                  <TeamCard member={member} />
                </ScrollReveal>
              ))}
            </section>

            {/* Remaining Team (3 columns) */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {teamMembers.slice(2).map((member) => (
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
