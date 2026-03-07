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
        <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
          <div className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Queue summary</div>
          <div className="mt-4 space-y-3 text-sm text-white/62">
            <div>{data.companies.length} companies pending</div>
            <div>{data.posts.length} posts pending</div>
            <div>{data.reports.length} reports open</div>
          </div>
        </div>
      }
    >
      <PageHeader
        eyebrow="Moderation"
        title="Staff overview"
        description="Review public-facing changes before they land in discovery and process reports with clear status transitions."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Companies", value: data.companies.length },
          { label: "Posts", value: data.posts.length },
          { label: "Reports", value: data.reports.length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{stat.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
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
