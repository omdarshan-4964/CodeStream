// app/components/ChatAssistant.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { type Content } from "@google/generative-ai";

// Define the shape of a chat message
interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatAssistantProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentCode: string; // We'll pass the current code for context
}

export function ChatAssistant({
  isOpen,
  onOpenChange,
  currentCode,
}: ChatAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // We use the 'Content' type from the Google AI SDK for history
  const [history, setHistory] = useState<Content[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!prompt) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", parts: [{ text: prompt }] };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          history: history, // Send the Google-formatted history
          prompt: prompt,
        }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      // --- Handle the Stream ---
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = "";
      let isDone = false;

      // Create a new "model" message entry to append to
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "" }] },
      ]);

      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        const chunk = decoder.decode(value, { stream: true });
        modelResponse += chunk;

        // Update the last message (the model's) in real-time
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          lastMessage.parts[0].text = modelResponse;
          return [...prev.slice(0, -1), lastMessage];
        });
      }
      // --- End of Stream Handling ---

      // Update the Google-formatted history for the next request
      setHistory([
        ...history,
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: modelResponse }] },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Error: Could not get response." }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>🤖 Gemini Assistant</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {/* We apply whitespace formatting to render newlines */}
                <pre className="whitespace-pre-wrap font-sans">
                  {msg.parts[0].text}
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about your code..."
            disabled={isLoading}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}