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
      description="Company hub overview, feed, members, and work."
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

      {/* Company banner and stats */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div
          className="h-40 border-b border-border"
          style={{
            background: data.company.bannerUrl
              ? `linear-gradient(to bottom, transparent 40%, hsl(240 5% 9%)), url(${data.company.bannerUrl})`
              : `linear-gradient(135deg, ${data.company.brandColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 10%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="space-y-4 p-5">
          <div className="-mt-14 flex items-end gap-4">
            <div className="flex size-20 items-center justify-center rounded-2xl border-2 border-card bg-card text-2xl font-semibold text-foreground shadow-lg">
              {data.company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-1">
              <div className="text-2xl font-semibold text-foreground">{data.company.name}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <StatusBadge status={data.company.recruitingStatus} />
                <StatusBadge status={data.company.status} />
                {data.currentMembership ? <RoleBadge kind="company" role={data.currentMembership.companyRole} /> : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.company.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Members", value: data.company.counts.members },
              { label: "Projects", value: data.company.counts.projects },
              { label: "Posts", value: data.company.counts.posts },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="mt-1 text-xl font-semibold text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="text-xs font-medium text-muted-foreground">Overview</div>
              <p className="mt-2 text-sm text-muted-foreground">
                The company hub is the operational HQ for members, projects, posts, invites, and applications.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/members`} />}>
                  Members
                </Button>
                <Button variant="secondary" size="sm" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
                  Projects
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="text-xs font-medium text-muted-foreground">Leadership</div>
              <div className="mt-2 space-y-2">
                <MiniProfileHoverCard user={data.company.owner} companyRole="OWNER" primaryCompany={data.company}>
                  <div className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-secondary p-2 transition-colors hover:bg-secondary/80">
                    <UserAvatar name={data.company.owner.displayName} image={data.company.owner.avatarUrl} accentColor={data.company.owner.accentColor} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{data.company.owner.displayName}</div>
                      <div className="text-xs text-muted-foreground">Owner</div>
                    </div>
                  </div>
                </MiniProfileHoverCard>
                {coOwners.map((member) => (
                  <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary">
                      <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                      <div className="text-sm text-foreground">{member.displayName}</div>
                    </div>
                  </MiniProfileHoverCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Company feed</h2>
          <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/posts`} />}>
            Posts
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
        <div className="space-y-2">
          {data.activity.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Members + Projects */}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Members</h2>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/members`} />}>
              Roster
            </Button>
          </div>
          <div className="mt-3 space-y-1.5">
            {data.members.slice(0, 6).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={data.company}>
                <div className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-secondary">
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Active projects</h2>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/company/${slug}/projects`} />}>
              View all
            </Button>
          </div>
          {data.projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
