import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { ApplicationCard } from "@/components/platform/application-card";
import { PageHeader } from "@/components/platform/page-header";
import { canReviewApplications } from "@/lib/permissions";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyApplicationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id);

  if (!data || !data.currentMembership) {
    notFound();
  }
  const currentMembership = data.currentMembership;

  return (
    <AppShell
      title={data.company.name}
      description="Join requests and application review flow."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Applications"
        title="Review incoming applications"
        description="Trusted members and above can help moderate company-level intake without exposing owner-only settings."
      />
      <div className="space-y-4">
        {data.applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            canReview={canReviewApplications(currentMembership.companyRole)}
          />
        ))}
      </div>
    </AppShell>
  );
}
