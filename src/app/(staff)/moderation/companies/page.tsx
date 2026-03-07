import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationCompaniesPage() {
  const data = await getModerationOverviewData();

  return (
    <AppShell title="Moderation" description="Review new companies and important public-facing changes." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Companies"
        title="Company moderation queue"
        description="New companies and sensitive public profile changes move through this review step."
      />
      <ModerationQueueTable
        rows={data.companies.map((company) => ({
          id: company.id,
          title: company.name,
          subtitle: company.description,
          status: company.status,
          targetType: "company" as const,
        }))}
      />
    </AppShell>
  );
}
