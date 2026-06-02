"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-[10px] font-bold shadow-sm">
                RS
              </span>
              <span>RepoSage</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Find your first open source contribution. Built for beginners, powered by AI.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <a
                href="https://github.com/anomalyco/reposage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Product</span>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#flow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Connect</span>
              <a
                href="https://github.com/anomalyco/reposage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>&copy; {new Date().getFullYear()} RepoSage. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">
            Built with <Heart className="size-3 text-red-400" /> using Next.js &middot; GitHub API &middot; Open Source
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
