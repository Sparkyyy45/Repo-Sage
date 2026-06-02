"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, X, Check } from "lucide-react";

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

export function ProblemSection() {
  return (
    <section id="problem" className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto mb-16 max-w-2xl text-center"
      >
        <p className="mb-3 text-sm font-semibold text-blue-600 uppercase tracking-wider">The gap</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Issue matchers stop where RepoSage starts.
        </h2>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
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
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 border-b border-border bg-muted/20">
            <div className="p-4 text-sm font-semibold text-foreground">Capability</div>
            <div className="p-4 text-sm font-medium text-muted-foreground text-center border-x border-border">
              <Search className="size-3.5 inline mr-1.5" />
              Issue Matchers
            </div>
            <div className="p-4 text-sm font-medium text-foreground text-center">
              <BookOpen className="size-3.5 inline mr-1.5 text-blue-600" />
              RepoSage
            </div>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 ${i < comparison.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className="p-4 text-sm text-foreground">{row.feature}</div>
              <div className="p-4 flex items-center justify-center border-x border-border/50">
                {row.others ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-red-400" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                <Check className="size-4 text-green-500" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Other tools hand you a list of issues and stop. RepoSage keeps going until you understand the codebase.
        </p>
      </motion.div>
    </section>
  );
}
