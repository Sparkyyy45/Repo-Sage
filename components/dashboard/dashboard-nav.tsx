"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function DashboardNav({
  user,
}: {
  user: {
    name?: string | null;
    login?: string;
    avatarUrl?: string;
  };
}) {
  return (
    <header className="flex h-14 items-center justify-between rounded-2xl card-glow px-5">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 font-semibold text-base tracking-tight text-foreground"
      >
        <span className="flex size-8 items-center justify-center rounded-xl gradient-primary text-xs font-bold">
          RS
        </span>
        <span className="hidden sm:inline">RepoSage</span>
      </Link>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <Link
          href="/learn"
          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-[hsl(var(--grad-1)/0.3)] hover:text-foreground"
          title="Learn"
        >
          <BookOpen className="size-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="font-medium text-foreground">{user.name || user.login}</div>
          <div className="text-xs text-muted-foreground">@{user.login}</div>
        </div>
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={30}
            height={30}
            className="size-8 rounded-full ring-2 ring-[hsl(var(--grad-1))]"
            unoptimized
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-[hsl(var(--grad-1))]">
            {(user.name || user.login || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <Link
          href="/settings"
          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-[hsl(var(--grad-1)/0.3)] hover:text-foreground"
          title="Settings"
        >
          <Settings className="size-4" />
        </Link>
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-[hsl(var(--grad-1)/0.3)] hover:text-foreground"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}