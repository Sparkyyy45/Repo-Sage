"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessageCircle, Send, AlertCircle, Sparkles } from "lucide-react";
import { streamText } from "@/lib/llm/provider";
import { SYSTEM_ANALYSIS } from "@/lib/llm/prompts";
import type { IngestedRepo } from "@/lib/github/ingest";
import type { IssueDetail } from "@/lib/github/issues";
import { renderMarkdown } from "@/lib/markdown";

export function IssueChat({
  repo,
  issue,
}: {
  repo: IngestedRepo;
  issue: IssueDetail;
  repoFullName: string;
}) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const analysisStartedRef = useRef(false);

  const hasKey = typeof window !== "undefined" && !!localStorage.getItem("reposage-llm-config");

  const buildContext = useCallback(
    (extraPrompt?: string) => {
      const treeSummary = repo.tree
        .filter((t) => t.type === "blob" && t.path.split("/").length <= 3)
        .slice(0, 40)
        .map((t) => t.path)
        .join("\n");

      const filesSummary = repo.files
        .slice(0, 6)
        .map((f) => `--- ${f.path} ---\n${f.content.slice(0, 800)}`)
        .join("\n\n");

      let prompt = [
        `## Repo\nName: ${repo.fullName}\nDescription: ${repo.description ?? "N/A"}\nLanguage: ${repo.language ?? "N/A"}\nTopics: ${repo.topics.join(", ") || "None"}\n`,
        `## File Tree\n${treeSummary}\n`,
        repo.readme ? `## README\n${repo.readme.slice(0, 2000)}\n` : "",
        `## Key Source Files\n${filesSummary}\n`,
        `## Issue\nTitle: ${issue.title}\nBody: ${(issue.body ?? "").slice(0, 3000)}\nLabels: ${issue.labels.join(", ")}\n`,
      ].join("\n");

      if (extraPrompt) {
        prompt += `\n\n## Follow-up Question\n${extraPrompt}\n\nAnswer the follow-up question concisely, referencing the same repo and issue context above.`;
      }

      return prompt;
    },
    [repo, issue]
  );

  const generateAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const prompt = buildContext();

    try {
      let accumulated = "";
      await streamText(prompt, SYSTEM_ANALYSIS, (token) => {
        accumulated += token;
        setAnalysis(accumulated);
      });
      setAnalysis(accumulated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [buildContext]);

  useEffect(() => {
    if (analysisStartedRef.current) return;
    analysisStartedRef.current = true;
    if (hasKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateAnalysis().catch(() => {});
    }
  }, [hasKey, generateAnalysis]);

  const handleFollowUp = async () => {
    if (!followUp.trim() || followUpLoading) return;

    setFollowUpLoading(true);
    setFollowUpAnswer(null);

    const prompt = buildContext(followUp);

    try {
      let accumulated = "";
      await streamText(prompt, SYSTEM_ANALYSIS, (token) => {
        accumulated += token;
        setFollowUpAnswer(accumulated);
      });
      setFollowUpAnswer(accumulated);
      setFollowUp("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to answer";
      setError(msg);
    } finally {
      setFollowUpLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="size-4 text-muted-foreground" />
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Issue Analysis
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure an AI provider in{" "}
          <a href="/settings" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Settings
          </a>{" "}
          to get an AI-powered analysis of what this issue requires.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="size-4 text-muted-foreground" />
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          What does this issue need?
        </h2>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive mb-4">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Analysis failed</p>
            <p className="text-muted-foreground mt-1">{error}</p>
            <button
              onClick={generateAnalysis}
              className="mt-2 text-xs text-primary underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {analysis !== null && analysis.length > 0 && !loading && (
        <div
          ref={answerRef}
          className="prose prose-sm max-w-none text-foreground mb-6 [&_h2]:text-xs [&_h2]:font-medium [&_h2]:text-muted-foreground [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-sm [&_li]:leading-relaxed [&_p]:text-sm [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0]"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(analysis) }}
        />
      )}

      {(analysis !== null || followUpAnswer !== null) && (
        <div className="border-t border-border pt-4 mt-4">
          {followUpAnswer !== null && followUpAnswer.length > 0 && (
            <div className="mb-4 prose prose-sm max-w-none text-foreground [&_p]:text-sm [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0]"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(followUpAnswer) }}
            />
          )}

          {followUpLoading && (
            <div className="mb-4 space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleFollowUp();
                }
              }}
              placeholder="Ask a follow-up question..."
              disabled={followUpLoading}
              className="flex-1 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
            />
            <button
              onClick={handleFollowUp}
              disabled={!followUp.trim() || followUpLoading}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Follow-up replaces the previous answer
          </p>
        </div>
      )}
    </div>
  );
}
