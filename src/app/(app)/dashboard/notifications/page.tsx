import Link from "next/link";
import { BellOff, Shield } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/platform/empty-state";
import { ModerationQueueTable } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getDashboardData, getModerationOverviewData } from "@/lib/data";
import { canAccessModeration } from "@/lib/permissions";
import { requireUser } from "@/lib/session";

export default async function DashboardNotificationsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id).catch((error) => {
    console.error("[dashboard:notifications] Failed to load notifications.", {
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell title="Dashboard" description="Notifications across companies, moderation, and recruitment." items={dashboardSidebarItems}>
        <EmptyState
          icon={BellOff}
          title="Notifications are temporarily unavailable"
          description="The inbox request failed, so PrismMTR could not load notification history for this account."
          action={
            <Button size="sm" render={<Link href="/dashboard" />}>
              Return to dashboard
            </Button>
          }
        />
      </AppShell>
    );
  }

  const staffInbox = canAccessModeration(viewer.siteRole)
    ? await getModerationOverviewData().catch((error) => {
        console.error("[dashboard:notifications] Failed to load moderation inbox.", {
          userId: viewer.id,
          error,
        });
        return null;
      })
    : null;
  const staffRows = staffInbox
    ? [
        ...staffInbox.companies.map((company) => ({
          id: company.id,
          title: company.name,
          subtitle: company.description,
          status: company.status,
          targetType: "company" as const,
        })),
        ...staffInbox.posts.map((post) => ({
          id: post.id,
          title: post.title,
          subtitle: post.excerpt ?? post.content,
          status: post.status,
          targetType: "post" as const,
        })),
        ...staffInbox.reports.map((report) => ({
          id: report.id,
          title: report.reason,
          subtitle: report.details ?? `${report.targetType} · ${report.targetId}`,
          status: report.status,
          targetType: "report" as const,
        })),
      ]
    : [];

  return (
    <AppShell title="Dashboard" description="Notifications across companies, moderation, and recruitment." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Notifications"
        title="Your Prism inbox"
        description="Notifications cover company membership updates, moderation events, and post workflows."
        actions={
          staffInbox ? (
            <Button variant="outline" render={<Link href="/moderation" />}>
              <Shield className="size-4" />
              Open moderation
            </Button>
          ) : undefined
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-4">
          {staffInbox ? (
            <section className="surface-panel space-y-4 p-5">
              <div className="border-b border-white/8 pb-4">
                <div className="panel-label">Staff approvals</div>
                <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Moderation actions waiting</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  This inbox combines pending company approvals, post reviews, and report outcomes so staff can act without leaving the dashboard flow.
                </p>
              </div>
              {staffRows.length ? (
                <ModerationQueueTable rows={staffRows.slice(0, 8)} />
              ) : (
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                  No moderation items are waiting right now.
                </div>
              )}
            </section>
          ) : null}

          <section className="surface-panel space-y-4 p-5">
            <div className="border-b border-white/8 pb-4">
              <div className="panel-label">Personal inbox</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Account notifications</h2>
            </div>
            <div className="space-y-3">
              {data.notifications.length ? (
                data.notifications.map((notification) => (
                  <div key={notification.id} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{notification.title}</span>
                      {notification.readAt ? null : <span className="size-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{notification.body}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                  No personal notifications yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="surface-panel space-y-4 p-5">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Summary</div>
            <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">What needs attention</h2>
          </div>
          <div className="space-y-2">
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Unread notifications</div>
              <div className="mt-2 text-sm text-white">{data.notifications.filter((item) => !item.readAt).length}</div>
            </div>
            {staffInbox ? (
              <>
                <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Pending company approvals</div>
                  <div className="mt-2 text-sm text-white">{staffInbox.companies.length}</div>
                </div>
                <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Pending post reviews</div>
                  <div className="mt-2 text-sm text-white">{staffInbox.posts.length}</div>
                </div>
                <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Open reports</div>
                  <div className="mt-2 text-sm text-white">{staffInbox.reports.length}</div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
