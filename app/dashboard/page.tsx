// app/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogIn, Sparkles, Code2, Users, Zap, Terminal, LogOut } from "lucide-react";
import { GlassCard, GlassCardHeader, GlassCardContent, GlassCardTitle, GlassCardDescription } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useToast } from "@/hooks/use-toast";

type Room = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(
    session?.user?.name?.split(" ")[0] ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);

  if (status === "authenticated" && !username && session?.user?.name) {
    setUsername(session.user.name.split(" ")[0]);
  }

  const handleCreateRoom = async (mode: "code" | "interview" = "code") => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${username}'s Room`, mode }),
      });

      if (!res.ok) {
        throw new Error("Failed to create room");
      }
      const newRoom = (await res.json()) as Room;
      router.push(`/room/${newRoom.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create room.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId || !username) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to join room");
      }

      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Joining Room",
        description: (error as Error).message || "That room does not exist.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <GlassPanel blur="lg" opacity={10} border className="w-20 h-20 rounded-2xl flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Code2 className="w-10 h-10 text-purple-400" />
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Logout Button */}
        <div className="absolute top-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>

        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-medium text-slate-300">Real-time Collaboration</span>
                    </div>
                  </motion.div>
                  
                  <h1 className="text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Build Together,
                    </span>
                    <br />
                    <span className="text-white">Ship Faster</span>
                  </h1>
                  
                  <p className="text-xl text-slate-400 max-w-lg">
                    Experience seamless collaboration with AI-powered assistance, 
                    real-time code execution, and intelligent Git integration.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Live Collaboration</h3>
                    <p className="text-xs text-slate-400">Code with your team in real-time with cursor tracking</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                      <Terminal className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Code Execution</h3>
                    <p className="text-xs text-slate-400">Run code instantly with Judge0 integration</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
                      <Sparkles className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">AI Assistant</h3>
                    <p className="text-xs text-slate-400">Get help from Gemini AI while coding</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-3">
                      <Code2 className="h-6 w-6 text-pink-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Smart Git</h3>
                    <p className="text-xs text-slate-400">AI-generated commit messages and Git UI</p>
                  </motion.div>
                </div>

                {/* Coming Soon Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Interview Mode</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/50">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Practice coding problems with built-in test runner</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard gradient className="overflow-hidden shadow-2xl">
                  <GlassCardHeader className="text-center space-y-4 pb-6">
                    <motion.div 
                      className="flex justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                        <Code2 className="h-10 w-10 text-white" />
                      </div>
                    </motion.div>
                    
                    <div>
                      <GlassCardTitle className="text-3xl mb-2">
                        <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          Start Coding
                        </span>
                      </GlassCardTitle>
                      <GlassCardDescription className="text-slate-300">
                        Join or create a collaboration room
                      </GlassCardDescription>
                    </div>
                  </GlassCardHeader>

                  <GlassCardContent className="space-y-6">
                    {/* Username Input */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        Your Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                      />
                    </motion.div>

                    {/* Room ID Input */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-blue-400" />
                        Room ID <span className="text-xs text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Room ID to join"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                      />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                      className="space-y-3 pt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <GradientButton
                        onClick={handleJoinRoom}
                        variant="purple-blue"
                        size="lg"
                        disabled={isLoading || !roomId || !username}
                        loading={isLoading}
                        fullWidth
                      >
                        <LogIn className="h-5 w-5 mr-2" />
                        Join Room
                      </GradientButton>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-slate-900/80 px-3 text-slate-500 font-medium">
                            OR
                          </span>
                        </div>
                      </div>

                      <GradientButton
                        onClick={() => handleCreateRoom("code")}
                        variant="glass"
                        size="lg"
                        disabled={isLoading || !username}
                        loading={isLoading}
                        fullWidth
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create New Room
                      </GradientButton>
                    </motion.div>
                  </GlassCardContent>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 relative z-10"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Zap className="h-10 w-10 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to CodeStream
          </span>
        </h1>
        
        <p className="text-xl text-slate-300 max-w-md mx-auto">
          Sign in to start collaborating with your team in real-time
        </p>
        
        <GradientButton
          onClick={() => router.push("/")}
          variant="purple-blue"
          size="xl"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Get Started
        </GradientButton>
      </motion.div>
    </div>
  );
}
