// components/ui/terminal-window.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";

export interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showControls?: boolean;
}

const TerminalWindow = React.forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ className, title = "terminal", showControls = true, children, ...props }, ref) => {
    return (
      <GlassPanel
        ref={ref}
        blur="md"
        opacity={10}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        {/* Window header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          {showControls && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          )}
          <div className="flex-1 text-center">
            <span className="text-xs text-gray-400 font-mono">{title}</span>
          </div>
          {showControls && <div className="w-[52px]" />} {/* Spacer for centering */}
        </div>

        {/* Window content */}
        <div className="p-4 font-mono text-sm">
          {children}
        </div>
      </GlassPanel>
    );
  }
);

TerminalWindow.displayName = "TerminalWindow";

export { TerminalWindow };
