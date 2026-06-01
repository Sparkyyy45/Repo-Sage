import { GitPullRequest, GitCommitHorizontal, Clock } from "lucide-react";

export function ActivityChart({
  weeklyCommits,
  openPRs,
  lastPushAgo,
}: {
  weeklyCommits: number[];
  openPRs: number;
  lastPushAgo: string;
}) {
  const maxCommits = Math.max(...weeklyCommits, 1);
  const dayLabels = getWeekLabels(weeklyCommits.length);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <GitCommitHorizontal className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</h3>
      </div>

      <div className="flex gap-1.5 items-end h-20 mb-3">
        {weeklyCommits.map((count, i) => {
          const height = count > 0 ? Math.max((count / maxCommits) * 100, 8) : 4;
          return (
            <div key={i} className="group relative flex-1">
              <div
                className="w-full rounded-sm bg-primary/60 transition-colors hover:bg-primary"
                style={{ height: `${height}%` }}
                title={`Week ${i + 1}: ${count} commits`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground mb-4">
        <span>{dayLabels[0]}</span>
        <span>{dayLabels[dayLabels.length - 1]}</span>
      </div>

      <div className="space-y-2 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <GitPullRequest className="size-3.5" />
            Open PRs
          </span>
          <span className="font-semibold text-foreground tabular-nums">{openPRs}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5" />
            Last push
          </span>
          <span className="font-semibold text-foreground tabular-nums">{lastPushAgo}</span>
        </div>
      </div>
    </div>
  );
}

function getWeekLabels(count: number): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }
  return labels;
}
