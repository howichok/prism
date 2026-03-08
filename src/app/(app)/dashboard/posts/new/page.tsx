import Link from "next/link";
import { FilePenLine } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PostForm } from "@/components/forms/post-form";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getPostCreationContext } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardNewPostPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getPostCreationContext(viewer.id).catch((error) => {
    console.error("[dashboard:new-post] Failed to load post creation context.", {
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell title="Dashboard" description="Create a new public, company-only, or private post." items={dashboardSidebarItems}>
        <EmptyState
          icon={FilePenLine}
          title="Post creation is temporarily unavailable"
          description="The publishing workspace could not load company context for this account."
          action={
            <Button size="sm" render={<Link href="/dashboard/posts" />}>
              Open posts
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard" description="Create a new public, company-only, or private post." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="New Post"
        title="Create a PrismMTR post"
        description="Start with the post basics, then choose where it belongs and how it should be published."
      />
      <PostForm companies={data.memberships} />
    </AppShell>
  );
}
