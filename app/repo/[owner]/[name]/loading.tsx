export default function Loading() {
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6 animate-pulse">
      <div className="h-14 rounded-2xl bg-muted" />
      <div className="mt-6 h-5 w-32 bg-muted rounded" />
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="h-7 w-64 bg-muted rounded" />
        <div className="mt-3 h-4 w-96 bg-muted rounded" />
        <div className="mt-4 flex gap-4">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-20 rounded-lg bg-muted" />
          <div className="h-6 w-24 rounded-lg bg-muted" />
          <div className="h-6 w-28 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-xl border border-border bg-card p-4" />
          <div className="h-40 rounded-xl border border-border bg-card p-4" />
          <div className="h-40 rounded-xl border border-border bg-card p-4" />
          <div className="h-40 rounded-xl border border-border bg-card p-4" />
        </div>
      </div>
    </div>
  );
}
