// components/ui/glass-panel.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "none" | "sm" | "md" | "lg" | "xl";
  opacity?: 5 | 10 | 20 | 30;
  border?: boolean;
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, blur = "sm", opacity = 5, border = true, children, ...props }, ref) => {
    const blurClasses = {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    const opacityClasses = {
      5: "bg-white/5",
      10: "bg-white/10",
      20: "bg-white/20",
      30: "bg-white/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          opacityClasses[opacity],
          blurClasses[blur],
          border && "border border-white/10",
          "rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
