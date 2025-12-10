// app/components/ChatAssistant.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { type Content } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { VoiceInput } from "@/components/ui/voice-input";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatAssistantProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentCode: string;
}

export function ChatAssistant({
  isOpen,
  onOpenChange,
  currentCode,
}: ChatAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Content[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", parts: [{ text: prompt }] };
    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: currentCode,
          history: history,
          prompt: currentPrompt,
        }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = "";
      let isDone = false;

      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "" }] },
      ]);

      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        const chunk = decoder.decode(value, { stream: true });
        modelResponse += chunk;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          lastMessage.parts[0].text = modelResponse;
          return [...prev.slice(0, -1), lastMessage];
        });
      }

      setHistory([
        ...history,
        { role: "user", parts: [{ text: currentPrompt }] },
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

  const handleVoiceTranscript = (transcript: string) => {
    setPrompt(transcript);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[480px] flex flex-col bg-slate-950 border-white/10">
        <SheetHeader className="border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <SheetTitle className="text-base">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Gemini Assistant
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-3 py-3">
          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {msg.role === "model" && (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <Sparkles className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400">
                        {msg.role === "user" ? "You" : "Gemini"}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed">
                      {msg.parts[0].text}
                    </pre>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    </motion.div>
                    <span className="text-xs text-slate-400">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-white/5 pt-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about your code..."
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 bg-transparent text-white placeholder-slate-500 px-2 py-1.5 focus:outline-none text-xs"
              />
              <VoiceInput onTranscript={handleVoiceTranscript} />
              <GradientButton
                onClick={handleSend}
                disabled={isLoading || !prompt.trim()}
                variant="blue-cyan"
                size="sm"
              >
                <Send className="h-3 w-3" />
              </GradientButton>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}