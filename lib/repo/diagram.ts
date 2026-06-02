import type { IngestedRepo, RepoTree } from "@/lib/github/ingest";

const ENTRY_POINTS = [
  "index.ts", "index.tsx", "index.js", "index.jsx",
  "main.ts", "main.tsx", "main.js", "main.jsx",
  "main.py", "app.py",
  "main.rs", "lib.rs",
  "main.go",
  "App.tsx", "App.jsx",
  "cli.ts", "cli.js",
];

const CONFIG_FILES = new Set([
  "package.json", "tsconfig.json", "next.config.js", "next.config.ts",
  "vite.config.ts", "vite.config.js", "webpack.config.js",
  "Cargo.toml", "go.mod", "pyproject.toml", "setup.py",
  "Gemfile", "Dockerfile",
]);

const DIR_LABELS: Record<string, string> = {
  src: "📁 Source",
  lib: "📁 Library",
  app: "📁 App",
  components: "📁 Components",
  pages: "📁 Pages",
  routes: "📁 Routes",
  api: "📁 API",
  utils: "📁 Utils",
  helpers: "📁 Helpers",
  hooks: "📁 Hooks",
  test: "📁 Tests",
  tests: "📁 Tests",
  spec: "📁 Tests",
  __tests__: "📁 Tests",
  config: "⚙️ Config",
  ".github": "⚙️ CI / Workflows",
  scripts: "📜 Scripts",
  docs: "📖 Docs",
  public: "🌐 Public",
  assets: "🎨 Assets",
  styles: "🎨 Styles",
  css: "🎨 Styles",
  "node_modules": "",
};

type DiagramCategory = "entry" | "source" | "test" | "config" | "docs" | "other";

interface DiagramNode {
  id: string;
  label: string;
  category: DiagramCategory;
  depth: number;
}

export function generateMermaidDiagram(repo: IngestedRepo): string {
  const maxDepth = 3;
  const maxNodes = 20;

  const tree = repo.tree;
  const entryNode = findEntryPoint(tree);
  const topDirs = collectTopDirectories(tree, maxDepth);
  const keyFiles = collectKeyFiles(tree);

  const nodes: DiagramNode[] = [];
  const edges: string[] = [];

  const rootId = safeId(repo.name);

  const rootLabel = `${repo.language ? `${repo.name} (${repo.language})` : repo.name}`;
  nodes.push({ id: rootId, label: rootLabel, category: "other", depth: 0 });

  if (entryNode) {
    const entryId = `${rootId}_entry`;
    nodes.push({
      id: entryId,
      label: `🟢 ${entryNode.path}`,
      category: "entry",
      depth: 1,
    });
    edges.push(`${rootId} --> ${entryId}`);
  }

  let nodeCount = nodes.length;

  for (const dir of topDirs) {
    if (nodeCount >= maxNodes) break;

    const dirLabel = DIR_LABELS[dir.name] || `📁 ${dir.name}`;
    const dirId = `${rootId}_${safeId(dir.name)}`;

    nodes.push({
      id: dirId,
      label: dirLabel,
      category: dirCategory(dir.name),
      depth: 1,
    });
    edges.push(`${rootId} --> ${dirId}`);

    const children = keyFiles
      .filter((f) => f.path.startsWith(dir.prefix) && f.depth === 2)
      .slice(0, 4);

    for (const child of children) {
      if (nodeCount >= maxNodes) break;
      const childId = `${dirId}_${safeId(child.name)}`;
      nodes.push({
        id: childId,
        label: child.name.length > 30 ? child.name.slice(0, 28) + "…" : child.name,
        category: child.category,
        depth: 2,
      });
      edges.push(`${dirId} --> ${childId}`);
      nodeCount++;
    }

    nodeCount++;
  }

  return buildMermaidString(nodes, edges);
}

function findEntryPoint(tree: RepoTree[]): RepoTree | undefined {
  return tree.find((t) => ENTRY_POINTS.includes(t.path));
}

interface TopDir {
  name: string;
  prefix: string;
}

function collectTopDirectories(tree: RepoTree[], maxDepth: number): TopDir[] {
  const seen = new Set<string>();
  const dirs: TopDir[] = [];

  for (const entry of tree) {
    if (entry.type !== "tree") continue;
    const parts = entry.path.split("/");
    if (parts.length === 0 || parts.length > maxDepth) continue;

    const top = parts[0];
    if (seen.has(top) || top.startsWith(".") || top === "node_modules") continue;
    seen.add(top);

    dirs.push({ name: top, prefix: entry.path + "/" });
  }

  const order = ["src", "lib", "app", "components", "pages", "test", "tests", "config", ".github", "docs", "scripts", "public"];
  dirs.sort((a, b) => {
    const ai = order.indexOf(a.name);
    const bi = order.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return dirs.slice(0, 10);
}

interface KeyFile {
  path: string;
  name: string;
  depth: number;
  category: DiagramCategory;
}

function collectKeyFiles(tree: RepoTree[]): KeyFile[] {
  const files: KeyFile[] = [];
  const seen = new Set<string>();

  for (const entry of tree) {
    if (entry.type !== "blob") continue;
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);

    const parts = entry.path.split("/");
    const depth = parts.length;
    if (depth < 1 || depth > 3) continue;

    const name = parts[parts.length - 1] ?? "";
    const parentDir = parts.length > 1 ? parts[0] : "";

    let category: DiagramCategory = "other";

    if (ENTRY_POINTS.includes(name)) category = "entry";
    else if (CONFIG_FILES.has(name) || name.startsWith(".")) category = "config";
    else if (parentDir === "test" || parentDir === "tests" || parentDir === "__tests__" || parentDir === "spec") category = "test";
    else if (name.endsWith(".md")) category = "docs";
    else if (SOURCE_EXTENSIONS.has(getExtension(name))) category = "source";

    files.push({ path: entry.path, name, depth, category });
  }

  return files;
}

const SOURCE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".py", ".rs", ".go", ".rb",
  ".java", ".kt", ".swift", ".c", ".cpp", ".h", ".hpp",
  ".css", ".scss", ".less", ".vue", ".svelte",
]);

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx);
}

function dirCategory(name: string): DiagramCategory {
  if (name === "test" || name === "tests" || name === "__tests__" || name === "spec") return "test";
  if (name === "config" || name === ".github") return "config";
  if (name === "docs") return "docs";
  if (name === "src" || name === "lib" || name === "app" || name === "components" || name === "pages") return "source";
  return "other";
}

function safeId(str: string): string {
  return str.replace(/[^a-zA-Z0-9\u4e00-\u9fff_]/g, "_").replace(/^_/, "a").replace(/_$/, "b") || "id";
}

function buildMermaidString(nodes: DiagramNode[], edges: string[]): string {
  const lines: string[] = ["flowchart TD"];

  for (const node of nodes) {
    const escaped = node.label.replace(/"/g, "#quot;");
    lines.push(`  ${node.id}["${escaped}"]`);
  }

  for (const edge of edges) {
    lines.push(`  ${edge}`);
  }

  lines.push("");
  lines.push("  classDef entry fill:#e8f5e9,stroke:#22c55e,color:#166534");
  lines.push("  classDef source fill:#eff6ff,stroke:#3b82f6,color:#1e40af");
  lines.push("  classDef test fill:#faf5ff,stroke:#a855f7,color:#6b21a8");
  lines.push("  classDef config fill:#fefce8,stroke:#f59e0b,color:#92400e");
  lines.push("  classDef docs fill:#ecfeff,stroke:#06b6d4,color:#155e75");
  lines.push("  classDef other fill:#f8fafc,stroke:#94a3b8,color:#475569");

  const grouped: Record<string, string[]> = {};
  for (const node of nodes) {
    const cat = node.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(node.id);
  }

  for (const [cat, ids] of Object.entries(grouped)) {
    if (ids.length > 0) {
      lines.push(`  class ${ids.join(",")} ${cat}`);
    }
  }

  return lines.join("\n");
}
