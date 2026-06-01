import type { Octokit } from "@octokit/rest";

export interface ProfileData {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  repos: Repo[];
  languages: { name: string; percentage: number; color: string | null }[];
  totalStars: number;
}

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
}

export async function fetchProfileData(
  octokit: Octokit,
  login: string
): Promise<ProfileData> {
  const { data: user } = await octokit.rest.users.getByUsername({ username: login });

  const repos = await fetchAllRepos(octokit);
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

  const topRepos = repos.slice(0, 15);
  const langBytes = repos.length > 0 ? await fetchLanguageBytes(octokit, topRepos) : new Map();
  const totalBytes = [...langBytes.values()].reduce((a, b) => a + b, 0);
  const languages = totalBytes > 0
    ? [...langBytes.entries()]
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 100),
          color: LANGUAGE_COLORS[name as keyof typeof LANGUAGE_COLORS] ?? null,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .filter((l) => l.percentage > 0)
        .slice(0, 8)
    : [];

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    repos,
    languages,
    totalStars,
  };
}

async function fetchAllRepos(
  octokit: Octokit,
  perPage = 100
): Promise<Repo[]> {
  const repos: Repo[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc",
      affiliation: "owner,collaborator,organization_member",
    });
    if (data.length === 0) break;
    for (const repo of data) {
      repos.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        language: repo.language ?? null,
        topics: repo.topics ?? [],
        updatedAt: repo.updated_at ?? "",
      });
    }
    hasMore = data.length === perPage;
    page++;
    if (page > 3) break;
  }
  return repos;
}

async function fetchLanguageBytes(
  octokit: Octokit,
  repos: Repo[]
): Promise<Map<string, number>> {
  const aggregated = new Map<string, number>();

  const batches = chunkArray(repos, 10);
  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map((repo) => {
        const [owner, name] = repo.fullName.split("/");
        return octokit.request("GET /repos/{owner}/{repo}/languages", { owner, repo: name });
      })
    );
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const [lang, bytes] of Object.entries(result.value.data)) {
        aggregated.set(lang, (aggregated.get(lang) || 0) + bytes);
      }
    }
  }

  return aggregated;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function getLanguageColor(language: string): string | null {
  return LANGUAGE_COLORS[language as keyof typeof LANGUAGE_COLORS] ?? null;
}

const LANGUAGE_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Scala: "#c22d40",
  Lua: "#000080",
  Haskell: "#5e5086",
  Elixir: "#4e2a59",
  Zig: "#ec915c",
  Solid: "#2c4f7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};
