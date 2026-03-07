import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Gamepad2, Globe2, Sparkles } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { PostCard } from "@/components/platform/post-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { getPublicUserByUsername } from "@/lib/data";
import { formatDate } from "@/lib/format";

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div
          className="h-32 sm:h-40"
          style={{
            background: user.bannerUrl
              ? `linear-gradient(to bottom, transparent 40%, hsl(240 5% 9%)), url(${user.bannerUrl})`
              : `linear-gradient(135deg, ${user.accentColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 10%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="p-6">
          <div className="-mt-16 flex items-end gap-4">
            <UserAvatar
              name={user.displayName}
              image={user.avatarUrl}
              accentColor={user.accentColor}
              size="lg"
              className="size-24 border-4 border-card"
            />
            <div className="min-w-0 pb-2">
              <h1 className="text-2xl font-semibold text-foreground">{user.displayName}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>@{user.username ?? "member"}</span>
                {user.siteRole !== "USER" ? <RoleBadge kind="site" role={user.siteRole} /> : null}
                {primaryMembership ? <RoleBadge kind="company" role={primaryMembership.companyRole} /> : null}
              </div>
            </div>
          </div>

          {user.bio ? <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p> : null}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.discordUsername ? (
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="size-4 text-primary/80" />
                {user.discordUsername}
              </span>
            ) : null}
            {user.minecraftNickname ? (
              <span className="inline-flex items-center gap-1.5">
                <Gamepad2 className="size-4 text-primary/80" />
                {user.minecraftNickname}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-primary/80" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>

          {user.badges.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {user.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="rounded-md border px-2 py-0.5 text-xs font-medium text-foreground"
                  style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
                >
                  {badge.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Sparkles className="size-4 text-primary/60" />
            Posts by {user.displayName}
          </h2>
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No posts published yet.
            </div>
          )}

          {activity.length > 0 ? (
            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
              <div className="mt-3 space-y-2">
                {activity.slice(0, 5).map((item) => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Companies</div>
            {user.memberships.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {user.memberships.map((membership) => (
                  <Link
                    key={membership.company.id}
                    href={`/companies/${membership.company.slug}`}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-secondary"
                  >
                    <span className="truncate text-foreground">{membership.company.name}</span>
                    <span className="text-xs text-muted-foreground">{membership.companyRole.replaceAll("_", " ")}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">No company memberships.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stats</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">Companies</span>
                <span className="font-medium text-foreground">{user.memberships.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">Badges</span>
                <span className="font-medium text-foreground">{user.badges.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs">
                <span className="text-muted-foreground">Posts</span>
                <span className="font-medium text-foreground">{posts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
