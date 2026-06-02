"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@/components/sign-in-button";
import { Sparkles, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-white" />
        <motion.div
          className="absolute top-1/2 left-1/3 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-24 text-center md:py-32"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/70 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm shadow-sm">
          <Sparkles className="size-3.5 text-blue-500" />
          It takes 30 seconds
        </span>

        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl leading-[1.1]">
          Your first open source contribution is one click away.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
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
      </motion.div>
    </section>
  );
}
