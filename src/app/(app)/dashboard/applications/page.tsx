import { AppShell } from "@/components/layout/app-shell";
import { BuildRequestForm } from "@/components/forms/build-request-form";
import { BuildRequestCard } from "@/components/platform/build-request-card";
import { PageHeader } from "@/components/platform/page-header";
import { StatusBadge } from "@/components/platform/status-badge";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardApplicationsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id);

  return (
    <AppShell title="Dashboard" description="Track join requests and build request submissions." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Applications"
        title="Requests and applications"
        description="Submit build requests, track your company applications, and keep an eye on recruitment activity."
      />
      <BuildRequestForm companies={data.memberships} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-white">My build requests</h2>
          {data.buildRequests.map((request) => (
            <BuildRequestCard key={request.id} request={request} />
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-white">Company applications</h2>
          {data.companyApplications.map((application) => (
            <div key={application.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-semibold text-white">{application.company.name}</div>
                <StatusBadge status={application.status} />
              </div>
              <p className="mt-3 text-sm leading-7 text-white/60">{application.message}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
