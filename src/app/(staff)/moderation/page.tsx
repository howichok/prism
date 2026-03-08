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
  const newestRow = rows[0] ?? null;
  const queueFocus =
    data.reports.length > 0 ? "Reports need direct review first." :
    data.companies.length > 0 ? "Company approvals are waiting for staff." :
    data.posts.length > 0 ? "Posts are ready for publication review." :
    "No active moderation backlog right now.";

  return (
    <AppShell title="Moderation" description="Staff queues for companies, posts, and reports." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Moderation"
        title="Staff overview"
        description="Review public-facing changes, process reports, and keep every active moderation queue in sync."
      />
      <section className="surface-panel-soft px-5 py-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
          <div>
            <div className="panel-label">Queue focus</div>
            <p className="mt-2 text-sm leading-7 text-white/74">{queueFocus}</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1rem] border border-white/8 bg-white/[0.02] sm:grid-cols-2">
            <div className="px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/42">Open queue</div>
              <div className="mt-2 font-display text-[1.75rem] leading-none text-white">{rows.length}</div>
              <div className="mt-1 text-xs text-white/44">Total items needing staff attention</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/42">Latest item</div>
              <div className="mt-2 text-sm font-medium text-white">{newestRow ? newestRow.title : "Queue is clear"}</div>
              <div className="mt-1 text-xs text-white/44">{newestRow ? newestRow.targetType : "No pending review"}</div>
            </div>
          </div>
        </div>
      </section>
      <ModerationQueueTable
        rows={rows}
        showOverview
        emptyTitle="All active queues are clear"
        emptyDescription="Companies, posts, and reports are already processed. New items will land here automatically."
      />
    </AppShell>
  );
}
