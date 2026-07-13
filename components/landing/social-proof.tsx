"use client";

import { AnimatedCounter } from "@/components/landing/animated-counter";
import { motion } from "framer-motion";
import { GitBranch, Globe, Sparkles, Star, Users } from "lucide-react";

const stats = [
  { icon: Star, value: 1247, suffix: "+", label: "Issues analyzed", grad: "var(--grad-1)", iconColor: "text-[hsl(258_60%_50%)]" },
  { icon: GitBranch, value: 892, suffix: "+", label: "Repos indexed", grad: "var(--grad-3)", iconColor: "text-[hsl(190_60%_38%)]" },
  { icon: Globe, value: 156, suffix: "+", label: "Projects covered", grad: "var(--grad-2)", iconColor: "text-[hsl(320_55%_50%)]" },
  { icon: Users, value: 420, suffix: "+", label: "Active users", grad: "var(--grad-4)", iconColor: "text-[hsl(45_70%_42%)]" },
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
    <section className="relative overflow-hidden border-y border-border/40 gradient-page">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-40 blur-3xl bg-[linear-gradient(90deg,hsl(var(--grad-1)),hsl(var(--grad-2)))]"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
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
          <div className="inline-flex items-center gap-1.5 rounded-full badge-pastel px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" />
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
              className="group relative overflow-hidden rounded-2xl card-glow p-6 text-center hover:-translate-y-1 transition-all duration-300"
              style={{ ["--stat-grad" as string]: `hsl(${s.grad})` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(180deg, hsl(${s.grad} / 0.25), transparent)` }}
              />
              <div className="relative z-10">
                <div
                  className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-card border border-border/50 group-hover:scale-110 transition-all duration-300 ${s.iconColor}`}
                  style={{ boxShadow: "none" }}
                >
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