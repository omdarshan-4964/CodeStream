// components/ui/gradient-button.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        "purple-blue": "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50",
        "blue-cyan": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50",
        "pink-purple": "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/50",
        "glass": "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
        "outline": "border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "purple-blue",
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.button>, 'onAnimationStart'>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, loading, fullWidth, children, disabled, ...props }, ref) => {
    const buttonClasses = cn(
      gradientButtonVariants({ variant, size, className }),
      fullWidth && "w-full"
    );

    if (asChild) {
      return (
        <Slot
          className={buttonClasses}
          ref={ref}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };
