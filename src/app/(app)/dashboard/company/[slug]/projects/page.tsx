import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { BuildRequestCard } from "@/components/platform/build-request-card";
import { PageHeader } from "@/components/platform/page-header";
import { ProjectCard } from "@/components/platform/project-card";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id);

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
