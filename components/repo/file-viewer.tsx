import { FileCode } from "lucide-react";
import type { RepoFile } from "@/lib/github/ingest";

export function FileViewer({ files }: { files: RepoFile[] }) {
  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.path}
          className="rounded-2xl border border-border bg-card shadow-xs"
        >
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <FileCode className="size-4 text-muted-foreground" />
            <span className="truncate font-mono text-xs text-muted-foreground">
              {file.path}
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {file.content.length} chars
            </span>
          </div>
          <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-foreground">
            <code>{file.content}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
