// components/ui/voice-input.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  onError?: (error: string) => void;
  className?: string;
  autoSend?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onStart,
  onStop,
  onError,
  className,
  autoSend = false,
}) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);
  const [transcript, setTranscript] = React.useState("");
  const [interimTranscript, setInterimTranscript] = React.useState("");
  const recognitionRef = React.useRef<ISpeechRecognition | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as Window & typeof globalThis & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || 
      (window as Window & typeof globalThis & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      if (onStart) onStart();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPiece + " ";
        } else {
          interimText += transcriptPiece;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
        setInterimTranscript("");
        
        if (autoSend && finalText.trim()) {
          onTranscript(finalText.trim());
        }
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      
      let errorMessage = "An error occurred";
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "No microphone found or permission denied.";
          break;
        case "not-allowed":
          errorMessage = "Microphone permission denied.";
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      toast({
        title: "Voice Input Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      if (onError) onError(errorMessage);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcript && !autoSend) {
        onTranscript(transcript);
      }
      setTranscript("");
      setInterimTranscript("");
      if (onStop) onStop();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript, autoSend, onTranscript, onStart, onStop, onError, toast]);

  const toggleRecording = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current?.start();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={toggleRecording}
        disabled={!isSupported}
        className={cn(
          "relative p-3 rounded-full transition-all",
          isRecording
            ? "bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
            : "bg-white/5 hover:bg-white/10 border border-white/10",
          !isSupported && "opacity-50 cursor-not-allowed"
        )}
        whileHover={isSupported ? { scale: 1.1 } : {}}
        whileTap={isSupported ? { scale: 0.95 } : {}}
        animate={isRecording ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={isRecording ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
      >
        {isRecording ? (
          <Mic className="h-5 w-5 text-white" />
        ) : (
          <MicOff className="h-5 w-5 text-gray-400" />
        )}

        {/* Pulsing ring when recording */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </motion.button>

      {/* Recording indicator and waveform */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg px-4 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                    animate={{
                      height: [8, 16, 8],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-purple-400 font-medium">
                Listening...
              </span>
            </div>

            {/* Show interim transcript */}
            {interimTranscript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs text-gray-400 italic max-w-xs"
              >
                &ldquo;{interimTranscript}&rdquo;
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

VoiceInput.displayName = "VoiceInput";

export { VoiceInput };
