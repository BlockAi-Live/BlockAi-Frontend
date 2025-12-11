import { motion } from "framer-motion";

export default function Discovery() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* How BlockAI Discovers Alpha Section */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 w-full max-w-3xl"
          >
            <div className="px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D8B4FE] via-[#A855F7] to-[#D8B4FE] bg-clip-text text-transparent">
                How BlockAI Discovers Alpha
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
            BlockAI continuously scans the blockchain to identify patterns, trends, and early signals that matter. Our AI models analyze smart-money wallet behavior, token creation patterns, unusual transaction spikes, and flow imbalances—all processed in real time.
          </motion.p>
        </div>

        {/* Supported Blockchains Section */}
        <div className="flex flex-col items-end">
          {/* Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 w-full max-w-3xl flex justify-end"
          >
            <div className="w-full px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg text-right">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-[#FFFFFF] to-[#4169E1] bg-clip-text text-transparent">
                Supported Blockchains
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Card Side (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-start lg:justify-end"
            >
              <div className="w-full max-w-md h-64 rounded-3xl border border-[#3B82F6]/50 bg-[#0B0E1A]/50 backdrop-blur-sm p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#3B82F6] transition-colors duration-300">
                <div className="absolute inset-0 bg-[#3B82F6]/5 group-hover:bg-[#3B82F6]/10 transition-colors duration-300" />
                
                <span className="text-white font-bold tracking-wider text-sm relative z-10">
                  CHAINS SUPPORTED
                </span>

                <div className="text-right relative z-10">
                  <span className="text-6xl font-bold text-[#3B82F6]">Base</span>
                </div>

                <div className="relative z-10">
                  <div className="w-full h-px bg-gray-700 mb-4" />
                  <p className="text-gray-400 text-sm">
                    With more L1s and L2s launching soon
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Text Side (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-right"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Built for <span className="text-[#3B82F6]">Base</span>,
                <br />
                expanding everywhere
              </h3>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed ml-auto max-w-xl">
                BlockAI currently powers Base with more L1s and L2s coming soon. Our vision is becoming the universal intelligence layer across all major blockchains.
              </p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
