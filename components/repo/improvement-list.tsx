import { Lightbulb, ArrowRight } from "lucide-react";

export function ImprovementList({
  improvements,
}: {
  improvements: string[];
}) {
  if (improvements.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="size-4 text-amber-500" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Improvements Needed
        </h3>
      </div>
      <div className="space-y-3">
        {improvements.map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <ArrowRight className="size-4 mt-0.5 shrink-0 text-amber-500" />
            <p className="text-sm text-foreground leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
