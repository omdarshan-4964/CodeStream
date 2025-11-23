// components/ui/enhanced-avatar.tsx
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const EnhancedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border",
      className
    )}
    {...props}
  />
));
EnhancedAvatar.displayName = AvatarPrimitive.Root.displayName;

const EnhancedAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
EnhancedAvatarImage.displayName = AvatarPrimitive.Image.displayName;

const EnhancedAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-semibold text-primary-foreground",
      className
    )}
    {...props}
  />
));
EnhancedAvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { EnhancedAvatar, EnhancedAvatarImage, EnhancedAvatarFallback };
