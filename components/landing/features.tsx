"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, BarChart3, MessageCircle, GitBranch, Shield } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Stack-aware discovery",
    description: "We search GitHub for good-first-issues across repos that use your languages. No irrelevant results, no noise.",
  },
  {
    icon: BookOpen,
    title: "Codebase onboarding",
    description: "Architecture diagram, directory tree, key source files, and README — all read and summarized so you understand the project fast.",
  },
  {
    icon: BarChart3,
    title: "Fit scoring",
    description: "Every issue shows a beginner-friendliness score, maintainer responsiveness, and estimated effort so you pick the right one.",
  },
  {
    icon: MessageCircle,
    title: "AI issue analysis",
    description: "Ask follow-up questions about any issue. RepoSage answers based on the actual repo code, not generic advice.",
  },
  {
    icon: GitBranch,
    title: "Integration-free",
    description: "No config files, no CLI, no setup. Sign in with GitHub and you're ready to explore issues in seconds.",
  },
  {
    icon: Shield,
    title: "Read-only & safe",
    description: "We never modify your repos, create branches, or take any action on your behalf. Just browse and learn.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function Features() {
  return (
    <section id="features" className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <p className="mb-3 text-sm font-semibold text-blue-600 uppercase tracking-wider">Everything you need</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Find, understand, and contribute.
        </h2>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
          RepoSage connects issue discovery with codebase understanding — the missing layer between &ldquo;good first issue&rdquo; and merged PR.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            className="group rounded-xl border border-border/60 bg-white p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-200"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
