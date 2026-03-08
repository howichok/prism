import Link from "next/link";
import { ClipboardList, PlusSquare } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { Button } from "@/components/ui/button";
import { getDashboardPostsWorkspace } from "@/lib/data";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardPostsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardPostsWorkspace(viewer.id).catch((error) => {
    console.error("[dashboard:posts] Failed to load authored posts.", {
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell title="Dashboard" description="Create and track your personal and company posts." items={dashboardSidebarItems}>
        <EmptyState
          icon={ClipboardList}
          title="Posts are temporarily unavailable"
          description="PrismMTR could not load the post workspace for this account right now."
          action={
            <Button size="sm" render={<Link href="/dashboard" />}>
              Return to dashboard
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" description="Create and track your personal and company posts." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Posts"
        title="Publish updates and announcements"
        description="Public posts flow into moderation when needed, while company-only updates stay inside the hub."
        actions={
          <Button render={<Link href="/dashboard/posts/new" />}>
            <PlusSquare className="size-4" />
            New Post
          </Button>
        }
      />
      <div className="space-y-4">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </AppShell>
  );
}
