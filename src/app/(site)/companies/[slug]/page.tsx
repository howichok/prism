import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building2, Handshake, Layers3 } from "lucide-react";

import { CompanyCollaborationRequestCard } from "@/components/platform/company-collaboration-request-card";
import { FeedItem } from "@/components/platform/feed-item";
import { PostCard } from "@/components/platform/post-card";
import { ProfileRosterRow } from "@/components/platform/profile-roster-row";
import { ProjectCard } from "@/components/platform/project-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { getPublicCompanyBySlugForViewer } from "@/lib/data";
import { formatCompactNumber, formatDate } from "@/lib/format";
import { getCompanyRoleLabel } from "@/lib/role-system";
import { getOptionalViewer, isGuestViewer } from "@/lib/session";

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const viewer = await getOptionalViewer();
  const viewerContext = viewer && !isGuestViewer(viewer) ? { id: viewer.id, siteRole: viewer.siteRole } : null;
  let data: Awaited<ReturnType<typeof getPublicCompanyBySlugForViewer>> | false = false;

  try {
    data = await getPublicCompanyBySlugForViewer(slug, viewerContext);
  } catch (error) {
    console.error("[company-detail] Error loading company", error);
  }

  if (data === false) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="This company page could not be loaded"
          description="The public company route responded, but the server could not fetch the company data from Prisma."
        />
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  const { company, posts, projects, activity, viewerMembership, viewerSourceCompanies, collaborations } = data;

  const isSignedIn = Boolean(viewerContext);
  const isMember = Boolean(viewerMembership);
  const isLeadership =
    viewerMembership?.companyRole === CompanyRole.OWNER ||
    viewerMembership?.companyRole === CompanyRole.CO_OWNER ||
    viewerMembership?.companyRole === CompanyRole.TRUSTED_MEMBER;
  const canRequestCollaboration = isSignedIn && !isMember && viewerSourceCompanies.length > 0;
  const primaryCta = isMember
    ? {
        label: "Open company hub",
        href: `/dashboard/company/${company.slug}`,
        external: false,
      }
    : isSignedIn && company.discordInviteUrl
      ? {
          label: "Open Discord invite",
          href: company.discordInviteUrl,
          external: true,
        }
      : !isSignedIn
        ? {
            label: "Sign in with Discord",
            href: "/sign-in",
            external: false,
          }
        : null;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Company header */}
      <section className="animate-fade-up">
        <div
          className="h-40 rounded-t-xl border border-b-0 border-white/6 sm:h-48"
          style={{
            background: company.bannerUrl
              ? `linear-gradient(180deg, rgba(8,10,14,0.14), rgba(8,10,14,0.72)), url(${company.bannerUrl})`
              : `radial-gradient(circle at 18% 18%, ${company.brandColor ?? "#55d4ff"}35, transparent 26%), linear-gradient(135deg, rgba(9,12,18,0.98) 0%, rgba(6,8,11,0.98) 48%, rgba(4,6,8,1) 100%)`,
            backgroundSize: company.bannerUrl ? "cover" : "auto",
            backgroundPosition: "center",
          }}
        />
        <div className="rounded-b-xl border border-t-0 border-white/6 bg-white/[0.02] px-6 py-6 sm:px-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4">
            <div
              className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-[hsl(0_0%_4%)] text-xl font-semibold text-white"
              style={{ background: company.brandColor ?? "#141414" }}
            >
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-1">
              <h1 className="font-display text-2xl text-white sm:text-3xl">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={company.recruitingStatus} />
                <StatusBadge status={company.status} />
              </div>
            </div>
          </div>

          {company.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">{company.description}</p>
          ) : null}

          {company.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/6 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Stats inline */}
          <div className="mt-5 flex flex-wrap gap-6 border-t border-white/6 pt-4 text-sm">
            <div>
              <span className="font-display text-lg text-white">{formatCompactNumber(company.counts.members)}</span>
              <span className="ml-1.5 text-xs text-white/35">members</span>
            </div>
            <div>
              <span className="font-display text-lg text-white">{company.counts.posts}</span>
              <span className="ml-1.5 text-xs text-white/35">posts</span>
            </div>
            <div>
              <span className="font-display text-lg text-white">{company.counts.projects}</span>
              <span className="ml-1.5 text-xs text-white/35">projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content + sidebar */}
      <div className="animate-fade-in grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          {activity.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/50">
                <Layers3 className="size-4" />
                Recent activity
              </h2>
              <div className="space-y-2">
                {activity.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-3.5">
                    <FeedItem item={item} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {collaborations.active.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/50">
                <Handshake className="size-4" />
                Active collaborations
              </h2>
              <div className="space-y-2">
                {collaborations.active.map((collaboration) => (
                  <div
                    key={collaboration.id}
                    className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/companies/${(collaboration.otherCompany ?? collaboration.targetCompany).slug}`}
                          className="text-sm font-medium text-white transition-colors hover:text-white/76"
                        >
                          {(collaboration.otherCompany ?? collaboration.targetCompany).name}
                        </Link>
                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                          Active since {collaboration.startedAt ? formatDate(collaboration.startedAt) : "now"}
                        </p>
                      </div>
                      <StatusBadge status={collaboration.status} />
                    </div>
                    {collaboration.message ? (
                      <p className="mt-3 text-sm leading-7 text-white/58">{collaboration.message}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/50">
                <Building2 className="size-4" />
                Posts
              </h2>
              <div className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-xl border border-white/6 bg-white/[0.02] px-5 py-3.5">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {projects.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-medium text-white/50">Projects</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="surface-panel-soft p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-white/35">Leadership</h3>
              {viewerMembership ? (
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                  {isLeadership ? "Leadership" : `Your role: ${getCompanyRoleLabel(viewerMembership.companyRole)}`}
                </span>
              ) : null}
            </div>
            <ProfileRosterRow user={company.owner} companyRole="OWNER" primaryCompany={company} variant="identity" />
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-white/35">Members</h3>
              <span className="text-xs text-white/25">{company.counts.members}</span>
            </div>
            <div className="space-y-1">
              {company.members.slice(0, 6).map((member) => (
                <ProfileRosterRow
                  key={member.id}
                  user={member}
                  companyRole={member.companyRole}
                  primaryCompany={company}
                  variant="identity"
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            {primaryCta ? (
              <Button
                className="w-full"
                render={
                  primaryCta.external ? (
                    <a href={primaryCta.href} target="_blank" rel="noreferrer" />
                  ) : (
                    <Link href={primaryCta.href} />
                  )
                }
              >
                {primaryCta.label}
                {primaryCta.external ? <ArrowUpRight className="size-4" /> : null}
              </Button>
            ) : (
              <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm text-white/76">
                No public Discord invite is configured for this company yet.
              </div>
            )}
            <Button variant="outline" className="mt-2 w-full" render={<Link href="/discovery" />}>
              Explore discovery
            </Button>
            {isLeadership ? (
              <Button variant="outline" className="mt-2 w-full" render={<Link href={`/dashboard/company/${slug}/collaborations`} />}>
                Manage collaborations
              </Button>
            ) : null}
            {canRequestCollaboration ? (
              <div className="mt-3">
                <CompanyCollaborationRequestCard
                  targetCompany={company}
                  sourceCompanies={viewerSourceCompanies}
                />
              </div>
            ) : null}
            {!isSignedIn ? (
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Sign in first to access dashboard workspaces, applications, and company-aware actions.
              </p>
            ) : !isMember && !company.discordInviteUrl && !canRequestCollaboration ? (
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Leadership can add a public Discord invite in Company Settings when they want this page to route members directly into the community.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
