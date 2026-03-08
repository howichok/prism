import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable, type ModerationQueueRow } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationReportsPage() {
  const data = await getModerationOverviewData();
  const rows: ModerationQueueRow[] = data.reports.map((report) => ({
    id: report.id,
    title: report.reason,
    subtitle: report.details ?? `Report on ${report.targetType.toLowerCase()} ${report.targetId}`,
    status: report.status,
    targetType: "report" as const,
    submittedAt: report.createdAt,
    submittedBy: report.reporter.displayName,
    context: `Target ${report.targetType.toLowerCase()}`,
    href: null,
  }));

  return (
    <AppShell title="Moderation" description="Review user and company reports." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Reports"
        title="Report queue"
        description="Process member-submitted reports, mark actioned outcomes, and close review loops with a reliable status trail."
      />
      <ModerationQueueTable
        rows={rows}
        defaultFilter="report"
        showTypeFilters={false}
        emptyTitle="No reports are waiting"
        emptyDescription="Open and in-review reports will appear here until staff action resolves them."
      />
    </AppShell>
  );
}
