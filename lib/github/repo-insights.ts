import type { Octokit } from "@octokit/rest";

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
  const langReq = octokit
    .request("GET /repos/{owner}/{repo}/languages", { owner, repo: name })
    .then((r) => Object.keys(r.data))
    .catch(() => [] as string[]);

  const [repoRes, activityData, searchData, openPRs, repoLanguages] =
    await Promise.all([repoReq, activityReq, goodFirstReq, pullsReq, langReq]);

  const repoLanguage = repoRes.data.language ?? "Unknown";

  // Match against the repo's full language breakdown, measuring how much of the
  // repo's stack the user covers. Denominator is the repo's languages, so the
  // score never shrinks just because the user knows additional languages.
  const repoLangs =
    repoLanguages.length > 0
      ? repoLanguages
      : (repoRes.data.language ? [repoRes.data.language] : []);

  const userSet = new Set(userLanguages.map((l) => l.name.toLowerCase()));
  const matched = repoLangs.filter((l) => userSet.has(l.toLowerCase()));
  const unmatched = repoLangs.filter((l) => !userSet.has(l.toLowerCase()));

  const skillPercent =
    repoLangs.length > 0
      ? Math.round((matched.length / repoLangs.length) * 100)
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

  return {
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
}
