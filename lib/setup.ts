import type { RepoTree, RepoFile } from "@/lib/github/ingest";

export type OS = "macos" | "windows" | "linux";
export type Ecosystem = "js" | "rust" | "go" | "ruby" | "python" | "java" | "other";

export interface SetupStep {
  step: number;
  label: string;
  commands: string[];
  note?: string;
}

export interface SetupResult {
  os: OS;
  fullName: string;
  repoName: string;
  ecosystem: Ecosystem;
  language: string | null;
  pmInfo: { name: string; install: string; run: string } | null;
  scripts: { name: string; command: string }[];
  runtimeVersion: { manager: string; version: string | null } | null;
  hasDocker: boolean;
  hasMakefile: boolean;
  makeTargets: string[];
  dockerBaseImage: string | null;
  tree: RepoTree[];
  steps: SetupStep[];
}

export function detectOS(): OS {
  if (typeof navigator === "undefined") return "linux";
  const p = navigator.platform.toLowerCase();
  if (p.includes("mac")) return "macos";
  if (p.includes("win")) return "windows";
  return "linux";
}

export function detectEcosystem(
  tree: RepoTree[],
  packageJson: Record<string, unknown> | null
): Ecosystem {
  const paths = new Set(tree.map((t) => t.path));
  if (packageJson) return "js";
  if (paths.has("Cargo.toml")) return "rust";
  if (paths.has("go.mod")) return "go";
  if (paths.has("Gemfile")) return "ruby";
  if (paths.has("pyproject.toml") || paths.has("setup.py") || paths.has("requirements.txt")) return "python";
  if (paths.has("build.gradle") || paths.has("pom.xml")) return "java";
  if (packageJson) return "js";
  return "other";
}

const PM_MAP: Record<string, { name: string; install: string; run: string }> = {
  pnpm: { name: "pnpm", install: "pnpm install", run: "pnpm" },
  yarn: { name: "yarn", install: "yarn", run: "yarn" },
  bun: { name: "bun", install: "bun install", run: "bun" },
  npm: { name: "npm", install: "npm install", run: "npm run" },
};

function getPMCommands(name: string) {
  return PM_MAP[name] ?? PM_MAP.npm;
}

export function detectPackageManager(
  tree: RepoTree[],
  packageJson: Record<string, unknown> | null
): { name: string; install: string; run: string } | null {
  if (!packageJson) return null;
  const pmField = packageJson.packageManager;
  if (typeof pmField === "string") {
    const name = pmField.split("@")[0];
    if (PM_MAP[name]) return getPMCommands(name);
  }
  const paths = new Set(tree.map((t) => t.path));
  if (paths.has("pnpm-lock.yaml")) return getPMCommands("pnpm");
  if (paths.has("yarn.lock")) return getPMCommands("yarn");
  if (paths.has("bun.lockb") || paths.has("bun.lock")) return getPMCommands("bun");
  if (paths.has("package-lock.json") || paths.has("npm-shrinkwrap.json")) return getPMCommands("npm");
  return getPMCommands("npm");
}

export function detectRuntimeVersion(
  tree: RepoTree[],
  packageJson: Record<string, unknown> | null
): { manager: string; version: string | null } | null {
  const paths = new Set(tree.map((t) => t.path));
  if (paths.has(".nvmrc") || paths.has(".node-version")) {
    return { manager: "nvm", version: null };
  }
  if (paths.has(".tool-versions")) {
    return { manager: "asdf", version: null };
  }
  if (packageJson) {
    const engines = packageJson.engines;
    if (engines && typeof engines === "object") {
      const nodeVer = (engines as Record<string, unknown>).node;
      if (typeof nodeVer === "string") {
        return { manager: "node", version: nodeVer };
      }
    }
  }
  return null;
}

export function extractScripts(
  packageJson: Record<string, unknown> | null
): { name: string; command: string }[] {
  if (!packageJson?.scripts || typeof packageJson.scripts !== "object") return [];
  const scripts = packageJson.scripts as Record<string, string>;
  const priority = ["dev", "build", "test", "start", "lint", "typecheck", "check"];
  const seen = new Set<string>();
  const result: { name: string; command: string }[] = [];
  for (const name of priority) {
    if (scripts[name] && !seen.has(name)) {
      seen.add(name);
      result.push({ name, command: scripts[name] });
    }
  }
  return result;
}

export function extractMakeTargets(tree: RepoTree[], files: RepoFile[]): string[] {
  const paths = new Set(tree.map((t) => t.path));
  if (!paths.has("Makefile")) return [];
  const makefile = files.find((f) => f.path === "Makefile");
  if (!makefile) return [];
  const targets: string[] = [];
  const regex = /^([a-zA-Z0-9_][a-zA-Z0-9_-]*):/gm;
  let match;
  while ((match = regex.exec(makefile.content)) !== null) {
    targets.push(match[1]);
  }
  return targets;
}

export function extractDockerBaseImage(files: RepoFile[]): string | null {
  const dockerfile = files.find((f) => f.path === "Dockerfile");
  if (!dockerfile) return null;
  const match = dockerfile.content.match(/^FROM\s+(\S+)/m);
  return match?.[1] ?? null;
}

export function pathExists(tree: RepoTree[], ...paths: string[]): boolean {
  const p = new Set(tree.map((t) => t.path));
  return paths.some((path) => p.has(path));
}

export function generateSetupSteps(result: SetupResult): SetupStep[] {
  const steps: SetupStep[] = [];
  const { fullName, repoName, ecosystem, pmInfo, scripts, runtimeVersion, hasDocker, hasMakefile, makeTargets } = result;

  steps.push({
    step: 1,
    label: "Clone the repository",
    commands: [
      `git clone https://github.com/${fullName}.git`,
      `cd ${repoName}`,
    ],
  });

  if (runtimeVersion) {
    if (runtimeVersion.version) {
      steps.push({
        step: steps.length + 1,
        label: "Set the correct runtime version",
        commands: [
          runtimeVersion.manager === "nvm"
            ? `nvm use ${runtimeVersion.version}`
            : runtimeVersion.manager === "asdf"
            ? `asdf install`
            : `# Ensure you have Node ${runtimeVersion.version}`,
        ],
      });
    } else {
      steps.push({
        step: steps.length + 1,
        label: "Set the correct runtime version",
        commands: [`nvm use           # version from ${pathExists(result.tree, ".nvmrc") ? ".nvmrc" : ".node-version"}`],
      });
    }
  }

  if (ecosystem === "js" && pmInfo) {
    steps.push({
      step: steps.length + 1,
      label: `Install dependencies`,
      commands: [pmInfo.install],
    });

    if (scripts.some((s) => s.name === "build")) {
      steps.push({
        step: steps.length + 1,
        label: "Build the project",
        commands: [`${pmInfo.run} build`],
      });
    }

    if (scripts.some((s) => s.name === "test")) {
      steps.push({
        step: steps.length + 1,
        label: "Verify everything works",
        commands: [`${pmInfo.run} test`],
      });
    }

    if (scripts.some((s) => s.name === "dev")) {
      steps.push({
        step: steps.length + 1,
        label: "Run locally",
        commands: [`${pmInfo.run} dev`],
        note: "Press Ctrl+C to stop the dev server.",
      });
    }
  } else if (ecosystem === "rust") {
    steps.push({ step: steps.length + 1, label: "Build the project", commands: ["cargo build"] });
    steps.push({ step: steps.length + 1, label: "Run tests", commands: ["cargo test"] });
    steps.push({ step: steps.length + 1, label: "Run locally", commands: ["cargo run"] });
  } else if (ecosystem === "go") {
    steps.push({ step: steps.length + 1, label: "Download dependencies", commands: ["go mod download"] });
    steps.push({ step: steps.length + 1, label: "Build the project", commands: ["go build ./..."] });
    steps.push({ step: steps.length + 1, label: "Run tests", commands: ["go test ./..."] });
    steps.push({ step: steps.length + 1, label: "Run locally", commands: ["go run ."] });
  } else if (ecosystem === "ruby") {
    steps.push({ step: steps.length + 1, label: "Install dependencies", commands: ["bundle install"] });
    steps.push({ step: steps.length + 1, label: "Run tests", commands: ["bundle exec rake test"] });
    steps.push({ step: steps.length + 1, label: "Run locally", commands: ["bundle exec rackup"] });
  } else if (ecosystem === "python") {
    steps.push({ step: steps.length + 1, label: "Install dependencies", commands: ["pip install -e ."] });
    steps.push({ step: steps.length + 1, label: "Run tests", commands: ["pytest"] });
  } else if (hasMakefile && makeTargets.length > 0) {
    if (makeTargets.includes("install") || makeTargets.includes("setup")) {
      steps.push({ step: steps.length + 1, label: "Install dependencies", commands: ["make install"] });
    }
    if (makeTargets.includes("build") || makeTargets.includes("all")) {
      steps.push({ step: steps.length + 1, label: "Build the project", commands: ["make build"] });
    }
    if (makeTargets.includes("test")) {
      steps.push({ step: steps.length + 1, label: "Run tests", commands: ["make test"] });
    }
    if (makeTargets.includes("dev") || makeTargets.includes("run")) {
      steps.push({ step: steps.length + 1, label: "Run locally", commands: [`make ${makeTargets.includes("dev") ? "dev" : "run"}`] });
    }
  }

  if (hasDocker && steps.length > 2) {
    steps.push({
      step: steps.length + 1,
      label: "Try Docker instead (no manual setup)",
      commands: ["docker compose up"],
      note: "Skips all steps above. Requires Docker Desktop.",
    });
  }

  return steps;
}

export function buildSetupContext(result: SetupResult): string {
  const lines: string[] = [
    `## OS\n${result.os}`,
    `## Repo\n${result.fullName}${result.language ? ` (${result.language})` : ""}`,
    `## Ecosystem\n${result.ecosystem}`,
  ];
  if (result.pmInfo) {
    lines.push(`## Package Manager\n${result.pmInfo.name} — install: \`${result.pmInfo.install}\`, run: \`${result.pmInfo.run}\``);
  }
  if (result.scripts.length > 0) {
    lines.push(`## Available Scripts\n${result.scripts.map((s) => `- ${s.name}: \`${s.command}\``).join("\n")}`);
  }
  if (result.runtimeVersion) {
    lines.push(`## Runtime\nManager: ${result.runtimeVersion.manager}${result.runtimeVersion.version ? `, version: ${result.runtimeVersion.version}` : ""}`);
  }
  if (result.hasDocker) lines.push("## Docker\nAvailable");
  if (result.hasMakefile) lines.push(`## Makefile\nTargets: ${result.makeTargets.join(", ") || "present"}`);
  return lines.join("\n\n");
}
