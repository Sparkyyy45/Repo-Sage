"use client";

import { motion } from "framer-motion";
import { LogIn, Search, Bot, Rocket } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Sign in with GitHub",
    body: "Read-only access. We analyze your languages, repos, and starred projects to find your best-fit issues.",
    color: "text-gray-700 bg-gray-100",
  },
  {
    icon: Search,
    title: "Discover matched issues",
    body: "Good-first-issues from across GitHub, ranked by your tech stack, experience level, and recency.",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Bot,
    title: "Explore with AI",
    body: "For every issue, RepoSage generates an architecture diagram, onboarding guide, and AI chat — built from the actual repo.",
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    icon: Rocket,
    title: "Make your first PR",
    body: "You know what to change, where to change it, and why. Open a PR with confidence and join the community.",
    color: "text-green-600 bg-green-100",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/40 bg-muted/20">
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
            Sign in, explore, contribute.
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Four steps from zero to your first open source pull request.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto grid max-w-5xl gap-6 md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <svg
            className="absolute left-0 top-8 hidden md:block pointer-events-none"
            width="100%"
            height="2"
            viewBox="0 0 1100 2"
            preserveAspectRatio="none"
          >
            <line x1="60" y1="1" x2="1040" y2="1" stroke="currentColor" className="text-border/60" strokeWidth="1" strokeDasharray="6 4" />
          </svg>

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={stepVariants}
              className="text-center"
            >
              <div className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl ${s.color} shadow-sm ring-1 ring-border/50`}>
                <s.icon className="size-6" />
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
