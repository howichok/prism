import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { ApplicationCard } from "@/components/platform/application-card";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { canReviewApplications } from "@/lib/permissions";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyApplicationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:applications] Failed to load company applications.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell title="Company Hub" description="Join requests and application review flow." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Applications are temporarily unavailable"
          description="PrismMTR could not load the company application queue right now."
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
