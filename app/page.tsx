import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Flow } from "@/components/landing/flow";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <Flow />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
