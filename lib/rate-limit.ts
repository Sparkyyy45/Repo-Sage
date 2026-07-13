import type { Octokit } from "@octokit/rest";

export interface RateLimitInfo {
  remaining: number;
  total: number;
  reset: number;
  isLimited: boolean;
  isNearLimit: boolean;
}

export async function getRateLimitInfo(
  octokit: Octokit
): Promise<RateLimitInfo | null> {
  try {
    const { data } = await octokit.rest.rateLimit.get();
    const core = data.resources.core;
    return {
      remaining: core.remaining,
      total: core.limit,
      reset: core.reset,
      isLimited: core.remaining==0,
      isNearLimit: core.remaining >0 && core.remaining <10,


    };
  } catch {
    return null;
  }
}

export function formatResetTime(unixSeconds: number): string {
  const minutes = Math.ceil((unixSeconds * 1000 - Date.now()) / 60000);
  if (minutes <= 0) return "any moment now";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
}
