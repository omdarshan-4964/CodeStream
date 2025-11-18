// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="bg-zinc-950 text-white min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
        <Card className="w-[400px] bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Join or Create Room</CardTitle>
            <CardDescription>
              Enter a Room ID to join or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleJoinRoom}
                className="w-full"
                disabled={isLoading || !roomId || !username}
              >
                {isLoading ? "Joining..." : "Join Room"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCreateRoom}
                className="w-full"
                disabled={isLoading || !username}
              >
                {isLoading ? "Creating..." : "Create New Room"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CodeStream v2</h1>
      <p className="text-xl text-muted-foreground">
        Please sign in to join or create a room.
      </p>
    </div>
  );
}
