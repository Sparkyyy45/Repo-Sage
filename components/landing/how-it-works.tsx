"use client";

import { motion } from "framer-motion";
import { LogIn, Search, Bot, BookmarkCheck, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    gradient: "from-blue-500 to-blue-600",
    number: "01",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    gradient: "from-indigo-500 to-indigo-600",
    number: "02",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "Architecture diagrams, onboarding guides, and AI chat — all generated from the actual repo code.",
    gradient: "from-violet-500 to-violet-600",
    number: "03",
  },
  {
    icon: BookmarkCheck,
    title: "Save & track issues",
    body: "Bookmark good-first-issues and track progress from Saved to Merged. Your contribution pipeline in one place.",
    gradient: "from-sky-500 to-sky-600",
    number: "04",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    body: "6 interactive guides covering Git fundamentals, codebase reading, PR best practices, and the open source lifecycle.",
    gradient: "from-teal-500 to-teal-600",
    number: "05",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-y border-border/40 bg-muted/20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-20 right-1/3 size-[500px] rounded-full bg-gradient-to-r from-blue-100/25 via-indigo-100/20 to-transparent blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.03, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/4 size-[400px] rounded-full bg-gradient-to-tr from-teal-100/20 via-sky-100/20 to-transparent blur-3xl"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold text-blue-600 uppercase tracking-wider">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            From zero to open source contributor.
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Five steps from your first sign-in to confidently contributing across any project.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-3 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <svg
            className="absolute left-[8%] top-10 w-[84%] h-px hidden lg:block pointer-events-none"
            viewBox="0 0 1100 1"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="stepConnector" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="25%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="75%" stopColor="#0EA5E9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <line x1="0" y1="0.5" x2="1100" y2="0.5" stroke="url(#stepConnector)" strokeWidth="0.5" strokeDasharray="5 4" />
          </svg>

          {steps.map((s) => (
            <motion.div
              key={s.title}
              variants={stepVariants}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient} opacity-80`} />
                <span className="absolute -top-1 right-3 text-[90px] font-bold text-black/[0.03] select-none leading-none pointer-events-none">
                  {s.number}
                </span>
                <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md`}>
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
