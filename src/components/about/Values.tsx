import { Shield, Zap, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: <Shield className="w-8 h-8 text-[#14F195]" />,
    title: "Trust & Transparency",
    description: "We believe in open-source code and verifiable data. No black boxes, just pure on-chain truth."
  },
  {
    icon: <Zap className="w-8 h-8 text-[#9B59B6]" />,
    title: "Lightning Fast",
    description: "In crypto, seconds matter. Our infrastructure is built for real-time data processing and instant alerts."
  },
  {
    icon: <Globe className="w-8 h-8 text-[#14F195]" />,
    title: "Decentralization",
    description: "Power to the people. We are building tools that empower individuals, not institutions."
  },
  {
    icon: <Users className="w-8 h-8 text-[#9B59B6]" />,
    title: "Community First",
    description: "Our roadmap is driven by our users. We build what the community needs to succeed."
  }
];

export default function Values() {
  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-[#10e291] font-bold text-xl mb-4 tracking-wider uppercase">Our Values</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-white">What Drives Us Forward</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="h-full bg-[#0B0E1A]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
                {/* Glassmorphic Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
