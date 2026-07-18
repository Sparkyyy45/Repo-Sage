"use client";

import { SignInButton } from "@/components/sign-in-button";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, GitBranch, LayoutDashboard, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export function CtaSection({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden gradient-page">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/2 left-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[hsl(var(--grad-1))]"
          animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 size-48 rounded-full blur-3xl bg-[hsl(var(--grad-3))]"
          animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/4 right-1/3 size-40 rounded-full blur-3xl bg-[hsl(var(--grad-2))]"
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto flex max-w-3xl flex-col items-center card-glow backdrop-blur-sm p-10 text-center rounded-2xl md:p-16"
        >
          <div className="absolute -top-px left-8 right-8 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--grad-1)),transparent)]" />
          <div className="absolute -bottom-px left-8 right-8 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--grad-3)/0.6),transparent)]" />
          <div className="absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] bg-[hsl(var(--grad-1)/0.15)]" />

          <span className="mb-6 inline-flex items-center gap-2 rounded-full badge-pastel px-4 py-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            It takes 30 seconds
          </span>

          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl leading-[1.1] gradient-text">
            Your first PR is one click away.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            No setup, no config, no risk. Sign in with GitHub and we&rsquo;ll find the perfect issue for you.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            {signedIn ? (
              <Link
                href="/dashboard"
                className={`${buttonVariants({ size: "lg" })} gradient-primary border-0`}
              >
                <LayoutDashboard className="size-4" />
                Go to Dashboard
              </Link>
            ) : (
              <div className="[&_button]:gradient-primary [&_button]:border-0 [&_a]:gradient-primary [&_a]:border-0">
                <SignInButton size="lg" label="Get Started Free" showArrow />
              </div>
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
              <Shield className="size-3.5 text-[hsl(258_55%_60%)]" />
              Read-only access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-[hsl(190_55%_45%)]" />
              Free forever
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="size-3.5 text-[hsl(320_50%_60%)]" />
              Open source
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}