"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getSectionProgress } from "@/components/learn/guide-content";
import { guides } from "@/data/guides";

export function LearnSidebarSection() {
  const [completedSections] = useState(() => {
    const progress = getSectionProgress();
    return guides.reduce(
      (sum, g) => sum + g.sections.filter((s) => progress[s.id]).length,
      0
    );
  });
  const [completedGuides] = useState(() => {
    const progress = getSectionProgress();
    return guides.filter((g) =>
      g.sections.every((s) => progress[s.id])
    ).length;
  });

  const totalSections = guides.reduce((sum, g) => sum + g.sections.length, 0);
  const totalGuides = guides.length;
  const sectionPct = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
  const allDone = completedGuides === totalGuides;

  const nextGuide = guides.find(
    (g) => !g.sections.every((s) => {
      try {
        const progress = getSectionProgress();
        return !!progress[s.id];
      } catch {
        return false;
      }
    })
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Learning
        </h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground font-medium">Guides</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedGuides}/{totalGuides}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground font-medium">Sections</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedSections}/{totalSections}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${sectionPct}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        {allDone
          ? "You've completed all guides! Time to find your first issue."
          : nextGuide
            ? `Next up: "${nextGuide.title}"`
            : "Learn how to contribute to open source from scratch."}
      </p>

      <Link
        href={allDone ? "/dashboard" : nextGuide ? `/learn/${nextGuide.slug}` : "/learn"}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        {allDone ? "Find your first issue" : completedGuides === 0 ? "Start learning" : "Continue"}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
