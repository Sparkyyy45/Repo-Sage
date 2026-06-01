import type { Octokit } from "@octokit/rest";

export interface Issue {
  id: number;
  title: string;
  htmlUrl: string;
  repoFullName: string;
  repoName: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  comments: number;
}

export interface IssueFeed {
  issues: Issue[];
  reposWithIssues: number;
}

export async function fetchGoodFirstIssues(
  octokit: Octokit,
  topLanguages: string[]
): Promise<IssueFeed> {
  const allIssues: Issue[] = [];
  const seenUrls = new Set<string>();

  const langFilter = topLanguages
    .slice(0, 5)
    .map((l) => `language:${l}`)
    .join(" ");

  const queries = [
    `label:"good first issue" is:issue is:open ${langFilter}`.trim(),
  ];

  if (topLanguages.length === 0) {
    queries.push('label:"good first issue" is:issue is:open');
  }

  const results = await Promise.allSettled(
    queries.map((q) =>
      octokit.rest.search
        .issuesAndPullRequests({
          q,
          sort: "updated",
          order: "desc",
          per_page: 30,
        })
        .then(({ data }) => data.items)
    )
  );

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seenUrls.has(item.html_url)) continue;
      seenUrls.add(item.html_url);

      const repoFullName = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      const [, repoName] = repoFullName.split("/");

      allIssues.push({
        id: item.id,
        title: item.title,
        htmlUrl: item.html_url,
        repoFullName,
        repoName,
        labels: item.labels.map((l) => l.name ?? ""),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        comments: item.comments,
      });
    }
  }

  allIssues.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const uniqueRepos = new Set(allIssues.map((i) => i.repoFullName));

  return {
    issues: allIssues.slice(0, 30),
    reposWithIssues: uniqueRepos.size,
  };
}
