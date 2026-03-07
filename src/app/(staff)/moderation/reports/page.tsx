import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationReportsPage() {
  const data = await getModerationOverviewData();

  return (
    <AppShell title="Moderation" description="Review user and company reports." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Reports"
        title="Report queue"
        description="Process user-submitted reports and mark actioned, rejected, or resolved outcomes."
      />
      <ModerationQueueTable
        rows={data.reports.map((report) => ({
          id: report.id,
          title: report.reason,
          subtitle: report.details ?? `${report.targetType} · ${report.targetId}`,
          status: report.status,
          targetType: "report" as const,
        }))}
      />
    </AppShell>
  );
}
