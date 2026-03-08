import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/platform/page-header";
import { IdentityPanel, ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { Button } from "@/components/ui/button";
import { dashboardSidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function DashboardProfilePage() {
  const viewer = await requireUser({ onboarded: true });
  const primaryMembership = viewer.companyMemberships[0] ?? null;

  return (
    <AppShell title="Dashboard" description="Manage your personal account surface." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Profile"
        title="Your public Prism identity"
        description="Update the member card that appears on hover profiles, company hubs, and public discovery."
        actions={
          viewer.username ? (
            <Button variant="outline" render={<Link href={`/users/${viewer.username}`} />}>
              View public profile
            </Button>
          ) : null
        }
      />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-6">
          <ProfileForm viewer={viewer} />
        </section>

        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <ProfileIdentitySurface
            user={{
              id: viewer.id,
              username: viewer.username,
              displayName: viewer.displayName ?? viewer.username ?? viewer.discordUsername ?? "Prism member",
              discordUsername: viewer.discordUsername,
              minecraftNickname: viewer.minecraftNickname,
              bio: viewer.bio,
              avatarUrl: viewer.avatarUrl,
              bannerUrl: viewer.bannerUrl,
              accentColor: viewer.accentColor,
              siteRole: viewer.siteRole,
              createdAt: viewer.createdAt,
              badges: viewer.userBadges.map((entry) => entry.badge),
              memberships: viewer.companyMemberships.map((membership) => ({
                companyRole: membership.companyRole,
                joinedAt: membership.joinedAt,
                company: membership.company,
              })),
            }}
            companyRole={primaryMembership?.companyRole}
            primaryCompany={primaryMembership?.company}
            variant="preview"
            headerLabel="Preview"
          />

          <IdentityPanel title="Profile reach">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Your display name, handle, bio, and linked Minecraft nickname flow into member discovery and hover identity cards.</p>
              <p>Site role and company role styling stay consistent across the mini profile, public page, and internal workspaces.</p>
            </div>
          </IdentityPanel>
        </aside>
      </div>
    </AppShell>
  );
}
