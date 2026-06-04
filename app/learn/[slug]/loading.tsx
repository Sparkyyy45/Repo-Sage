import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function GuideLoading() {
  return (
    <div className="mx-auto min-h-full max-w-6xl px-6 py-6">
      <DashboardNav user={{ name: "", login: "" }} />

      <div className="mt-6 mb-8 animate-pulse">
        <div className="h-4 bg-muted rounded w-32 mb-6" />
        <div className="h-8 bg-muted rounded w-2/3 mb-2" />
        <div className="h-4 bg-muted rounded w-48 mb-8" />
      </div>

      <div className="flex gap-12 lg:gap-16 animate-pulse">
        <div className="hidden lg:block w-48 shrink-0 space-y-3">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-4/6" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-4/5" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
