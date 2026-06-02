"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Code2, CheckCircle, GitBranch, GitPullRequest, MessageCircle, LayoutDashboard, Star } from "lucide-react";
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
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
      <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-[0.04]" viewBox="0 0 1200 800" fill="none">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
          </pattern>
        </defs>
        <rect width="1200" height="800" fill="url(#hero-grid)" />
      </svg>
      <motion.div
        className="absolute -top-40 right-0 size-[600px] rounded-full bg-gradient-to-br from-blue-100/60 via-indigo-100/30 to-transparent blur-3xl"
        animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.03, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-0 size-[500px] rounded-full bg-gradient-to-tr from-sky-100/40 via-blue-50/20 to-transparent blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 size-[200px] rounded-full bg-gradient-to-bl from-indigo-50/40 to-transparent blur-2xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
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
      className="relative mx-auto mt-16 max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-black/[0.02]">
        <div className="flex items-center gap-1.5 border-b border-border/40 px-5 py-3.5 bg-muted/20">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground/50 font-mono">RepoSage &mdash; Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
              <Star className="size-3" />
              Pro tip: issues matched to your stack
            </span>
          </div>
        </div>
        <div className="grid grid-cols-[200px_1fr] min-h-[340px]">
          <div className="border-r border-border/40 p-5 space-y-4 bg-muted/10">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">Jane Dev</span>
                <span className="text-[10px] text-muted-foreground/60">@jane_dev</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Languages</div>
              {[
                { name: "javascript", color: "bg-yellow-400" },
                { name: "python", color: "bg-blue-400" },
                { name: "rust", color: "bg-orange-500" },
                { name: "go", color: "bg-cyan-400" },
              ].map((lang) => (
                <div key={lang.name} className="flex items-center gap-2 text-xs text-muted-foreground/60">
                  <span className={`size-1.5 rounded-full ${lang.color}`} />
                  {lang.name}
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/30 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <GitBranch className="size-3" />
                <span className="font-medium text-foreground/80">42</span> issues found
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <Star className="size-3" />
                <span className="font-medium text-foreground/80">89%</span> match rate
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {issues.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group flex items-start gap-3 rounded-xl border border-border/40 p-3.5 hover:border-border/80 hover:shadow-sm transition-all duration-200"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <GitBranch className="size-3" />
                    {item.repo}
                    <span className="ml-auto text-[10px]">{item.updated}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground leading-snug">{item.title}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.labels.map((label) => (
                      <span key={label} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                        {label}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/60">
                      <MessageCircle className="size-3" />
                      {item.comments}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <div className="size-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                    <CheckCircle className="size-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-3 -right-3 -z-10 size-full rounded-2xl border border-border/20 bg-muted/20" />
      <div className="absolute -top-1 -left-1 -z-10 size-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-xl" />
    </motion.div>
  );
}

export function Hero({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden pt-16">
      <HeroBackground />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-20 pb-28 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/60 px-4 py-1.5 text-xs text-blue-700 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-blue-500" />
            From &ldquo;good first issue&rdquo; to merged PR
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-5xl text-balance text-5xl font-semibold tracking-tight text-foreground md:text-7xl lg:text-8xl leading-[0.95]"
          >
            Your first{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              open source
            </span>
            {" "}contribution.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg leading-relaxed"
          >
            RepoSage finds good-first-issues matched to your exact tech stack and
            uses AI to walk you through the codebase — so you know exactly what
            to change before you start coding.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            {signedIn ? (
              <Link
                href="/dashboard"
                className={buttonVariants({ size: "lg" })}
              >
                <LayoutDashboard className="size-4" />
                Go to Dashboard
              </Link>
            ) : (
              <SignInButton size="lg" label="Explore Issues" showArrow />
            )}
            <Link
              href="#how-it-works"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Code2 className="size-4" />
              See how it works
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-green-500" />
              Read-only access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-green-500" />
              Free for everyone
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-green-500" />
              No setup required
            </span>
          </motion.div>
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}
