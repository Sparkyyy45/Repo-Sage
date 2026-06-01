import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";

const OctokitWithPlugins = Octokit.plugin(retry).plugin(throttling);

export function createOctokit(token: string) {
  return new OctokitWithPlugins({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter: number) => {
        console.warn(`Rate limit hit, retrying in ${retryAfter}s`);
        return true;
      },
      onSecondaryRateLimit: () => {
        console.warn("Secondary rate limit hit");
        return false;
      },
    },
    retry: { doNotRetry: [400, 401, 403, 404, 422] as const },
  });
}
