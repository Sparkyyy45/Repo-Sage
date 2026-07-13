"use client";

import { motion, Variants } from "framer-motion";
import { BookmarkCheck, Bot, FileText, GraduationCap, LogIn, Search } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    number: "01",
    grad: "var(--grad-1)",
    text: "hsl(258 55% 32%)",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    number: "02",
    grad: "var(--grad-3)",
    text: "hsl(190 60% 25%)",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "Architecture diagrams, onboarding guides, and AI chat — all generated from the actual repo code.",
    number: "03",
    grad: "var(--grad-2)",
    text: "hsl(320 50% 32%)",
  },
  {
    icon: FileText,
    title: "Generate Repo Docs",
    body: "Instantly create polished CODE_OF_CONDUCT, CONTRIBUTING, and other community standards to make your repo contributor-ready.",
    number: "04",
    grad: "var(--grad-4)",
    text: "hsl(45 65% 28%)",
  },
  {
    icon: BookmarkCheck,
    title: "Save & track issues",
    body: "Bookmark good-first-issues and track progress from Saved to Merged. Your contribution pipeline in one place.",
    number: "05",
    grad: "var(--grad-1)",
    text: "hsl(258 55% 32%)",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    body: "Interactive guides covering Git fundamentals, codebase reading, PR best practices, and the open source lifecycle.",
    number: "06",
    grad: "var(--grad-3)",
    text: "hsl(190 60% 25%)",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden gradient-page py-24 md:py-32">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full badge-pastel px-3 py-1 text-sm font-semibold mb-6">
            Story of a Contributor
          </div>
          <h2 className="text-4xl font-bold md:text-5xl tracking-[-0.02em] gradient-text">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg md:text-xl leading-relaxed">
            A seamless, professional workflow designed to take you from signing in to merging your first pull request.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((s) => (
              <motion.div
                key={s.title}
                variants={stepVariants}
                className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 overflow-hidden rounded-3xl card-glow p-8 md:p-10 transition-all duration-500 hover:-translate-y-1"
              >
                <span
                  className="absolute -bottom-6 -right-2 select-none text-[120px] font-bold leading-none tracking-tighter text-muted/40 dark:text-muted/10 transition-all duration-500 group-hover:-translate-y-4 font-mono pointer-events-none z-0"
                  style={{ ["--hover-num" as string]: `hsl(${s.grad} / 0.5)` }}
                >
                  {s.number}
                </span>

                <div
                  className="relative z-10 flex shrink-0 items-center justify-center size-16 rounded-2xl border border-border/60 bg-muted/50 text-muted-foreground transition-all duration-500 group-hover:scale-110 group-hover:text-white origin-left md:origin-center"
                  style={{
                    background: "var(--hover-bg, none)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `hsl(${s.grad})` }}
                  />
                  {(() => {
                    const Icon = s.icon;
                    return <Icon className="relative size-7" strokeWidth={2} />;
                  })()}
                </div>

                <div className="relative z-10 flex-grow">
                  <h3
                    className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300"
                    style={{ color: "var(--title-hover, inherit)" }}
                  >
                    <span className="group-hover:hidden">{s.title}</span>
                    <span className="hidden group-hover:inline" style={{ color: s.text }}>{s.title}</span>
                  </h3>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}