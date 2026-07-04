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

export default async function Home() {
  const session = await auth();
  const signedIn = !!session?.user;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Nav />
      <main className="flex-1">
        <Hero signedIn={signedIn} />
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
