import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { GuideCard } from "@/components/learn/guide-card";
import { LearnProgressDots } from "@/components/learn/learn-progress-dots";
import { guides } from "@/data/guides";

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="mx-auto min-h-full max-w-3xl px-6 py-6">
      <DashboardNav user={session.user} />

      <div className="mt-6 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Learn open source
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-lg">
          Six guides that take you from complete beginner to making your first contribution.
        </p>
        <div className="mt-5 max-w-xs">
          <LearnProgressDots />
        </div>
      </div>

      <div className="border-t border-border/40">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>

      <div className="mt-12 border-t border-border/40 pt-8 pb-4 text-center">
        <p className="text-sm text-muted-foreground">
          Ready to put it into practice? Find your first issue on the dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          Explore Issues
          <span aria-hidden="true" className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
