import { ExternalLink, MessageCircle, Search, GitBranch, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Issue } from "@/lib/github/issues";
import { estimateDifficulty, estimateEffort } from "@/lib/difficulty";
import type { Difficulty } from "@/lib/difficulty";
import { IssueBookmarkButton } from "./issue-bookmark-button";

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
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
          <Search className="size-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No issues found yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Issues tagged with &ldquo;good first issue&rdquo; matching your tech stack will
          appear here. Try searching for a specific repo above.
        </p>
        <Link
          href="https://github.com/topics/good-first-issue"
          target="_blank"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
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
          Issues for You
        </h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {issues.length} from {reposWithIssues} repos
        </span>
      </div>
      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCard key={issue.htmlUrl} issue={issue} />
        ))}
      </div>
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
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/issue/${owner}/${repoName}/${issue.number}`}
              className="text-base font-semibold text-foreground hover:text-indigo-600 hover:underline leading-snug transition-colors"
            >
              {issue.title}
            </Link>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <IssueBookmarkButton issue={issue} />
              <Link
                href={issue.htmlUrl}
                target="_blank"
                className="flex size-8 items-center justify-center rounded-xl text-muted-foreground/30 hover:text-muted-foreground hover:border-border hover:bg-muted/50 transition-colors"
                title="Open on GitHub"
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
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

          <div className="relative pl-4 border-l-2 border-indigo-200/60">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Why this matches:</span>{" "}
              {issue.labels.length > 0
                ? `Labeled as "${issue.labels.slice(0, 3).join('", "')}" — aligned with your ${difficulty.toLowerCase()} skill level.`
                : "Tagged with good first issue — a great starting point for your first contribution."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ level }: { level: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    Advanced: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${styles[level]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  const styles: Record<string, string> = {
    "Small": "bg-sky-50 text-sky-700 border-sky-200",
    "Medium": "bg-amber-50 text-amber-700 border-amber-200",
    "Large": "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${styles[effort] || styles["Small"]}`}>
      ~{effort}
    </span>
  );
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
