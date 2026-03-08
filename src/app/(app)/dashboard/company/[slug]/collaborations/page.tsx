import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, Handshake } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyCollaborationWorkspace } from "@/components/platform/company-collaboration-workspace";
import { CompanyRail } from "@/components/platform/company-rail";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { getCompanyCollaborationWorkspaceData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyCollaborationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getCompanyCollaborationWorkspaceData>> | false = false;

  try {
    data = await getCompanyCollaborationWorkspaceData(slug, {
      id: viewer.id,
      siteRole: viewer.siteRole,
    });
  } catch (error) {
    console.error("[company-hub:collaborations] Failed to load collaboration workspace.", {
      slug,
      userId: viewer.id,
      error,
    });
  }

  if (data === false) {
    return (
      <AppShell title="Company Hub" description="Manage official company collaborations." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Collaborations are temporarily unavailable"
          description="PrismMTR could not load collaboration records for this company right now."
          action={
            <Button size="sm" render={<Link href={`/dashboard/company/${slug}`} />}>
              Return to company hub
            </Button>
          }
        />
      </AppShell>
    );
  }

  if (!data) {
    notFound();
  }

  return (
    <AppShell
      title={data.company.name}
      description="Manage official company collaborations."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership?.companyRole} />}
    >
      <PageHeader
        eyebrow="Collaborations"
        title={`${data.company.name} collaboration graph`}
        description="Review active company partnerships, respond to incoming requests, and manage outgoing collaboration links from one controlled workspace."
        actions={
          <Button variant="outline" render={<Link href={`/companies/${slug}`} />}>
            <Handshake className="size-4" />
            View public company page
          </Button>
        }
      />
      <CompanyCollaborationWorkspace
        company={data.company}
        canManageCollaborations={data.canManageCollaborations}
        isAdmin={viewer.siteRole === "ADMIN"}
        availableTargets={data.availableTargets}
        collaborations={data.collaborations}
      />
    </AppShell>
  );
}
