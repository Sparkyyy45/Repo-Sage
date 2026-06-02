"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { LogIn, Search, Bot, BookmarkCheck, GraduationCap, FileText } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
    number: "01",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    gradient: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/20",
    number: "02",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "Architecture diagrams, onboarding guides, and AI chat — all generated from the actual repo code.",
    gradient: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-500/20",
    number: "03",
  },
  {
    icon: FileText,
    title: "Generate Repo Docs",
    body: "Instantly create polished CODE_OF_CONDUCT, CONTRIBUTING, and other community standards to make your repo contributor-ready.",
    gradient: "from-fuchsia-500 to-pink-500",
    shadow: "shadow-fuchsia-500/20",
    number: "04",
  },
  {
    icon: BookmarkCheck,
    title: "Save & track issues",
    body: "Bookmark good-first-issues and track progress from Saved to Merged. Your contribution pipeline in one place.",
    gradient: "from-sky-500 to-blue-500",
    shadow: "shadow-sky-500/20",
    number: "05",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    body: "Interactive guides covering Git fundamentals, codebase reading, PR best practices, and the open source lifecycle.",
    gradient: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/20",
    number: "06",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-slate-50/50 py-24 md:py-32">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-100/40 to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-24 max-w-2xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 mb-6">
            Workflow
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-slate-600 text-lg leading-relaxed">
            A seamless, professional workflow designed to take you from signing in to merging your first pull request, while ensuring repositories are welcoming and fully prepared.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl" ref={containerRef}>
          {/* Animated Central Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 transform md:-translate-x-1/2 hidden md:block">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-indigo-500 to-purple-500 w-full"
              style={{ height: lineHeight }}
            />
          </div>

          <motion.div
            className="space-y-16 md:space-y-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
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
                    <div className="group relative w-full max-w-[440px] rounded-[2rem] border border-white/40 bg-white/40 backdrop-blur-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 text-left">
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/60 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="relative z-10">
                        <span className="absolute -top-4 -right-2 text-[120px] font-black text-slate-900/[0.03] select-none leading-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-2 group-hover:translate-x-2">
                          {s.number}
                        </span>
                        
                        <div className={`mb-8 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg ${s.shadow} ring-1 ring-white/20 transition-transform duration-500 group-hover:scale-105`}>
                          <s.icon className="size-6" />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">{s.title}</h3>
                        <p className="text-base leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{s.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 flex size-12 items-center justify-center rounded-full border-[4px] border-white bg-slate-50 shadow-sm transform md:-translate-x-1/2 md:-translate-y-1/2 z-10 hidden md:flex transition-transform duration-500 hover:scale-110">
                    <div className={`size-3.5 rounded-full bg-gradient-to-br ${s.gradient} shadow-sm`} />
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
