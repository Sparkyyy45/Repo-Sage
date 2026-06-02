"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Cpu, Code2, Sparkles, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const ONBOARDING_KEY = "reposage-onboarded";

const steps: {
  title: string;
  subtitle: string;
  cards?: { icon: React.ElementType; label: string; desc: string }[];
  body?: string;
  action?: { label: string; href: string };
}[] = [
  {
    title: "Welcome to RepoSage",
    subtitle: "Here's what you can do",
    cards: [
      { icon: Search, label: "Discover Issues", desc: "Good-first issues matched to your exact tech stack, with difficulty and effort estimates." },
      { icon: BookOpen, label: "Learn the Ropes", desc: "Six interactive guides that take you from zero to your first merged PR." },
      { icon: Cpu, label: "AI-Powered Analysis", desc: "Get an AI-generated onboarding guide and chat for every issue you explore." },
    ],
  },
  {
    title: "Configure AI (optional)",
    subtitle: "Unlock issue analysis & chat",
    body: "Configure an AI provider in Settings to get personalized onboarding guides and an interactive issue chat for every issue you explore. Supports OpenRouter and Groq.",
    action: { label: "Go to Settings", href: "/settings" },
  },
  {
    title: "You're all set!",
    subtitle: "Your first issue is waiting",
    body: "Your dashboard is populated with good-first-issues matched to your profile. Pick one, save it, and start your open source journey.",
  },
];

export function FirstVisitOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setOpen(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOpen(false);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!open) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary mb-4">
                <Sparkles className="size-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{current.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            <div className="space-y-3">
              {current.cards!.map((card) => (
                <div key={card.label} className="flex gap-3 rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <card.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{card.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center justify-center size-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Cpu className="size-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{current.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                onClick={dismiss}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Cpu className="size-4" />
                Go to Settings
              </Link>
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center justify-center size-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Check className="size-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{current.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>
            <div className="flex flex-wrap gap-2">
              {["Bookmark issues you like", "Track your progress", "Learn with interactive guides", "Get AI-powered help"].map(
                (tip) => (
                  <span
                    key={tip}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 border border-border px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="size-3 text-primary" />
                    {tip}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Skip all
          </button>
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity shadow-sm"
          >
            {step < steps.length - 1 ? (
              <>
                Next <ArrowRight className="size-4" />
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
