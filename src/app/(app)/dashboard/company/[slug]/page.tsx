import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ArrowRight, Megaphone, UserRoundPlus } from "lucide-react";

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
      description="Company hub overview, public feed, members, and current work."
      items={getCompanySidebarItems(slug)}
      rail={<CompanyRail company={data.company} currentRole={data.currentMembership?.companyRole} />}
    >
      <PageHeader
        eyebrow="Company Hub"
        title={data.company.name}
        description={data.company.description}
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

      <section className="surface-panel-strong overflow-hidden">
        <div
          className="h-48 border-b border-white/10"
          style={{
            background: data.company.bannerUrl
              ? `linear-gradient(135deg, rgba(5,10,20,0.18), rgba(5,10,20,0.86)), url(${data.company.bannerUrl})`
              : `linear-gradient(135deg, ${data.company.brandColor ?? "#55d4ff"} 0%, rgba(8,15,30,0.96) 78%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="space-y-6 p-6 sm:p-7">
          <div className="-mt-18 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-24 items-center justify-center rounded-[1.8rem] border border-white/14 bg-[#07101d]/84 font-display text-3xl font-semibold text-white shadow-[0_28px_60px_-36px_rgba(0,0,0,0.96)]">
                {data.company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-2">
                <div className="font-display text-4xl font-semibold text-white">{data.company.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={data.company.recruitingStatus} />
                  <StatusBadge status={data.company.status} />
                  {data.currentMembership ? <RoleBadge kind="company" role={data.currentMembership.companyRole} /> : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.company.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-[#07101d]/72 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/62">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Members", value: data.company.counts.members },
              { label: "Projects", value: data.company.counts.projects },
              { label: "Posts", value: data.company.counts.posts },
            ].map((stat) => (
              <div key={stat.label} className="surface-panel-soft p-4">
                <div className="panel-label">{stat.label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-panel-soft p-5">
              <div className="panel-label">Overview</div>
              <p className="mt-3 text-sm leading-7 text-white/62">
                This company hub is the operational HQ for members, projects, posts, invites, and applications. It keeps the social layer visible without turning the workspace into chat.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" render={<Link href={`/dashboard/company/${slug}/members`} />}>
                  Open member roster
                </Button>
                <Button variant="secondary" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
                  View projects
                </Button>
              </div>
            </div>

            <div className="surface-panel-soft p-5">
              <div className="panel-label">Leadership</div>
              <div className="mt-4 space-y-3">
                <MiniProfileHoverCard user={data.company.owner} companyRole="OWNER" primaryCompany={data.company}>
                  <div className="flex cursor-pointer items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/6 p-3 transition hover:bg-white/10">
                    <UserAvatar name={data.company.owner.displayName} image={data.company.owner.avatarUrl} accentColor={data.company.owner.accentColor} />
                    <div>
                      <div className="font-medium text-white">{data.company.owner.displayName}</div>
                      <div className="text-sm text-white/56">Owner</div>
                    </div>
                  </div>
                </MiniProfileHoverCard>
                {coOwners.map((member) => (
                  <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                    <div className="flex cursor-pointer items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/4 p-3 transition hover:bg-white/8">
                      <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-white">{member.displayName}</div>
                        <div className="text-xs text-white/50">Co-owner</div>
                      </div>
                    </div>
                  </MiniProfileHoverCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="panel-label">Company feed</div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">Operational activity</h2>
          </div>
          <Button variant="outline" render={<Link href={`/dashboard/company/${slug}/posts`} />}>
            View posts
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-5 space-y-4">
          {data.activity.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="surface-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Members</div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">Roster preview</h2>
            </div>
            <Button variant="outline" render={<Link href={`/dashboard/company/${slug}/members`} />}>
              Open roster
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {data.members.slice(0, 6).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                <div className="flex cursor-pointer items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/6 px-3 py-2.5 transition hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-white">{member.displayName}</div>
                      <div className="text-xs text-white/50">@{member.username ?? "member"}</div>
                    </div>
                  </div>
                  <RoleBadge kind="company" role={member.companyRole} />
                </div>
              </MiniProfileHoverCard>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="panel-label">Projects</div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">Active workstreams</h2>
            </div>
            <Button variant="outline" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
              View all
            </Button>
          </div>
          {data.projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
