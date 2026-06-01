const steps = [
  {
    n: "1",
    title: "Sign in with GitHub",
    body: "Read-only scope. We analyze your languages, repos, and skills to find the perfect match.",
  },
  {
    n: "2",
    title: "Discover your issues",
    body: "Good-first-issues filtered by your exact stack, ranked by fit and recency — no noise.",
  },
  {
    n: "3",
    title: "Understand the codebase",
    body: "RepoSage reads the repo for you — file tree, README, and key source files made clear.",
  },
  {
    n: "4",
    title: "Start contributing",
    body: "Pick an issue, open a PR, and join the open source community with confidence.",
  },
];

export function Flow() {
  return (
    <section id="flow" className="border-y border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            From login to ready-to-contribute in four steps.
          </h2>
          <p className="mt-3 text-muted-foreground text-base leading-relaxed">
            No setup, no configuration. Just sign in with GitHub and start exploring.
          </p>
        </div>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-primary">
                {s.n}
              </div>
              <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
