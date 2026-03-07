import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { InviteGenerator } from "@/components/forms/invite-generator";
import { CompanyRail } from "@/components/platform/company-rail";
import { EmptyState } from "@/components/platform/empty-state";
import { InviteCard } from "@/components/platform/invite-card";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { canManageInvites } from "@/lib/permissions";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyInvitesPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:invites] Failed to load company invites.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell title="Company Hub" description="Generate and manage invite codes." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Invites are temporarily unavailable"
          description="The invite workspace failed before PrismMTR could load the current company invite list."
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
      description="Generate and manage invite codes."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Invites"
        title="Invite members"
        description="Generate expiration-bound codes and keep membership growth deliberate."
      />
      {canManageInvites(data.currentMembership.companyRole) ? <InviteGenerator companyId={data.company.id} /> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {data.invites.map((invite) => (
          <InviteCard key={invite.id} invite={invite} />
        ))}
      </div>
    </AppShell>
  );
}
