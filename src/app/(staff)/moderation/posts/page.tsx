import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable, type ModerationQueueRow } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationPostsPage() {
  const data = await getModerationOverviewData();
  const rows: ModerationQueueRow[] = data.posts.map((post) => ({
    id: post.id,
    title: post.title,
    subtitle: post.excerpt ?? post.content,
    status: post.status,
    targetType: "post" as const,
    submittedAt: post.createdAt,
    submittedBy: post.author.displayName,
    context: post.company ? `For ${post.company.name}` : "Independent post",
    href: `/posts/${post.slug}`,
  }));

  return (
    <AppShell title="Moderation" description="Review pending public posts." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Posts"
        title="Post moderation queue"
        description="Approve, reject, or archive public posts before they appear in discovery and public company surfaces."
      />
      <ModerationQueueTable
        rows={rows}
        defaultFilter="post"
        showTypeFilters={false}
        emptyTitle="No posts are waiting"
        emptyDescription="Posts that require public approval will appear here when they enter staff review."
      />
    </AppShell>
  );
}
