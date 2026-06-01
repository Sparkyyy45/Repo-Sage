import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-lg font-bold shadow-sm">
          RS
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-2 text-lg font-medium text-foreground">Page not found</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The repo you&apos;re looking for doesn&apos;t exist, isn&apos;t accessible, or the URL
          might be wrong.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
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
