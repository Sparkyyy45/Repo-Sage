"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import type { Issue } from "@/lib/github/issues";
import { IssueFeed } from "./issue-feed";
import { IssueFilters } from "./issue-filters";

type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";
type SortOrder = "newest" | "oldest" | "comments";

const PAGE_SIZE = 10;

export function IssueFeedClient({
  issues,
}: {
  issues: Issue[];
}) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
  };

  const filtered = useMemo(() => {
    let result = [...issues];

    if (difficulty !== "all") {
      result = result.filter((issue) => {
        const labels = issue.labels.map((l) => l.toLowerCase());
        const isBeginner = labels.some(
          (l) => l.includes("good first") || l.includes("easy") || l.includes("beginner")
        );
        const isAdvanced = labels.some(
          (l) => l.includes("hard") || l.includes("complex") || l.includes("advanced")
        );
        const isIntermediate = !isBeginner && !isAdvanced;

        if (difficulty === "Beginner") return isBeginner;
        if (difficulty === "Advanced") return isAdvanced;
        return isIntermediate;
      });
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortOrder === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return b.comments - a.comments;
    });

    return result;
  }, [issues, difficulty, sortOrder]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [difficulty, sortOrder]);

  const filteredRepos = useMemo(
    () => new Set(filtered.map((i) => i.repoFullName)).size,
    [filtered]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <IssueFilters
          difficulty={difficulty}
          sortOrder={sortOrder}
          onDifficultyChange={setDifficulty}
          onSortChange={setSortOrder}
        />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh issues"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      <IssueFeed issues={visible} reposWithIssues={filteredRepos} />
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all shadow-sm"
          >
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
      {!hasMore && filtered.length > PAGE_SIZE && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          Showing all {filtered.length} issues
        </p>
      )}
    </div>
  );
}
