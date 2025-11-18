// app/api/execute/route.ts

import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";

// This object maps our simple language names to Judge0's language IDs
const languageMap: Record<string, number> = {
  java: 62,
  javascript: 63,
  python: 71,
};

export async function POST(req: Request) {
  try {
    // 1. Check if user is authenticated
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get the API key from environment
    const apiKey = process.env.JUDGE0_API_KEY;
    if (!apiKey) {
      return new NextResponse("API key not configured", { status: 500 });
    }

    // 3. Parse the request body
    const body = await req.json();
    const {
      code,
      language,
      input,
    }: { code: string; language: string; input: string } = body;

    const languageId = languageMap[language.toLowerCase()];
    if (languageId === undefined) {
      return new NextResponse("Unsupported language", { status: 400 });
    }

    // 4. Prepare data for Judge0
    const submissionData = {
      source_code: code,
      language_id: languageId,
      stdin: input,
      // We use wait=true so Judge0 handles polling for us
      // and returns the final result directly.
      wait: true, 
    };

    // 5. Call the Judge0 API
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(submissionData),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Judge0 API Error:", errorData);
      return new NextResponse(`API Error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const result = await response.json();

    // 6. Return the result
    return NextResponse.json(result);

  } catch (error) {
    console.error("[EXECUTE_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}