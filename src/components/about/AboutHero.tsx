import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-40 pb-12 px-6 md:px-12 lg:px-20 w-full min-h-[70vh] flex items-center">
      
      {/* Right Sphere - Positioned Absolutely */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-24 z-0 pointer-events-none">
         <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[500px] md:w-[800px] 
                       mix-blend-screen
                       grayscale opacity-60"
          >
            <source src="/sphere-render.webm" type="video/webm" />
          </video>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-12"
          >
            About <span className="bg-gradient-to-r from-[#FFFFFF] via-[#794F9D] to-[#FFFFFF] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">BlockAI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-16 max-w-2xl"
          >
            BlockAI is a decentralized platform built for traders, founders, and on-chain explorers who need to stay ahead. We combine AI-powered analytics with live blockchain data to deliver actionable insights the moment they happen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl font-semibold italic whitespace-normal md:whitespace-nowrap"
          >
            <span className="bg-gradient-to-r from-[#A0FFC3] via-[#70E0A0] to-[#A0FFC3] bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
              The crypto market moves fast. BlockAI moves faster. {'>>>'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
