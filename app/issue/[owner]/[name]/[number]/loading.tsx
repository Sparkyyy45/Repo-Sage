export default function Loading() {
  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-6 animate-pulse">
      <div className="h-14 rounded-2xl bg-muted" />
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="h-5 w-48 bg-muted rounded mb-3" />
          <div className="h-7 w-96 bg-muted rounded" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-lg bg-muted" />
            <div className="h-6 w-16 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="h-48 rounded-2xl border border-border bg-card p-6" />
        <div className="h-64 rounded-2xl border border-border bg-card p-6" />
        <div className="h-40 rounded-2xl border border-border bg-card p-6" />
      </div>
    </div>
  );
}
