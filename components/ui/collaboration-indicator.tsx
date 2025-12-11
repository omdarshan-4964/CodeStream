// components/ui/collaboration-indicator.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedAvatar, EnhancedAvatarFallback } from "./enhanced-avatar";

export interface CollaborationIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    color?: string;
    isOnline?: boolean;
  }>;
  className?: string;
  maxShow?: number;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  users,
  className,
  maxShow = 3,
}) => {
  const visibleUsers = users.slice(0, maxShow);
  const extraCount = users.length - maxShow;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center -space-x-2">
        <AnimatePresence>
          {visibleUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <EnhancedAvatar className="h-8 w-8 border-2 border-slate-950">
                <EnhancedAvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </EnhancedAvatarFallback>
              </EnhancedAvatar>
              {user.isOnline && (
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-950"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {extraCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-slate-950 text-xs font-semibold text-white"
          >
            +{extraCount}
          </motion.div>
        )}
      </div>

      <motion.div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Users className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-300">
          {users.length} {users.length === 1 ? "user" : "users"}
        </span>
      </motion.div>
    </div>
  );
};

CollaborationIndicator.displayName = "CollaborationIndicator";

export { CollaborationIndicator };
