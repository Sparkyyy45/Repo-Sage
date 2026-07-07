"use client";

import { getSectionProgress } from "@/components/learn/guide-content";
import type { Guide } from "@/data/guides";
import { Check } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function GuideCard({ guide }: { guide: Guide }) {
  const total = guide.sections.length;
  const done = useMemo(() => {
    const p = getSectionProgress();
    return guide.sections.filter((s) => p[s.id]).length;
  }, [guide.sections]);
  const allDone = done === total;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <Link
      href={`/learn/${guide.slug}`}
      className="group flex items-center gap-4 py-4 border-b border-border/40 last:border-0 transition-colors hover:bg-[hsl(var(--grad-1)/0.12)] -mx-6 px-6"
    >
      <span className="text-[10px] font-semibold tabular-nums text-muted-foreground/30 w-6 shrink-0 text-right">
        {String(guide.order).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-[hsl(258_55%_45%)]">
            {guide.title}
          </h3>
          {allDone && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
              <Check className="size-2.5" />
              Done
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{guide.description}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="h-1 flex-1 max-w-[160px] rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500 bg-[linear-gradient(90deg,hsl(var(--grad-1)),hsl(var(--grad-3)))]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums text-muted-foreground/60">
            {done}/{total}
          </span>
          <span className="text-[10px] text-muted-foreground/40">&middot;</span>
          <span className="text-[10px] text-muted-foreground/60">{guide.readTime}</span>
        </div>
      </div>

      <div className="hidden sm:flex size-7 shrink-0 items-center justify-center rounded-md border border-border/50 text-muted-foreground/30 transition-colors group-hover:border-[hsl(var(--grad-1))] group-hover:text-[hsl(258_55%_45%)]">
        <span className="text-xs font-medium">{allDone ? "✓" : "→"}</span>
      </div>
    </Link>
  );
}