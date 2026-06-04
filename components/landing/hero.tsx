"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, CheckCircle, GitBranch, MessageCircle, Star, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-foreground opacity-[0.03] blur-[100px]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500 opacity-[0.06] blur-[140px]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 opacity-[0.03] blur-[100px]" />
    </div>
  );
}

const issues = [
  { repo: "facebook/react", title: "Add aria labels to Button component", labels: ["good first issue", "beginner"], comments: 3, updated: "2d ago" },
  { repo: "vercel/next.js", title: "Fix typo in documentation sidebar", labels: ["good first issue", "docs"], comments: 1, updated: "5h ago" },
  { repo: "microsoft/vscode", title: "Improve error message for missing config", labels: ["good first issue", "help wanted"], comments: 5, updated: "1d ago" },
];

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto mt-24 max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-indigo-500/5 ring-1 ring-indigo-500/5">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3 bg-muted/50">
          <span className="size-3 rounded-full bg-muted-foreground/20" />
          <span className="size-3 rounded-full bg-muted-foreground/20" />
          <span className="size-3 rounded-full bg-muted-foreground/20" />
          <div className="ml-4 flex h-6 w-full max-w-sm items-center rounded-md bg-background px-3 text-[11px] text-muted-foreground shadow-sm ring-1 ring-border/50">
            <span className="truncate">reposage.app/dashboard</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[400px]">
          <div className="hidden md:block border-r border-border p-5 space-y-6 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-medium">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Jane Dev</span>
                <span className="text-xs text-muted-foreground">@jane_dev</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Languages</div>
              {["JavaScript", "Python", "Rust", "Go"].map((lang) => (
                <div key={lang} className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className="size-1.5 rounded-full bg-foreground/30" />
                  {lang}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitBranch className="size-4" />
                <span className="font-medium text-foreground">42</span> issues
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="size-4" />
                <span className="font-medium text-foreground">89%</span> match
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4 bg-card">
            <div className="mb-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Recommended Issues</h3>
              <p className="text-sm text-muted-foreground">Based on your stack and experience level.</p>
            </div>
            {issues.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border border-border p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GitBranch className="size-3.5" />
                    {item.repo}
                    <span className="ml-auto sm:hidden text-[10px]">{item.updated}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {item.labels.map((label) => (
                      <span key={label} className="rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {label}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageCircle className="size-3" />
                      {item.comments}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">{item.updated}</span>
                  <div className="flex items-center justify-center rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted transition-colors cursor-pointer">
                    View Issue
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-24 pb-16">
      <HeroBackground />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm"
          >
            <Sparkles className="size-3.5 text-indigo-500" />
            From &ldquo;good first issue&rdquo; to merged PR
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-balance text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-7xl leading-[1.05]"
          >
            Ship your first open source contribution.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[42rem] text-balance text-base text-muted-foreground sm:text-lg sm:leading-8"
          >
            RepoSage finds good-first-issues matched to your exact tech stack and
            uses AI to walk you through the codebase — so you know exactly what
            to change before you start coding.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
          >
            {signedIn ? (
              <Link
                href="/dashboard"
                className={buttonVariants({ size: "lg" })}
              >
                Go to Dashboard
                <ChevronRight className="ml-1 size-4" />
              </Link>
            ) : (
              <SignInButton size="lg" label="Start Exploring" showArrow />
            )}
            <Link
              href="#how-it-works"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              See how it works
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-indigo-500" />
              Read-only access
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-indigo-500" />
              Free for everyone
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="size-4 text-indigo-500" />
              No setup required
            </span>
          </motion.div>
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}
