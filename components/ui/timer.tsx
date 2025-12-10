// components/ui/timer.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";

export interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onTick?: (remainingSeconds: number) => void;
  autoStart?: boolean;
  className?: string;
  showControls?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  onTick,
  autoStart = false,
  className,
  showControls = true,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (onTick) onTick(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, onComplete, onTick]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const isWarning = timeLeft <= 300 && timeLeft > 60; // Last 5 minutes
  const isCritical = timeLeft <= 60; // Last minute

  const handleToggle = () => {
    if (timeLeft <= 0) return;
    setIsRunning(!isRunning);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const gradientColor = isCritical
    ? { from: "red-500", to: "rose-500" }
    : isWarning
    ? { from: "yellow-500", to: "orange-500" }
    : { from: "purple-500", to: "blue-500" };

  return (
    <GlassPanel blur="md" opacity={10} className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-4">
        {/* Progress ring */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-white/10"
            />
            {/* Progress circle */}
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 176" }}
              animate={{
                strokeDasharray: `${(progress / 100) * 176} 176`,
              }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`stop-${gradientColor.from}`} />
                <stop offset="100%" className={`stop-${gradientColor.to}`} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className={cn(
              "h-6 w-6",
              isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-purple-500"
            )} />
          </div>
        </div>

        {/* Time display */}
        <div className="flex-1">
          <motion.div
            className={cn(
              "text-3xl font-bold font-mono tabular-nums",
              isCritical && "text-red-500 animate-pulse",
              isWarning && "text-yellow-500",
              !isWarning && !isCritical && "text-white"
            )}
            animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-xs text-gray-400 mt-1">
            {isRunning ? "Running" : isPaused ? "Paused" : "Not started"}
          </p>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              disabled={timeLeft <= 0}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Warning messages */}
      {isWarning && timeLeft > 60 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs text-center"
        >
          ⚠️ Less than 5 minutes remaining
        </motion.div>
      )}
      {isCritical && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-semibold"
        >
          🚨 Less than 1 minute remaining!
        </motion.div>
      )}
    </GlassPanel>
  );
};

Timer.displayName = "Timer";

export { Timer };
