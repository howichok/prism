import { AppShell } from "@/components/layout/app-shell";
import { ModerationQueueTable } from "@/components/platform/moderation-queue-table";
import { PageHeader } from "@/components/platform/page-header";
import { getModerationOverviewData } from "@/lib/data";
import { moderationSidebarItems } from "@/lib/navigation";

export default async function ModerationPostsPage() {
  const data = await getModerationOverviewData();

  return (
    <AppShell title="Moderation" description="Review pending public posts." items={moderationSidebarItems}>
      <PageHeader
        eyebrow="Posts"
        title="Post moderation queue"
        description="Approve, reject, or archive public posts before they appear in discovery."
      />
      <ModerationQueueTable
        rows={data.posts.map((post) => ({
          id: post.id,
          title: post.title,
          subtitle: post.excerpt ?? post.content,
          status: post.status,
          targetType: "post" as const,
        }))}
      />
    </AppShell>
  );
}
