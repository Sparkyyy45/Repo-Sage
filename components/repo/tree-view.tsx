import { Folder, File } from "lucide-react";
import type { RepoTree } from "@/lib/github/ingest";

export function RepoTreeView({ items }: { items: RepoTree[] }) {
  const dirs = items.filter((i) => i.type === "tree");
  const files = items.filter((i) => i.type === "blob");

  if (items.length === 0) {
    return (
      <div className="p-4 text-xs text-muted-foreground">
        No files found.
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto p-1">
      {dirs.length > 0 && (
        <div className="mb-1">
          <div className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Directories ({dirs.length})
          </div>
          {dirs.slice(0, 50).map((item) => (
            <div
              key={item.path}
              className="flex items-center gap-2 rounded-md px-3 py-1 text-xs hover:bg-muted/40 min-w-0"
            >
              <Folder className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate min-w-0">{item.path}</span>
            </div>
          ))}
          {dirs.length > 50 && (
            <div className="px-3 py-1 text-[11px] text-muted-foreground">
              + {dirs.length - 50} more
            </div>
          )}
        </div>
      )}

      <div>
        <div className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Files ({files.length})
        </div>
        {files.slice(0, 100).map((item) => (
          <div
            key={item.path}
            className="flex items-center gap-2 rounded-md px-3 py-1 text-xs hover:bg-muted/40 min-w-0"
          >
            <File className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate min-w-0">{item.path}</span>
            {item.size != null && (
              <span className="shrink-0 text-muted-foreground">
                {formatSize(item.size)}
              </span>
            )}
          </div>
        ))}
        {files.length > 100 && (
          <div className="px-3 py-1 text-[11px] text-muted-foreground">
            + {files.length - 100} more
          </div>
        )}
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}
