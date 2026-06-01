import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_0%,#DBEAFE,transparent_70%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-sm">
          <Sparkles className="size-3.5 text-primary" />
          <span>From <span className="font-semibold text-foreground">good first issue</span> to first PR</span>
        </span>
        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Find your first open source contribution.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg leading-relaxed">
          Discover beginner-friendly issues matched to your skills and learn unfamiliar codebases faster. No more guessing where to start.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <SignInButton size="lg" label="Explore Issues" showArrow />
          <Link
            href="#features"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            How It Works
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Read-only access &middot; We never modify your repos &middot; Free for everyone
        </p>
      </div>
    </section>
  );
}
