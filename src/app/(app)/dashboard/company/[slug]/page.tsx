import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { ClipboardCheck, ClipboardList, FolderKanban, Handshake, Megaphone, Settings, UserRoundPlus, UsersRound } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/platform/empty-state";
import { FeedItem } from "@/components/platform/feed-item";
import { PageHeader } from "@/components/platform/page-header";
import { ProfileRosterRow } from "@/components/platform/profile-roster-row";
import { ProjectCard } from "@/components/platform/project-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { canEditCompanySettings, canManageInvites } from "@/lib/permissions";
import { requireUser } from "@/lib/session";

export default async function CompanyHubOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id).catch((error) => {
    console.error("[company-hub:overview] Failed to load company hub data.", {
      slug,
      userId: viewer.id,
      error,
    });
    return null;
  });

  if (!data) {
    return (
      <AppShell title="Company Hub" description="Company hub overview, feed, members, and work." items={getCompanySidebarItems(slug)}>
        <EmptyState
          icon={ClipboardList}
          title="Company hub is temporarily unavailable"
          description="The company workspace request failed before PrismMTR could load the hub surface."
          action={
            <Button size="sm" render={<Link href="/dashboard" />}>
              Return to dashboard
            </Button>
          }
        />
      </AppShell>
    );
  }

  const coOwners = data.members.filter((member) => member.companyRole === CompanyRole.CO_OWNER).slice(0, 3);
  const canManageCompanyInvites = Boolean(data.currentMembership && canManageInvites(data.currentMembership.companyRole));
  const canEditSettings = Boolean(data.currentMembership && canEditCompanySettings(data.currentMembership.companyRole));
  const managementPaths = [
    {
      href: `/dashboard/company/${slug}/members`,
      label: "Members",
      body: "Search the roster, inspect roles, and manage access.",
      icon: UsersRound,
    },
    {
      href: `/dashboard/company/${slug}/collaborations`,
      label: "Collaborations",
      body: "Track active partnerships, incoming requests, and outgoing links.",
      icon: Handshake,
    },
    {
      href: `/dashboard/company/${slug}/projects`,
      label: "Projects",
      body: "Track active work, build requests, and delivery status.",
      icon: FolderKanban,
    },
    {
      href: `/dashboard/company/${slug}/posts`,
      label: "Posts",
      body: "Keep announcements, recruitment, and updates visible.",
      icon: Megaphone,
    },
    {
      href: `/dashboard/company/${slug}/applications`,
      label: "Applications",
      body: "Review company intake and member requests in one flow.",
      icon: ClipboardCheck,
    },
    ...(canManageCompanyInvites
      ? [
          {
            href: `/dashboard/company/${slug}/invites`,
            label: "Invites",
            body: "Create or revoke invite codes without leaving the hub.",
            icon: UserRoundPlus,
          },
        ]
      : []),
    ...(canEditSettings
      ? [
          {
            href: `/dashboard/company/${slug}/settings`,
            label: "Settings",
            body: "Edit public company details and moderation-sensitive fields.",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <AppShell
      title={data.company.name}
      description="Company hub overview, feed, members, and work."
      items={getCompanySidebarItems(slug)}
    >
      <PageHeader
        eyebrow="Company Hub"
        title={`${data.company.name} operating hub`}
        description="Use the company workspace as one control surface for members, publishing, projects, applications, and invites."
        actions={
          <>
            <Button render={<Link href="/dashboard/posts/new" />}>
              <Megaphone className="size-4" />
              Create Post
            </Button>
            {data.currentMembership && canManageInvites(data.currentMembership.companyRole) ? (
              <Button variant="outline" render={<Link href={`/dashboard/company/${slug}/invites`} />}>
                <UserRoundPlus className="size-4" />
                Manage Invites
              </Button>
            ) : null}
          </>
        }
      />

      <section className="surface-panel-strong overflow-hidden p-0">
        <div
          className="h-32 border-b border-white/8 sm:h-36"
          style={{
            background: data.company.bannerUrl
              ? `url(${data.company.bannerUrl})`
              : data.company.brandColor ?? "#141414",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="p-6 sm:p-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4">
            <div
              className="flex size-20 items-center justify-center rounded-[1.25rem] border-[3px] border-[hsl(0_0%_5%)] text-[1.35rem] font-semibold text-white shadow-[0_28px_70px_-42px_rgba(0,0,0,0.92)]"
              style={{ background: data.company.brandColor ?? "#141414" }}
            >
              {data.company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-1">
              <div className="panel-label">Company workspace</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="font-display text-[2.1rem] leading-[0.95] text-white">{data.company.name}</div>
                <StatusBadge status={data.company.recruitingStatus} />
                <StatusBadge status={data.company.status} />
                {data.currentMembership ? <RoleBadge kind="company" role={data.currentMembership.companyRole} /> : null}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-5">
              <p className="max-w-3xl text-sm leading-8 text-muted-foreground">{data.company.description}</p>

              <div className="flex flex-wrap gap-2">
                {data.company.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/66"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Current role</div>
                <div className="mt-3">
                  {data.currentMembership ? (
                    <RoleBadge kind="company" role={data.currentMembership.companyRole} />
                  ) : (
                    <span className="text-sm text-muted-foreground">Public viewer</span>
                  )}
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Recruiting status</div>
                <div className="mt-3">
                  <StatusBadge status={data.company.recruitingStatus} />
                </div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  Public discovery reflects the current recruiting posture and moderation state of this company.
                </p>
              </div>
              <Button variant="outline" className="w-full" render={<Link href={`/companies/${slug}`} />}>
                View public company page
              </Button>
            </div>
          </div>

          <div className="motion-stagger mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Members", value: data.company.counts.members, body: "Visible roster and role structure." },
              { label: "Projects", value: data.company.counts.projects, body: "Active work tied to the company." },
              { label: "Posts", value: data.company.counts.posts, body: "Publishing surfaces inside and outside the hub." },
              { label: "Applications", value: data.applications.length, body: "Open intake waiting for review." },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{stat.label}</div>
                <div className="mt-3 font-display text-[2rem] leading-none text-white">{stat.value}</div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{stat.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/8 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="panel-label">Primary paths</div>
                <h2 className="mt-3 font-display text-[1.55rem] leading-none text-white">Navigate the company workspace</h2>
              </div>
            </div>
            <div className="motion-stagger mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {managementPaths.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[1rem] border border-white/8 bg-white/[0.03] p-4 motion-lift hover:border-white/14 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-blue-400/16 bg-blue-400/[0.08] text-blue-200">
                      <item.icon className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_340px]">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Activity feed</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Company feed</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{data.activity.length} events</div>
          </div>
          <div className="space-y-2">
            {data.activity.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="surface-panel space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="panel-label">Leadership</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{coOwners.length + 1} visible</div>
            </div>
            <div className="space-y-2">
              <ProfileRosterRow user={data.company.owner} companyRole="OWNER" primaryCompany={data.company} variant="identity" />
              {coOwners.map((member) => (
                <ProfileRosterRow
                  key={member.id}
                  user={member}
                  companyRole={member.companyRole}
                  primaryCompany={data.company}
                  variant="identity"
                />
              ))}
            </div>
          </section>

          <section className="surface-panel space-y-4 p-5">
            <div className="panel-label">Operations note</div>
            <p className="text-sm leading-7 text-muted-foreground">
              The hub groups identity, people, work, invites, and publishing into one operating surface so members do not have to hunt through disconnected admin panels.
            </p>
            <div className="space-y-2">
              {canManageCompanyInvites ? (
                <Button variant="outline" className="w-full justify-start" render={<Link href={`/dashboard/company/${slug}/invites`} />}>
                  <UserRoundPlus className="size-4" />
                  Manage invites
                </Button>
              ) : null}
              {canEditSettings ? (
                <Button variant="outline" className="w-full justify-start" render={<Link href={`/dashboard/company/${slug}/settings`} />}>
                  <Settings className="size-4" />
                  Open settings
                </Button>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Roster</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Visible members</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/members`} />}>
              Open roster
            </Button>
          </div>
          <div className="space-y-2">
            {data.members.slice(0, 6).map((member) => (
              <ProfileRosterRow
                key={member.id}
                user={member}
                companyRole={member.companyRole}
                primaryCompany={data.company}
                variant="identity"
              />
            ))}
          </div>
        </section>

        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Projects</div>
              <h2 className="mt-3 font-display text-[1.65rem] leading-none text-white">Active work surfaces</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {data.projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
