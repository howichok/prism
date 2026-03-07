import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Layers3, UsersRound } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getPublicCompanyBySlug } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getPublicCompanyBySlug(slug).catch((error) => {
    console.error("[company-detail] Error loading company", error);
    return null;
  });

  if (!company) return notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div
          className="h-40 sm:h-48"
          style={{
            background: company.bannerUrl
              ? `linear-gradient(to bottom, transparent 40%, hsl(240 5% 9%)), url(${company.bannerUrl})`
              : `linear-gradient(135deg, ${company.brandColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 10%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{company.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{company.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={company.recruitingStatus} />
              <StatusBadge status={company.status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>{formatCompactNumber(company.counts.members)} members</span>
            <span>·</span>
            <span>{company.counts.posts} posts</span>
            <span>·</span>
            <span>{company.counts.projects} projects</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Activity feed */}
          {company.activity.length > 0 ? (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Layers3 className="size-4 text-primary/60" />
                Recent activity
              </h2>
              <div className="space-y-2">
                {company.activity.slice(0, 5).map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Posts */}
          {company.posts.length > 0 ? (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Building2 className="size-4 text-primary/60" />
                Posts
              </h2>
              <div className="space-y-3">
                {company.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Projects */}
          {company.projects.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-foreground">Projects</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {company.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Leadership */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Leadership</div>
            <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
              <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg bg-secondary p-2.5 transition-colors hover:bg-secondary/80">
                <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{company.owner.displayName}</div>
                  <div className="truncate text-xs text-muted-foreground">@{company.owner.username ?? "member"}</div>
                </div>
              </div>
            </MiniProfileHoverCard>
          </div>

          {/* Members */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Members</div>
              <span className="text-xs text-muted-foreground">{company.counts.members}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {company.members.slice(0, 6).map((member) => (
                <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                  <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary">
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
