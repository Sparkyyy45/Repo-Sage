export default function Loading() {
  return (
    <div className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-6 animate-pulse">
      <div className="h-14 rounded-2xl bg-muted" />
      <div className="mt-8 h-4 w-24 bg-muted rounded" />
      <div className="mt-10 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
