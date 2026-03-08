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
    <AppShell title="Dashboard" description="Manage linked accounts and access settings." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Settings"
        title="Network settings"
        description="A lighter account shell for identity, company access, publishing, moderation, and integration readiness."
      />

      <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        <aside className="hidden xl:block xl:sticky xl:top-28 xl:self-start">
          <div className="space-y-1 border-r border-white/8 pr-5">
            <div className="panel-label px-3 pb-3">Settings</div>
            {settingsNav.map((item) => (
              <a
                key={item}
                href={`#${slugifySection(item)}`}
                className="block rounded-[0.85rem] px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-10">
          <section id="my-account" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">My Account</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Primary account surface</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                PrismMTR keeps Discord as the primary identity source. Profile, company access, moderation, and future launcher readiness build on that account layer.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-3 border-b border-white/8 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Primary sign-in</div>
                  <div className="mt-1 text-sm text-muted-foreground">{linkedDiscord ? "Discord connected" : "Discord not detected"}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/48">{viewer.discordUsername ?? "No Discord username"}</div>
              </div>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Profile editing</div>
                  <div className="mt-1 text-sm text-muted-foreground">Display name, handle, bio, and Minecraft nickname live in the profile workspace.</div>
                </div>
                <Button variant="outline" render={<Link href="/dashboard/profile" />}>
                  Open profile
                </Button>
              </div>
            </div>
          </section>

          <section id="identity-profile" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">Identity &amp; Profile</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Presence across the network</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: "Display name", value: viewer.displayName ?? "Not set" },
                { label: "Handle", value: viewer.username ? `@${viewer.username}` : "Not set" },
                { label: "Minecraft nickname", value: viewer.minecraftNickname ?? "Not linked yet" },
                { label: "Email", value: viewer.email ?? "Optional / empty" },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1 border-b border-white/8 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{row.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">Used where relevant across hover identity, discovery, and public member pages.</div>
                  </div>
                  <div className="text-sm text-white">{row.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="privacy-security" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">Privacy &amp; Security</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Authentication boundaries</h2>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Password flow",
                  body: "Reserved for future use. Discord remains the active authentication source in this MVP.",
                },
                {
                  label: "Public profile visibility",
                  body: "Your public member page stays discoverable when a username is set and content is visible.",
                },
                {
                  label: "Role boundaries",
                  body: "Moderator and admin tools appear only when your site role explicitly allows them.",
                },
              ].map((row) => (
                <div key={row.label} className="border-b border-white/8 py-4 last:border-b-0">
                  <div className="text-sm font-medium text-white">{row.label}</div>
                  <div className="mt-1 max-w-2xl text-sm leading-7 text-muted-foreground">{row.body}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="company-workspace" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">Company Workspace</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Where company access lives</h2>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-3 border-b border-white/8 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Memberships</div>
                  <div className="mt-1 text-sm text-muted-foreground">{viewer.companyMemberships.length} visible company membership(s).</div>
                </div>
                <Button
                  variant="outline"
                  render={<Link href={primaryMembership ? `/dashboard/company/${primaryMembership.company.slug}` : "/dashboard/company/create"} />}
                >
                  {primaryMembership ? "Open company hub" : "Create company hub"}
                </Button>
              </div>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Directory access</div>
                  <div className="mt-1 text-sm text-muted-foreground">Browse public companies before joining or creating one.</div>
                </div>
                <Button variant="secondary" render={<Link href="/companies" />}>
                  Company directory
                </Button>
              </div>
            </div>
          </section>

          <section id="publishing" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">Publishing</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Public posts and internal publishing flow</h2>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-3 border-b border-white/8 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Post studio</div>
                  <div className="mt-1 text-sm text-muted-foreground">Create announcements, showcases, recruitment posts, and updates.</div>
                </div>
                <Button variant="outline" render={<Link href="/dashboard/posts/new" />}>
                  Create post
                </Button>
              </div>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-white">My posts</div>
                  <div className="mt-1 text-sm text-muted-foreground">Manage authored posts and their review status.</div>
                </div>
                <Button variant="secondary" render={<Link href="/dashboard/posts" />}>
                  Open posts
                </Button>
              </div>
            </div>
          </section>

          <section id="integrations" className="space-y-5 border-b border-white/8 pb-8">
            <div>
              <div className="panel-label">Integrations</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Connected identity providers</h2>
            </div>
            <div className="space-y-2">
              {viewer.linkedAccounts.length ? (
                viewer.linkedAccounts.map((account) => (
                  <div key={account.id} className="flex flex-col gap-1 border-b border-white/8 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{account.provider}</div>
                      <div className="mt-1 text-sm text-muted-foreground">Connected identity provider used by PrismMTR.</div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/48">
                      {account.providerAccountId ? account.providerAccountId : "Connected"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-sm text-muted-foreground">No linked accounts recorded for this session.</div>
              )}
              <div className="border-b border-white/8 py-4 text-sm text-muted-foreground">
                Microsoft linkage and launcher account handoff remain future-ready and deliberately separate from this MVP.
              </div>
            </div>
          </section>

          <section id="devices-sessions" className="space-y-5">
            <div>
              <div className="panel-label">Devices / Sessions</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Current session model</h2>
            </div>
            <div className="space-y-2">
              <div className="border-b border-white/8 py-4 text-sm leading-7 text-muted-foreground">
                This MVP keeps the session model intentionally simple: Discord sign-in, local guest mode, and server-enforced route checks.
              </div>
            </div>
          </section>

          {canAccessModeration(viewer.siteRole) ? (
            <section id="moderator-tools" className="space-y-5 border-t border-white/8 pt-8">
              <div>
                <div className="panel-label">Moderator Tools</div>
                <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Staff queue and review surface</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm leading-7 text-muted-foreground">
                  Open the staff inbox for moderation queues, company approvals, post review, and reports.
                </div>
                <Button variant="outline" render={<Link href="/moderation" />}>
                  Open moderation
                </Button>
              </div>
            </section>
          ) : null}

          {viewer.siteRole === SiteRole.ADMIN ? (
            <section id="admin-tools" className="space-y-5 border-t border-white/8 pt-8">
              <div>
                <div className="panel-label">Admin Tools</div>
                <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Administrative control</h2>
              </div>
              <div className="text-sm leading-7 text-muted-foreground">
                Admin role keeps full platform override power. Continue into the moderation workspace for actual admin review actions.
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <ProfileIdentitySurface
            user={previewUser}
            companyRole={primaryMembership?.companyRole}
            primaryCompany={primaryMembership?.company}
            variant="preview"
            headerLabel="Settings preview"
          />

          <IdentityPanel title="Workspace summary">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-[0.85rem] border border-white/8 bg-background/65 px-3 py-2.5">
                <span>Linked accounts</span>
                <span className="font-medium text-white">{viewer.linkedAccounts.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[0.85rem] border border-white/8 bg-background/65 px-3 py-2.5">
                <span>Company memberships</span>
                <span className="font-medium text-white">{viewer.companyMemberships.length}</span>
              </div>
              {staffOverview ? (
                <div className="flex items-center justify-between rounded-[0.85rem] border border-white/8 bg-background/65 px-3 py-2.5">
                  <span>Pending staff items</span>
                  <span className="font-medium text-white">
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
