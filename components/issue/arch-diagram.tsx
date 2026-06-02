"use client";

import { useEffect, useRef, useState } from "react";
import type { IngestedRepo } from "@/lib/github/ingest";
import { generateMermaidDiagram } from "@/lib/repo/diagram";

export function ArchDiagram({ repo }: { repo: IngestedRepo }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const diagram = generateMermaidDiagram(repo);

  useEffect(() => {
    if (!ref.current || !diagram) return;
    let mounted = true;

    import("mermaid").then((mermaid) => {
      if (!mounted || !ref.current) return;
      mermaid.default.initialize({ startOnLoad: false, theme: "default" });
      ref.current.innerHTML = "";
      mermaid.default
        .render("archDiagram", diagram)
        .then(({ svg }) => {
          if (mounted && ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch(() => {
          if (mounted) setError(true);
        });
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
        <span className="text-sm">🏗️</span>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Repo Architecture
        </h2>
      </div>
      <div ref={ref} className="overflow-x-auto [&_svg]:mx-auto" />
    </div>
  );
}
