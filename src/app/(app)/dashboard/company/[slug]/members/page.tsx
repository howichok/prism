import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyMembersWorkspace } from "@/components/platform/company-members-workspace";
import { CompanyRail } from "@/components/platform/company-rail";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyMembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:members] Failed to load company members.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell title="Company Hub" description="Manage company members and roles." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Roster is temporarily unavailable"
          description="PrismMTR could not load the company member workspace right now."
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
      description="Manage company members and roles."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Members"
        title={`${data.company.name} roster`}
        description="Searchable member lists and hover profiles define the social identity of the company hub."
      />
      <CompanyMembersWorkspace company={data.company} currentRole={currentMembership.companyRole} members={data.members} />
    </AppShell>
  );
}
