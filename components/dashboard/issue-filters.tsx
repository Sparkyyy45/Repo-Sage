"use client";

import { Filter } from "lucide-react";

type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";
type SortOrder = "newest" | "oldest" | "comments";

export function IssueFilters({
  difficulty,
  sortOrder,
  onDifficultyChange,
  onSortChange,
}: {
  difficulty: DifficultyFilter;
  sortOrder: SortOrder;
  onDifficultyChange: (d: DifficultyFilter) => void;
  onSortChange: (s: SortOrder) => void;
}) {
  const difficulties: DifficultyFilter[] = ["all", "Beginner", "Intermediate", "Advanced"];

  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "comments", label: "Most Comments" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Filter className="size-3.5" />
        <span>Filter:</span>
      </div>
      <div className="flex gap-1">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
              difficulty === d
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            {d === "all" ? "All" : d}
          </button>
        ))}
      </div>
      <div className="ml-auto">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
