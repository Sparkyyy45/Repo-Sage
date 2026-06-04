"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bot, RefreshCw, AlertCircle } from "lucide-react";
import { generateText } from "@/lib/llm/provider";
import { SYSTEM_ONBOARDING } from "@/lib/llm/prompts";
import type { IngestedRepo } from "@/lib/github/ingest";
import type { IssueDetail } from "@/lib/github/issues";
import { renderMarkdown } from "@/lib/markdown";

const STORAGE_PREFIX = "reposage-guide-";

export function OnboardingGuide({
  repo,
  issue,
  repoFullName,
}: {
  repo: IngestedRepo;
  issue: IssueDetail;
  repoFullName: string;
}) {
  const storageKey = STORAGE_PREFIX + repoFullName + "#" + issue.number;

  const hasKey = typeof window !== "undefined" && !!localStorage.getItem("reposage-llm-config");

  const [guide, setGuide] = useState<string | null>(() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedRef = useRef(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);

    const treeSummary = repo.tree
      .filter((t) => t.type === "tree")
      .slice(0, 30)
      .map((t) => t.path)
      .join("\n");

    const filesSummary = repo.files
      .slice(0, 8)
      .map((f) => `--- ${f.path} ---\n${f.content.slice(0, 1000)}`)
      .join("\n\n");

    const prompt = [
      `## Repo\nName: ${repo.fullName}\nDescription: ${repo.description ?? "N/A"}\nLanguage: ${repo.language ?? "N/A"}\nTopics: ${repo.topics.join(", ") || "None"}\n`,
      `## Directory Tree\n${treeSummary}\n`,
      repo.readme ? `## README\n${repo.readme.slice(0, 3000)}\n` : "",
      repo.packageJson ? `## package.json\n${JSON.stringify(repo.packageJson, null, 2).slice(0, 2000)}\n` : "",
      `## Key Source Files\n${filesSummary}\n`,
      `## Issue\nTitle: ${issue.title}\nBody: ${(issue.body ?? "").slice(0, 2000)}\nLabels: ${issue.labels.join(", ")}\n`,
      "Generate the onboarding guide as specified.",
    ].join("\n");

    try {
      const result = await generateText(prompt, SYSTEM_ONBOARDING);
      setGuide(result);
      try { localStorage.setItem(storageKey, result); } catch { /* ignore */ }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [repo, issue, storageKey, setError, setGuide, setLoading]);

  useEffect(() => {
    if (generatedRef.current) return;
    generatedRef.current = true;
    if (!hasKey || guide) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generate().catch(() => {});
  }, [hasKey, guide, generate]);

  if (!hasKey) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex size-6 items-center justify-center rounded-md bg-muted/50">
            <Bot className="size-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            AI Onboarding Guide
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure an AI provider in{" "}
          <a href="/settings" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500">
            Settings
          </a>{" "}
          to get an onboarding guide for this repo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`flex size-6 items-center justify-center rounded-md transition-colors duration-300 ${guide && !loading ? "bg-indigo-100" : "bg-muted/50"}`}>
            <Bot className={`size-3.5 transition-colors duration-300 ${guide && !loading ? "text-indigo-600" : "text-muted-foreground"}`} />
          </div>
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            AI Onboarding Guide
          </h2>
        </div>
        {guide && (
          <button
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
            Regenerate
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="size-4 mt-0.5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Failed to generate guide</p>
            <p className="text-muted-foreground mt-1 text-xs">{error}</p>
            <button
              onClick={generate}
              className="mt-2 text-xs font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {guide !== null && !loading && (
        <div className="prose prose-sm max-w-none text-foreground [&_h2]:text-xs [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-sm [&_li]:leading-relaxed [&_p]:text-sm [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(guide) }}
        />
      )}
    </div>
  );
}
