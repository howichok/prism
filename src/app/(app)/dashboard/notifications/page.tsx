import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardNotificationsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id);

  return (
    <AppShell title="Dashboard" description="Notifications across companies, moderation, and recruitment." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Notifications"
        title="Your Prism inbox"
        description="Notifications cover company membership updates, moderation events, recruitment activity, and post workflows."
      />
      <div className="space-y-4">
        {data.notifications.map((notification) => (
          <div key={notification.id} className="rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
            <div className="text-lg font-semibold text-white">{notification.title}</div>
            <p className="mt-2 text-sm leading-7 text-white/60">{notification.body}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
