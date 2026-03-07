import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationPage() {
  const data = await getModerationOverviewData();

  return (
    <AppShell
      title="Moderation"
      description="Staff queues for companies, posts, and reports."
      items={moderationSidebarItems}
      rail={
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Queue summary</div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span>Companies</span>
              <span className="font-medium text-foreground">{data.companies.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span>Posts</span>
              <span className="font-medium text-foreground">{data.posts.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span>Reports</span>
              <span className="font-medium text-foreground">{data.reports.length}</span>
            </div>
          </div>
        </div>
      }
    >
      <PageHeader
        eyebrow="Moderation"
        title="Staff overview"
        description="Review public-facing changes and process reports with clear status transitions."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Companies", value: data.companies.length },
          { label: "Posts", value: data.posts.length },
          { label: "Reports", value: data.reports.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>
      <ModerationQueueTable
        rows={[
          ...data.companies.map((company) => ({
            id: company.id,
            title: company.name,
            subtitle: company.description,
            status: company.status,
            targetType: "company" as const,
          })),
          ...data.posts.map((post) => ({
            id: post.id,
            title: post.title,
            subtitle: post.excerpt ?? post.content,
            status: post.status,
            targetType: "post" as const,
          })),
        ]}
      />
    </AppShell>
  );
}
