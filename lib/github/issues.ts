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

export async function fetchGoodFirstIssues(
  octokit: Octokit,
  topLanguages: string[],
  options?: { page?: number; perPage?: number }
): Promise<IssueFeed> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 10;
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
          per_page: perPage,
          page,
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
        number: item.number,
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
    issues: allIssues,
    reposWithIssues: uniqueRepos.size,
  };
}
