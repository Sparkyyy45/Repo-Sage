import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <SocialProof />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
