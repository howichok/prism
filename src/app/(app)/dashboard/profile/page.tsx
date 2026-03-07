import { AppShell } from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardProfilePage() {
  const viewer = await requireUser({ onboarded: true });

  return (
    <AppShell title="Dashboard" description="Manage your personal account surface." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Profile"
        title="Your public Prism identity"
        description="Update the member card that appears on hover profiles, company hubs, and public discovery."
      />
      <ProfileForm viewer={viewer} />
    </AppShell>
  );
}
