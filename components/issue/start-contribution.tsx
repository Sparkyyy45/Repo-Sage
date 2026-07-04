"use client";

import { useState, useCallback } from "react";
import { GitBranch, GitPullRequestDraft, Copy, Check, Loader2, ExternalLink, AlertCircle } from "lucide-react";

interface StartContributionProps {
  owner: string;
  name: string;
  issueNumber: number;
  issueTitle: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function StartContribution({
  owner,
  name,
  issueNumber,
  issueTitle,
}: StartContributionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{
    cloneCommand: string;
    prUrl: string;
    forkUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleStart = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/issues/start-contribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, name, issueNumber, issueTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }, [owner, name, issueNumber, issueTitle]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.cloneCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [result]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex size-6 items-center justify-center rounded-md bg-indigo-100">
          <GitBranch className="size-3.5 text-indigo-600" />
        </div>
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Start Contributing
        </h2>
      </div>

      {status === "idle" && (
        <>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Fork the repo, create a branch, and open a draft PR — all in one click.
            Then clone locally and start coding.
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <GitPullRequestDraft className="size-4" />
            Start Contribution
          </button>
        </>
      )}

      {status === "loading" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-indigo-600" />
            Setting up your fork and draft PR...
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-muted rounded animate-pulse w-1/2" />
            <div className="h-2.5 bg-muted rounded animate-pulse w-2/3" />
          </div>
        </div>
      )}

      {status === "success" && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <Check className="size-4 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">
              Fork and draft PR created successfully
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Run this command to start coding:
            </p>
            <div className="group relative rounded-xl bg-[#0d1117] p-3.5 pr-10 font-mono text-[13px] leading-relaxed shadow-sm">
              <code className="text-gray-100 break-all whitespace-pre-wrap">
                {result.cloneCommand}
              </code>
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-md text-gray-500 opacity-100 md:opacity-0 transition-all hover:bg-white/10 hover:text-gray-300 md:group-hover:opacity-100"
                title="Copy command"
              >
                {copied ? (
                  <Check className="size-3.5 text-indigo-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <a
              href={result.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <GitPullRequestDraft className="size-4" />
              View draft PR
              <ExternalLink className="size-3" />
            </a>
            <span className="text-muted-foreground/40">|</span>
            <a
              href={result.forkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitBranch className="size-4" />
              View fork
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs">
            <AlertCircle className="size-3.5 mt-0.5 shrink-0 text-destructive" />
            <span className="text-destructive">{errorMsg}</span>
          </div>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
