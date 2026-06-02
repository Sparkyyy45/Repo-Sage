import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";
import { SignInButton } from "@/components/sign-in-button";

export async function Nav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm">
              RS
            </span>
            <span>RepoSage</span>
          </Link>
          {!session && (
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#flow"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </a>
            </nav>
          )}
        </div>
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}
