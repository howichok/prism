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
        description="Notifications cover company membership updates, moderation events, and post workflows."
      />
      <div className="space-y-3">
        {data.notifications.map((notification) => (
          <div key={notification.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">{notification.title}</span>
              {notification.readAt ? null : <span className="size-2 rounded-full bg-primary" />}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{notification.body}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
