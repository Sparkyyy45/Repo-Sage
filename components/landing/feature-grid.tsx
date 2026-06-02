"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, GitBranch, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart issue discovery",
    description:
      "We scan GitHub for good-first-issues that match your exact tech stack — no more sifting through irrelevant repos.",
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    iconBg: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-500",
  },
  {
    icon: BookOpen,
    title: "Understand any codebase",
    description:
      "RepoSage reads the repo structure, key files, and README. See an architecture diagram and AI onboarding guide for every issue.",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    iconBg: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "bg-emerald-500",
  },
  {
    icon: GitBranch,
    title: "Contribution readiness",
    description:
      "See beginner-friendliness scores, maintainer responsiveness, and estimated effort for every issue before you dive in.",
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    iconBg: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  {
    icon: HeartHandshake,
    title: "Built for beginners",
    description:
      "Designed to reduce anxiety and make open source feel approachable. Every feature helps you take the next step with confidence.",
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
    iconBg: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "bg-violet-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function FeatureGrid() {
  return (
    <section id="features" className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Why RepoSage</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          The bridge between &ldquo;good first issue&rdquo; and your first PR.
        </h2>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed">
          Issue matchers exist. Onboarding tools exist. No one has connected them. RepoSage is the missing layer.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-5 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className={`absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${f.accent}`} />
            <div className={`absolute -inset-x-4 -inset-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl bg-gradient-to-br ${f.gradient} blur-2xl pointer-events-none`} />
            <div className="relative z-10">
              <div
                className={`mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.iconBg} shadow-sm ring-1 ring-border/50 ${f.iconColor}`}
              >
                <f.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
