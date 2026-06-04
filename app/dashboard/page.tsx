import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOctokit } from "@/lib/github";
import { fetchProfileData } from "@/lib/github/profile";
import { fetchGoodFirstIssues } from "@/lib/github/issues";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ProfileSidebar } from "@/components/dashboard/profile-sidebar";
import { IssueFeedClient } from "@/components/dashboard/issue-feed-client";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { RepoSearch } from "@/components/dashboard/repo-search";
import { LearnSidebarSection } from "@/components/learn/sidebar-section";
import { SavedIssuesSection } from "@/components/dashboard/saved-issues-section";
import { FirstVisitOnboarding } from "@/components/dashboard/first-visit-onboarding";
import { getRateLimitInfo } from "@/lib/rate-limit";
import { RateLimitBanner } from "@/components/rate-limit-banner";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (!session.accessToken) {
    return (
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6">
        <DashboardNav user={session.user} />
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-muted-foreground">
              Unable to authenticate with GitHub. Please sign in again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const octokit = createOctokit(session.accessToken);
  const login = session.user.login!;

  const [profile, rateLimitInfo] = await Promise.all([
    fetchProfileData(octokit, login).catch(() => null),
    getRateLimitInfo(octokit),
  ]);

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-8">
        <DashboardNav user={session.user} />
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="text-muted-foreground">
              Could not load profile data. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const topLanguages = profile.languages.map((l) => l.name);
  const feed = await fetchGoodFirstIssues(octokit, topLanguages).catch(
    () => ({ issues: [], reposWithIssues: 0 })
  );

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6">
      <DashboardNav user={session.user} />

      {rateLimitInfo?.isLimited && (
        <div className="mt-6">
          <RateLimitBanner info={rateLimitInfo} />
        </div>
      )}

      <div className="mt-8 mb-6 space-y-4">
        <RepoSearch />
        <FirstVisitOnboarding />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <WelcomeSection
            name={session.user.name || session.user.login || "Developer"}
            languages={profile.languages}
            totalStars={profile.totalStars}
            reposCount={profile.publicRepos}
            issuesCount={feed.issues.length}
            reposWithIssues={feed.reposWithIssues}
          />

          <SavedIssuesSection />

          <IssueFeedClient
            issues={feed.issues}
            topLanguages={topLanguages}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <ProfileSidebar profile={profile} />
          <LearnSidebarSection />
        </div>
      </div>
    </div>
  );
}
