"use client";

import { ArrowRight, GitBranch } from "lucide-react";
import { signIn } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";

export function SignInButton({
  size = "sm",
  label = "Sign in",
  showArrow = false,
}: {
  size?: "sm" | "lg";
  label?: string;
  showArrow?: boolean;
}) {
  return (
    <button
      onClick={() => signIn("github")}
      className={buttonVariants({ size })}
    >
      <GitBranch className="size-4" />
      <span>{label}</span>
      {showArrow && <ArrowRight className="size-4" />}
    </button>
  );
}
