"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { buttonVariants } from "@/components/ui/button";

export function UserMenu({
  user,
}: {
  user: {
    name?: string | null;
    login?: string;
    avatarUrl?: string;
    email?: string | null;
  };
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right text-sm leading-tight sm:block">
        <div className="font-medium text-foreground">{user.name || user.login}</div>
        <div className="text-muted-foreground text-xs">{user.login}</div>
      </div>
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full ring-2 ring-border"
          unoptimized
        />
      ) : (
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-border">
          {(user.name || user.login || "?").charAt(0).toUpperCase()}
        </div>
      )}
      <button
        onClick={() => signOut({ redirectTo: "/" })}
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        title="Sign out"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
