import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AISettings } from "@/components/settings/ai-settings";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-6">
      <DashboardNav user={session.user} />
      <div className="mt-8">
        <AISettings />
      </div>
    </div>
  );
}
