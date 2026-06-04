"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Terminal, Copy, Check, Apple, Monitor, ChevronDown, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import type { IngestedRepo } from "@/lib/github/ingest";
import { detectOS, detectEcosystem, detectPackageManager, detectRuntimeVersion, extractScripts, extractMakeTargets, extractDockerBaseImage, generateSetupSteps, pathExists, buildSetupContext } from "@/lib/setup";
import type { SetupResult, OS } from "@/lib/setup";
import { generateText } from "@/lib/llm/provider";
import { SYSTEM_SETUP } from "@/lib/llm/prompts";

const STORAGE_PREFIX = "reposage-setup-";

const OS_ICONS: Record<OS, typeof Apple> = {
  macos: Apple,
  windows: Monitor,
  linux: Terminal,
};

const OS_LABELS: Record<OS, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
};

export function SetupGuide({ repo }: { repo: IngestedRepo }) {
  const storageKey = STORAGE_PREFIX + repo.fullName;
  const hasAiKey = typeof window !== "undefined" && !!localStorage.getItem("reposage-llm-config");

  const [result, setResult] = useState<SetupResult | null>(() => {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached) as SetupResult;
    } catch { console.warn("Failed to access localStorage"); }
    return null;
  });

  const [aiTips, setAiTips] = useState<string | null>(() => {
    try {
      return localStorage.getItem(storageKey + "-ai");
    } catch { return null; }
  });

  const [loading, setLoading] = useState(!result);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiExpanded, setAiExpanded] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const generatedRef = useRef(false);
  const aiGeneratedRef = useRef(false);

  useEffect(() => {
    if (generatedRef.current || result) return;
    generatedRef.current = true;

    const os = detectOS();
    const pmInfo = detectPackageManager(repo.tree, repo.packageJson);
    const ecosystem = detectEcosystem(repo.tree, repo.packageJson);
    const scripts = extractScripts(repo.packageJson);
    const runtimeVersion = detectRuntimeVersion(repo.tree, repo.packageJson);
    const makeTargets = extractMakeTargets(repo.tree, repo.files);
    const dockerBaseImage = extractDockerBaseImage(repo.files);
    const hasDocker = pathExists(repo.tree, "Dockerfile", "docker-compose.yml", "docker-compose.yaml");
    const hasMakefile = makeTargets.length > 0;

    const setupResult: SetupResult = {
      os,
      fullName: repo.fullName,
      repoName: repo.name,
      ecosystem,
      language: repo.language,
      pmInfo,
      scripts,
      runtimeVersion,
      hasDocker,
      hasMakefile,
      makeTargets,
      dockerBaseImage,
      tree: repo.tree,
      steps: [],
    };

    setupResult.steps = generateSetupSteps(setupResult);
    setResult(setupResult);
    setLoading(false);

    try { localStorage.setItem(storageKey, JSON.stringify(setupResult)); } catch { console.warn("Failed to access localStorage"); }
  }, [repo, result, storageKey]);

  useEffect(() => {
    if (aiGeneratedRef.current || !hasAiKey || aiTips || !result || result.steps.length === 0) return;
    aiGeneratedRef.current = true;
    setAiLoading(true);

    const context = buildSetupContext(result);

    generateText(context, SYSTEM_SETUP)
      .then((tips) => {
        setAiTips(tips);
        setAiExpanded(true);
        try { localStorage.setItem(storageKey + "-ai", tips); } catch { console.warn("Failed to access localStorage"); }
      })
      .catch((err: unknown) => {
        setAiError(err instanceof Error ? err.message : "Failed to generate tips");
      })
      .finally(() => setAiLoading(false));
  }, [hasAiKey, result, aiTips, storageKey]);

  const copyToClipboard = useCallback(async (text: string, step?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (step !== undefined) {
        setCopiedStep(step);
        setTimeout(() => setCopiedStep(null), 2000);
      } else {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch { console.warn("Failed to access localStorage"); }
  }, []);

  const copyAll = useCallback(() => {
    if (!result) return;
    const all = result.steps
      .map((s) => `# ${s.label}\n${s.commands.join("\n")}`)
      .join("\n\n");
    copyToClipboard(all);
  }, [result, copyToClipboard]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="size-4 text-muted-foreground" />
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Setup in 60 Seconds
          </h2>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!result || result.steps.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex size-6 items-center justify-center rounded-md bg-muted/50">
            <Terminal className="size-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Setup in 60 Seconds
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Could not auto-detect setup instructions for this repository.
        </p>
      </div>
    );
  }

  const OsIcon = OS_ICONS[result.os];
  const capitalizedLang = result.language ? result.language.charAt(0).toUpperCase() + result.language.slice(1) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-indigo-100">
            <Terminal className="size-3.5 text-indigo-600" />
          </div>
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Setup in 60 Seconds
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            <OsIcon className="size-3" />
            {OS_LABELS[result.os]}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {result.pmInfo && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {result.pmInfo.name}
          </span>
        )}
        {result.ecosystem !== "other" && result.ecosystem !== "js" && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {result.ecosystem}
          </span>
        )}
        {capitalizedLang && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {capitalizedLang}
          </span>
        )}
        {result.runtimeVersion && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {result.runtimeVersion.version ?? `${result.runtimeVersion.manager} config`}
          </span>
        )}
        {result.hasDocker && (
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Docker
          </span>
        )}
        {result.hasMakefile && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Makefile
          </span>
        )}
      </div>

      <div className="rounded-xl bg-[#0d1117] p-4 font-mono text-[13px] leading-relaxed shadow-sm">
        {result.steps.map((step) => (
          <div key={step.step} className="group relative mb-3 last:mb-0">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                {step.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[11px] font-medium text-gray-400">
                  {step.label}
                </p>
                {step.commands.map((cmd, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 select-none">$</span>
                    <span className="text-gray-100 break-all">{cmd}</span>
                  </div>
                ))}
                {step.note && (
                  <p className="mt-1 text-[11px] text-gray-500 italic">{step.note}</p>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(step.commands.join("\n"), step.step)}
                className="mt-1 flex shrink-0 size-6 items-center justify-center rounded-md text-gray-500 opacity-0 transition-all hover:bg-white/10 hover:text-gray-300 group-hover:opacity-100"
                title="Copy step commands"
              >
                {copiedStep === step.step ? (
                  <Check className="size-3.5 text-indigo-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-200 transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="size-3.5 text-indigo-400" />
                Copied all commands
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy all commands
              </>
            )}
          </button>

          {result.os === "windows" && result.hasMakefile && (
            <span className="text-[10px] text-amber-400/70">
              Make requires WSL on Windows
            </span>
          )}
        </div>
      </div>

      {!hasAiKey && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Commands are auto-detected from your repo.{" "}
          <a href="/settings" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500 font-medium">
            Configure AI
          </a>{" "}
          for setup tips.
        </p>
      )}

      {aiLoading && (
        <div className="mt-4 space-y-2 animate-pulse">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      )}

      {aiError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs">
          <AlertCircle className="size-3.5 mt-0.5 shrink-0 text-destructive" />
          <span className="text-destructive">AI tips unavailable: {aiError}</span>
        </div>
      )}

      {aiTips && (
        <div className="mt-4">
          <button
            onClick={() => setAiExpanded(!aiExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {aiExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            <Sparkles className="size-3.5" />
            AI setup tips
          </button>
          {aiExpanded && (
            <div className="mt-2 rounded-xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/80 to-white p-4 text-xs text-muted-foreground leading-relaxed shadow-sm">
              <div className="prose prose-xs max-w-none text-muted-foreground [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:text-indigo-700 [&_h2]:mt-3 [&_h2]:mb-1 [&_p]:text-xs [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-xs [&_code]:rounded [&_code]:bg-indigo-100/70 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-indigo-800]">
                {aiTips}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
