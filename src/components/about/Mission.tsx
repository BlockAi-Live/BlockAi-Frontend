import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-10"
        >
          <div className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D8B4FE] via-[#A855F7] to-[#D8B4FE] bg-clip-text text-transparent">
              Our Mission
            </h2>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-xl md:text-2xl leading-relaxed max-w-3xl"
        >
          Alpha shouldn't be locked behind centralized paywalls. BlockAI gives every user—from beginners to advanced traders—a statistical edge powered by AI, transparency, and decentralization.
        </motion.p>
      </div>
    </section>
  );
}
