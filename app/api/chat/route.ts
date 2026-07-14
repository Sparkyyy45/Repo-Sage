import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create a new ratelimiter, that allows 10 requests per 1 minute
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? "127.0.0.1";
    
    // Skip rate limiting if keys are missing (for local dev without redis)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
      
      if (!success) {
        return Response.json(
          { error: "Too many requests. Please try again later." },
          { 
            status: 429, 
            headers: { 
              "X-RateLimit-Limit": limit.toString(), 
              "X-RateLimit-Remaining": remaining.toString(), 
              "X-RateLimit-Reset": reset.toString() 
            } 
          }
        );
      }
    }

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
