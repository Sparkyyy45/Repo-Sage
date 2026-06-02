import { ExternalLink, MessageCircle, Search, GitBranch, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Issue } from "@/lib/github/issues";

export function IssueFeed({
  issues,
  reposWithIssues,
}: {
  issues: Issue[];
  reposWithIssues: number;
}) {
  if (issues.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary">
          <Search className="size-7 text-secondary-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No issues found yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Issues tagged with &ldquo;good first issue&rdquo; matching your tech stack will
          appear here. Try searching for a specific repo above.
        </p>
        <Link
          href="https://github.com/topics/good-first-issue"
          target="_blank"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Browse good first issues on GitHub
          <ExternalLink className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Recommended Issues
        </h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {issues.length} from {reposWithIssues} repos
        </span>
      </div>
      <div className="space-y-4">
        {issues.slice(0, 10).map((issue) => (
          <IssueCard key={issue.htmlUrl} issue={issue} />
        ))}
      </div>
      {issues.length > 10 && (
        <p className="text-center text-sm text-muted-foreground">
          +{issues.length - 10} more issues available
        </p>
      )}
    </div>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const [owner, repoName] = issue.repoFullName.split("/");
  const repoPath = `/repo/${owner}/${repoName}`;
  const difficulty = estimateDifficulty(issue);
  const effort = estimateEffort(issue);

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <GitBranch className="size-4 shrink-0 text-muted-foreground" />
            <Link
              href={repoPath}
              className="font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              {issue.repoFullName}
            </Link>
          </div>

          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/issue/${owner}/${repoName}/${issue.number}`}
              className="text-base font-semibold text-foreground hover:text-primary hover:underline leading-snug transition-colors"
            >
              {issue.title}
            </Link>
            <Link
              href={issue.htmlUrl}
              target="_blank"
              className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Open on GitHub"
            >
              <ExternalLink className="size-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            <DifficultyBadge level={difficulty} />
            <EffortBadge effort={effort} />
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {issue.comments}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              Updated {formatDate(issue.updatedAt)}
            </span>
          </div>

          {issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {issue.labels.slice(0, 6).map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-md border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3">
            <AlertCircle className="size-4 mt-0.5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Why this matches:</span>{" "}
              {issue.labels.length > 0
                ? `Labeled as "${issue.labels.slice(0, 3).join('", "')}" — aligned with beginner-friendly open source contributions.`
                : "Tagged with good first issue — a great starting point for your first contribution."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    Advanced: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${styles[level] || styles.Beginner}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  const styles: Record<string, string> = {
    "Small": "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
    "Medium": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    "Large": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  };

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${styles[effort] || styles["Small"]}`}>
      ~{effort}
    </span>
  );
}

function estimateDifficulty(issue: Issue): string {
  const labels = issue.labels.map((l) => l.toLowerCase());
  if (
    labels.some((l) => l.includes("easy") || l.includes("good first") || l.includes("beginner"))
  ) {
    return "Beginner";
  }
  if (
    labels.some((l) => l.includes("hard") || l.includes("complex") || l.includes("advanced"))
  ) {
    return "Advanced";
  }
  return "Intermediate";
}

function estimateEffort(issue: Issue): string {
  const labels = issue.labels.map((l) => l.toLowerCase());
  if (
    labels.some((l) => l.includes("size: small") || l.includes("effort: small") || l.includes("quick") || l.includes("trivial"))
  ) {
    return "Small";
  }
  if (
    labels.some((l) => l.includes("size: large") || l.includes("effort: large") || l.includes("epic"))
  ) {
    return "Large";
  }
  return "Medium";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
