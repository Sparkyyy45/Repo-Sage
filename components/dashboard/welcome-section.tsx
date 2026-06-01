import { BarChart3, Code2 } from "lucide-react";

export function WelcomeSection({
  name = "Developer",
  languages,
  totalStars,
  reposCount,
}: {
  name?: string | null;
  languages: { name: string; percentage: number; color: string | null }[];
  totalStars: number;
  reposCount: number;
}) {
  const topSkills = languages.slice(0, 5);
  const readinessScore = Math.min(
    100,
    reposCount * 4 + totalStars * 0.3 + languages.length * 5
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here are your recommended issues and insights.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 rounded-xl bg-secondary p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-secondary-foreground">Contribution Readiness</div>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-primary/20">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(Math.round(readinessScore), 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-secondary-foreground tabular-nums">
                {Math.round(Math.min(readinessScore, 100))}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {topSkills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((lang) => (
              <span
                key={lang.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
              >
                <span
                  className="size-2.5 rounded"
                  style={{ backgroundColor: lang.color ?? "#64748B" }}
                />
                {lang.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
