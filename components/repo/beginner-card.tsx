import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export function BeginnerCard({
  score,
  breakdown,
}: {
  score: number;
  breakdown: {
    hasContributing: boolean;
    hasCodeOfConduct: boolean;
    hasIssueTemplates: boolean;
    hasPRTemplate: boolean;
    goodFirstIssues: number;
    recentCommit: boolean;
  };
}) {
  const ringColor =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 50
        ? "stroke-amber-500"
        : "stroke-rose-500";

  const label =
    score >= 80
      ? "Very Beginner Friendly"
      : score >= 50
        ? "Moderately Friendly"
        : "Needs Improvement";

  const items = [
    { label: "CONTRIBUTING.md", ok: breakdown.hasContributing },
    { label: "CODE_OF_CONDUCT.md", ok: breakdown.hasCodeOfConduct },
    { label: "Issue Templates", ok: breakdown.hasIssueTemplates },
    { label: "PR Template", ok: breakdown.hasPRTemplate },
    { label: `Good first issues (${breakdown.goodFirstIssues})`, ok: breakdown.goodFirstIssues >= 3 },
    { label: "Active (pushed ≤30d)", ok: breakdown.recentCommit },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Beginner Friendly</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative size-16 shrink-0">
          <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="16"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="16"
              fill="none"
              className={ringColor}
              strokeWidth="3"
              strokeDasharray={`${score} ${100 - score}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground tabular-nums">
            {score}
          </span>
        </div>
        <div>
          <div className="text-base font-semibold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">out of 100</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            {item.ok ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <XCircle className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
