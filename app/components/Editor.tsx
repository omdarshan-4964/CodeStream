// app/components/Editor.tsx
"use client";

import { java } from "@codemirror/lang-java";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client"; // Import the client

// The default Java code
const javaDefault = `// Java:Name the class to Main and remove 'public'
class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;

// Define props to accept the roomId
interface EditorProps {
  roomId: string;
}

export function Editor({ roomId }: EditorProps) {
  const [code, setCode] = useState(javaDefault);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Effect 1: Setup the Socket.IO connection
  useEffect(() => {
    // 1. Create the socket connection
    const newSocket = io("http://localhost:5000"); // Your server URL
    setSocket(newSocket);

    // 2. Tell the server we want to join this room
    newSocket.emit("join-room", roomId);

    // 3. Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]); // Re-run if roomId changes

  // Effect 2: Setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    // 4. Listen for code changes from other users
    const handleCodeReceive = (newCode: string) => {
      setCode(newCode); // Update our local code
    };

    socket.on("receive-code", handleCodeReceive);

    // Cleanup this specific listener
    return () => {
      socket.off("receive-code", handleCodeReceive);
    };
  }, [socket]); // Re-run if the socket instance changes

  // This function now has two jobs
  const onChange = (value: string) => {
    // 1. Update our own editor immediately
    setCode(value);

    // 2. Send the new code to the server
    if (socket) {
      socket.emit("code-change", roomId, value);
    }
  };

  return (
    <CodeMirror
      value={code} // The editor's content is now driven by our state
      onChange={onChange}
      theme={githubDark}
      extensions={[java()]}
      style={{
        height: "100%",
        width: "100%",
        fontSize: "14px",
      }}
    />
  );
}