import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building2, Sparkles } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { IdentityPanel, ProfileIdentitySurface, ProfileStatsRail } from "@/components/platform/profile-identity";
import { PostCard } from "@/components/platform/post-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { getPublicUserByUsername } from "@/lib/data";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicUserByUsername(username).catch((error) => {
    console.error("[user-profile] Error loading user", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="This profile could not be loaded"
          description="The public profile route responded, but the server could not fetch the member data from Prisma."
        />
      </div>
    );
  }

  const { user, posts, activity } = data;

  if (!user) {
    return notFound();
  }

  const primaryMembership = user.memberships[0] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileIdentitySurface
          user={user}
          companyRole={primaryMembership?.companyRole}
          primaryCompany={primaryMembership?.company}
          variant="full"
          actionRow={
            <div className="flex flex-wrap gap-2">
              {primaryMembership ? (
                <Link
                  href={`/companies/${primaryMembership.company.slug}`}
                  className="inline-flex items-center gap-2 rounded-[0.85rem] border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white transition-colors hover:border-white/16 hover:bg-white/[0.05]"
                >
                  <Building2 className="size-4 text-primary/80" />
                  View company
                </Link>
              ) : null}
              <Link
                href="/discovery"
                className="inline-flex items-center gap-2 rounded-[0.85rem] border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white transition-colors hover:border-white/16 hover:bg-white/[0.05]"
              >
                Explore network
                <ArrowUpRight className="size-4 text-primary/80" />
              </Link>
            </div>
          }
        />

        <div className="space-y-4">
          <ProfileStatsRail
            stats={[
              { label: "Companies", value: user.memberships.length, note: "Visible memberships across the network." },
              { label: "Badges", value: user.badges.length, note: "Identity markers assigned to this profile." },
              { label: "Posts", value: posts.length, note: "Public publishing surfaces authored by this member." },
            ]}
          />

          {primaryMembership ? (
            <IdentityPanel title="Primary company">
              <Link
                href={`/companies/${primaryMembership.company.slug}`}
                className="block rounded-[0.95rem] border border-white/8 bg-background/65 px-3.5 py-3 transition-colors hover:border-white/14 hover:bg-white/[0.04]"
              >
                <div className="text-sm font-medium text-white">{primaryMembership.company.name}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/42">
                  {primaryMembership.companyRole.replaceAll("_", " ")}
                </div>
              </Link>
            </IdentityPanel>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <section className="surface-panel space-y-4 p-5">
            <div className="border-b border-white/8 pb-4">
              <div className="panel-label">Publishing</div>
              <h2 className="mt-3 flex items-center gap-2 font-display text-[1.8rem] leading-none text-white">
                <Sparkles className="size-5 text-primary/70" />
                Posts by {user.displayName}
              </h2>
            </div>
            {posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-6 text-center text-sm text-muted-foreground">
                No posts published yet.
              </div>
            )}
          </section>

          {activity.length > 0 ? (
            <section className="surface-panel space-y-4 p-5">
              <div className="border-b border-white/8 pb-4">
                <div className="panel-label">Activity</div>
                <h2 className="mt-3 font-display text-[1.8rem] leading-none text-white">Recent activity</h2>
              </div>
              <div className="space-y-2">
                {activity.slice(0, 5).map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          <IdentityPanel title="Companies">
            {user.memberships.length > 0 ? (
              <div className="mt-3 space-y-2">
                {user.memberships.map((membership) => (
                  <Link
                    key={membership.company.id}
                    href={`/companies/${membership.company.slug}`}
                    className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm transition-colors hover:border-white/14 hover:bg-white/[0.05]"
                  >
                    <span className="truncate text-foreground">{membership.company.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">{membership.companyRole.replaceAll("_", " ")}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No company memberships.</p>
            )}
          </IdentityPanel>
        </div>
      </div>
    </div>
  );
}
