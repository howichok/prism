import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Layers3 } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { getPublicCompanyBySlug } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPublicCompanyBySlug(slug).catch((error) => {
    console.error("[company-detail] Error loading company", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="This company page could not be loaded"
          description="The public company route responded, but the server could not fetch the company data from Prisma."
        />
      </div>
    );
  }

  const { company, posts, projects, activity } = data;

  if (!company) {
    return notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Company header */}
      <section className="animate-fade-up">
        <div
          className="h-40 rounded-t-xl border border-b-0 border-white/6 sm:h-48"
          style={{
            background: company.bannerUrl
              ? `url(${company.bannerUrl})`
              : company.brandColor ?? "#141414",
            backgroundSize: "cover",
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
      <div className="animate-fade-up grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]" style={{ animationDelay: "120ms" }}>
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
          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-white/35">Leadership</h3>
              <Button variant="outline" size="sm" render={<Link href="/sign-in" />}>
                Join
              </Button>
            </div>
            <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
              <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.04]">
                <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{company.owner.displayName}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/30">Owner</div>
                </div>
              </div>
            </MiniProfileHoverCard>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-white/35">Members</h3>
              <span className="text-xs text-white/25">{company.counts.members}</span>
            </div>
            <div className="space-y-1">
              {company.members.slice(0, 6).map((member) => (
                <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                  <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
                    <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                    <span className="truncate text-sm text-white/70">{member.displayName}</span>
                  </div>
                </MiniProfileHoverCard>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <Button className="w-full" render={<Link href="/sign-in" />}>
              Join with Discord
            </Button>
            <Button variant="outline" className="mt-2 w-full" render={<Link href="/discovery" />}>
              Explore discovery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
