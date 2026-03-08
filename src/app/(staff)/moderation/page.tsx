import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable, type ModerationQueueRow } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationPage() {
  const data = await getModerationOverviewData();
  const rows: ModerationQueueRow[] = [
    ...data.companies.map((company) => ({
      id: company.id,
      title: company.name,
      subtitle: company.description,
      status: company.status,
      targetType: "company" as const,
      submittedAt: company.createdAt,
      submittedBy: company.owner.displayName,
      context: `${company.privacy.toLowerCase()} company · ${company.recruitingStatus.toLowerCase()} recruiting`,
      href: `/companies/${company.slug}`,
    })),
    ...data.posts.map((post) => ({
      id: post.id,
      title: post.title,
      subtitle: post.excerpt ?? post.content,
      status: post.status,
      targetType: "post" as const,
      submittedAt: post.createdAt,
      submittedBy: post.author.displayName,
      context: post.company ? `For ${post.company.name}` : "Independent post",
      href: `/posts/${post.slug}`,
    })),
    ...data.reports.map((report) => ({
      id: report.id,
      title: report.reason,
      subtitle: report.details ?? `Report on ${report.targetType.toLowerCase()} ${report.targetId}`,
      status: report.status,
      targetType: "report" as const,
      submittedAt: report.createdAt,
      submittedBy: report.reporter.displayName,
      context: `Target ${report.targetType.toLowerCase()}`,
      href: null,
    })),
  ].sort((left, right) => right.submittedAt.getTime() - left.submittedAt.getTime());

  return (
    <AppShell title="Moderation" description="Staff queues for companies, posts, and reports." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Moderation"
        title="Staff overview"
        description="Review public-facing changes, process reports, and keep every active moderation queue in sync."
      />
      <ModerationQueueTable
        rows={rows}
        showOverview
        emptyTitle="All active queues are clear"
        emptyDescription="Companies, posts, and reports are already processed. New items will land here automatically."
      />
    </AppShell>
  );
}
