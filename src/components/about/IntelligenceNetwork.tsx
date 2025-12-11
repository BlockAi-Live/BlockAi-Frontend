import { motion } from "framer-motion";
import Head from "@/assets/icons/Head";

export default function IntelligenceNetwork() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-visible">
      
      {/* Central Core */}
      <div className="relative z-20">
        <motion.div
          animate={{
            filter: [
              "drop-shadow(0 0 15px rgba(155, 89, 182, 0.4))",
              "drop-shadow(0 0 30px rgba(155, 89, 182, 0.8))",
              "drop-shadow(0 0 15px rgba(155, 89, 182, 0.4))",
            ],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
           <div className="scale-125">
             <Head />
           </div>
        </motion.div>
        
        {/* Core Glow */}
        <div className="absolute inset-0 bg-[#9B59B6] rounded-full blur-[80px] opacity-30 z-0 scale-150" />
      </div>

      {/* Orbiting Rings */}
      {[1, 2, 3].map((i) => {
        const size = 280 + i * 100;
        const radius = size / 2 - 1;
        const color = i === 1 ? '#14F195' : i === 2 ? '#9B59B6' : '#3B82F6';
        
        return (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{ width: size, height: size }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 10, repeat: Infinity, ease: "linear" }}
        >
           {/* Base Ring */}
           <div className="absolute inset-0 rounded-full border border-white/5" />
           
           {/* Glowing Segment */}
           <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
             <defs>
               <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor={color} stopOpacity="0" />
                 <stop offset="100%" stopColor={color} stopOpacity="1" />
               </linearGradient>
             </defs>
             <circle
               cx="50%"
               cy="50%"
               r={radius}
               fill="none"
               stroke={`url(#grad-${i})`}
               strokeWidth="2"
               strokeDasharray={`${size * 3.14}`}
               strokeDashoffset={`${size * 3.14 * 0.6}`} // Show 40%
               strokeLinecap="round"
               className="opacity-80 drop-shadow-[0_0_8px_currentColor]"
             />
           </svg>

           {/* Nodes */}
           {[0, 1, 2].map((j) => (
             <div
               key={j}
               className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
               style={{
                 transformOrigin: `50% ${size/2}px`,
                 transform: `rotate(${j * 120}deg)`,
               }}
             >
                <div className={`w-3 h-3 rounded-full bg-white shadow-[0_0_15px_${color}]`} />
             </div>
           ))}
        </motion.div>
      )})}
      
      {/* Floating Particles Background */}
      {[...Array(40)].map((_, i) => (
        <motion.div
            key={`p-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            initial={{ 
                x: Math.random() * 800 - 400, 
                y: Math.random() * 800 - 400,
                opacity: 0,
                scale: 0
            }}
            animate={{ 
                y: [Math.random() * 800 - 400, Math.random() * 800 - 400],
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0]
            }}
            transition={{ 
                duration: Math.random() * 5 + 3, 
                repeat: Infinity,
                delay: Math.random() * 5
            }}
        />
      ))}
    </div>
  );
}
