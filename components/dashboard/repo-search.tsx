"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function RepoSearch() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(false);
      let trimmed = input.trim();
      trimmed = trimmed.replace(/^https?:\/\/github\.com\//, "");
      trimmed = trimmed.replace(/\/$/, "");
      const parts = trimmed.split("/");
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const owner = encodeURIComponent(parts[0]);
        const repo = encodeURIComponent(parts[1]);
        router.push(`/repo/${owner}/${repo}`);
      } else {
        setError(true);
      }
    },
    [input, router]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Explore any repository... e.g. vercel/next.js"
          className={`flex h-12 w-full rounded-2xl border bg-card pl-11 pr-4 text-sm placeholder:text-muted-foreground/60 transition-all focus:outline-none ${
            error
              ? "border-destructive ring-1 ring-destructive/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-destructive font-medium">
          Enter a repo as owner/name (e.g. vercel/next.js)
        </p>
      )}
    </form>
  );
}
