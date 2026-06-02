"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, GitPullRequest, GitMerge, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { getSavedIssues, updateIssueStatus, removeIssue, type IssueStatus, type SavedIssue } from "@/lib/saved-issues";

const statusMeta: Record<IssueStatus, { label: string; icon: React.ElementType; classes: string }> = {
  saved: { label: "Saved", icon: Bookmark, classes: "text-blue-600 bg-blue-50 border-blue-200" },
  working: { label: "Working on it", icon: BookmarkCheck, classes: "text-amber-600 bg-amber-50 border-amber-200" },
  "pr-submitted": { label: "PR Submitted", icon: GitPullRequest, classes: "text-purple-600 bg-purple-50 border-purple-200" },
  merged: { label: "Merged", icon: GitMerge, classes: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

const nextStatus: Record<IssueStatus, IssueStatus | null> = {
  saved: "working",
  working: "pr-submitted",
  "pr-submitted": "merged",
  merged: null,
};

const statusTabs: IssueStatus[] = ["saved", "working", "pr-submitted", "merged"];

function countByStatus(issues: SavedIssue[]): Record<IssueStatus, number> {
  return {
    saved: issues.filter((i) => i.status === "saved").length,
    working: issues.filter((i) => i.status === "working").length,
    "pr-submitted": issues.filter((i) => i.status === "pr-submitted").length,
    merged: issues.filter((i) => i.status === "merged").length,
  };
}

export function SavedIssuesSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<IssueStatus>("saved");

  const all = getSavedIssues();
  const counts = countByStatus(all);
  const filtered = all.filter((i) => i.status === activeTab);
  const total = all.length;

  const handleAdvance = (issue: SavedIssue) => {
    const next = nextStatus[issue.status];
    if (next) {
      updateIssueStatus(issue.id, next);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleRemove = (id: number) => {
    removeIssue(id);
    setRefreshKey((k) => k + 1);
  };

  if (total === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" key={refreshKey}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Your Issues
        </h2>
        <span className="text-sm tabular-nums text-muted-foreground">{total} total</span>
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {statusTabs.map((tab) => {
          const meta = statusMeta[tab];
          const count = counts[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? `${meta.classes} shadow-sm`
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <meta.icon className={`size-3 ${activeTab === tab ? "" : "text-muted-foreground/60"}`} />
              {meta.label}
              <span className="tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl bg-muted/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">No issues with this status.</p>
          </div>
        )}
        {filtered.map((issue) => {
          const [owner, repoName] = issue.repoFullName.split("/");
          return (
            <div
              key={issue.id}
              className="group flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
            >
              <Link
                href={`/issue/${owner}/${repoName}/${issue.number}`}
                className="min-w-0 flex-1 space-y-1"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span className="truncate font-medium text-muted-foreground">{issue.repoFullName}</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug truncate">
                  {issue.title}
                </p>
                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {issue.labels.slice(0, 3).map((l) => (
                      <span key={l} className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                {nextStatus[issue.status] && (
                  <button
                    onClick={() => handleAdvance(issue)}
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
                    title={`Mark as ${statusMeta[nextStatus[issue.status]!].label}`}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                )}
                <Link
                  href={issue.htmlUrl}
                  target="_blank"
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-colors"
                  title="Open on GitHub"
                >
                  <ExternalLink className="size-3" />
                </Link>
                <button
                  onClick={() => handleRemove(issue.id)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
