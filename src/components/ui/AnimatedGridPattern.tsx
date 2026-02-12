"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

function getPos(numCols: number, numRows: number) {
  return [
    Math.floor(Math.random() * numCols),
    Math.floor(Math.random() * numRows),
  ];
}

function generateSquares(
  count: number,
  numCols: number,
  numRows: number
) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: getPos(numCols, numRows),
  }));
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className = "",
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const numCols = Math.ceil(dimensions.width / width);
  const numRows = Math.ceil(dimensions.height / height);

  const [squares, setSquares] = useState(() =>
    generateSquares(numSquares, numCols, numRows)
  );

  function updateSquarePosition(id: number) {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id ? { ...sq, pos: getPos(numCols, numRows) } : sq
      )
    );
  }

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares, numCols, numRows));
    }
  }, [dimensions, numCols, numRows, numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [col, row], id: sqId }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: Infinity,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(sqId)}
            key={`${sqId}-${index}`}
            width={width - 1}
            height={height - 1}
            x={col * width + 1}
            y={row * height + 1}
            fill="currentColor"
            strokeWidth="0"
            className="text-[#14F195]"
          />
        ))}
      </svg>
    </svg>
  );
}

export default AnimatedGridPattern;
