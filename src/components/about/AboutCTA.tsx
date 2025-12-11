import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AboutCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 w-full relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9B59B6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
        >
          <span className="text-white">Real-Time Intelligence</span>
          <br />
          <span className="bg-gradient-to-r from-[#D8B4FE] via-[#A855F7] to-[#D8B4FE] bg-clip-text text-transparent animate-gradient-x">
            Moves Faster
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed"
        >
          Join thousands of traders and founders who stay ahead with real-time on-chain intelligence.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/signup")}
          className="px-12 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-lg font-medium backdrop-blur-sm transition-all duration-300"
        >
          Sign Up
        </motion.button>

      </div>
    </section>
  );
}
