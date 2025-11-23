// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LogIn, Sparkles, Code2 } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { EnhancedInput } from "@/components/ui/enhanced-input";
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

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${username}'s Room` }),
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
          >
            <EnhancedCard className="overflow-hidden">
              <EnhancedCardHeader className="text-center space-y-4 pb-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <Code2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <EnhancedCardTitle className="text-4xl">
                  Code Together, Create Forever
                </EnhancedCardTitle>
                <EnhancedCardDescription className="text-lg">
                  Join an existing room or start a new collaboration session
                </EnhancedCardDescription>
              </EnhancedCardHeader>

              <EnhancedCardContent className="space-y-8">
                {/* Username Input */}
                <div className="space-y-2">
                  <EnhancedInput
                    label="Your Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    helperText="This is how others will see you in the room"
                  />
                </div>

                {/* Room ID Input */}
                <div className="space-y-2">
                  <EnhancedInput
                    label="Room ID (Optional)"
                    placeholder="Enter Room ID to join existing room"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <EnhancedButton
                    onClick={handleJoinRoom}
                    variant="primary"
                    size="lg"
                    disabled={isLoading || !roomId || !username}
                    loading={isLoading}
                    fullWidth
                  >
                    <LogIn className="h-5 w-5" />
                    Join Existing Room
                  </EnhancedButton>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-4 text-muted-foreground font-medium">
                        OR
                      </span>
                    </div>
                  </div>

                  <EnhancedButton
                    onClick={handleCreateRoom}
                    variant="outline"
                    size="lg"
                    disabled={isLoading || !username}
                    loading={isLoading}
                    fullWidth
                  >
                    <Plus className="h-5 w-5" />
                    Create New Room
                  </EnhancedButton>
                </div>

                {/* Features List */}
                <div className="pt-6 space-y-3 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span>AI-powered code assistance and debugging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Code2 className="h-4 w-4 text-secondary" />
                    </div>
                    <span>Real-time collaboration with live cursors</span>
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto">
          <Code2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to CodeStream</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Please sign in to join or create a collaborative coding room
        </p>
      </motion.div>
    </div>
  );
}
