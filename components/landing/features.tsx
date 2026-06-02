"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, BarChart3, MessageCircle, GitBranch, Shield, GraduationCap, BookmarkCheck, SearchCode } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Stack-aware discovery",
    description: "We search GitHub for good-first-issues across repos that use your languages. No irrelevant results, no noise.",
    span: "md:col-span-2",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "Codebase onboarding",
    description: "Architecture diagrams, directory trees, and READMEs—summarized so you understand projects fast.",
    span: "md:col-span-1",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: BarChart3,
    title: "Fit scoring",
    description: "Every issue shows a beginner-friendliness score, maintainer responsiveness, and estimated effort.",
    span: "md:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: MessageCircle,
    title: "AI issue analysis",
    description: "Ask follow-up questions about any issue. RepoSage answers based on the actual repo code, not generic advice. Navigate codebases like a senior engineer.",
    span: "md:col-span-2",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: GitBranch,
    title: "Integration-free",
    description: "No config files, no CLI, no setup. Sign in with GitHub and you're ready to explore.",
    span: "md:col-span-1",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Shield,
    title: "Read-only & safe",
    description: "We never modify your repos or create branches. Just browse and learn safely.",
    span: "md:col-span-1",
    gradient: "from-slate-500/20 to-gray-500/20",
    iconColor: "text-slate-500",
  },
  {
    icon: GraduationCap,
    title: "Interactive Learning Hub",
    description: "Hands-on guides with progress tracking. Learn Git, codebase reading, and PR etiquette.",
    span: "md:col-span-1",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
  {
    icon: BookmarkCheck,
    title: "Issue progress tracking",
    description: "Bookmark any issue and track its status from Saved to Merged.",
    span: "md:col-span-1",
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-500",
  },
  {
    icon: SearchCode,
    title: "Repository insights",
    description: "Search any repo for a beginner-friendliness score, activity trends, and matching good-first-issues instantly.",
    span: "md:col-span-2",
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    iconColor: "text-fuchsia-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function Features() {
  return (
    <section id="features" className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative mx-auto mb-20 max-w-2xl text-center"
      >
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 mb-6">
          <SearchCode className="mr-2 size-4" />
          Everything you need
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-6">
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
            className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-white/40 backdrop-blur-xl p-8 hover:bg-white/60 transition-all duration-500 ${f.span}`}
          >
            {/* Animated Hover Border Effect */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none mix-blend-overlay" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
            
            <div className={`absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br ${f.gradient} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 ease-in-out pointer-events-none`} />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border/50 group-hover:scale-110 group-hover:shadow-md transition-all duration-500 ease-out">
                <f.icon className={`size-6 ${f.iconColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{f.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{f.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
