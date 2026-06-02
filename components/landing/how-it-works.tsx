"use client";

import { motion } from "framer-motion";
import { LogIn, Search, Bot, BookmarkCheck, GraduationCap, FileText } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
    number: "01",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    gradient: "from-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-500/20",
    number: "02",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "Architecture diagrams, onboarding guides, and AI chat — all generated from the actual repo code.",
    gradient: "from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/20",
    number: "03",
  },
  {
    icon: FileText,
    title: "Generate Repo Docs",
    body: "Instantly create polished CODE_OF_CONDUCT, CONTRIBUTING, and other community standards to make your repo contributor-ready.",
    gradient: "from-fuchsia-500 to-fuchsia-600",
    shadow: "shadow-fuchsia-500/20",
    number: "04",
  },
  {
    icon: BookmarkCheck,
    title: "Save & track issues",
    body: "Bookmark good-first-issues and track progress from Saved to Merged. Your contribution pipeline in one place.",
    gradient: "from-sky-500 to-sky-600",
    shadow: "shadow-sky-500/20",
    number: "05",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    body: "Interactive guides covering Git fundamentals, codebase reading, PR best practices, and the open source lifecycle.",
    gradient: "from-teal-500 to-teal-600",
    shadow: "shadow-teal-500/20",
    number: "06",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-y border-border/40 bg-muted/20">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 right-1/4 size-[600px] rounded-full bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-transparent blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-0 size-[500px] rounded-full bg-gradient-to-tr from-fuchsia-100/20 via-violet-100/20 to-transparent blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold text-blue-600 uppercase tracking-wider">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            A seamless workflow designed to take you from signing in to merging your first pull request, while ensuring repos are welcoming and prepared.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent transform md:-translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((s, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={s.title}
                  variants={stepVariants}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`w-full md:w-1/2 flex ${isEven ? "md:justify-start" : "md:justify-end"}`}>
                    <div className="group relative w-full max-w-[420px] rounded-3xl border border-border/60 bg-white/60 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden text-left">
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${s.gradient}`} />
                      
                      <div className="relative z-10">
                        <span className="absolute -top-6 -right-2 text-[140px] font-black text-black/[0.02] select-none leading-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                          {s.number}
                        </span>
                        
                        <div className={`mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg ${s.shadow} transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                          <s.icon className="size-6" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{s.title}</h3>
                        <p className="text-base leading-relaxed text-muted-foreground">{s.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-4 md:left-1/2 top-8 md:top-1/2 flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-background shadow-md transform md:-translate-x-1/2 md:-translate-y-1/2 z-10 hidden md:flex transition-transform duration-500 hover:scale-125">
                    <div className={`size-3 rounded-full bg-gradient-to-br ${s.gradient} animate-pulse`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
