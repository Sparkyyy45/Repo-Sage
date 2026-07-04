"use client";

import { motion } from "framer-motion";
import { Star, GitBranch, Globe, Users, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/landing/animated-counter";

const stats = [
  { icon: Star, value: 1247, suffix: "+", label: "Issues analyzed", gradient: "from-indigo-500/15 to-indigo-300/15", iconColor: "text-indigo-500" },
  { icon: GitBranch, value: 892, suffix: "+", label: "Repos indexed", gradient: "from-indigo-500/15 to-indigo-300/15", iconColor: "text-indigo-500" },
  { icon: Globe, value: 156, suffix: "+", label: "Projects covered", gradient: "from-indigo-500/15 to-indigo-300/15", iconColor: "text-indigo-500" },
  { icon: Users, value: 420, suffix: "+", label: "Active users", gradient: "from-indigo-500/15 to-indigo-300/15", iconColor: "text-indigo-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function SocialProof() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-muted/20">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-gradient-to-r from-indigo-100/40 to-purple-100/30 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto mb-10 max-w-xl text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1 text-xs font-medium text-indigo-700">
            <Sparkles className="size-3.5 text-indigo-500" />
            Trusted by the open source community
          </div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={statVariants}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200/50 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-card border border-border/50 shadow-sm group-hover:scale-110 group-hover:shadow-indigo-500/10 group-hover:border-indigo-200 transition-all duration-300 ${s.iconColor}`}>
                  <s.icon className="size-5" />
                </div>
                <div className="text-2xl font-bold text-foreground tabular-nums md:text-3xl">
                  <AnimatedCounter from={0} to={s.value} />
                  {s.suffix}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
