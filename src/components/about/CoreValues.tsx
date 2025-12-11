import { motion } from "framer-motion";

const features = [
  {
    icon: "/analytics.svg",
    label: "Analytics",
    title: "AI-Powered Analysis of On-Chain Behavior",
    description: "Our models learn from millions of data points across the blockchain, identifying patterns that matter before they trend."
  },
  {
    icon: "/data.svg",
    label: "Data",
    title: "Live Blockchain Signals in Real Time",
    description: "Every second, the chain changes. BlockAI updates with it, capturing whale movements, liquidity shifts, and emerging opportunities."
  },
  {
    icon: "/insights.svg",
    label: "Insights",
    title: "Actionable Intelligence Delivered Instantly",
    description: "No waiting hours for analysis. BlockAI surfaces high-probability signals designed to give you an early advantage."
  }
];

export default function CoreValues() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <div className="px-8 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
              <h2 className="text-3xl font-bold text-[#A0FFC3]">
                Core
              </h2>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#A0FFC3] to-[#14F195] bg-clip-text text-transparent"
          >
            What BlockAI Delivers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-xl"
          >
            Three pillars power the platform
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              className="relative group h-full"
            >
              <div className="h-full p-8 rounded-3xl border border-[#794F9D]/30 bg-[#0B0E1A]/50 backdrop-blur-sm hover:border-[#794F9D]/60 transition-colors duration-300 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-8 relative w-24 h-24 flex items-center justify-center">
                  <img 
                    src={feature.icon} 
                    alt={feature.label}
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(20,241,149,0.3)]"
                  />
                </div>

                {/* Label */}
                <span className="text-[#14F195] font-medium mb-4 block">
                  {feature.label}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-6 leading-tight min-h-[3.5rem]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
