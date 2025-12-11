import { motion } from "framer-motion";

export default function WhyBlockAIExists() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 w-full max-w-3xl"
        >
          <div className="w-full px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-[#D8B4FE]">
              Why BlockAI Exists
            </h2>
          </div>
        </motion.div>

        <motion.ul 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 max-w-4xl"
        >
          {[
            "Because alpha shouldn't be locked behind centralized paywalls.",
            "Because on-chain data should be accessible to everyone.",
            "Because the future of trading intelligence is decentralized, instant, and AI-powered.",
            "BlockAI gives you the clarity, speed, and insight needed to navigate the crypto world with confidence."
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-4 text-xl md:text-2xl text-gray-200 leading-relaxed">
              <span className="mt-2 w-4 h-4 min-w-[1rem] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
