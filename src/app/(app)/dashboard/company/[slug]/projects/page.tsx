import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { BuildRequestCard } from "@/components/platform/build-request-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { ProjectCard } from "@/components/platform/project-card";
import { Button } from "@/components/ui/button";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:projects] Failed to load company projects.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell title="Company Hub" description="Projects and build requests across the company." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Projects are temporarily unavailable"
          description="The company project workspace could not load right now."
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
      description="Projects and build requests across the company."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Projects"
        title="Company projects"
        description="Track internal and public-facing work, plus build requests that need recruitment or review."
      />
      <div className="space-y-4">
        {data.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-white">Build requests</h2>
        {data.buildRequests.map((request) => (
          <BuildRequestCard key={request.id} request={request} />
        ))}
      </div>
    </AppShell>
  );
}
