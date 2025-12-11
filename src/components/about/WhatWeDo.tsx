import { motion } from "framer-motion";

const items = [
  {
    title: "Whale movements & smart-money flows",
    description: "Movements happen fast. BlockAI catches them faster, tracking the wallets that move markets before the crowd notices.",
    align: "right",
    gradient: "linear-gradient(0deg, #9B69B5, #FFFFFF)",
    textColor: "text-[#D8B4FE]"
  },
  {
    title: "New airdrops and hidden opportunities",
    description: "Airdrops drop without warning. BlockAI identifies them early, giving you time to act when it matters most.",
    align: "left",
    gradient: "linear-gradient(120deg, #8FFFE1, #FFFFFF)",
    textColor: "text-[#A0FFC3]"
  },
  {
    title: "Liquidity changes, token metrics & early market shifts",
    description: "Liquidity shifts signal what's coming. BlockAI reads these changes in real time, before they move the price.",
    align: "right",
    gradient: "linear-gradient(0deg, #06B6D4, rgba(155, 105, 181, 0.7))",
    textColor: "text-[#38bdf8]"
  },
  {
    title: "Transaction patterns across influential wallets",
    description: "Every transaction tells a story. BlockAI reads the patterns, finding the signal in the noise of millions of trades.",
    align: "left",
    gradient: "linear-gradient(0deg, #2FCC59, #A0A0A0)",
    textColor: "text-[#4ade80]"
  },
  {
    title: "Emerging alpha signals before they trend",
    description: "Alpha moves fast. BlockAI surfaces it before the market catches on, giving you the edge when it counts.",
    align: "right",
    gradient: "linear-gradient(-144deg, #6366F1, #9CA3AF)",
    textColor: "text-[#818cf8]"
  }
];

export default function WhatWeDo() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-24">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-10"
          >
            <div className="px-8 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
              <h2 className="text-3xl font-bold text-[#D8B4FE]">
                What We Do
              </h2>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-xl md:text-2xl leading-relaxed max-w-4xl"
          >
            BlockAI continuously scans the blockchain to identify patterns, trends, and early signals that matter. Our system analyzes:
          </motion.p>
        </div>

        {/* Content Rows */}
        <div className="space-y-16 md:space-y-24">
          {items.map((item, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${item.align === 'left' ? '' : 'md:flex-row-reverse'}`}>
              
              {/* Card Side */}
              <motion.div 
                initial={{ opacity: 0, x: item.align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-2/3"
              >
                <div 
                  className="rounded-2xl p-[1px]"
                  style={{ background: item.gradient }}
                >
                  <div className="h-32 md:h-40 rounded-2xl bg-[#0B0E1A] flex items-center justify-center px-8 text-center shadow-[0_0_30px_-10px_rgba(0,0,0,0.3)] hover:bg-[#0B0E1A]/80 transition-colors duration-300">
                    <h3 className="text-2xl md:text-3xl font-medium text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: item.align === 'left' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full md:w-1/3"
              >
                 <p className={`text-lg md:text-xl leading-relaxed ${item.textColor} text-center ${item.align === 'left' ? 'md:text-left' : 'md:text-right'}`}>
                  {item.description}
                </p>
              </motion.div>

            </div>
          ))}
        </div>

        {/* Footer Text */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 text-center max-w-4xl mx-auto"
        >
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12">
                With AI-driven models trained on historical and live on-chain data, BlockAI surfaces high-probability insights designed to give you an early advantage.
            </p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

      </div>
    </section>
  );
}
