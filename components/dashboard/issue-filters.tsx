"use client";

import { Filter, Sparkles, Info } from "lucide-react";
import type { Difficulty } from "@/lib/difficulty";

type DifficultyFilter = "all" | Difficulty;
type SortOrder = "newest" | "oldest" | "comments";

const DIFFICULTY_HINTS: Record<string, string> = {
  Beginner: "Entry-level issues with beginner-friendly labels and low discussion activity.",
  Intermediate: "Issues that may require some codebase familiarity. Moderate discussion and scope.",
  Advanced: "Complex issues involving architecture, performance, or cross-cutting changes.",
};

export function IssueFilters({
  difficulty,
  sortOrder,
  onDifficultyChange,
  onSortChange,
  counts,
}: {
  difficulty: DifficultyFilter;
  sortOrder: SortOrder;
  onDifficultyChange: (d: DifficultyFilter) => void;
  onSortChange: (s: SortOrder) => void;
  counts: Record<Difficulty, number>;
}) {
  const difficulties: DifficultyFilter[] = ["all", "Beginner", "Intermediate", "Advanced"];

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "comments", label: "Most Comments" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Filter className="size-3.5" />
        <span className="hidden sm:inline">Filter</span>
      </div>
      <div className="flex gap-1">
        {difficulties.map((d) => {
          const isActive = difficulty === d;
          const count = d === "all"
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : counts[d as Difficulty];
          return (
            <div key={d} className="relative group">
              <button
                onClick={() => onDifficultyChange(d)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                {d === "all" ? "All" : d}
                <span className={`ml-1 tabular-nums ${isActive ? "text-indigo-200" : "text-muted-foreground/50"}`}>
                  {count}
                </span>
              </button>
              {d !== "all" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
                    <div className="flex items-start gap-1.5">
                      <Info className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
                      <span>{DIFFICULTY_HINTS[d]}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-400/30"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {difficulty === "all" && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-indigo-500/70">
            <Sparkles className="size-3" />
            Beginner? Try filtering by level
          </span>
        )}
      </div>
    </div>
  );
}
