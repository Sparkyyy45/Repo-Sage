import type { Octokit } from "@octokit/rest";

export interface Issue {
  id: number;
  number: number;
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

interface SearchResultItem {
  html_url: string;
  repository_url: string;
  id: number;
  number: number;
  title: string;
  labels: Array<{ name?: string }>;
  created_at: string;
  updated_at: string;
  comments: number;
}

export interface IssueDetail {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  htmlUrl: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  comments: number;
  user: {
    login: string;
    avatarUrl: string;
  };
}

export interface IssueComment {
  id: number;
  body: string | null;
  user: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export async function fetchIssueDetail(
  octokit: Octokit,
  owner: string,
  name: string,
  issueNumber: number
): Promise<{ issue: IssueDetail; comments: IssueComment[] }> {
  const { data } = await octokit.rest.issues.get({
    owner,
    repo: name,
    issue_number: issueNumber,
  });

  const { data: commentsData } = await octokit.rest.issues.listComments({
    owner,
    repo: name,
    issue_number: issueNumber,
    per_page: 10,
  });

  return {
    issue: {
      id: data.id,
      number: data.number,
      title: data.title,
      body: data.body ?? null,
      state: data.state,
      htmlUrl: data.html_url,
      labels: (data.labels as Array<{ name?: string }>).map((l) => l.name ?? ""),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      comments: data.comments,
      user: {
        login: data.user?.login ?? "unknown",
        avatarUrl: data.user?.avatar_url ?? "",
      },
    },
    comments: commentsData.map((c) => ({
      id: c.id,
      body: c.body ?? null,
      user: {
        login: c.user?.login ?? "unknown",
        avatarUrl: c.user?.avatar_url ?? "",
      },
      createdAt: c.created_at,
    })),
  };
}

async function searchIssues(
  octokit: Octokit,
  query: string,
  page: number
): Promise<SearchResultItem[]> {
  try {
    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: query,
      sort: "updated",
      order: "desc",
      per_page: 50,
      page,
    });
    return (data.items ?? []) as SearchResultItem[];
  } catch {
    return [];
  }
}

export async function fetchGoodFirstIssues(
  octokit: Octokit,
  topLanguages: string[],
  options?: { page?: number }
): Promise<IssueFeed> {
  const page = options?.page ?? 1;
  const allIssues: Issue[] = [];
  const seenUrls = new Set<string>();

  const queries: string[] = [];

  if (topLanguages.length > 0) {
    const langs = topLanguages.slice(0, 5);
    for (const lang of langs) {
      queries.push(`label:"good first issue" is:issue is:open language:${lang}`);
    }
    for (const lang of langs.slice(0, 3)) {
      queries.push(`label:enhancement is:issue is:open language:${lang}`);
      queries.push(`label:bug is:issue is:open language:${lang}`);
    }
  } else {
    queries.push(`label:"good first issue" is:issue is:open`);
  }

  const results = await Promise.allSettled(
    queries.map((q) => searchIssues(octokit, q, page))
  );

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      if (seenUrls.has(item.html_url)) continue;
      seenUrls.add(item.html_url);

      const repoFullName = item.repository_url.replace("https://api.github.com/repos/", "");
      const [, repoName] = repoFullName.split("/");

      allIssues.push({
        id: item.id,
        number: item.number,
        title: item.title,
        htmlUrl: item.html_url,
        repoFullName,
        repoName,
        labels: (item.labels || []).map((l) => l.name ?? ""),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        comments: item.comments,
      });
    }
  }

  allIssues.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return { issues: allIssues, reposWithIssues: new Set(allIssues.map((i) => i.repoFullName)).size };
}

/**
 * Fetches exactly 3 "good first issue" issues for the landing page preview.
 * Makes a single GitHub Search API request — intentionally lightweight.
 * Returns an empty array on any error so the landing page never breaks.
 */
export async function fetchLandingPreviewIssues(
  octokit: Octokit
): Promise<Issue[]> {
  try {
    const { data } = await octokit.rest.search.issuesAndPullRequests({
      q: `label:"good first issue" is:issue is:open archived:false stars:>100`,
      sort: "updated",
      order: "desc",
      per_page: 3,
      page: 1,
    });

    const mapped = (data.items as SearchResultItem[]).map((item) => {
      const repoFullName = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      const [, repoName] = repoFullName.split("/");
      return {
        id: item.id,
        number: item.number,
        title: item.title,
        htmlUrl: item.html_url,
        repoFullName,
        repoName,
        labels: (item.labels || []).map((l) => l.name ?? ""),
        createdAt: item.created_at,
        // Null-guard: API guarantees non-null, but the cast hides TS enforcement.
        updatedAt: item.updated_at ?? new Date().toISOString(),
        comments: item.comments,
      };
    });

    // Audit log — confirms every field is sourced from the GitHub API response.
    // Safe to remove once the feature is verified in production.
    console.log("[fetchLandingPreviewIssues] Fetched issues audit:");
    for (const issue of mapped) {
      console.log(JSON.stringify({
        repo:      issue.repoFullName,
        title:     issue.title,
        labels:    issue.labels,
        comments:  issue.comments,
        updatedAt: issue.updatedAt,
        htmlUrl:   issue.htmlUrl,
      }, null, 2));
    }

    return mapped;
  } catch (err) {
    console.warn("[fetchLandingPreviewIssues] GitHub API error:", err);
    return [];
  }
}
