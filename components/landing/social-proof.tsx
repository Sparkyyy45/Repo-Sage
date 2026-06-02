"use client";

import { motion } from "framer-motion";
import { Star, GitBranch, Globe, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/landing/animated-counter";

const stats = [
  { icon: Star, value: 1247, suffix: "+", label: "Issues analyzed" },
  { icon: GitBranch, value: 892, suffix: "+", label: "Repos indexed" },
  { icon: Globe, value: 156, suffix: "+", label: "Projects covered" },
  { icon: Users, value: 420, suffix: "+", label: "Active users" },
];

export function SocialProof() {
  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-white border border-border/60 shadow-sm">
                <s.icon className="size-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums md:text-3xl">
                <AnimatedCounter from={0} to={s.value} />
                {s.suffix}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
