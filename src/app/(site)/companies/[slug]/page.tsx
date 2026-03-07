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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="surface-panel-strong overflow-hidden p-0">
        <div
          className="h-44 border-b border-white/8 sm:h-56"
          style={{
            background: company.bannerUrl
              ? `url(${company.bannerUrl})`
              : company.brandColor ?? "#141414",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="-mt-16 flex flex-wrap items-end gap-4">
              <div
                className="flex size-24 items-center justify-center rounded-[1.7rem] border-[3px] border-[hsl(0_0%_5%)] text-[1.6rem] font-semibold text-white shadow-[0_28px_70px_-42px_rgba(0,0,0,0.92)]"
                style={{ background: company.brandColor ?? "#141414" }}
              >
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-1">
                <div className="panel-label">Public company surface</div>
                <h1 className="mt-3 font-display text-[2.5rem] leading-[0.95] text-white sm:text-[3rem]">{company.name}</h1>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusBadge status={company.recruitingStatus} />
                  <StatusBadge status={company.status} />
                </div>
              </div>
            </div>

            <p className="max-w-3xl text-sm leading-8 text-muted-foreground">{company.description}</p>

            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
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
                { label: "Members", value: formatCompactNumber(company.counts.members), body: "Visible roster density." },
                { label: "Posts", value: company.counts.posts, body: "Public and internal publishing." },
                { label: "Projects", value: company.counts.projects, body: "Work currently tied to this company." },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.2rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{item.label}</div>
                  <div className="mt-3 font-display text-[2rem] leading-none text-white">{item.value}</div>
                  <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
            <div className="panel-label">Public actions</div>
            <div className="mt-4 space-y-2">
              <Button className="w-full justify-between" render={<Link href="/sign-in" />}>
                Join with Discord
              </Button>
              <Button variant="outline" className="w-full justify-between" render={<Link href="/discovery" />}>
                Explore discovery
              </Button>
            </div>

            <div className="mt-6 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="panel-label">Leadership</div>
              <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
                <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                  <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{company.owner.displayName}</div>
                    <div className="truncate text-[10px] uppercase tracking-[0.18em] text-white/42">Owner</div>
                  </div>
                </div>
              </MiniProfileHoverCard>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {activity.length > 0 ? (
            <section className="surface-panel space-y-4 p-5">
              <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="panel-label">Activity</div>
                  <h2 className="mt-3 flex items-center gap-2 font-display text-[1.8rem] leading-none text-white">
                    <Layers3 className="size-5 text-primary/70" />
                    Recent company activity
                  </h2>
                </div>
              </div>
              <div className="space-y-2">
                {activity.slice(0, 5).map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section className="surface-panel space-y-4 p-5">
              <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="panel-label">Publishing</div>
                  <h2 className="mt-3 flex items-center gap-2 font-display text-[1.8rem] leading-none text-white">
                    <Building2 className="size-5 text-primary/70" />
                    Public posts
                  </h2>
                </div>
              </div>
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {projects.length > 0 ? (
            <section className="surface-panel space-y-4 p-5">
              <div className="border-b border-white/8 pb-4">
                <div className="panel-label">Projects</div>
                <h2 className="mt-3 font-display text-[1.8rem] leading-none text-white">Visible work surfaces</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="surface-panel p-4">
            <div className="flex items-center justify-between">
              <div className="panel-label">Leadership</div>
              <Button variant="outline" size="sm" render={<Link href="/sign-in" />}>
                Join
              </Button>
            </div>
            <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
              <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{company.owner.displayName}</div>
                  <div className="truncate text-[10px] uppercase tracking-[0.18em] text-white/42">@{company.owner.username ?? "member"}</div>
                </div>
              </div>
            </MiniProfileHoverCard>
          </div>

          <div className="surface-panel p-4">
            <div className="flex items-center justify-between">
              <div className="panel-label">Member preview</div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">{company.counts.members}</span>
            </div>
            <div className="mt-3 space-y-2">
              {company.members.slice(0, 6).map((member) => (
                <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                  <div className="flex cursor-pointer items-center gap-2.5 rounded-[1.05rem] border border-white/8 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/14 hover:bg-white/[0.05]">
                    <UserAvatar name={member.displayName} image={member.avatarUrl} accentColor={member.accentColor} size="sm" />
                    <span className="truncate text-sm text-foreground">{member.displayName}</span>
                  </div>
                </MiniProfileHoverCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
