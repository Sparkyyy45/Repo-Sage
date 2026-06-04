"use client";

import { useState, useMemo, useCallback } from "react";
import { RefreshCw, Filter, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "@/lib/github/issues";
import { estimateDifficulty } from "@/lib/difficulty";
import type { Difficulty } from "@/lib/difficulty";
import { IssueFeed } from "./issue-feed";
import { IssueFilters } from "./issue-filters";

type DifficultyFilter = "all" | Difficulty;
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
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [allIssues, setAllIssues] = useState(initialIssues);
  const [currentPage, setCurrentPage] = useState(1);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/issues/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languages: topLanguages, page: 1 }),
      });
      const data = await res.json();
      setAllIssues(data.issues ?? []);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to refresh issues");
    } finally {
      setRefreshing(false);
    }
  }, [topLanguages]);

  const filtered = useMemo(() => {
    let result = [...allIssues];

    if (difficulty === "Beginner") {
      result = result.filter(
        (issue) =>
          estimateDifficulty(issue) === "Beginner" ||
          issue.labels.some((l) => l.toLowerCase() === "good first issue")
      );
    } else if (difficulty !== "all") {
      result = result.filter((issue) => estimateDifficulty(issue) === difficulty);
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortOrder === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return b.comments - a.comments;
    });

    return result;
  }, [allIssues, difficulty, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const displayed = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = useCallback((p: number) => {
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const handleDifficultyChange = useCallback((d: DifficultyFilter) => {
    setDifficulty(d);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((s: SortOrder) => {
    setSortOrder(s);
    setCurrentPage(1);
  }, []);

  const counts = useMemo(() => {
    const c = { Beginner: 0, Intermediate: 0, Advanced: 0 };
    for (const issue of allIssues) {
      c[estimateDifficulty(issue)]++;
    }
    return c;
  }, [allIssues]);

  const filteredRepos = useMemo(
    () => new Set(filtered.map((i) => i.repoFullName)).size,
    [filtered]
  );

  const zeroResults = filtered.length === 0 && allIssues.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <IssueFilters
          difficulty={difficulty}
          sortOrder={sortOrder}
          onDifficultyChange={handleDifficultyChange}
          onSortChange={handleSortChange}
          counts={counts}
        />
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh issues"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {allIssues.length > 0 && (
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart3 className="size-3.5" />
            <span className="font-medium text-foreground">{allIssues.length}</span> total
          </div>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{counts.Beginner}</span> beginner
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{counts.Intermediate}</span> intermediate
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{counts.Advanced}</span> advanced
              </span>
            </span>
          </div>
        </div>
      )}

      {zeroResults && (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
          <Filter className="size-8 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            No {difficulty === "Intermediate" ? "intermediate" : difficulty?.toLowerCase()} issues found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Try a different difficulty level or check back later.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {(["all", "Beginner", "Intermediate", "Advanced"] as const)
              .filter((d) => d !== difficulty)
              .map((d) => (
                <button
                  key={d}
                  onClick={() => handleDifficultyChange(d)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {d === "all" ? "All issues" : d}
                  {d !== "all" && (
                    <span className="tabular-nums text-muted-foreground/60">
                      ({counts[d as Difficulty]})
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      <IssueFeed issues={displayed} reposWithIssues={filteredRepos} />

      {allIssues.length > 0 && totalPages > 1 && (
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | "...")[] = [];

  pages.push(1);

  const rangeStart = Math.max(2, currentPage - 2);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 2);

  if (rangeStart > 2) pages.push("...");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex size-8 items-center justify-center rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="inline-flex size-8 items-center justify-center text-xs text-muted-foreground/40">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`inline-flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === currentPage
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex size-8 items-center justify-center rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {startItem}–{endItem} of {totalItems}
      </p>
    </div>
  );
}
