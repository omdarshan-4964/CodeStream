// components/ui/enhanced-input.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, helperText, ...props }, ref) => {
    const inputId = React.useId();
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border bg-input/50 px-4 py-2 text-sm transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive pr-10",
              success && "border-success focus:ring-success pr-10",
              !error && !success && "border-border focus:ring-primary",
              className
            )}
            ref={ref}
            {...props}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
          )}
          {success && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };
