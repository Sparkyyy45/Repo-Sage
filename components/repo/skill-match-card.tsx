import { CheckCircle2, XCircle, Code2 } from "lucide-react";

export function SkillMatchCard({
  repoLanguage,
  matched,
  unmatched,
  percent,
}: {
  repoLanguage: string;
  matched: string[];
  unmatched: string[];
  percent: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Skills vs This Repo</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-foreground mb-3">
          This repo uses <span className="font-semibold text-primary">{repoLanguage}</span>
          {matched.length > 0 ? (
            <> — which matches your <span className="font-semibold">{matched.join(" & ")}</span> skills!</>
          ) : (
            <> — a great chance to learn something new!</>
          )}
        </p>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-3xl font-bold text-foreground tabular-nums">{percent}%</span>
        <span className="text-sm text-muted-foreground mb-1">skill match</span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {matched.length > 0 && (
          <div>
            <p className="text-xs font-medium text-emerald-600 mb-2">You already know:</p>
            <div className="flex flex-wrap gap-1.5">
              {matched.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-sm font-medium"
                >
                  <CheckCircle2 className="size-4" />
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
        {unmatched.length > 0 && percent < 100 && matched.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Languages to learn:</p>
            <div className="flex flex-wrap gap-1.5">
              {unmatched.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 rounded-lg bg-muted text-muted-foreground border border-border px-3 py-1.5 text-sm font-medium"
                >
                  <XCircle className="size-4" />
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {matched.length === 0 && (
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-sm text-secondary-foreground leading-relaxed">
            Your top languages don&apos;t overlap with this repo&apos;s stack, but that doesn&apos;t mean you can&apos;t contribute!
            Many open source projects welcome contributions in documentation, testing, and translations.
            Check the issues below to find something that fits your comfort level.
          </p>
        </div>
      )}
    </div>
  );
}
