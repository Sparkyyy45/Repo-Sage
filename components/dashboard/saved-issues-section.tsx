"use client";

import { getSavedIssues, removeIssue, updateIssueStatus, type IssueStatus, type SavedIssue } from "@/lib/saved-issues";
import { Bookmark, BookmarkCheck, BookOpen, ExternalLink, GitMerge, GitPullRequest, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "./empty-state";

const statusMeta: Record<IssueStatus, { label: string; icon: React.ElementType; classes: string }> = {
  saved: { label: "Saved", icon: Bookmark, classes: "text-[hsl(258_45%_35%)] bg-[hsl(var(--grad-1)/0.35)] border-[hsl(var(--grad-1))]" },
  working: { label: "Working on it", icon: BookmarkCheck, classes: "text-[hsl(45_60%_28%)] bg-[hsl(var(--grad-4)/0.45)] border-[hsl(var(--grad-4))]" },
  "pr-submitted": { label: "PR Submitted", icon: GitPullRequest, classes: "text-[hsl(320_55%_35%)] bg-[hsl(var(--grad-2)/0.4)] border-[hsl(var(--grad-2))]" },
  merged: { label: "Merged", icon: GitMerge, classes: "text-[hsl(190_60%_25%)] bg-[hsl(var(--grad-3)/0.4)] border-[hsl(var(--grad-3))]" },
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

  if (total === 0) {
    return (
      <div className="rounded-2xl card-glow p-6">
        <EmptyState
          icon={Bookmark}
          title="No saved issues yet"
          description="Bookmark issues from the feed below to start tracking your open-source contributions."
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-glow p-6" key={refreshKey}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Your Issues
          </h2>
          <span className="text-xs text-muted-foreground/60 hidden sm:inline">
            saved → working → PR → merged
          </span>
        </div>
        <span className="text-sm tabular-nums text-muted-foreground">{total} total</span>
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 mt-3">
        {statusTabs.map((tab) => {
          const meta = statusMeta[tab];
          const count = counts[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? `${meta.classes} shadow-sm`
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--grad-1)/0.15)]"
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
          <EmptyState
            variant="compact"
            icon={BookOpen}
            description={
              activeTab === "saved"
                ? "Bookmark issues from the feed below to start tracking."
                : `No issues marked as "${statusMeta[activeTab].label}".`
            }
          />
        )}
        {filtered.map((issue) => {
          const [owner, repoName] = issue.repoFullName.split("/");
          return (
            <div
              key={issue.id}
              className="group flex items-start gap-3 rounded-xl border border-border p-3 transition-colors bg-[hsl(var(--grad-1)/0.06)] hover:bg-[hsl(var(--grad-1)/0.12)]"
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
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-[hsl(var(--grad-1)/0.2)] transition-colors"
                    title={`Mark as ${statusMeta[nextStatus[issue.status]!].label}`}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                )}
                <Link
                  href={issue.htmlUrl}
                  target="_blank"
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/30 hover:text-foreground hover:bg-[hsl(var(--grad-1)/0.2)] transition-colors"
                  title="Open on GitHub"
                >
                  <ExternalLink className="size-3" />
                </Link>
                <button
                  onClick={() => handleRemove(issue.id)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground/20 hover:text-red-500 hover:bg-red-50 transition-colors"
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