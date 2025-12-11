// app/api/git/generate-message/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { changes } = await req.json();

    if (!changes || changes.length === 0) {
      return NextResponse.json(
        { error: "No changes provided" },
        { status: 400 }
      );
    }

    // Format changes for Gemini
    const changesText = changes
      .map((c: { status: string; path: string }) => `${c.status}: ${c.path}`)
      .join("\n");

    const prompt = `Generate a concise, professional git commit message for these file changes:

${changesText}

Requirements:
- Start with a verb (Add, Update, Fix, Remove, Refactor, etc.)
- Be specific but concise (max 72 characters)
- Follow conventional commit format
- Don't use quotes or special formatting
- Return only the commit message, nothing else

Example: "Add user authentication with JWT tokens"`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text().trim();

    // Remove quotes if Gemini adds them
    const cleanMessage = message.replace(/^["']|["']$/g, "");

    return NextResponse.json({ message: cleanMessage });
  } catch (error) {
    console.error("Error generating commit message:", error);
    
    // Fallback to simple message
    const { changes } = await req.json();
    const fallbackMessage = 
      changes.length === 1
        ? `Update ${changes[0].path}`
        : `Update ${changes.length} files`;
    
    return NextResponse.json({ message: fallbackMessage });
  }
}
