// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Make sure this is from 'next/navigation'
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

// We'll use this type for the API response
type Room = {
  id: string;
  name: string;
  // ...other fields
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Get the router
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(
    session?.user?.name?.split(" ")[0] ?? ""
  );
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Update username in state if session loads after component
  if (status === "authenticated" && !username && session?.user?.name) {
    setUsername(session.user.name.split(" ")[0]);
  }

  // UPDATED FUNCTION
  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${username}'s Room`, // Pass a name for the room
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create room");
      }

      const newRoom = (await res.json()) as Room;

      // Redirect to the new room's page
      router.push(`/room/${newRoom.id}`);
    } catch (error) {
      console.error(error);
      // TODO: Add a toast notification for the user
      setIsLoading(false);
    }
    // We don't set loading to false here because we are navigating away
  };

  // NOT CHANGED
  const handleJoinRoom = () => {
    if (roomId && username) {
      // We'll add this logic later
      console.log(`Joining room ${roomId} as ${username}`);
      // Redirect to the joined room
      router.push(`/room/${roomId}?username=${username}`);
    }
  };

  // 1. Show a loading state (NOT CHANGED)
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // 2. Show the "Join/Create Room" card if logged in (UPDATED BUTTONS)
  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-[400px]">
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
                  disabled={isLoading} // Disable input when loading
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  disabled={isLoading} // Disable input when loading
                />
              </div>
              <Button
                onClick={handleJoinRoom}
                className="w-full"
                disabled={isLoading || !roomId || !username} // Disable button
              >
                Join Room
              </Button>
              <Button
                variant="secondary"
                onClick={handleCreateRoom}
                className="w-full"
                disabled={isLoading || !username} // Disable button
              >
                {isLoading ? "Creating..." : "Create New Room"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Show a "Please log in" message if not logged in (NOT CHANGED)
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CodeStream v2</h1>
      <p className="text-xl text-muted-foreground">
        Please sign in to join or create a room.
      </p>
    </div>
  );
}