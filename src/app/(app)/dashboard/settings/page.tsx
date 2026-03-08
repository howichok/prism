import Link from "next/link";
import { SiteRole } from "@prisma/client";

import { AppShell } from "@/components/layout/app-shell";
import { getModerationOverviewData } from "@/lib/data";
import { dashboardSidebarItems } from "@/lib/navigation";
import { canAccessModeration } from "@/lib/permissions";
import { requireUser } from "@/lib/session";
import { IdentityPanel, ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { PageHeader } from "@/components/platform/page-header";
import { Button } from "@/components/ui/button";

function slugifySection(label: string) {
  return label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
}

export default async function DashboardSettingsPage() {
  const viewer = await requireUser({ onboarded: true });
  const primaryMembership = viewer.companyMemberships[0] ?? null;
  const staffOverview = canAccessModeration(viewer.siteRole)
    ? await getModerationOverviewData().catch((error) => {
        console.error("[settings] Failed to load moderation preview.", {
          userId: viewer.id,
          error,
        });
        return null;
      })
    : null;

  const settingsNav = [
    "My Account",
    "Identity & Profile",
    "Privacy & Security",
    "Company Workspace",
    "Publishing",
    "Integrations",
    "Devices / Sessions",
    ...(canAccessModeration(viewer.siteRole) ? ["Moderator Tools"] : []),
    ...(viewer.siteRole === SiteRole.ADMIN ? ["Admin Tools"] : []),
  ];

  const linkedDiscord = viewer.linkedAccounts.find((account) => account.provider === "DISCORD");
  const previewUser = {
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
  };

  return (
    <AppShell title="Dashboard" description="Account and workspace settings." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your account, identity, integrations, and workspace preferences."
      />

      <div className="grid gap-8 xl:grid-cols-[200px_minmax(0,1fr)_280px]">
        {/* Settings nav */}
        <aside className="hidden xl:block xl:sticky xl:top-28 xl:self-start">
          <nav className="space-y-0.5 border-r border-white/6 pr-4">
            {settingsNav.map((item) => (
              <a
                key={item}
                href={`#${slugifySection(item)}`}
                className="block rounded-lg px-3 py-2 text-[13px] text-white/50 transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Settings content */}
        <div className="space-y-8">
          <section id="my-account" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">My Account</h2>
            <div className="space-y-1">
              <SettingsRow
                label="Primary sign-in"
                value={linkedDiscord ? "Discord connected" : "Not connected"}
                detail={viewer.discordUsername ?? undefined}
              />
              <SettingsRow
                label="Profile editing"
                value="Display name, handle, bio, avatar"
                action={<Button variant="outline" size="sm" render={<Link href="/dashboard/profile" />}>Open profile</Button>}
              />
            </div>
          </section>

          <section id="identity-profile" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">Identity & Profile</h2>
            <div className="space-y-1">
              <SettingsRow label="Display name" value={viewer.displayName ?? "Not set"} />
              <SettingsRow label="Handle" value={viewer.username ? `@${viewer.username}` : "Not set"} />
              <SettingsRow label="Minecraft nickname" value={viewer.minecraftNickname ?? "Not linked"} />
              <SettingsRow label="Email" value={viewer.email ?? "Not set"} />
            </div>
          </section>

          <section id="privacy-security" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">Privacy & Security</h2>
            <div className="space-y-1">
              <SettingsRow label="Password" value="Discord-only authentication (MVP)" />
              <SettingsRow label="Profile visibility" value="Public when username is set" />
              <SettingsRow label="Role boundaries" value="Tools appear based on site role" />
            </div>
          </section>

          <section id="company-workspace" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">Company Workspace</h2>
            <div className="space-y-1">
              <SettingsRow
                label="Memberships"
                value={`${viewer.companyMemberships.length} active`}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={primaryMembership ? `/dashboard/company/${primaryMembership.company.slug}` : "/dashboard/company/create"} />}
                  >
                    {primaryMembership ? "Open hub" : "Create hub"}
                  </Button>
                }
              />
              <SettingsRow
                label="Directory"
                value="Browse and join public companies"
                action={<Button variant="secondary" size="sm" render={<Link href="/companies" />}>Browse</Button>}
              />
            </div>
          </section>

          <section id="publishing" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">Publishing</h2>
            <div className="space-y-1">
              <SettingsRow
                label="Post studio"
                value="Create and manage posts"
                action={<Button variant="outline" size="sm" render={<Link href="/dashboard/posts/new" />}>New post</Button>}
              />
              <SettingsRow
                label="My posts"
                value="View and manage authored posts"
                action={<Button variant="secondary" size="sm" render={<Link href="/dashboard/posts" />}>View</Button>}
              />
            </div>
          </section>

          <section id="integrations" className="space-y-4 border-b border-white/6 pb-6">
            <h2 className="text-sm font-medium text-white">Integrations</h2>
            <div className="space-y-1">
              {viewer.linkedAccounts.length ? (
                viewer.linkedAccounts.map((account) => (
                  <SettingsRow
                    key={account.id}
                    label={account.provider}
                    value="Connected"
                    detail={account.providerAccountId ?? undefined}
                  />
                ))
              ) : (
                <div className="py-3 text-sm text-white/35">No linked accounts.</div>
              )}
            </div>
          </section>

          <section id="devices-sessions" className="space-y-4">
            <h2 className="text-sm font-medium text-white">Devices / Sessions</h2>
            <div className="py-2 text-sm text-white/40">
              Simple session model: Discord sign-in with server-enforced route checks.
            </div>
          </section>

          {canAccessModeration(viewer.siteRole) ? (
            <section id="moderator-tools" className="space-y-4 border-t border-white/6 pt-6">
              <h2 className="text-sm font-medium text-white">Moderator Tools</h2>
              <SettingsRow
                label="Staff inbox"
                value="Moderation queues, approvals, and reports"
                action={<Button variant="outline" size="sm" render={<Link href="/moderation" />}>Open</Button>}
              />
            </section>
          ) : null}

          {viewer.siteRole === SiteRole.ADMIN ? (
            <section id="admin-tools" className="space-y-4 border-t border-white/6 pt-6">
              <h2 className="text-sm font-medium text-white">Admin Tools</h2>
              <div className="py-2 text-sm text-white/40">
                Full platform override via the moderation workspace.
              </div>
            </section>
          ) : null}
        </div>

        {/* Right preview */}
        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <ProfileIdentitySurface
            user={previewUser}
            companyRole={primaryMembership?.companyRole}
            primaryCompany={primaryMembership?.company}
            variant="preview"
            headerLabel="Profile preview"
          />

          <IdentityPanel title="Summary">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-white/40">
                <span>Linked accounts</span>
                <span className="text-white">{viewer.linkedAccounts.length}</span>
              </div>
              <div className="flex items-center justify-between text-white/40">
                <span>Company memberships</span>
                <span className="text-white">{viewer.companyMemberships.length}</span>
              </div>
              {staffOverview ? (
                <div className="flex items-center justify-between text-white/40">
                  <span>Pending staff items</span>
                  <span className="text-white">
                    {staffOverview.companies.length + staffOverview.posts.length + staffOverview.reports.length}
                  </span>
                </div>
              ) : null}
            </div>
          </IdentityPanel>
        </aside>
      </div>
    </AppShell>
  );
}

function SettingsRow({
  label,
  value,
  detail,
  action,
}: {
  label: string;
  value: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-white/[0.04] py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm text-white/80">{label}</div>
        <div className="mt-0.5 text-xs text-white/35">{value}</div>
      </div>
      {detail ? (
        <div className="text-xs text-white/25">{detail}</div>
      ) : action ? (
        action
      ) : null}
    </div>
  );
}
