"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { GuideSection } from "@/data/guides";
import { getSectionProgress } from "@/components/learn/guide-content";

const dotColors: Record<string, string> = {
  info: "bg-blue-500",
  tip: "bg-amber-500",
  exercise: "bg-green-500",
  code: "bg-gray-400",
};

export function SectionNav({ sections }: { sections: GuideSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProgress(getSectionProgress());
    const h = () => setProgress(getSectionProgress());
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  useEffect(() => {
    const h = (e: CustomEvent) => setActiveId(e.detail);
    window.addEventListener("section-active", h as EventListener);
    return () => window.removeEventListener("section-active", h as EventListener);
  }, []);

  const go = (id: string) => {
    window.dispatchEvent(new CustomEvent("section-navigate", { detail: id }));
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2.5 px-1">
        Sections
      </p>
      <nav className="space-y-0.5">
        {sections.map((s, i) => {
          const isActive = s.id === activeId;
          const isDone = !!progress[s.id];
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-muted text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                {isDone ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <span className={`size-2 rounded-full ${isActive ? "bg-blue-500" : "bg-muted-foreground/30"}`} />
                )}
              </span>
              <span className="truncate text-sm">{i + 1}. {s.heading}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
