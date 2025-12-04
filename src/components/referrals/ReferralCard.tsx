"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ReferralCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradientBorder?: boolean;
}

export const ReferralCard = React.forwardRef<HTMLDivElement, ReferralCardProps>(
  ({ children, className, hoverEffect = false, gradientBorder = false, ...props }, ref) => {
    if (gradientBorder) {
      return (
        <motion.div 
          className={cn(
            "relative p-[1px] rounded-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195] transition-all duration-300",
            hoverEffect && "hover:-translate-y-1"
          )}
        >
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={cn(
              "bg-[#0d0f18]/80 backdrop-blur-md relative overflow-hidden rounded-2xl h-full",
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-[#0d0f18]/80 backdrop-blur-md border border-white/10 relative overflow-hidden rounded-2xl transition-all duration-300",
          hoverEffect && "hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ReferralCard.displayName = "ReferralCard";
