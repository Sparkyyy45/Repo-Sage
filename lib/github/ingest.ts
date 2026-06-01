import type { Octokit } from "@octokit/rest";

export interface RepoTree {
  path: string;
  type: "tree" | "blob";
  size: number | null;
}

export interface RepoFile {
  path: string;
  content: string;
  size: number;
}

export interface IngestedRepo {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  topics: string[];
  language: string | null;
  stars: number;
  forks: number;
  tree: RepoTree[];
  files: RepoFile[];
  readme: string | null;
  contributing: string | null;
  packageJson: Record<string, unknown> | null;
}

const KEY_FILES = [
  "README.md",
  "CONTRIBUTING.md",
  "CONTRIBUTING",
  "package.json",
  "composer.json",
  "Cargo.toml",
  "go.mod",
  "pyproject.toml",
  "setup.py",
  "Gemfile",
  "Podfile",
  "build.gradle",
  "tsconfig.json",
  "next.config.js",
  "next.config.ts",
  "vite.config.ts",
  "vite.config.js",
  "webpack.config.js",
  "Makefile",
  "Dockerfile",
  "docker-compose.yml",
  ".github/workflows",
];

const SOURCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".rs",
  ".go",
  ".rb",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".cpp",
  ".h",
  ".hpp",
  ".css",
  ".scss",
  ".less",
  ".vue",
  ".svelte",
]);

const MAX_FILE_SIZE = 50_000;
const MAX_TREE_ENTRIES = 5000;
const MAX_FILES_TO_READ = 15;

export async function ingestRepo(
  octokit: Octokit,
  owner: string,
  name: string
): Promise<IngestedRepo> {
  const { data: repo } = await octokit.rest.repos.get({ owner, repo: name });
  const defaultBranch = repo.default_branch;

  const tree = await fetchRepoTree(octokit, owner, name, defaultBranch);

  const keyFiles = tree.filter(
    (entry) =>
      entry.type === "blob" &&
      KEY_FILES.some((kf) => entry.path === kf || entry.path.startsWith(kf))
  );
  const sourceFiles = tree.filter(
    (entry) =>
      entry.type === "blob" &&
      SOURCE_EXTENSIONS.has(
        entry.path.substring(entry.path.lastIndexOf("."))
      ) &&
      entry.path.split("/").length <= 4
  );

  const filesToRead = [
    ...new Map(
      [...keyFiles, ...sourceFiles.slice(0, MAX_FILES_TO_READ)].map((f) => [
        f.path,
        f,
      ])
    ).values(),
  ].slice(0, MAX_FILES_TO_READ);

  const fileContents = await readFiles(octokit, owner, name, filesToRead);

  const readmeFile = fileContents.find(
    (f) => f.path.toLowerCase() === "readme.md"
  );
  const contributingFile = fileContents.find(
    (f) =>
      f.path.toLowerCase() === "contributing.md" || f.path === "CONTRIBUTING"
  );
  const packageJsonFile = fileContents.find(
    (f) => f.path === "package.json"
  );

  let packageJson: Record<string, unknown> | null = null;
  if (packageJsonFile) {
    try {
      packageJson = JSON.parse(packageJsonFile.content);
    } catch {
      packageJson = null;
    }
  }

  return {
    owner,
    name,
    fullName: repo.full_name,
    description: repo.description,
    defaultBranch,
    topics: repo.topics ?? [],
    language: repo.language,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    tree,
    files: fileContents,
    readme: readmeFile?.content ?? null,
    contributing: contributingFile?.content ?? null,
    packageJson,
  };
}

async function fetchRepoTree(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string
): Promise<RepoTree[]> {
  const result: RepoTree[] = [];

  try {
    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1",
    });

    for (const item of data.tree) {
      if (!item.path || result.length >= MAX_TREE_ENTRIES) continue;

      if (item.type === "tree" || item.type === "blob") {
        result.push({
          path: item.path,
          type: item.type,
          size: item.size ?? null,
        });
      }
    }
  } catch {
    result.push({ path: "/", type: "tree", size: null });
  }

  return result;
}

async function readFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  files: RepoTree[]
): Promise<RepoFile[]> {
  const results: RepoFile[] = [];

  const batches = chunkArray(files, 5);
  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(async (file) => {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if (Array.isArray(data) || data.type !== "file") return null;

        const content = data.content
          ? Buffer.from(data.content, "base64").toString("utf-8")
          : "";

        if (content.length > MAX_FILE_SIZE) return null;

        return {
          path: file.path,
          content,
          size: data.size,
        } satisfies RepoFile;
      })
    );

    for (const r of batchResults) {
      if (r.status === "fulfilled" && r.value) {
        results.push(r.value);
      }
    }
  }

  return results;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
