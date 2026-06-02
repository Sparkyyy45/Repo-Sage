import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { GuideContent } from "@/components/learn/guide-content";
import { SectionNav } from "@/components/learn/section-nav";
import { guides, getGuide, getNextGuide, getPrevGuide } from "@/data/guides";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const nextGuide = getNextGuide(slug);
  const prevGuide = getPrevGuide(slug);

  return (
    <div className="mx-auto min-h-full max-w-6xl px-6 py-6">
      <DashboardNav user={session.user} />

      <div className="mt-6 mb-8">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          All guides
        </Link>
      </div>

      <header className="mb-10 max-w-2xl">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground mb-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Guide {guide.order} &middot; {guide.readTime}
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {guide.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {guide.description}
        </p>
      </header>

      <div className="flex gap-12 lg:gap-16">
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
              Sections
            </p>
            <SectionNav sections={guide.sections} />
          </div>
        </aside>

        <article className="flex-1 min-w-0 max-w-prose">
          <GuideContent guide={guide} nextGuide={nextGuide} prevGuide={prevGuide} />
        </article>
      </div>
    </div>
  );
}
