import { Code2, GitBranch, Layers, BarChart3 } from "lucide-react";

export function WelcomeSection({
  name = "Developer",
  languages,
  reposCount,
  issuesCount,
  reposWithIssues,
}: {
  name?: string | null;
  languages: { name: string; percentage: number; color: string | null }[];
  reposCount: number;
  issuesCount: number;
  reposWithIssues: number;
}) {
  const topSkills = languages.slice(0, 5);

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

        {issuesCount > 0 && (
          <div className="flex shrink-0 items-center gap-4 rounded-xl bg-indigo-50/60 border border-indigo-100/50 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-indigo-700">Issues found for you</div>
              <div className="mt-0.5 text-2xl font-bold text-indigo-600 tabular-nums">
                {issuesCount}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="size-3.5" />
            Issues found
          </div>
          <div className="mt-1 text-xl font-bold text-foreground tabular-nums">{issuesCount}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="size-3.5" />
            Repos matched
          </div>
          <div className="mt-1 text-xl font-bold text-foreground tabular-nums">{reposWithIssues}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Code2 className="size-3.5" />
            Languages
          </div>
          <div className="mt-1 text-xl font-bold text-foreground tabular-nums">{languages.length}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="size-3.5" />
            Your repos
          </div>
          <div className="mt-1 text-xl font-bold text-foreground tabular-nums">{reposCount}</div>
        </div>
      </div>

      {topSkills.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
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
