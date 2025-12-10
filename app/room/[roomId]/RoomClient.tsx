// app/room/[roomId]/RoomClient.tsx
"use client";

import { java } from "@codemirror/lang-java";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { Bot, Copy, LogOut, Play, Users, Code2 } from "lucide-react";
import { ChatAssistant } from "@/app/components/ChatAssistant";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { CollaborationIndicator } from "@/components/ui/collaboration-indicator";
import { GitPanel } from "@/app/components/GitPanel";
import { io, type Socket } from "socket.io-client";

interface TeamMember {
  id: string;
  username: string;
}

const javaDefault = `// Java:Name the class to Main and remove 'public'
class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;

interface RoomClientProps {
  roomId: string;
  session: Session;
}

export default function RoomClient({ roomId, session }: RoomClientProps) {
  const [code, setCode] = useState(javaDefault);
  const [language, setLanguage] = useState("java");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sidebarTab, setSidebarTab] = useState<"team" | "git">("team");

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user) return;
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.emit("join-room", roomId, session.user.name?.split(" ")[0] ?? "Guest");
    return () => {
      newSocket.disconnect();
    };
  }, [roomId, session]);

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
    return () => {
      socket.off("receive-code", handleCodeReceive);
      socket.off("update-team-list", handleTeamUpdate);
    };
  }, [socket]);

  const onCodeChange = (value: string) => {
    setCode(value);
    if (socket) {
      socket.emit("code-change", roomId, value);
    }
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running code...");
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, input }),
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

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard.",
    });
  };

  const handleLeaveRoom = () => {
    router.push('/dashboard');
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <motion.div
            className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Left Sidebar */}
        <aside className="w-64 flex flex-col relative z-10 border-r border-white/5">
          <GlassPanel blur="lg" opacity={5} className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Code2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-sm text-white">CodeStream</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400">Live</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Room ID</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                    <code className="text-[11px] text-purple-300 font-mono truncate block">
                      {roomId}
                    </code>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopyRoomId}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <Copy className="h-3 w-3 text-slate-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="mt-3 flex gap-1.5">
                <button
                  onClick={() => setSidebarTab("team")}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                    sidebarTab === "team"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Team
                </button>
                <button
                  onClick={() => setSidebarTab("git")}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                    sidebarTab === "git"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Git
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {sidebarTab === "team" ? (
                <div className="h-full overflow-y-auto p-4">
                  <h3 className="text-xs font-semibold mb-3 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
                    <Users className="h-3 w-3" />
                    Members ({teamMembers.length})
                  </h3>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {teamMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {member.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate text-white">
                                  {member.username}
                                </p>
                                {member.id === socket?.id && (
                                  <span className="text-[10px] text-green-400">You</span>
                                )}
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <GitPanel roomId={roomId} />
              )}
            </div>

            {/* Leave Room Button */}
            <div className="p-4 border-t border-white/5">
              <GradientButton
                onClick={handleLeaveRoom}
                variant="pink-purple"
                size="sm"
                fullWidth
              >
                <LogOut className="h-3 w-3 mr-1.5" />
                Leave Room
              </GradientButton>
            </div>
          </GlassPanel>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col relative z-10">
          {/* Top Bar - Cleaner */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-slate-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <select
                className="bg-white/5 border border-white/10 px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
              >
                <option value="java" className="bg-slate-900">Java</option>
                <option value="javascript" className="bg-slate-900">JavaScript</option>
                <option value="python" className="bg-slate-900">Python</option>
              </select>
              
              <CollaborationIndicator 
                users={teamMembers.map(m => ({ id: m.id, name: m.username }))} 
                maxShow={3} 
              />
            </div>

            <div className="flex gap-2">
              <GradientButton
                onClick={() => setIsChatOpen(true)}
                variant="glass"
                size="sm"
              >
                <Bot className="h-3 w-3 mr-1.5" />
                Assistant
              </GradientButton>
              <GradientButton
                onClick={handleRunCode}
                variant="blue-cyan"
                size="sm"
                disabled={isLoading}
                loading={isLoading}
              >
                <Play className="h-3 w-3 mr-1.5" />
                {isLoading ? "Running..." : "Run"}
              </GradientButton>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              onChange={onCodeChange}
              theme={githubDark}
              extensions={[java()]}
              style={{
                height: "100%",
                width: "100%",
                fontSize: "13px",
              }}
              className="h-full"
            />
          </div>

          {/* Bottom Panels */}
          <div className="h-48 flex border-t border-white/5">
            {/* Input */}
            <div className="w-1/2 flex flex-col border-r border-white/5">
              <div className="h-7 px-3 flex items-center border-b border-white/5 bg-slate-900/50">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Input</span>
              </div>
              <textarea
                className="flex-1 bg-transparent text-slate-300 p-3 resize-none focus:outline-none text-xs font-mono placeholder-slate-600"
                placeholder="Enter input..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Output */}
            <div className="w-1/2 flex flex-col">
              <div className="h-7 px-3 flex items-center border-b border-white/5 bg-slate-900/50">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Output</span>
              </div>
              <pre className="flex-1 bg-transparent text-slate-300 p-3 overflow-y-auto text-xs font-mono">
                {output || "No output yet. Run your code."}
              </pre>
            </div>
          </div>
        </main>

        <ChatAssistant
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          currentCode={code}
        />
      </div>
    </TooltipProvider>
  );
}