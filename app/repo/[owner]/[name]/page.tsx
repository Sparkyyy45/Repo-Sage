import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createOctokit } from "@/lib/github";
import { ingestRepo } from "@/lib/github/ingest";
import { fetchUserLanguages } from "@/lib/github/user-languages";
import { fetchRepoInsights } from "@/lib/github/repo-insights";
import { ArrowLeft, ExternalLink, Star, GitFork } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { InsightsSection } from "@/components/repo/insights-section";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { owner, name } = await params;

  if (!session.accessToken) {
    return (
      <div className="mx-auto flex min-h-full max-w-6xl flex-col items-center justify-center px-6">
        <p className="text-muted-foreground">Unable to authenticate.</p>
      </div>
    );
  }

  const octokit = createOctokit(session.accessToken);

  const [ingested, userLanguages] = await Promise.all([
    ingestRepo(octokit, owner, name).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("403")) {
        throw new Error("GitHub API rate limit exceeded. Please wait a moment and try again.");
      }
      console.error("Failed to ingest repo:", err);
      return null;
    }),
    fetchUserLanguages(octokit).catch(() => []),
  ]);
  if (!ingested) notFound();

  const insightsData = ingested
    ? await fetchRepoInsights(octokit, owner, name, userLanguages, ingested.tree.map((t) => t.path)).catch(() => null)
    : null;

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6">
      <DashboardNav user={session.user} />

      <div className="mt-6 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              <span className="font-normal text-muted-foreground">
                {ingested.owner} /
              </span>{" "}
              {ingested.name}
            </h1>
            {ingested.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {ingested.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {ingested.language && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-primary" />
                  {ingested.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4" />
                {ingested.stars}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitFork className="size-4" />
                {ingested.forks}
              </span>
            </div>
          </div>
          <Link
            href={`https://github.com/${ingested.fullName}`}
            target="_blank"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 sm:py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full sm:w-auto"
          >
            <ExternalLink className="size-4" />
            View on GitHub
          </Link>
        </div>
        {ingested.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {ingested.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {insightsData && (
        <InsightsSection
          insights={insightsData}
          repoFullName={ingested.fullName}
          description={ingested.description}
          topics={ingested.topics}
          language={ingested.language}
        />
      )}
    </div>
  );
}
