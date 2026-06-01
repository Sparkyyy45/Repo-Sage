export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">
            RS
          </span>
          <span className="font-medium text-foreground">RepoSage</span>
          <span className="hidden text-border md:inline">&middot;</span>
          <span className="hidden md:inline">Find your first open source contribution.</span>
        </div>
        <div className="text-xs">
          Built with Next.js &middot; GitHub API &middot; Open Source
        </div>
      </div>
    </footer>
  );
}
