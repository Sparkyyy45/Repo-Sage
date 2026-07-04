import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle, Calendar } from "lucide-react";
import type { IssueDetail } from "@/lib/github/issues";
import { renderMarkdown } from "@/lib/markdown";

export function IssueHeader({
  issue,
  repoFullName,
  owner,
  name,
}: {
  issue: IssueDetail;
  repoFullName: string;
  owner: string;
  name: string;
}) {
  const maxBodyLength = 1500;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-x-auto">
      <div className="mb-4">
        <Link
          href={`/repo/${owner}/${name}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {repoFullName}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                issue.state === "open"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className={`size-1.5 rounded-full ${issue.state === "open" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              {issue.state}
            </span>
            <span className="text-xs text-muted-foreground">#{issue.number}</span>
          </div>

          <h1 className="text-lg font-semibold leading-snug text-foreground">
            {issue.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{issue.user.login}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(issue.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3" />
              {issue.comments} comments
            </span>
          </div>

          {issue.labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {issue.labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={issue.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 sm:py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full sm:w-auto"
        >
          <ExternalLink className="size-4" />
          View on GitHub
        </a>
      </div>

      {issue.body && (
        <div className="mt-5 border-t border-border pt-4 overflow-x-auto">
          <div className="prose prose-sm max-w-none text-foreground break-words [&_p]:text-sm [&_p]:leading-relaxed [&_p]:break-words [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-sm [&_li]:break-words [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_img]:rounded-lg [&_img]:max-w-full]"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(issue.body.slice(0, maxBodyLength)),
            }}
          />
          {issue.body.length > maxBodyLength && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-primary hover:text-primary/80">
                Show more ({issue.body.length - maxBodyLength} characters)
              </summary>
              <div
                className="prose prose-sm max-w-none text-foreground mt-2 break-words [&_p]:text-sm [&_p]:leading-relaxed [&_p]:break-words [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0]"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(issue.body.slice(maxBodyLength)),
                }}
              />
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
