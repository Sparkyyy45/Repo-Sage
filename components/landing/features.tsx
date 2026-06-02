"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, BarChart3, MessageCircle, GitBranch, Shield, GraduationCap, BookmarkCheck, SearchCode } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Stack-aware discovery",
    description: "We search GitHub for good-first-issues across repos that use your languages. No irrelevant results, no noise.",
    span: "md:col-span-2",
  },
  {
    icon: BookOpen,
    title: "Codebase onboarding",
    description: "Architecture diagrams, directory trees, and READMEs—summarized so you understand projects fast.",
    span: "md:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Fit scoring",
    description: "Every issue shows a beginner-friendliness score, maintainer responsiveness, and estimated effort.",
    span: "md:col-span-1",
  },
  {
    icon: MessageCircle,
    title: "AI issue analysis",
    description: "Ask follow-up questions about any issue. RepoSage answers based on the actual repo code, not generic advice. Navigate codebases like a senior engineer.",
    span: "md:col-span-2",
  },
  {
    icon: GitBranch,
    title: "Integration-free",
    description: "No config files, no CLI, no setup. Sign in with GitHub and you're ready to explore.",
    span: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Read-only & safe",
    description: "We never modify your repos or create branches. Just browse and learn safely.",
    span: "md:col-span-1",
  },
  {
    icon: GraduationCap,
    title: "Interactive Learning Hub",
    description: "Hands-on guides with progress tracking. Learn Git, codebase reading, and PR etiquette.",
    span: "md:col-span-1",
  },
  {
    icon: BookmarkCheck,
    title: "Issue progress tracking",
    description: "Bookmark any issue and track its status from Saved to Merged.",
    span: "md:col-span-1",
  },
  {
    icon: SearchCode,
    title: "Repository insights",
    description: "Search any repo for a beginner-friendliness score, activity trends, and matching good-first-issues instantly.",
    span: "md:col-span-2",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function Features() {
  return (
    <section id="features" className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-background" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative mx-auto mb-20 max-w-2xl text-center"
      >
        <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground mb-6 backdrop-blur-sm">
          <SearchCode className="mr-2 size-3.5" />
          Everything you need
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-foreground md:text-5xl lg:text-6xl mb-6">
          Find, understand, <br className="hidden sm:block" /> and contribute.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
          Issue discovery, AI-powered understanding, progress tracking, and interactive learning — the complete open source companion.
        </p>
      </motion.div>

      <motion.div
        className="relative grid gap-4 md:grid-cols-3 auto-rows-[minmax(180px,auto)]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-8 hover:border-foreground/20 transition-all duration-300 ${f.span}`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-muted/30 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <f.icon className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{f.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
