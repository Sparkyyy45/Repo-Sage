"use client";

import { useEffect, useRef, useState } from "react";
import { GitBranch } from "lucide-react";
import type { IngestedRepo } from "@/lib/github/ingest";
import { generateMermaidDiagram } from "@/lib/repo/diagram";

export function ArchDiagram({ repo }: { repo: IngestedRepo }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const diagram = generateMermaidDiagram(repo);

  useEffect(() => {
    if (!ref.current || !diagram) return;
    let mounted = true;

    import("mermaid")
      .then((mermaid) => {
        if (!mounted || !ref.current) return;
        mermaid.default.initialize({ startOnLoad: false, theme: "default" });
        ref.current.innerHTML = "";
        mermaid.default
          .render("archDiagram", diagram)
          .then(({ svg }) => {
            if (mounted && ref.current) {
              ref.current.innerHTML = svg;
              setLoading(false);
            }
          })
          .catch(() => {
            if (mounted) setError(true);
          })
          .finally(() => {
            if (mounted) setLoading(false);
          });
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [diagram]);

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Could not render the architecture diagram. The repo structure may be too complex.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="size-4 text-indigo-500" />
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Repo Architecture
        </h2>
      </div>
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-32 bg-muted rounded-lg w-full" />
        </div>
      )}
      <div ref={ref} className={`overflow-x-auto [&_svg]:mx-auto ${loading ? "hidden" : ""}`} />
    </div>
  );
}
