import { Search, BookOpen, GitBranch, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart issue discovery",
    description:
      "We scan GitHub for good-first-issues that match your exact tech stack — no more sifting through irrelevant repos.",
  },
  {
    icon: BookOpen,
    title: "Repo insights at a glance",
    description:
      "Auto-generated README summaries, file tree navigation, and key files highlighted so you understand any codebase in minutes.",
  },
  {
    icon: GitBranch,
    title: "Contribution readiness",
    description:
      "See beginner-friendliness scores, maintainer responsiveness, and estimated effort for every issue before you dive in.",
  },
  {
    icon: HeartHandshake,
    title: "Built for beginners",
    description:
      "Designed to reduce anxiety and make open source feel approachable. Every feature helps you take the next step with confidence.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Why RepoSage</p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          The bridge between &ldquo;good first issue&rdquo; and your first PR.
        </h2>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed">
          Issue matchers exist. Onboarding tools exist. No one has connected them. RepoSage is the missing layer.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
