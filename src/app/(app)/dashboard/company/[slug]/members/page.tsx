import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyMembersWorkspace } from "@/components/platform/company-members-workspace";
import { CompanyRail } from "@/components/platform/company-rail";
import { PageHeader } from "@/components/platform/page-header";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyMembersPage({ params }: { params: Promise<{ slug: string }> }) {
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
