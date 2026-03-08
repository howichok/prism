import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable, type ModerationQueueRow } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationCompaniesPage() {
  const data = await getModerationOverviewData();
  const rows: ModerationQueueRow[] = data.companies.map((company) => ({
    id: company.id,
    title: company.name,
    subtitle: company.description,
    status: company.status,
    targetType: "company" as const,
    submittedAt: company.createdAt,
    submittedBy: company.owner.displayName,
    context: `${company.privacy.toLowerCase()} company · ${company.recruitingStatus.toLowerCase()} recruiting`,
    href: `/companies/${company.slug}`,
  }));

  return (
    <AppShell title="Moderation" description="Review new companies and important public-facing changes." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Companies"
        title="Company moderation queue"
        description="Review company submissions, approve trustworthy public hubs, and reject or archive items that should not enter discovery."
      />
      <ModerationQueueTable
        rows={rows}
        defaultFilter="company"
        showTypeFilters={false}
        emptyTitle="No companies are waiting"
        emptyDescription="New company submissions will appear here when they reach staff review."
      />
    </AppShell>
  );
}
