"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Cpu, Sparkles, ArrowRight, ChevronDown, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const GUIDE_KEY = "reposage-guide-dismissed";

const steps = [
  {
    icon: Search,
    title: "Find your issue",
    desc: "Browse issues matched to your tech stack below, or search any repo.",
  },
  {
    icon: BookOpen,
    title: "Understand the code",
    desc: "Every issue comes with an architecture diagram, onboarding guide, and AI chat.",
  },
  {
    icon: Cpu,
    title: "Track your progress",
    desc: "Save issues and move them through your pipeline: Saved → Working → PR → Merged.",
  },
];

export function FirstVisitOnboarding() {
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem(GUIDE_KEY));
  const [expanded, setExpanded] = useState(false);
  const [hasSavedIssue, setHasSavedIssue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("reposage-saved-issues") || "[]");
      return saved.length > 0;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const checkSaved = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("reposage-saved-issues") || "[]");
        setHasSavedIssue(saved.length > 0);
      } catch {
        setHasSavedIssue(false);
      }
    };
    window.addEventListener("storage", checkSaved);
    return () => window.removeEventListener("storage", checkSaved);
  }, []);

  const dismiss = () => {
    localStorage.setItem(GUIDE_KEY, "true");
    setDismissed(true);
  };

  if (dismissed || hasSavedIssue) {
    return (
      <button
        onClick={() => {
          setDismissed(false);
          setExpanded(true);
        }}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-indigo-500 transition-colors"
        title="Show getting started guide"
      >
        <Sparkles className="size-3" />
        Guide
      </button>
    );
  }

  return (
    <div className="relative rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/80 to-white p-5 md:p-6 shadow-sm">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
        title="Dismiss guide"
      >
        <X className="size-3.5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Welcome to RepoSage
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your personal guide to finding and contributing to open source. Here&rsquo;s how it works:
          </p>

          {expanded && (
            <div className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <s.icon className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Step {i + 1}: {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  <BookOpen className="size-3.5" />
                  Start Learning
                  <ArrowRight className="size-3.5" />
                </Link>
                <button
                  onClick={dismiss}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronDown className="size-3.5" />
                Hide guide
              </>
            ) : (
              <>
                <ChevronRight className="size-3.5" />
                Show me around
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
