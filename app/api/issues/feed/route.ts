import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/github";
import { fetchGoodFirstIssues } from "@/lib/github/issues";
import { cache } from "@/lib/cache";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return Response.json({ issues: [], reposWithIssues: 0 });
  }

  const { languages, page } = await req.json();
  if (!Array.isArray(languages)) {
    return Response.json({ issues: [], reposWithIssues: 0 });
  }

  const cacheKey = `reposage:feed:${languages.join(",")}:${page ?? 1}`;
  const cached = await cache.get<any>(cacheKey);
  if (cached) {
    return Response.json(cached);
  }

  const octokit = createOctokit(session.accessToken);
  const feed = await fetchGoodFirstIssues(octokit, languages, { page: page ?? 1 }).catch(
    () => ({ issues: [], reposWithIssues: 0 })
  );

  await cache.set(cacheKey, feed, 300); // 5 minutes

  return Response.json(feed);
}
