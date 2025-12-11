// app/components/Header.tsx
"use client";

import { motion } from "framer-motion";
import { Code2, LogOut, User, Settings } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GradientButton } from "@/components/ui/gradient-button";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show header on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full"
    >
      <GlassPanel blur="lg" opacity={10} className="border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CodeStream
              </span>
            </motion.button>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3"
                  >
                    <GlassPanel blur="sm" opacity={20} border className="px-4 py-2 rounded-lg hover:opacity-100 transition-all">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || 'User'}
                            className="w-7 h-7 rounded-full"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {user.name?.substring(0, 2).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="text-left hidden sm:block">
                          <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsMenuOpen(false)}
                          className="fixed inset-0 z-40"
                        />
                        
                        {/* Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 z-50"
                        >
                          <GlassPanel blur="lg" opacity={10} border className="rounded-xl overflow-hidden shadow-2xl">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  router.push('/dashboard');
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-white"
                              >
                                <User className="h-4 w-4 text-purple-400" />
                                <span className="text-sm">Dashboard</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  // Add settings route later
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-white"
                              >
                                <Settings className="h-4 w-4 text-blue-400" />
                                <span className="text-sm">Settings</span>
                              </button>

                              <div className="border-t border-white/10 my-2" />

                              <button
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  signOut({ callbackUrl: '/' });
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-400"
                              >
                                <LogOut className="h-4 w-4" />
                                <span className="text-sm">Sign Out</span>
                              </button>
                            </div>
                          </GlassPanel>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <GradientButton
                  onClick={() => signIn('google')}
                  variant="purple-blue"
                  size="sm"
                >
                  Sign In
                </GradientButton>
              )}
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.header>
  );
}
