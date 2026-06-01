import type { RepoInsightData } from "@/lib/github/repo-insights";
import { SkillMatchCard } from "./skill-match-card";
import { BeginnerCard } from "./beginner-card";
import { ActivityChart } from "./activity-chart";
import { ImprovementList } from "./improvement-list";
import { MatchingIssues } from "./matching-issues";

function computeDaysAgo(dateStr: string): string {
  if (!dateStr) return "Unknown";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0 || isNaN(diff)) return "Unknown";
  const days = Math.floor(diff / 86400000);
  if (days <= 1) return "Today";
  return `${days}d ago`;
}

export function InsightsSection({
  insights,
  repoFullName,
  description,
  topics,
  language,
}: {
  insights: RepoInsightData;
  repoFullName: string;
  description: string | null;
  topics: string[];
  language: string | null;
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          How this repo fits your skills
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {description
            ? `"${description}" — ${repoFullName}`
            : `${repoFullName}`}{" "}
          is built with <span className="font-medium text-foreground">{language || "various technologies"}</span>.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <SkillMatchCard
              repoLanguage={insights.skillMatch.repoLanguage}
              matched={insights.skillMatch.matched}
              unmatched={insights.skillMatch.unmatched}
              percent={insights.skillMatch.percent}
            />
          </div>
          <div className="space-y-5">
            <BeginnerCard
              score={insights.beginnerScore}
              breakdown={insights.breakdown}
            />
          </div>
        </div>

        {topics.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {insights.beginnerScore < 80 && insights.improvements.length > 0 && (
        <ImprovementList improvements={insights.improvements} />
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-5">
          Good First Issues for You
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2">
            <MatchingIssues
              issues={insights.matchingIssues}
              repoFullName={repoFullName}
            />
          </div>
          <div className="md:col-span-1">
            <ActivityChart
              weeklyCommits={insights.weeklyCommits}
              openPRs={insights.openPRs}
              lastPushAgo={computeDaysAgo(insights.lastPush)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
