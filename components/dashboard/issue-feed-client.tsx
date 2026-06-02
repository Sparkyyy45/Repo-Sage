"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import type { Issue } from "@/lib/github/issues";
import { IssueFeed } from "./issue-feed";
import { IssueFilters } from "./issue-filters";

type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";
type SortOrder = "newest" | "oldest" | "comments";

const PAGE_SIZE = 10;

export function IssueFeedClient({
  issues: initialIssues,
  topLanguages,
}: {
  issues: Issue[];
  topLanguages: string[];
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [allIssues, setAllIssues] = useState(initialIssues);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialIssues.length >= PAGE_SIZE);

  const fetchPage = useCallback(async (pageNum: number) => {
    const res = await fetch("/api/issues/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ languages: topLanguages, page: pageNum }),
    });
    const data = await res.json();
    return (data.issues ?? []) as Issue[];
  }, [topLanguages]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchPage(1);
      setAllIssues(fresh);
      setPage(1);
      setHasMore(fresh.length >= PAGE_SIZE);
    } catch {
      setAllIssues(initialIssues);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage, initialIssues]);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newIssues = await fetchPage(nextPage);
      if (newIssues.length === 0) {
        setHasMore(false);
      } else {
        setAllIssues((prev) => {
          const seen = new Set(prev.map((i) => i.htmlUrl));
          const deduped = newIssues.filter((i) => !seen.has(i.htmlUrl));
          return [...prev, ...deduped];
        });
        setPage(nextPage);
        setHasMore(newIssues.length >= PAGE_SIZE);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [page, fetchPage]);

  const filtered = useMemo(() => {
    let result = [...allIssues];

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
  }, [allIssues, difficulty, sortOrder]);

  const filteredRepos = useMemo(
    () => new Set(filtered.map((i) => i.repoFullName)).size,
    [filtered]
  );

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
      <IssueFeed issues={filtered} reposWithIssues={filteredRepos} />
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50 transition-all shadow-sm disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
      {!hasMore && page > 1 && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          Showing all {allIssues.length} loaded issues
        </p>
      )}
    </div>
  );
}
