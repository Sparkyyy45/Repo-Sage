"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@/components/sign-in-button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_100%,#DBEAFE,transparent_80%)] dark:bg-[radial-gradient(40%_40%_at_50%_100%,#1E3A5F,transparent_80%)]" />
        <div className="absolute top-1/2 left-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center md:py-28"
      >
        <div className="mx-auto max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/70 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <Sparkles className="size-3.5 text-primary" />
            Get started in under a minute
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Your first open source contribution is waiting.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Join developers who use RepoSage to find their perfect first issue. No setup, no stress.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <SignInButton size="lg" label="Get Started Free" showArrow />
            <Link
              href="#features"
              className={buttonVariants({ size: "lg", variant: "ghost" })}
            >
              Learn more
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
