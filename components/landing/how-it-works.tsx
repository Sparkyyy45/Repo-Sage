"use client";

import { motion, Variants } from "framer-motion";
import { LogIn, Search, Bot, BookmarkCheck, GraduationCap, FileText } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    number: "01",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    number: "02",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "Architecture diagrams, onboarding guides, and AI chat — all generated from the actual repo code.",
    number: "03",
  },
  {
    icon: FileText,
    title: "Generate Repo Docs",
    body: "Instantly create polished CODE_OF_CONDUCT, CONTRIBUTING, and other community standards to make your repo contributor-ready.",
    number: "04",
  },
  {
    icon: BookmarkCheck,
    title: "Save & track issues",
    body: "Bookmark good-first-issues and track progress from Saved to Merged. Your contribution pipeline in one place.",
    number: "05",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    body: "Interactive guides covering Git fundamentals, codebase reading, PR best practices, and the open source lifecycle.",
    number: "06",
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
    <section id="how-it-works" className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-32">
      {/* Extremely subtle, professional dot pattern background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 mb-6 shadow-sm tracking-tight">
            Story of a Contributor
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl tracking-[-0.02em]">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
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
                className="group relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl"
              >
                {/* Giant aesthetic watermark number */}
                <span className="absolute -bottom-6 -right-2 select-none text-[120px] font-bold leading-none tracking-tighter text-slate-50/70 transition-all duration-500 group-hover:-translate-y-4 group-hover:text-indigo-50/60 font-mono pointer-events-none z-0">
                  {s.number}
                </span>

                {/* Left side: Icon */}
                <div className="relative z-10 flex shrink-0 items-center justify-center size-16 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 transition-all duration-500 group-hover:scale-110 group-hover:border-indigo-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] origin-left md:origin-center">
                  {(() => {
                    const Icon = s.icon;
                    return <Icon className="size-7" strokeWidth={2} />;
                  })()}
                </div>

                {/* Right side: Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-700">
                    {s.title}
                  </h3>
                  <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-600">
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
