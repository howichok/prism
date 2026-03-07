import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, Sparkles, UserRoundPlus } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { RoleBadge } from "@/components/platform/role-badge";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { getPublicCompanyBySlug } from "@/lib/data";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data;

  try {
    data = await getPublicCompanyBySlug(slug);
  } catch (error) {
    console.error(`[company:${slug}] Failed to load public company page.`, error);

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8">
        <PublicDataUnavailable
          title="This company page could not be loaded"
          description="The route exists, but the server could not fetch the company profile from Prisma. Check the production database connection and schema state."
        />
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const { company, posts, projects, activity } = data;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <section className="surface-panel-strong overflow-hidden">
        <div
          className="h-56 border-b border-white/10"
          style={{
            background: company.bannerUrl
              ? `linear-gradient(135deg, rgba(5,10,20,0.2), rgba(5,10,20,0.86)), url(${company.bannerUrl})`
              : `linear-gradient(135deg, ${company.brandColor ?? "#55d4ff"} 0%, rgba(8,15,30,0.96) 78%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="space-y-6 p-8">
          <div className="-mt-18 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-24 items-center justify-center rounded-[1.8rem] border border-white/14 bg-[#07101d]/84 font-display text-3xl font-semibold text-white shadow-[0_28px_60px_-36px_rgba(0,0,0,0.96)]">
                {company.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="pb-2">
                <div className="font-display text-4xl font-semibold text-white">{company.name}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={company.recruitingStatus} />
                  <StatusBadge status={company.status} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button render={<Link href="/sign-in" />}>
                <UserRoundPlus className="size-4" />
                Sign in to join
              </Button>
              <Button variant="outline" render={<Link href="/discovery" />}>
                Explore discovery
              </Button>
            </div>
          </div>

          <PageHeader
            eyebrow="Company Profile"
            title={company.name}
            description={company.description}
            className="border-none bg-transparent p-0 shadow-none before:hidden"
          />

          <div className="flex flex-wrap gap-3">
            {company.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/65"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Members", value: company.counts.members },
              { label: "Posts", value: company.counts.posts },
              { label: "Projects", value: company.counts.projects },
            ].map((stat) => (
              <div key={stat.label} className="surface-panel p-5">
                <div className="panel-label">{stat.label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="panel-label">Public feed</div>
                <h2 className="mt-3 font-display text-2xl font-semibold text-white">Recent company activity</h2>
              </div>
              <Button variant="outline" render={<Link href="/discovery" />}>
                Open discovery
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {activity.map((item) => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-label">Featured posts</div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="panel-label">Projects</div>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-cyan-100" />
              <div className="panel-label">Leadership and roster</div>
            </div>
            <div className="mt-4 space-y-3">
              {company.members.map((member) => (
                <MiniProfileHoverCard key={member.id} user={member} primaryCompany={company} companyRole={member.companyRole}>
                  <div className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 transition hover:bg-white/10">
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

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-100" />
              <div className="panel-label">Why join</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Public companies on PrismMTR combine visible member identity, structured posts, project workstreams, and moderation-aware growth instead of raw chat channels.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
