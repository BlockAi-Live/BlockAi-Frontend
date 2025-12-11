import { motion } from "framer-motion";

export default function OurModels() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Part 1: Our Models */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-32">
          <div className="w-full md:w-1/2">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10 w-full max-w-3xl"
              >
                <div className="w-full px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-[#FFFFFF] to-[#6366F1] bg-clip-text text-transparent">
                    Our Models
                  </h2>
                </div>
              </motion.div>

              <motion.ul 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 mb-10"
              >
                <li className="flex items-center gap-4 text-xl text-gray-200">
                  <span className="w-4 h-4 rounded-full bg-[#14F195] shadow-[0_0_10px_#14F195]" />
                  Learn continuously from live blockchain activity
                </li>
                <li className="flex items-center gap-4 text-xl text-gray-200">
                  <span className="w-4 h-4 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
                  Adapt to market shifts
                </li>
                <li className="flex items-center gap-4 text-xl text-gray-200">
                  <span className="w-4 h-4 rounded-full bg-[#9B59B6] shadow-[0_0_10px_#9B59B6]" />
                  Improve with every block processed
                </li>
              </motion.ul>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 text-lg leading-relaxed max-w-lg"
              >
                This gives you a measurable informational edge — something previously accessible only to top-tier trading firms.
              </motion.p>
          </div>
        </div>

        {/* Part 2: BlockAI Never Sleeps */}
        <div className="flex flex-col md:flex-row justify-end items-start gap-12">
           <div className="w-full md:w-1/2 flex flex-col items-end text-right">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10 w-full max-w-3xl flex justify-end"
              >
                <div className="w-full px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg text-right">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-[#FFFFFF] to-[#8FFFE1] bg-clip-text text-transparent whitespace-nowrap">
                    BlockAI Never Sleeps
                  </h2>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-300 text-xl mb-10 max-w-lg"
              >
                Every second, the chain changes. And every second, BlockAI updates;
              </motion.p>

              <motion.ul 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                {[
                  "Whales moving",
                  "Airdrops dropping",
                  "Smart money loading",
                  "Tokens pumping",
                  "Wallets shifting"
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-end gap-4 text-xl text-gray-200">
                    {item}
                    <span className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </li>
                ))}
              </motion.ul>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white text-xl md:text-2xl mt-10"
              >
                All in real time. All decentralized.
              </motion.p>
           </div>
        </div>

      </div>
    </section>
  );
}
