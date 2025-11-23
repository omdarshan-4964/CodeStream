// app/room/[roomId]/RoomClient.tsx
"use client";

// Editor Imports
import { java } from "@codemirror/lang-java";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { Bot, Copy, LogOut } from "lucide-react";
import { ChatAssistant } from "@/app/components/ChatAssistant";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // <-- IMPORT useToast

// React & Next.js Imports
import { useEffect, useState } from "react";
import { Session } from "next-auth"; // Type for session
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex h-screen w-full">
      {/* 1. Left Sidebar (Team Members) */}
      <aside className="w-1/5 bg-slate-950 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>
        <div className="grow">
          <ul>
            {teamMembers.map((member) => (
              <li
                key={member.id}
                className="flex items-center space-x-2 mb-2"
              >
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                  {member.username.substring(0, 2).toUpperCase()}
                </span>
                <span>{member.username}</span>
                {member.id === socket?.id && (
                  <span className="text-xs text-blue-400">(You)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* --- FIX 5: Connect buttons to handlers --- */}
        <div className="space-y-2">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center space-x-2 transition-transform duration-150 active:scale-95"
            onClick={handleCopyRoomId}
            title="Copy Room ID"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Room ID</span>
          </button>
          <button 
            className="w-full bg-red-600 hover:bg-red-700 p-2 rounded flex items-center justify-center space-x-2 transition-transform duration-150 active:scale-95"
            onClick={handleLeaveRoom}
            title="Leave Room"
          >
            <LogOut className="h-4 w-4" />
            <span>Leave Room</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Area (Editor + I/O) */}
      <main className="w-4/5 flex flex-col">
        {/* Top bar for language/theme */}
        <div className="flex justify-between items-center p-2 bg-slate-900 text-white border-b border-slate-800">
          <div>
            <label htmlFor="language" className="mr-2">
              Language:
            </label>
            <select
              id="language"
              className="bg-slate-800 p-1 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center space-x-1 p-2 rounded px-4 bg-blue-600 hover:bg-blue-700 transition-transform duration-150 active:scale-95"
                  onClick={() => setIsChatOpen(true)}
                >
                  <Bot size={16} />
                  <span>Gemini Assistant</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open AI Assistant</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 p-2 rounded px-4 disabled:bg-slate-600 transition-transform duration-150 active:scale-95"
                  onClick={handleRunCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Running..." : "Run Code"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Execute Code (Ctrl+Enter)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Editor Area */}
        <div className="grow bg-slate-900 text-white overflow-hidden">
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
        <div className="h-1/4 flex bg-slate-950 text-white">
          <div className="w-1/2 p-2 border-r border-slate-800 flex flex-col">
            <h3 className="font-semibold mb-2">Input</h3>
            <textarea
              className="w-full grow bg-slate-900 rounded p-2 resize-none"
              placeholder="Enter input for your program..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <div className="w-1/2 p-2 flex flex-col">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="w-full grow bg-slate-900 rounded p-2 overflow-y-auto">
              {output}
            </pre>
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