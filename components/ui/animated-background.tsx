// components/ui/animated-background.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  children: ReactNode;
  variant?: "default" | "dark" | "purple";
}

export function AnimatedBackground({ 
  children, 
  variant = "default" 
}: AnimatedBackgroundProps) {
  const gradients = {
    default: "from-purple-500/10 via-blue-500/10 to-pink-500/10",
    dark: "from-slate-900 via-purple-900/20 to-slate-900",
    purple: "from-purple-500/20 via-blue-500/20 to-pink-500/20",
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]}`} />

      {/* Animated grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px"
      }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
