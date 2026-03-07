import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardPostsPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id);

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
