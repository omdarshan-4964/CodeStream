// app/components/InterviewPanel.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Clock, CheckCircle2, XCircle, PlayCircle } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GradientButton } from "@/components/ui/gradient-button";
import { Timer } from "@/components/ui/timer";

interface TestCase {
  input: string;
  expectedOutput: string;
  passed?: boolean;
  actualOutput?: string;
}

interface Problem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
}

interface InterviewPanelProps {
  problem: Problem;
  onRunTests: (code: string) => Promise<TestCase[]>;
  timeLimit?: number;
}

export function InterviewPanel({ problem, onRunTests, timeLimit = 45 }: InterviewPanelProps) {
  const [testResults, setTestResults] = React.useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeUp, setTimeUp] = React.useState(false);

  const difficultyColors = {
    Easy: "text-green-400 bg-green-500/10 border-green-500/30",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    Hard: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const mockCode = "// User's code";
      const results = await onRunTests(mockCode);
      setTestResults(results);
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <Timer
          duration={timeLimit * 60}
          onComplete={handleTimeUp}
          className="scale-75 origin-right"
        />
      </div>

      {/* Problem Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {/* Title */}
        <h1 className="text-base font-bold text-white">{problem.title}</h1>

        {/* Description */}
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="prose prose-invert prose-sm max-w-none text-xs">
            <ReactMarkdown>{problem.description}</ReactMarkdown>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Examples</h3>
          {problem.examples.map((example, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
              <div>
                <span className="text-[10px] text-slate-500">Input:</span>
                <pre className="mt-0.5 p-1.5 bg-slate-900/50 rounded text-[11px] text-cyan-300 font-mono">
                  {example.input}
                </pre>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Output:</span>
                <pre className="mt-0.5 p-1.5 bg-slate-900/50 rounded text-[11px] text-green-300 font-mono">
                  {example.output}
                </pre>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-[10px] text-slate-500">Explanation:</span>
                  <p className="mt-0.5 text-[11px] text-slate-300">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-[10px] font-semibold text-purple-400 mb-2 uppercase tracking-wider">Constraints</h3>
          <ul className="space-y-0.5">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Results</h3>
              <span className={`text-[11px] ${allPassed ? "text-green-400" : "text-slate-300"}`}>
                {passedTests}/{totalTests} Passed
              </span>
            </div>

            {testResults.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div
                  className={`p-2.5 rounded-lg border ${
                    test.passed
                      ? "bg-green-500/5 border-green-500/30"
                      : "bg-red-500/5 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white">Test {idx + 1}</span>
                        <span className={`text-[10px] ${test.passed ? "text-green-400" : "text-red-400"}`}>
                          {test.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 space-y-0.5">
                        <div>Input: <span className="text-cyan-300 font-mono">{test.input}</span></div>
                        <div>Expected: <span className="text-green-300 font-mono">{test.expectedOutput}</span></div>
                        {!test.passed && test.actualOutput && (
                          <div>Actual: <span className="text-red-300 font-mono">{test.actualOutput}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3 border-t border-white/5 bg-slate-900/30">
        <GradientButton
          onClick={handleRunTests}
          variant="purple-blue"
          size="sm"
          fullWidth
          disabled={isRunning || timeUp}
          loading={isRunning}
        >
          <PlayCircle className="h-3 w-3 mr-1.5" />
          {timeUp ? "Time's Up!" : "Run Tests"}
        </GradientButton>
        {timeUp && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[10px] text-red-400 mt-2"
          >
            <Clock className="h-3 w-3 inline mr-1" />
            Time limit reached!
          </motion.p>
        )}
      </div>
    </div>
  );
}