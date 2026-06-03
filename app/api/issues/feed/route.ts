import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/github";
import { fetchGoodFirstIssues } from "@/lib/github/issues";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return Response.json({ issues: [], reposWithIssues: 0 });
  }

  const { languages, page } = await req.json();
  if (!Array.isArray(languages)) {
    return Response.json({ issues: [], reposWithIssues: 0 });
  }

  const octokit = createOctokit(session.accessToken);
  const feed = await fetchGoodFirstIssues(octokit, languages, { page: page ?? 1 }).catch(
    () => ({ issues: [], reposWithIssues: 0 })
  );

  return Response.json(feed);
}
