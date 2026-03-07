import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, Shield } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyForm } from "@/components/forms/company-form";
import { CompanyRail } from "@/components/platform/company-rail";
import { EmptyState } from "@/components/platform/empty-state";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";
import { canEditCompanySettings } from "@/lib/permissions";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanySettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:settings] Failed to load company settings context.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (data === null) {
    return (
      <AppShell
        title="Company Hub"
        description="Manage company profile, recruitment state, and moderation-sensitive settings."
        items={getCompanySidebarItems(slug)}
      >
        <EmptyState
          icon={ClipboardList}
          title="Settings are temporarily unavailable"
          description="The company settings workspace failed before PrismMTR could load editable company data."
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

  const canEdit = canEditCompanySettings(data.currentMembership.companyRole);

  return (
    <AppShell
      title={data.company.name}
      description="Manage company profile, recruitment state, and moderation-sensitive settings."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership.companyRole} />}
    >
      <PageHeader
        eyebrow="Settings"
        title="Company settings"
        description="Public-facing changes can move the company back into moderation review to keep discovery reliable."
      />
      {canEdit ? (
        <CompanyForm
          mode="edit"
          companyId={data.company.id}
          initialValues={{
            name: data.company.name,
            slug: data.company.slug,
            description: data.company.description,
            privacy: data.company.privacy,
            recruitingStatus: data.company.recruitingStatus,
            tags: data.company.tags,
            brandColor: data.company.brandColor ?? "#55d4ff",
          }}
        />
      ) : (
        <EmptyState
          icon={Shield}
          title="Settings are restricted"
          description="Only co-owners and the owner can edit company settings."
        />
      )}
    </AppShell>
  );
}
