import type { Octokit } from "@octokit/rest";
import { cache } from "@/lib/cache";


export interface RepoInsightData {
  skillMatch: {
    percent: number;
    matched: string[];
    unmatched: string[];
    repoLanguage: string;
  };
  beginnerScore: number;
  breakdown: {
    hasContributing: boolean;
    hasCodeOfConduct: boolean;
    hasIssueTemplates: boolean;
    hasPRTemplate: boolean;
    goodFirstIssues: number;
    recentCommit: boolean;
  };
  improvements: string[];
  weeklyCommits: number[];
  openPRs: number;
  lastPush: string;
  goodFirstIssues: number;
  matchingIssues: MatchingIssue[];
}

export interface MatchingIssue {
  title: string;
  htmlUrl: string;
  labels: string[];
}

export async function fetchRepoInsights(
  octokit: Octokit,
  owner: string,
  name: string,
  userLanguages: { name: string; percentage: number }[],
  filePaths: string[]
): Promise<RepoInsightData> {
  const userLanguagesHash = userLanguages.map((ul) => `${ul.name}:${ul.percentage}`).join(",");
  const cacheKey = `reposage:insights:${owner}:${name}:${userLanguagesHash}`;
  const cached = await cache.get<RepoInsightData>(cacheKey);
  if (cached) return cached;

  const repoReq = octokit.rest.repos.get({ owner, repo: name });
  const activityReq = octokit.rest.repos
    .getCommitActivityStats({ owner, repo: name })
    .then((r) => r.data)
    .catch(() => null);
  const goodFirstReq = octokit.rest.search
    .issuesAndPullRequests({
      q: `repo:${owner}/${name} label:"good first issue" is:issue is:open`,
      sort: "updated",
      order: "desc",
      per_page: 5,
    })
    .then((r) => r.data)
    .catch(() => null);
  const pullsReq = octokit.rest.search
    .issuesAndPullRequests({
      q: `repo:${owner}/${name} is:pr is:open`,
      per_page: 1,
    })
    .then((r) => r.data.total_count)
    .catch(() => 0);

  const [repoRes, activityData, searchData, openPRs] = await Promise.all([
    repoReq,
    activityReq,
    goodFirstReq,
    pullsReq,
  ]);

  const repoLanguage = repoRes.data.language ?? "Unknown";

  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const ul of userLanguages.slice(0, 5)) {
    if (ul.name.toLowerCase() === repoLanguage.toLowerCase()) {
      matched.push(ul.name);
    } else {
      unmatched.push(ul.name);
    }
  }

  const skillPercent =
    userLanguages.length > 0
      ? Math.round(
          (matched.length /
            Math.min(userLanguages.length, 5)) *
            100
        )
      : 0;

  const weeklyCommitData = activityData ?? [];
  const weeklyCommits = weeklyCommitData
    .slice(-12)
    .map((w: { total: number }) => w.total);

  const hasContributing = filePaths.some(
    (p) => p.toLowerCase() === "contributing.md" || p === "CONTRIBUTING"
  );
  const hasCodeOfConduct = filePaths.some(
    (p) => p.toLowerCase() === "code_of_conduct.md" || p.toLowerCase() === "code-of-conduct.md"
  );
  const hasIssueTemplates = filePaths.some(
    (p) => p.startsWith(".github/ISSUE_TEMPLATE/") || p.startsWith(".github/issue_template")
  );
  const hasPRTemplate = filePaths.some(
    (p) =>
      p.toLowerCase() === ".github/pull_request_template.md" ||
      p.toLowerCase() === "pull_request_template.md"
  );

  const goodFirstIssues = searchData?.total_count ?? 0;
  const lastPush = repoRes.data.pushed_at;
  const daysSincePush = lastPush
    ? Math.floor(
        (Date.now() - new Date(lastPush).getTime()) / 86400000
      )
    : 999;
  const recentCommit = daysSincePush <= 30;

  let beginnerScore = 0;
  if (hasContributing) beginnerScore += 20;
  if (hasCodeOfConduct) beginnerScore += 15;
  if (hasIssueTemplates) beginnerScore += 15;
  if (hasPRTemplate) beginnerScore += 10;
  if (goodFirstIssues >= 3) beginnerScore += 25;
  else if (goodFirstIssues > 0) beginnerScore += 10;
  if (recentCommit) beginnerScore += 15;

  const improvements: string[] = [];
  if (!hasContributing) improvements.push("Add a CONTRIBUTING.md file — it helps contributors know how to get started.");
  if (!hasCodeOfConduct) improvements.push("Add a CODE_OF_CONDUCT.md — fosters a welcoming community.");
  if (!hasIssueTemplates) improvements.push("Add issue templates (.github/ISSUE_TEMPLATE/) to guide bug reports and feature requests.");
  if (!hasPRTemplate) improvements.push("Add a PR template to streamline the pull request process.");
  if (goodFirstIssues < 3) improvements.push("Label more issues as 'good first issue' to attract new contributors.");
  if (!recentCommit) improvements.push("The repo hasn't been updated in a while — check if it's still actively maintained.");

  const matchingIssues: MatchingIssue[] =
    searchData?.items?.slice(0, 5).map((item) => ({
      title: item.title,
      htmlUrl: item.html_url,
      labels: item.labels.map((l) => (typeof l === "string" ? l : l.name ?? "")),
    })) ?? [];

  const result: RepoInsightData = {
    skillMatch: {
      percent: skillPercent,
      matched,
      unmatched,
      repoLanguage,
    },
    beginnerScore,
    breakdown: {
      hasContributing,
      hasCodeOfConduct,
      hasIssueTemplates,
      hasPRTemplate,
      goodFirstIssues,
      recentCommit,
    },
    improvements,
    weeklyCommits,
    openPRs,
    lastPush: lastPush ?? "",
    goodFirstIssues,
    matchingIssues,
  };

  await cache.set(cacheKey, result, 1800); // 30 minutes
  return result;
}
