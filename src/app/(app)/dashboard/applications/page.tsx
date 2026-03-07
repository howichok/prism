import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { BuildRequestForm } from "@/components/forms/build-request-form";
import { BuildRequestCard } from "@/components/platform/build-request-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardApplicationsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id).catch((error) => {
    console.error("[dashboard:applications] Failed to load dashboard application data.", {
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell title="Dashboard" description="Track join requests and build request submissions." items={dashboardSidebarItems}>
        <EmptyState
          icon={ClipboardList}
          title="Applications are temporarily unavailable"
          description="Your account is online, but the applications workspace could not load right now."
          action={
            <Button size="sm" render={<Link href="/dashboard" />}>
              Return to dashboard
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" description="Track join requests and build request submissions." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Applications"
        title="Requests and applications"
        description="Submit build requests, track your company applications, and monitor recruitment activity."
      />
      <BuildRequestForm companies={data.memberships} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">My build requests</h2>
          {data.buildRequests.map((request) => (
            <BuildRequestCard key={request.id} request={request} />
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Company applications</h2>
          {data.companyApplications.map((application) => (
            <div key={application.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">{application.company.name}</span>
                <StatusBadge status={application.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{application.message}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
