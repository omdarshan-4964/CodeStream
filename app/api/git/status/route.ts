// app/api/git/status/route.ts
import { NextResponse } from "next/server";
import simpleGit from "simple-git";

export async function GET() {
  try {
    const git = simpleGit({
      baseDir: process.cwd(),
      binary: "git",
      maxConcurrentProcesses: 6,
    });

    // Get current branch
    const branch = await git.branchLocal();

    // Get status
    const status = await git.status();

    // Format changes
    const changes = [
      ...status.created.map(file => ({ 
        path: file, 
        status: "added" as const, 
        staged: status.staged.includes(file) 
      })),
      ...status.modified.map(file => ({ 
        path: file, 
        status: "modified" as const, 
        staged: status.staged.includes(file) 
      })),
      ...status.deleted.map(file => ({ 
        path: file, 
        status: "deleted" as const, 
        staged: status.staged.includes(file) 
      })),
    ];

    return NextResponse.json({
      branch: branch.current,
      changes,
      clean: status.isClean(),
    });
  } catch (error) {
    console.error("Error getting git status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get git status" },
      { status: 500 }
    );
  }
}
