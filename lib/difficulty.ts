import type { Issue } from "@/lib/github/issues";

const BEGINNER_LABELS = [
  "good first issue", "help wanted", "easy", "beginner", "starter",
  "low-hanging fruit", "trivial", "documentation", "typo", "enhancement",
  "priority: low", "size: small", "size: xs", "good first",
];
const ADVANCED_LABELS = [
  "hard", "complex", "advanced", "epic", "needs discussion",
  "breaking change", "breaking", "major", "size: large", "size: xl",
  "performance", "security", "infrastructure", "redesign", "migration",
];
const BEGINNER_TITLE_WORDS = ["typo", "fix typo", "update", "bump", "upgrade", "nit", "lint"];
const ADVANCED_TITLE_WORDS = [
  "api", "refactor", "redesign", "migration", "breaking",
  "performance", "optimize", "infrastructure", "architecture",
];

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export function estimateDifficulty(issue: Pick<Issue, "labels" | "comments" | "title">): Difficulty {
  const labels = issue.labels.map((l) => l.toLowerCase());
  const title = issue.title.toLowerCase();
  let score = 0;

  const hasBeginner = labels.some((l) => BEGINNER_LABELS.some((b) => l.includes(b)));
  const hasAdvanced = labels.some((l) => ADVANCED_LABELS.some((a) => l.includes(a)));

  if (hasBeginner) score -= 2;
  if (hasAdvanced) score += 3;

  if (issue.comments <= 2) score -= 0.5;
  else if (issue.comments <= 8) score += 0.5;
  else score += 1.5;

  if (BEGINNER_TITLE_WORDS.some((w) => title.includes(w))) score -= 1;
  if (ADVANCED_TITLE_WORDS.some((w) => title.includes(w))) score += 2;

  if (score < 1) return "Beginner";
  if (score < 3.5) return "Intermediate";
  return "Advanced";
}

export function estimateEffort(issue: Pick<Issue, "labels" | "comments">): string {
  const labels = issue.labels.map((l) => l.toLowerCase());
  if (
    labels.some(
      (l) =>
        l.includes("size: small") || l.includes("effort: small") || l.includes("quick") || l.includes("trivial") || l.includes("size: xs")
    )
  ) {
    return "Small";
  }
  if (
    labels.some(
      (l) => l.includes("size: large") || l.includes("effort: large") || l.includes("epic") || l.includes("size: xl")
    )
  ) {
    return "Large";
  }
  if (issue.comments > 10) return "Large";
  if (issue.comments <= 3) return "Small";
  return "Medium";
}
