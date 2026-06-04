"use client";

import { useState } from "react";
import Link from "next/link";
import { guides } from "@/data/guides";
import { getSectionProgress } from "@/components/learn/guide-content";

export function LearnProgressDots() {
  const [progression] = useState<Record<string, { done: number; total: number }>>(() => {
    const progress = getSectionProgress();
    const result: Record<string, { done: number; total: number }> = {};
    for (const guide of guides) {
      const done = guide.sections.filter((s) => progress[s.id]).length;
      result[guide.slug] = { done, total: guide.sections.length };
    }
    return result;
  });

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {guides.map((g) => {
        const p = progression[g.slug];
        const pct = p ? p.done / p.total : 0;
        return (
          <Link
            key={g.slug}
            href={`/learn/${g.slug}`}
            className={`h-2 rounded-full transition-colors duration-300 ${
              pct === 1 ? "bg-green-500" : pct > 0 ? "bg-blue-400" : "bg-muted"
            }`}
            title={p ? `${g.title}: ${p.done}/${p.total} sections` : g.title}
          />
        );
      })}
    </div>
  );
}
