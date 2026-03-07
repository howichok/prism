import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { Megaphone, UserRoundPlus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { CompanyRail } from "@/components/platform/company-rail";
import { FeedItem } from "@/components/platform/feed-item";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { PageHeader } from "@/components/platform/page-header";
import { ProjectCard } from "@/components/platform/project-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { canManageInvites } from "@/lib/permissions";
import { getCompanyHubData } from "@/lib/data";
import { getCompanySidebarItems } from "@/lib/navigation";
import { requireUser } from "@/lib/session";

export default async function CompanyHubOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const viewer = await requireUser({ onboarded: true });
  const { slug } = await params;
  const data = await getCompanyHubData(slug, viewer.id);

  if (!data) {
    notFound();
  }

  const coOwners = data.members.filter((member) => member.companyRole === CompanyRole.CO_OWNER).slice(0, 3);

  return (
    <AppShell
      title={data.company.name}
      description="Company hub overview, feed, members, and work."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership?.companyRole} />}
    >
      <PageHeader
        eyebrow="Company Hub"
        title={`${data.company.name} operating hub`}
        description="Run members, publishing, projects, and company workflows from one dedicated shell."
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

      <div className="surface-panel-strong overflow-hidden p-0">
        <div
          className="h-44 border-b border-white/8 sm:h-52"
          style={{
            background: data.company.bannerUrl
              ? `url(${data.company.bannerUrl})`
              : data.company.brandColor ?? "#141414",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="-mt-16 flex flex-wrap items-end gap-4">
              <div
                className="flex size-24 items-center justify-center rounded-[1.7rem] border-[3px] border-[hsl(0_0%_5%)] text-[1.65rem] font-semibold text-white shadow-[0_28px_70px_-42px_rgba(0,0,0,0.92)]"
                style={{ background: data.company.brandColor ?? "#141414" }}
              >
                {data.company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-1">
                <div className="panel-label">Company operating surface</div>
                <div className="mt-3 font-display text-[2.35rem] leading-[0.95] text-white">{data.company.name}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusBadge status={data.company.recruitingStatus} />
                  <StatusBadge status={data.company.status} />
                  {data.currentMembership ? <RoleBadge kind="company" role={data.currentMembership.companyRole} /> : null}
                </div>
              </div>
            </div>

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

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Members", value: data.company.counts.members, body: "Visible roster and role structure." },
                { label: "Projects", value: data.company.counts.projects, body: "Active work published by the company." },
                { label: "Posts", value: data.company.counts.posts, body: "Public and internal publishing surfaces." },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.2rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{stat.label}</div>
                  <div className="mt-3 font-display text-[2rem] leading-none text-white">{stat.value}</div>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">{stat.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
            <div className="panel-label">Operational focus</div>
            <div className="mt-4 space-y-2">
              {[
                {
                  href: `/dashboard/company/${slug}/members`,
                  label: "Roster workspace",
                  body: "Search, inspect, and manage members with role-aware controls.",
                },
                {
                  href: `/dashboard/company/${slug}/projects`,
                  label: "Project surfaces",
                  body: "Keep active work readable through status and authorship.",
                },
                {
                  href: `/dashboard/company/${slug}/posts`,
                  label: "Publishing stream",
                  body: "Announcements, recruitment, and progress updates live here.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-white/14 hover:bg-white/[0.05]"
                >
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.body}</p>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="panel-label">Current role</div>
              <div className="mt-3">
                {data.currentMembership ? (
                  <RoleBadge kind="company" role={data.currentMembership.companyRole} />
                ) : (
                  <span className="text-sm text-muted-foreground">Public viewer</span>
                )}
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Company hub is where members, work, invites, and publishing remain legible as one system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <div className="panel-label">Activity feed</div>
              <h2 className="mt-3 font-display text-[1.8rem] leading-none text-white">Company feed</h2>
            </div>
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
              {data.activity.length} events
            </div>
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
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">{coOwners.length + 1} visible</span>
            </div>
            <div className="space-y-2">
              <MiniProfileHoverCard user={data.company.owner} companyRole="OWNER" primaryCompany={data.company}>
                <div className="flex cursor-pointer items-center gap-3 rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                  <UserAvatar
                    name={data.company.owner.displayName}
                    image={data.company.owner.avatarUrl}
                    accentColor={data.company.owner.accentColor}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-medium text-foreground">{data.company.owner.displayName}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Owner</div>
                  </div>
                </div>
              </MiniProfileHoverCard>
              {coOwners.map((member) => (
                <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                  <div className="flex cursor-pointer items-center gap-3 rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                    <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                    <div className="min-w-0">
                      <div className="truncate text-sm text-foreground">{member.displayName}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Co-owner</div>
                    </div>
                  </div>
                </MiniProfileHoverCard>
              ))}
            </div>
          </section>

          <section className="surface-panel space-y-4 p-5">
            <div className="panel-label">Overview</div>
            <p className="text-sm leading-7 text-muted-foreground">
              The hub keeps company identity, roster, work, invites, and publishing in one place instead of fragmenting them across unrelated admin pages.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/members`} />}>
                Members
              </Button>
              <Button variant="secondary" size="sm" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
                Projects
              </Button>
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Member snapshot</div>
              <h2 className="mt-3 font-display text-[1.8rem] leading-none text-white">Visible roster</h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/members`} />}>
              Roster
            </Button>
          </div>
          <div className="space-y-2">
            {data.members.slice(0, 6).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                <div className="flex cursor-pointer items-center justify-between rounded-[1.05rem] border border-white/8 bg-white/[0.03] px-3 py-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{member.displayName}</div>
                      <div className="text-xs text-muted-foreground">@{member.username ?? "member"}</div>
                    </div>
                  </div>
                  <RoleBadge kind="company" role={member.companyRole} />
                </div>
              </MiniProfileHoverCard>
            ))}
          </div>
        </section>

        <section className="surface-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Projects</div>
              <h2 className="mt-3 font-display text-[1.8rem] leading-none text-white">Active work surfaces</h2>
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
