// app/room/[roomId]/RoomClient.tsx
"use client";

// Editor Imports
import { java } from "@codemirror/lang-java"
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { Bot } from "lucide-react";
import { ChatAssistant } from "@/app/components/ChatAssistant";

// React & Next.js Imports
import { useEffect, useState } from "react";
import { Session } from "next-auth"; // Type for session

// Socket.IO Import
import { io, type Socket } from "socket.io-client";

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

  // Effect 1: Setup Socket.IO
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.emit("join-room", roomId);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Effect 2: Setup Socket.IO Listeners
  useEffect(() => {
    if (!socket) return;

    const handleCodeReceive = (newCode: string) => {
      setCode(newCode);
    };
    socket.on("receive-code", handleCodeReceive);

    return () => {
      socket.off("receive-code", handleCodeReceive);
    };
  }, [socket]);

  // Editor onChange handler
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

      // Handle different result statuses from Judge0
      if (result.status.id === 3) { // Accepted
        setOutput(result.stdout || "No output");
      } else if (result.status.id === 6) { // Compilation Error
        setOutput(result.compile_output);
      } else { // Other errors
        setOutput(result.stderr || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      setOutput("Failed to run code. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* 1. Left Sidebar (Team Members) */}
      <aside className="w-1/5 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>
        <div className="flex-grow">
          <ul>
            <li className="flex items-center space-x-2 mb-2">
              <img
                src={session.user.image ?? ""}
                alt={session.user.name ?? "User"}
                className="w-8 h-8 rounded-full"
              />
              <span>{session.user.name} (Owner)</span>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
            Copy Room ID
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 p-2 rounded">
            Leave Room
          </button>
        </div>
      </aside>

      {/* 2. Main Area (Editor + I/O) */}
      <main className="w-4/5 flex flex-col">
      <ChatAssistant
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        currentCode={code}
    />
        {/* Top bar for language/theme */}
        {/* ... inside <main> ... */}
{/* Top bar for language/theme */}
        <div className="flex justify-between items-center p-2 bg-gray-800 text-white border-b border-gray-700">
        <div>
            {/* ... language dropdown ... */}
        </div>

        {/* --- ADD THIS BUTTON --- */}
        <div className="flex space-x-2">
            <button
            className="flex items-center space-x-1 p-2 rounded px-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsChatOpen(true)}
            >
            <Bot size={16} />
            <span>Gemini Assistant</span>
            </button>
            <button
            className="bg-green-600 hover:bg-green-700 p-2 rounded px-4 disabled:bg-gray-500"
            onClick={handleRunCode}
            disabled={isLoading}
            >
            {isLoading ? "Running..." : "Run Code"}
            </button>
        </div>
        {/* --- END OF ADDITION --- */}

        </div>

        

        {/* Editor Area */}
        <div className="flex-grow bg-gray-800 text-white overflow-hidden">
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
        <div className="h-1/4 flex bg-gray-900 text-white">
          <div className="w-1/2 p-2 border-r border-gray-700 flex flex-col">
            <h3 className="font-semibold mb-2">Input</h3>
            <textarea
              className="w-full flex-grow bg-gray-800 rounded p-2 resize-none"
              placeholder="Enter input for your program..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <div className="w-1/2 p-2 flex flex-col">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="w-full flex-grow bg-gray-800 rounded p-2 overflow-y-auto">
              {output}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}