import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey, provider, model, system } = body;

    if (!apiKey) {
      return Response.json({ error: "No API key provided" }, { status: 401 });
    }

    const baseURL = provider === "openrouter" 
      ? "https://openrouter.ai/api/v1" 
      : "https://api.groq.com/openai/v1";

    const headers = provider === "openrouter" ? {
       "HTTP-Referer": "https://reposage.com",
       "X-Title": "RepoSage"
    } : undefined;

    // Set up custom provider using OpenAI compatibility
    const customOpenAI = createOpenAI({
      apiKey,
      baseURL,
      headers
    });

    const result = streamText({
      model: customOpenAI(model),
      system,
      messages,
      maxTokens: 4096,
    });

    return result.toDataStreamResponse();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: errorMsg }, { status: 500 });
  }
}
