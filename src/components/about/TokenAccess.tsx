import { motion } from "framer-motion";

const features = [
  { text: "Real-time whale alerts", color: "bg-[#14F195]" },
  { text: "Advanced predictive AI models", color: "bg-[#9B59B6]" },
  { text: "Early airdrop detection", color: "bg-[#2dd4bf]" },
  { text: "VIP analytics dashboard", color: "bg-[#8B5CF6]" },
  { text: "Exclusive community channels and research drops", color: "bg-[#38bdf8]" },
];

export default function TokenAccess() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Access & The BlockAI Token Section */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 w-full max-w-3xl"
          >
            <div className="px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Access & The <span className="text-[#9B59B6]">BlockAI</span> Token
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-8">
              Everyone gets access to core analytics for free. But holding the BlockAI Token unlocks premium features, including:
            </p>

            <ul className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${feature.color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                  <span className="text-gray-300 text-lg md:text-xl">{feature.text}</span>
                </li>
              ))}
            </ul>

            <p className="text-white text-xl md:text-2xl font-bold">
              The more tokens you hold, the more powerful your tools become.
            </p>
          </motion.div>
        </div>

        {/* AI Predictions You Can Trust Section */}
        <div className="flex flex-col items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 w-full max-w-3xl flex justify-end"
          >
            <div className="w-full px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg text-right">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-[#FFFFFF] to-[#8FFFE1] bg-clip-text text-transparent">
                AI Predictions You Can Trust
              </h2>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl leading-relaxed text-right max-w-3xl"
          >
            While no tool can guarantee perfect accuracy in the crypto markets, BlockAI provides probability-based insights grounded in hard data.
          </motion.p>
        </div>

      </div>
    </section>
  );
}
