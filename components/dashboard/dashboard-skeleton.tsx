export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6">
      <div className="h-16 border-b border-border bg-background/80 backdrop-blur-lg rounded-2xl mb-8" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-48" />
              <div className="h-4 bg-muted rounded w-72" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-16" />
                  </div>
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-pulse">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-muted" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
