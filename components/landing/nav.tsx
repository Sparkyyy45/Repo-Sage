import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";
import { SignInButton } from "@/components/sign-in-button";

export async function Nav() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">
              RS
            </span>
            <span>RepoSage</span>
          </Link>
          {!session && (
            <nav className="hidden md:flex items-center gap-8">
              <a href="#problem" className="text-sm text-muted-foreground/80 hover:text-indigo-600 transition-colors">
                Why
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground/80 hover:text-indigo-600 transition-colors">
                How it works
              </a>
              <a href="#features" className="text-sm text-muted-foreground/80 hover:text-indigo-600 transition-colors">
                Features
              </a>
            </nav>
          )}
        </div>
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <SignInButton size="sm" />
        )}
      </div>
    </header>
  );
}
