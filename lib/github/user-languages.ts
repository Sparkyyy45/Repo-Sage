import type { Octokit } from "@octokit/rest";

export async function fetchUserLanguages(
  octokit: Octokit
): Promise<{ name: string; percentage: number }[]> {
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    affiliation: "owner,collaborator,organization_member",
    sort: "updated",
    per_page: 50,
  });

  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  }

  const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(langCounts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);
}
