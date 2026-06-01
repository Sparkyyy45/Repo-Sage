"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isRateLimit =
    error.message?.toLowerCase().includes("rate limit") ||
    error.message?.toLowerCase().includes("403");

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive text-lg font-bold shadow-sm">
          RS
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {isRateLimit ? "Rate Limited" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isRateLimit
            ? "GitHub API rate limit exceeded. Wait a moment and try again."
            : error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            <Home className="size-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
