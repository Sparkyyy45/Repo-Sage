import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { createOctokit } from "@/lib/github";
import { ingestRepo } from "@/lib/github/ingest";
import { fetchIssueDetail } from "@/lib/github/issues";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { IssueHeader } from "@/components/issue/issue-header";
import { ArchDiagram } from "@/components/issue/arch-diagram";
import { SetupGuide } from "@/components/issue/setup-guide";
import { OnboardingGuide } from "@/components/issue/onboarding-guide";
import { IssueChat } from "@/components/issue/issue-chat";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ owner: string; name: string; number: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { owner, name, number } = await params;
  const issueNumber = parseInt(number, 10);
  if (isNaN(issueNumber)) notFound();

  if (!session.accessToken) {
    return (
      <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-6">
        <DashboardNav user={session.user} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Unable to authenticate.</p>
        </div>
      </div>
    );
  }

  const octokit = createOctokit(session.accessToken);
  const repoFullName = `${owner}/${name}`;

  const [issueData, ingested] = await Promise.all([
    fetchIssueDetail(octokit, owner, name, issueNumber).catch(() => null),
    ingestRepo(octokit, owner, name).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("403")) {
        throw new Error("GitHub API rate limit exceeded. Please wait a moment and try again.");
      }
      console.error("Failed to ingest repo:", err);
      return null;
    }),
  ]);

  if (!issueData) notFound();

  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-6">
      <DashboardNav user={session.user} />

      <div className="mt-6 space-y-6">
        <IssueHeader
          issue={issueData.issue}
          repoFullName={repoFullName}
          owner={owner}
          name={name}
        />

        {ingested && (
          <>
            <ArchDiagram repo={ingested} />

            <SetupGuide repo={ingested} />

            <OnboardingGuide
              repo={ingested}
              issue={issueData.issue}
              repoFullName={repoFullName}
            />

            <IssueChat
              repo={ingested}
              issue={issueData.issue}
              repoFullName={repoFullName}
            />
          </>
        )}

        {!ingested && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Could not load repo data. The repo may be private, deleted, or unavailable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
