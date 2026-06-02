"use client";

import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* High-contrast architectural grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-60" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 mb-6 shadow-sm tracking-tight">
            Story of a Contributor
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl tracking-[-0.02em]">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-slate-700 text-lg leading-relaxed font-medium">
            A seamless, professional workflow designed to take you from signing in to merging your first pull request.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((s, idx) => {
              const bentoClass = [
                "md:col-span-2",
                "md:col-span-1",
                "md:col-span-1",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-1",
              ][idx];

              return (
                <motion.div
                  key={s.title}
                  variants={stepVariants}
                  className={`relative flex flex-col rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group overflow-hidden ${bentoClass}`}
                >
                  {/* Subtle, sharp typography background number */}
                  <span className="absolute -bottom-6 -right-4 font-mono text-[120px] leading-none font-bold text-slate-50 select-none pointer-events-none tracking-tighter group-hover:text-indigo-50/50 transition-colors duration-500">
                    {s.number}
                  </span>
                  
                  {/* Glowing hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Minimalist Icon Box */}
                    <div className="mb-12 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-110 origin-left">
                      <s.icon className="size-6" strokeWidth={2} />
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">{s.title}</h3>
                      <p className="text-base leading-relaxed text-slate-600 font-medium max-w-[90%]">{s.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
