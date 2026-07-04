"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, X, Check, ArrowRight } from "lucide-react";

const comparison = [
  {
    feature: "Issues matched to your stack",
    others: true,
    reposage: true,
  },
  {
    feature: "Codebase architecture overview",
    others: false,
    reposage: true,
  },
  {
    feature: "AI-powered onboarding guide",
    others: false,
    reposage: true,
  },
  {
    feature: "What files to change",
    others: false,
    reposage: true,
  },
  {
    feature: "Follow-up Q&A about the issue",
    others: false,
    reposage: true,
  },
  {
    feature: "Reads repo file tree & README",
    others: false,
    reposage: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function ProblemSection() {
  return (
    <section id="problem" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-6 shadow-sm">
            <ArrowRight className="mr-1.5 size-3.5 text-indigo-500" />
            The gap
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground md:text-4xl lg:text-5xl">
            Issue matchers stop where RepoSage starts.
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
            Finding a good-first-issue is easy. Understanding what the code does and what needs to change is the hard part.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
            <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-50 pointer-events-none" />
            <div className="grid grid-cols-3 border-b border-border bg-muted/50">
              <div className="p-4 text-sm font-semibold text-foreground">Capability</div>
              <div className="p-4 text-sm font-medium text-muted-foreground/60 text-center border-x border-border">
                <Search className="size-3.5 inline mr-1.5" />
                Issue Matchers
              </div>
              <div className="p-4 text-sm font-semibold text-indigo-700 text-center bg-indigo-50/60">
                <BookOpen className="size-3.5 inline mr-1.5" />
                RepoSage
              </div>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {comparison.map((row, i) => (
                <motion.div
                  key={row.feature}
                  variants={rowVariants}
                  className={`grid grid-cols-3 ${i < comparison.length - 1 ? "border-b border-border" : ""} ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}
                >
                  <div className="p-4 text-sm text-foreground">{row.feature}</div>
                  <div className="p-4 flex items-center justify-center border-x border-border">
                    {row.others ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                      >
                        <Check className="size-4 text-foreground/70" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                      >
                        <X className="size-4 text-muted-foreground/40" />
                      </motion.div>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
                    >
                      <Check className="size-4 text-indigo-600" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground max-w-md mx-auto">
            Other tools hand you a list of issues and stop. RepoSage keeps going until you understand the codebase.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
