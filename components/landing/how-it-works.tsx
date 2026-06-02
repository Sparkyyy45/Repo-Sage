"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { LogIn, Search, Bot, BookmarkCheck, GraduationCap, FileText } from "lucide-react";
import { useRef } from "react";

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
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Smooth out the scroll progress for a more refined animation
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-32">
      {/* Vercel-style clean architectural grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-24 max-w-2xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-900 mb-6 shadow-sm tracking-tight">
            Story of a Contributor
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl tracking-[-0.02em]">
            From zero to contributor.
          </h2>
          <p className="mt-6 text-slate-600 text-lg leading-relaxed font-medium">
            A seamless, professional workflow designed to take you from signing in to merging your first pull request.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl pb-16" ref={containerRef}>
          {/* Animated Central Line - Thick "Road" structure */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-2 bg-indigo-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] rounded-full transform md:-translate-x-1/2 hidden md:block z-0">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-indigo-600 w-full rounded-full origin-top shadow-[0_0_15px_rgba(79,70,229,0.5)]"
              style={{ height: lineHeight }}
            />
          </div>

          <motion.div
            className="w-full"
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
                  className="relative flex flex-col md:flex-row items-center w-full mb-16 md:mb-24 last:mb-0 group/step"
                >
                  {/* Spacer for alternating layout */}
                  <div className={`hidden md:block w-1/2 ${isEven ? 'order-1' : 'order-3'}`} />
                  
                  {/* Card Container */}
                  <div className={`w-full md:w-1/2 flex relative ${isEven ? "md:justify-start md:pl-20 order-3" : "md:justify-end md:pr-20 order-1"}`}>
                    
                    {/* Horizontal Connector Branch - High visibility road */}
                    <div className={`absolute top-1/2 h-2 w-20 bg-indigo-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] hidden md:block z-10 ${isEven ? 'left-0 origin-left rounded-r-full' : 'right-0 origin-right rounded-l-full'} -translate-y-1/2`}>
                      <motion.div 
                        className={`h-full w-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] ${isEven ? 'rounded-r-full' : 'rounded-l-full'}`}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    {/* Vercel/Notion Style Card */}
                    <div className="relative w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 text-left z-20">
                      
                      {/* Subtle, sharp typography background number */}
                      <span className="absolute top-6 right-8 font-mono text-6xl font-bold text-slate-100 select-none pointer-events-none tracking-tighter">
                        {s.number}
                      </span>
                      
                      <div className="relative z-10">
                        {/* Minimalist Icon Box */}
                        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-indigo-600 transition-colors duration-300 group-hover/step:bg-indigo-50 group-hover/step:border-indigo-100 group-hover/step:text-indigo-700">
                          <s.icon className="size-5" strokeWidth={2} />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">{s.title}</h3>
                        <p className="text-[15px] leading-relaxed text-slate-600 font-medium">{s.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center Node - Clean, elegant junction */}
                  <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 flex size-12 items-center justify-center rounded-full border-[4px] border-white bg-indigo-50 shadow-sm transform md:-translate-x-1/2 md:-translate-y-1/2 z-30 hidden md:flex">
                    <motion.div 
                      className="size-3.5 rounded-full bg-indigo-200"
                      initial={{ backgroundColor: "#c7d2fe", scale: 1, boxShadow: "0 0 0px rgba(79,70,229,0)" }}
                      whileInView={{ backgroundColor: "#4f46e5", scale: 1.2, boxShadow: "0 0 12px rgba(79,70,229,0.5)" }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
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
