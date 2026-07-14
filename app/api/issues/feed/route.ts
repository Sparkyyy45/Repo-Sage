import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/github";
import { fetchGoodFirstIssues } from "@/lib/github/issues";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

const FeedRequestSchema = z.object({
  languages: z.array(z.string()),
  page: z.number().optional().default(1),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? "127.0.0.1";
    
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_feed_${ip}`);
      
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

    const session = await auth();
    if (!session?.accessToken) {
      return Response.json({ issues: [], reposWithIssues: 0 });
    }

    const body = await req.json();
    const parsed = FeedRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json({ error: "Invalid request payload", details: parsed.error.format() }, { status: 400 });
    }

    const { languages, page } = parsed.data;

    const octokit = createOctokit(session.accessToken);
    const feed = await fetchGoodFirstIssues(octokit, languages, { page }).catch(
      () => ({ issues: [], reposWithIssues: 0 })
    );

    return Response.json(feed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: errorMsg }, { status: 500 });
  }
}
