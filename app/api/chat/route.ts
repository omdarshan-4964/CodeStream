// app/api/chat/route.ts

import { getAuthSession } from "@/lib/auth";
import {
  GoogleGenerativeAI,
  Content,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Configuration for the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Safety settings to block harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // ... (add other categories as needed)
];

export async function POST(req: Request) {
  try {
    // 1. Check for authentication
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { code, history, prompt } = body as {
      code: string; // The current code in the editor
      history: Content[]; // The previous chat history
      prompt: string; // The user's new question
    };

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // 3. Construct the full prompt for the AI
    const fullPrompt = `
      You are an expert coding assistant. A user is asking a question about the following code:

      --- CODE ---
      ${code}
      --- END CODE ---

      Here is their question:
      "${prompt}"

      Please provide a helpful and concise answer.
    `;

    // 4. Start a chat session with the given history
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: history, // Pass the previous conversation
    });

    // 5. Send the new prompt (with code context) and stream the response
    const result = await chat.sendMessageStream(fullPrompt);

    // 6. Return the streamed response
    // This is a more advanced pattern that sends the AI's response
    // chunk by chunk, so the user sees text appearing immediately.
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(chunkText);
        }
        controller.close();
      },
    });

    return new Response(stream);

  } catch (error) {
    console.error("[CHAT_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}