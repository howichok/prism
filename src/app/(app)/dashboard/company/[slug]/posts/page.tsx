import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { Button } from "@/components/ui/button";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyPostsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:posts] Failed to load company posts.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell title="Company Hub" description="Company posts, announcements, showcases, and progress updates." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Posts are temporarily unavailable"
          description="The company post stream could not load right now."
          action={
            <Button size="sm" render={<Link href={`/dashboard/company/${slug}`} />}>
              Return to company hub
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (!data || !data.currentMembership) {
    notFound();
  }

  return (
    <AppShell
      title={data.company.name}
      description="Company posts, announcements, showcases, and progress updates."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Posts"
        title="Company post stream"
        description="Public posts can enter moderation while internal updates remain available to members immediately."
      />
      <div className="space-y-4">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </AppShell>
  );
}
