"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { isIssueSaved, saveIssue, removeIssue } from "@/lib/saved-issues";
import type { Issue } from "@/lib/github/issues";

export function IssueBookmarkButton({ issue, onToggle }: { issue: Issue; onToggle?: () => void }) {
  const [saved, setSaved] = useState(() => isIssueSaved(issue.id));

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (saved) {
          removeIssue(issue.id);
          setSaved(false);
        } else {
          saveIssue(issue);
          setSaved(true);
        }
        onToggle?.();
      }}
      className={`flex size-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
        saved
          ? "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          : "border-transparent text-muted-foreground/30 hover:text-muted-foreground hover:border-border hover:bg-muted/50"
      }`}
      title={saved ? "Remove from saved" : "Save issue"}
    >
      <Bookmark className={`size-3.5 ${saved ? "fill-indigo-600" : ""}`} />
    </button>
  );
}
