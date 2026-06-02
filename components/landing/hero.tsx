"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, GitBranch, Code2, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button";
import { AnimatedCounter } from "@/components/landing/animated-counter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const floatingOrb = (delay: number) => ({
  animate: {
    y: [0, -20, 0] as number[],
    scale: [1, 1.05, 1] as number[],
    opacity: [0.3, 0.5, 0.3] as number[],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay },
  },
});

function CodeWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative mx-auto mt-14 max-w-2xl"
    >
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground/60 font-mono">good-first-issues — README.md</span>
        </div>
        <div className="flex">
          <div className="hidden border-r border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground/40 font-mono sm:block">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="px-2 py-0.5 text-right">{i + 1}</div>
            ))}
          </div>
          <div className="space-y-1.5 p-4 text-xs font-mono leading-relaxed">
            <span className="text-muted-foreground/40">#</span> <span className="text-muted-foreground/60">RepoSage — Issue Overview</span>
            <div>
              <span className="text-muted-foreground/40"># </span>
              <span className="text-emerald-500 dark:text-emerald-400">repo</span>
              <span className="text-muted-foreground/60">: facebook/react</span>
            </div>
            <div>
              <span className="text-muted-foreground/40"># </span>
              <span className="text-emerald-500 dark:text-emerald-400">difficulty</span>
              <span className="text-muted-foreground/60">: </span>
              <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-green-600 dark:text-green-400">beginner</span>
            </div>
            <div className="pt-1" />
            <span className="text-muted-foreground/40"># Files you'll touch</span>
            <div className="pl-4 text-blue-500 dark:text-blue-400">
              src/components/Button.tsx
            </div>
            <div className="pl-4 text-blue-500 dark:text-blue-400">
              src/styles/button.css
            </div>
            <div className="pt-1" />
            <span className="text-muted-foreground/40"># Architecture overview</span>
            <div className="pl-4 text-muted-foreground/60">
              Button is a presentational component...
            </div>
            <div className="pt-1 border-t border-border/40 mt-2" />
            <span className="text-muted-foreground/40">✨ Ready to contribute</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(35%_30%_at_50%_0%,#DBEAFE,transparent_70%)] dark:bg-[radial-gradient(35%_30%_at_50%_0%,#1E3A5F,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(25%_25%_at_70%_20%,#C7D2FE,transparent_60%)] dark:bg-[radial-gradient(25%_25%_at_70%_20%,#2E3A59,transparent_60%)]" />

        <motion.div
          className="absolute top-1/4 left-[15%] size-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/10 blur-3xl"
          variants={floatingOrb(0)}
          animate="animate"
        />
        <motion.div
          className="absolute top-1/3 right-[15%] size-64 rounded-full bg-gradient-to-br from-violet-400/15 to-purple-400/5 blur-3xl"
          variants={floatingOrb(1.5)}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/4 left-[40%] size-96 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-500/10 blur-3xl"
          variants={floatingOrb(3)}
          animate="animate"
        />

        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-28 text-center md:pt-24 md:pb-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-4 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-md"
        >
          <Sparkles className="size-3.5 text-primary" />
          <span>From <span className="font-semibold text-foreground">good first issue</span> to first PR</span>
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl leading-[1.08]"
        >
          Find your first{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            open source
          </span>
          {" "}contribution.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg leading-relaxed"
        >
          Discover beginner-friendly issues matched to your skills. RepoSage reads the
          codebase for you — from architecture diagram to what needs to change — so you
          can contribute with confidence.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <SignInButton size="lg" label="Explore Issues" showArrow />
          <Link
            href="#features"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            <Code2 className="size-4" />
            How It Works
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm px-8 py-5 shadow-sm"
        >
          {[
            { icon: Star, label: "Issues Analyzed", value: 1247, suffix: "+" },
            { icon: GitBranch, label: "Repos Indexed", value: 892, suffix: "+" },
            { icon: ExternalLink, label: "Open Source Projects", value: 156, suffix: "+" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 px-6 py-3 sm:py-0 justify-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <stat.icon className="size-4" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground tabular-nums">
                  <AnimatedCounter from={0} to={stat.value} />{stat.suffix}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <CodeWindow />

        <motion.p
          variants={itemVariants}
          className="mt-10 text-xs text-muted-foreground/50"
        >
          Read-only access &middot; We never modify your repos &middot; Free for everyone
        </motion.p>
      </motion.div>
    </section>
  );
}
