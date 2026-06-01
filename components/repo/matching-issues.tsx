import { ExternalLink, Bug, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { MatchingIssue } from "@/lib/github/repo-insights";

export function MatchingIssues({
  issues,
  repoFullName,
}: {
  issues: MatchingIssue[];
  repoFullName: string;
}) {
  if (issues.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bug className="size-4 text-muted-foreground" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Good First Issues
          </h3>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4 text-center">
          <p className="text-sm text-secondary-foreground">
            No open good-first-issues found for this repo. Try browsing the
            repo directly on GitHub to find other ways to contribute.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bug className="size-4 text-muted-foreground" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Good First Issues
          </h3>
        </div>
        <Link
          href={`https://github.com/${repoFullName}/issues?q=label%3A%22good+first+issue%22+is%3Aissue+is%3Aopen`}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Browse all
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const isBeginner = issue.labels.some(
            (l) =>
              l.toLowerCase().includes("good first") ||
              l.toLowerCase().includes("easy") ||
              l.toLowerCase().includes("beginner")
          );
          return (
            <Link
              key={issue.htmlUrl}
              href={issue.htmlUrl}
              target="_blank"
              className="block rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60 hover:border-foreground/20 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {issue.title}
                    <ExternalLink className="size-3 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {isBeginner && (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
                        Beginner friendly
                      </span>
                    )}
                    {issue.labels.slice(0, 4).map((label) => (
                      <span
                        key={label}
                        className="inline-flex rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
