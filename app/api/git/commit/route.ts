// app/api/git/commit/route.ts
import { NextResponse } from "next/server";
import simpleGit from "simple-git";

export async function POST(req: Request) {
  try {
    const { message, files } = await req.json();

    if (!message || !files || files.length === 0) {
      return NextResponse.json(
        { error: "Message and files are required" },
        { status: 400 }
      );
    }

    // Initialize git in the project root
    // In production, this should be configured based on the room's workspace
    const git = simpleGit({
      baseDir: process.cwd(),
      binary: "git",
      maxConcurrentProcesses: 6,
    });

    // Stage the specific files
    await git.add(files);

    // Commit with the message
    const result = await git.commit(message);

    return NextResponse.json({
      success: true,
      commit: result.commit,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Error committing changes:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to commit changes" },
      { status: 500 }
    );
  }
}
