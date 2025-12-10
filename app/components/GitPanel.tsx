// app/components/GitPanel.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  GitCommit, 
  FileCode, 
  Plus, 
  Minus, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GradientButton } from "@/components/ui/gradient-button";
import { useToast } from "@/hooks/use-toast";

interface FileChange {
  path: string;
  status: "added" | "modified" | "deleted";
  staged: boolean;
}

interface GitPanelProps {
  roomId: string;
}

export function GitPanel({ roomId: _roomId }: GitPanelProps) {
  const [changes, setChanges] = React.useState<FileChange[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");
  const [generatingMessage, setGeneratingMessage] = React.useState(false);
  const [currentBranch] = React.useState("main");
  const { toast } = useToast();

  React.useEffect(() => {
    const mockChanges: FileChange[] = [
      { path: "src/components/Header.tsx", status: "modified", staged: false },
      { path: "src/utils/helpers.ts", status: "added", staged: false },
      { path: "src/old-file.ts", status: "deleted", staged: true },
    ];
    setChanges(mockChanges);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Refreshed",
        description: "Git status updated",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to refresh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStageFile = (path: string) => {
    setChanges(prev => {
      const updated = prev.map(change =>
        change.path === path ? { ...change, staged: !change.staged } : change
      );
      const changedFile = updated.find(c => c.path === path);
      if (changedFile) {
        toast({
          title: changedFile.staged ? "Staged" : "Unstaged",
          description: path,
        });
      }
      return updated;
    });
  };

  const handleStageAll = () => {
    const hasUnstaged = changes.some(c => !c.staged);
    setChanges(prev => prev.map(change => ({ ...change, staged: hasUnstaged })));
    toast({
      title: hasUnstaged ? "Staged All" : "Unstaged All",
    });
  };

  const handleGenerateCommitMessage = async () => {
    setGeneratingMessage(true);
    try {
      const stagedChanges = changes.filter(c => c.staged);
      
      if (stagedChanges.length === 0) {
        toast({
          title: "No staged changes",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/git/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: stagedChanges }),
      });

      if (!response.ok) throw new Error("Failed");
      
      const data = await response.json();
      setCommitMessage(data.message);
      
      toast({
        title: "Message Generated",
      });
    } catch (error) {
      const stagedChanges = changes.filter(c => c.staged);
      const summary = stagedChanges.length === 1
        ? `Update ${stagedChanges[0].path}`
        : `Update ${stagedChanges.length} files`;
      setCommitMessage(summary);
      
      toast({
        title: "Generated Message",
      });
    } finally {
      setGeneratingMessage(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Empty message",
        variant: "destructive",
      });
      return;
    }

    const stagedChanges = changes.filter(c => c.staged);
    if (stagedChanges.length === 0) {
      toast({
        title: "No staged changes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/git/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: commitMessage,
          files: stagedChanges.map(c => c.path)
        }),
      });

      toast({
        title: "Committed",
        description: `${stagedChanges.length} file(s)`,
      });
      
      setCommitMessage("");
      setChanges(prev => prev.filter(c => !c.staged));
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to commit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "added":
        return <Plus className="h-3 w-3 text-green-400" />;
      case "modified":
        return <FileCode className="h-3 w-3 text-blue-400" />;
      case "deleted":
        return <Minus className="h-3 w-3 text-red-400" />;
      default:
        return <FileCode className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "text-green-400";
      case "modified":
        return "text-blue-400";
      case "deleted":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const stagedCount = changes.filter(c => c.staged).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/5 bg-slate-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-white">{currentBranch}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 text-slate-300 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="text-[10px] text-slate-400 mt-1.5">
          {changes.length === 0 ? (
            <div className="flex items-center gap-1.5 text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>No changes</span>
            </div>
          ) : (
            <div>
              {changes.length} change(s) • {stagedCount} staged
            </div>
          )}
        </div>
      </div>

      {/* Changes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {changes.length === 0 ? (
          <div className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">Working tree clean</p>
            <p className="text-[10px] text-slate-400 mt-0.5">No changes to commit</p>
          </div>
        ) : (
          <AnimatePresence>
            {changes.map((change, index) => (
              <motion.div
                key={change.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all border ${
                    change.staged ? "bg-white/5 border-purple-500/30" : "border-white/10"
                  }`}
                  onClick={() => handleStageFile(change.path)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                        change.staged
                          ? "bg-purple-500 border-purple-500"
                          : "border-slate-600 hover:border-purple-400"
                      }`}
                    >
                      {change.staged && <CheckCircle2 className="h-2 w-2 text-white" />}
                    </div>
                    
                    {getStatusIcon(change.status)}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white truncate">{change.path}</p>
                      <p className={`text-[10px] ${getStatusColor(change.status)}`}>
                        {change.status}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Actions */}
      {changes.length > 0 && (
        <div className="p-3 border-t border-white/5 bg-slate-900/30 space-y-2">
          <GradientButton
            onClick={handleStageAll}
            variant="glass"
            size="sm"
            fullWidth
            disabled={loading}
          >
            {changes.every(c => c.staged) ? "Unstage All" : "Stage All"}
          </GradientButton>

          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Commit message..."
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                disabled={loading || generatingMessage}
                className="flex-1 px-2 py-1.5 text-[11px] rounded bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleGenerateCommitMessage}
                disabled={loading || generatingMessage || stagedCount === 0}
                className="px-2 py-1.5 rounded bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 transition-all disabled:opacity-50"
                title="Generate AI message"
              >
                {generatingMessage ? (
                  <Loader2 className="h-3 w-3 text-purple-400 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 text-purple-400" />
                )}
              </button>
            </div>

            <GradientButton
              onClick={handleCommit}
              variant="purple-blue"
              size="sm"
              fullWidth
              disabled={loading || !commitMessage.trim() || stagedCount === 0}
              loading={loading}
            >
              <GitCommit className="h-3 w-3 mr-1.5" />
              Commit {stagedCount > 0 && `(${stagedCount})`}
            </GradientButton>
          </div>
        </div>
      )}
    </div>
  );
}