"use client";

import { ReferralCard } from "./ReferralCard";
import { motion } from "framer-motion";
import { useState } from "react";

const Node = ({ x, y, level, color, label }: { x: number, y: number, level: number, color: string, label: string }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: level * 0.2, type: "spring", stiffness: 200, damping: 20 }}
    whileHover={{ scale: 1.1 }}
    className="cursor-pointer"
  >
    {/* Outer Glow */}
    <circle cx={x} cy={y} r={24} fill={color} opacity="0.1" className="animate-pulse" />
    {/* Border */}
    <circle cx={x} cy={y} r={18} fill="#111827" stroke={color} strokeWidth="2" />
    {/* Inner Dot */}
    <circle cx={x} cy={y} r={6} fill={color} />
    
    <text x={x} y={y + 40} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" className="uppercase tracking-wider font-mono">
      {label}
    </text>
  </motion.g>
);

const Connection = ({ x1, y1, x2, y2, color }: { x1: number, y1: number, x2: number, y2: number, color: string }) => (
  <motion.path
    d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 0.3 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke={color}
    strokeWidth="2"
    fill="none"
  />
);

export default function ReferralTree() {
  const [zoom, setZoom] = useState(1);

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Network Visualization</h2>
        <div className="flex gap-2 bg-[#0d0f18]/60 backdrop-blur-sm p-1 rounded-lg border border-white/10">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">-</button>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">+</button>
        </div>
      </div>

      <ReferralCard gradientBorder className="h-[300px] md:h-[500px] w-full flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
          {Array.from({ length: 1600 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white" />
          ))}
        </div>

        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
          animate={{ scale: zoom }}
          className="w-full h-full"
        >
          <g transform="translate(400, 50)">
            {/* Root */}
            <Node x={0} y={0} level={0} color="#FFFFFF" label="You" />

            {/* Level 1 Connections */}
            <Connection x1={0} y1={24} x2={-200} y2={150} color="#6366F1" />
            <Connection x1={0} y1={24} x2={0} y2={150} color="#6366F1" />
            <Connection x1={0} y1={24} x2={200} y2={150} color="#6366F1" />

            {/* Level 1 Nodes */}
            <Node x={-200} y={150} level={1} color="#6366F1" label="L1 User" />
            <Node x={0} y={150} level={1} color="#6366F1" label="L1 User" />
            <Node x={200} y={150} level={1} color="#6366F1" label="L1 User" />

            {/* Level 2 Connections */}
            <Connection x1={-200} y1={174} x2={-250} y2={300} color="#8B5CF6" />
            <Connection x1={-200} y1={174} x2={-150} y2={300} color="#8B5CF6" />
            <Connection x1={0} y1={174} x2={0} y2={300} color="#8B5CF6" />

            {/* Level 2 Nodes */}
            <Node x={-250} y={300} level={2} color="#8B5CF6" label="L2 User" />
            <Node x={-150} y={300} level={2} color="#8B5CF6" label="L2 User" />
            <Node x={0} y={300} level={2} color="#8B5CF6" label="L2 User" />
          </g>
        </motion.svg>
        
        <div className="absolute bottom-6 right-6 flex gap-6 text-xs font-mono bg-[#0d0f18]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.5)]" /> Level 1
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.5)]" /> Level 2
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.5)]" /> Level 3
          </div>
        </div>
      </ReferralCard>
    </section>
  );
}
