// app/room/[roomId]/RoomClient.tsx
"use client";

// Editor Imports
import { java } from "@codemirror/lang-java";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { Bot, Copy, LogOut, Play, Users as UsersIcon, Code2 } from "lucide-react";
import { ChatAssistant } from "@/app/components/ChatAssistant";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// React & Next.js Imports
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced Components
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { EnhancedAvatar, EnhancedAvatarFallback } from "@/components/ui/enhanced-avatar";
import { EnhancedBadge } from "@/components/ui/enhanced-badge";

// Socket.IO Import
import { io, type Socket } from "socket.io-client";

// --- FIX 1: Define the TeamMember interface ---
interface TeamMember {
  id: string;
  username: string;
}

// The default Java code
const javaDefault = `// Java:Name the class to Main and remove 'public'
class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;

// Define the props our component will receive
interface RoomClientProps {
  roomId: string;
  session: Session; // Pass the whole session object
}

export default function RoomClient({ roomId, session }: RoomClientProps) {
  // Editor state
  const [code, setCode] = useState(javaDefault);
  const [language, setLanguage] = useState("java");

  // I/O state
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Socket.IO state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // --- FIX 2: Initialize router and toast ---
  const router = useRouter();
  const { toast } = useToast();

  // Effect 1: Setup Socket.IO
  useEffect(() => {
    // --- FIX 3: Add session guard to prevent crash ---
    if (!session?.user) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.emit("join-room", roomId, session.user.name?.split(" ")[0] ?? "Guest");

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, session]); // <-- Add session to dependency array

  // Effect 2: Setup Socket.IO Listeners
  useEffect(() => {
    if (!socket) return;

    const handleCodeReceive = (newCode: string) => {
      setCode(newCode);
    };
    socket.on("receive-code", handleCodeReceive);

    const handleTeamUpdate = (members: TeamMember[]) => {
      setTeamMembers(members);
    };
    socket.on("update-team-list", handleTeamUpdate);

    // Don't forget to cleanup the team update listener
    return () => {
      socket.off("receive-code", handleCodeReceive);
      socket.off("update-team-list", handleTeamUpdate);
    };
  }, [socket]); // Re-run if the socket instance changes

  // Editor onChange handler
  const onCodeChange = (value: string) => {
    setCode(value);
    if (socket) {
      socket.emit("code-change", roomId, value);
    }
  };

  // Code execution handler
  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running code...");

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          input,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setOutput(`Error: ${result.message || "Something went wrong"}`);
        return;
      }

      if (result.status.id === 3) {
        setOutput(result.stdout || "No output");
      } else if (result.status.id === 6) {
        setOutput(result.compile_output);
      } else {
        setOutput(result.stderr || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      setOutput("Failed to run code. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIX 4: Add new button handlers ---
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard.",
    });
  };

  const handleLeaveRoom = () => {
    router.push('/');
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-background">
        {/* 1. Left Sidebar (Team Members) */}
        <aside className="w-72 bg-card border-r border-border flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">CodeStream</h2>
                <EnhancedBadge variant="secondary" className="text-xs">
                  Live Session
                </EnhancedBadge>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Room ID</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-background border border-border rounded px-2 py-1 flex-1 truncate">
                  {roomId}
                </code>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopyRoomId}
                      className="p-1.5 hover:bg-background rounded transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Room ID</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Team Members ({teamMembers.length})
            </h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
                >
                  <EnhancedAvatar className="h-8 w-8">
                    <EnhancedAvatarFallback>
                      {member.username.substring(0, 2).toUpperCase()}
                    </EnhancedAvatarFallback>
                  </EnhancedAvatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.username}
                    </p>
                    {member.id === socket?.id && (
                      <EnhancedBadge variant="success" className="text-xs mt-1">
                        You
                      </EnhancedBadge>
                    )}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-border space-y-2">
            <EnhancedButton
              onClick={handleLeaveRoom}
              variant="danger"
              size="default"
              fullWidth
            >
              <LogOut className="h-4 w-4" />
              Leave Room
            </EnhancedButton>
          </div>
        </aside>

        {/* 2. Main Area (Editor + I/O) */}
        <main className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <label htmlFor="language" className="text-sm font-medium">
                Language:
              </label>
              <select
                id="language"
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
              >
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div className="flex gap-3">
              <EnhancedButton
                onClick={() => setIsChatOpen(true)}
                variant="secondary"
                size="default"
              >
                <Bot className="h-4 w-4" />
                Gemini Assistant
              </EnhancedButton>
              <EnhancedButton
                onClick={handleRunCode}
                variant="primary"
                size="default"
                disabled={isLoading}
                loading={isLoading}
              >
                <Play className="h-4 w-4" />
                {isLoading ? "Running..." : "Run Code"}
              </EnhancedButton>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 bg-[#0d1117] overflow-hidden">
            <CodeMirror
              value={code}
              onChange={onCodeChange}
              theme={githubDark}
              extensions={[java()]}
              style={{
                height: "100%",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Bottom Panels (Input/Output) */}
          <div className="h-64 flex border-t border-border">
            {/* Input Panel */}
            <div className="w-1/2 flex flex-col border-r border-border bg-card">
              <div className="h-12 px-4 flex items-center border-b border-border">
                <h3 className="text-sm font-semibold">Input</h3>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  className="w-full h-full bg-background border border-border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                  placeholder="Enter input for your program..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="w-1/2 flex flex-col bg-card">
              <div className="h-12 px-4 flex items-center border-b border-border">
                <h3 className="text-sm font-semibold">Output</h3>
              </div>
              <div className="flex-1 p-4">
                <pre className="w-full h-full bg-background border border-border rounded-lg p-3 overflow-y-auto text-sm font-mono">
                  {output || "No output yet. Run your code to see results."}
                </pre>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Assistant Sheet */}
        <ChatAssistant
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          currentCode={code}
        />
      </div>
    </TooltipProvider>
  );
}