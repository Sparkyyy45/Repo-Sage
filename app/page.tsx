import { auth } from "@/lib/auth";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { BackToTopButton } from "@/components/landing/BackToTopButton";
import { createOctokit } from "@/lib/github";
import { fetchLandingPreviewIssues } from "@/lib/github/issues";
import type { Issue } from "@/lib/github/issues";

export default async function Home() {
  const session = await auth();
  const signedIn = !!session?.user;

  // Fetch real landing preview issues when a token is available.
  // On any failure (missing token, network error, rate limit), we
  // fall back to undefined so the Hero uses its static fallback data.
  let landingIssues: Issue[] | undefined;
  if (process.env.GITHUB_TOKEN) {
    try {
      const octokit = createOctokit(process.env.GITHUB_TOKEN);
      const issues = await fetchLandingPreviewIssues(octokit);
      if (issues.length > 0) landingIssues = issues;
    } catch {
      // Silently fall back to static data
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <Hero signedIn={signedIn} dynamicIssues={landingIssues} />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <SocialProof />
        <CtaSection signedIn={signedIn} />
      </main>
      <BackToTopButton/>
      <Footer />
    </div>
  );
}
