"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Sign in with GitHub",
    body: "Read-only scope. We analyze your languages, repos, and skills to find the perfect match.",
  },
  {
    n: "02",
    title: "Discover your issues",
    body: "Good-first-issues filtered by your exact stack, ranked by fit and recency — no noise.",
  },
  {
    n: "03",
    title: "Explore with RepoSage",
    body: "Architecture diagrams, onboarding guides, and AI-powered issue analysis — all generated for you.",
  },
  {
    n: "04",
    title: "Start contributing",
    body: "Pick an issue, open a PR, and join the open source community with confidence.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function Flow() {
  return (
    <section id="flow" className="relative border-y border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            From login to ready-to-contribute in four steps.
          </h2>
          <p className="mt-3 text-muted-foreground text-base leading-relaxed">
            No setup, no configuration. Just sign in with GitHub and start exploring.
          </p>
        </motion.div>

        <motion.div
          className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <svg
            className="absolute left-0 top-8 hidden lg:block pointer-events-none"
            width="100%"
            height="2"
            viewBox="0 0 1100 2"
            preserveAspectRatio="none"
          >
            <line
              x1="60"
              y1="1"
              x2="1040"
              y2="1"
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
              strokeDasharray="6 4"
            />
          </svg>

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={stepVariants}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20">
                <span className="relative z-10">{s.n}</span>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
