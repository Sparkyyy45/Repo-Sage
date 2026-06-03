"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@/components/sign-in-button";
import { Sparkles, LayoutDashboard, Shield, Clock, GitBranch } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white" />
        <motion.div
          className="absolute top-1/2 left-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/40 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 size-48 rounded-full bg-indigo-100/30 blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-10 text-center shadow-2xl shadow-indigo-500/10 md:p-16"
        >
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />

          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles className="size-3.5 text-indigo-500" />
            It takes 30 seconds
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl leading-[1.1]">
            Your first PR is one click away.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            No setup, no config, no risk. Sign in with GitHub and we&rsquo;ll find the perfect issue for you.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            {signedIn ? (
              <Link
                href="/dashboard"
                className={buttonVariants({ size: "lg" })}
              >
                <LayoutDashboard className="size-4" />
                Go to Dashboard
              </Link>
            ) : (
              <SignInButton size="lg" label="Get Started Free" showArrow />
            )}
            <Link
              href="#features"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Learn more
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-indigo-400" />
              Read-only access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-indigo-400" />
              Free forever
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="size-3.5 text-indigo-400" />
              Open source
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
