import { AppShell } from "@/components/layout/app-shell";
import { PostForm } from "@/components/forms/post-form";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function DashboardNewPostPage() {
  const viewer = await requireUser({ onboarded: true });
  const data = await getDashboardData(viewer.id);

  return (
    <AppShell title="Dashboard" description="Create a new public, company-only, or private post." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="New Post"
        title="Create a PrismMTR post"
        description="Announcements, recruitment posts, showcases, and progress updates all run through the same structured publishing flow."
      />
      <PostForm companies={data.memberships} />
    </AppShell>
  );
}
