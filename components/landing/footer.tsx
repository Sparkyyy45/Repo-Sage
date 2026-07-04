import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background relative">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-sm">
                RS
              </span>
              <span>RepoSage</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Find your first open source contribution. Built for beginners, powered by AI.
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Product</span>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">
                How it works
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors">
                Features
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Community</span>
              <a
                href="https://github.com/anomalyco/reposage/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
              >
                Contributing
              </a>
              <a
                href="https://github.com/Sparkyyy45/Repo-Sage/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
              >
                Code of Conduct
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Connect</span>
              <a
                href="https://github.com/Sparkyyy45/Repo-Sage/blob/main/CODE_OF_CONDUCT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
              >
                <ExternalLink className="size-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>&copy; {new Date().getFullYear()} RepoSage. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">
            Built with <Heart className="size-3 text-red-400" /> using Next.js &middot; GitHub API &middot; Open Source
          </span>
        </div>
      </div>
    </footer>
  );
}
