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
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="surface-panel-strong overflow-hidden p-0">
        <div
          className="h-40 sm:h-48"
          style={{
            background: user.bannerUrl
              ? `linear-gradient(to bottom, transparent 40%, hsl(0 0% 8%)), url(${user.bannerUrl})`
              : `linear-gradient(135deg, ${user.accentColor ?? "hsl(221 83% 53%)"} 0%, hsl(0 0% 8%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="-mt-16 flex items-end gap-4">
              <UserAvatar
                name={user.displayName}
                image={user.avatarUrl}
                accentColor={user.accentColor}
                size="lg"
                className="size-24 border-4 border-card"
              />
              <div className="min-w-0 pb-2">
                <div className="panel-label">Identity surface</div>
                <h1 className="mt-3 font-display text-[2.4rem] leading-[0.95] text-white">{user.displayName}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">@{user.username ?? "member"}</span>
                  {user.siteRole !== "USER" ? <RoleBadge kind="site" role={user.siteRole} /> : null}
                  {primaryMembership ? <RoleBadge kind="company" role={primaryMembership.companyRole} /> : null}
                </div>
              </div>
            </div>

            {user.bio ? <p className="max-w-3xl text-sm leading-8 text-muted-foreground">{user.bio}</p> : null}

            <div className="grid gap-3 sm:grid-cols-3">
              {user.discordUsername ? (
                <div className="rounded-[1.15rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Discord</div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-white">
                    <Globe2 className="size-4 text-primary/80" />
                    {user.discordUsername}
                  </div>
                </div>
              ) : null}
              <div className="rounded-[1.15rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Minecraft</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-white">
                  <Gamepad2 className="size-4 text-primary/80" />
                  {user.minecraftNickname ?? "Not set"}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Joined</div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-white">
                  <CalendarDays className="size-4 text-primary/80" />
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            {user.badges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground"
                    style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
                  >
                    {badge.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
            <div className="panel-label">Presence</div>
            <div className="mt-4 space-y-2">
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Companies</div>
                <div className="mt-2 text-sm text-white">{user.memberships.length}</div>
              </div>
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Badges</div>
                <div className="mt-2 text-sm text-white">{user.badges.length}</div>
              </div>
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Posts</div>
                <div className="mt-2 text-sm text-white">{posts.length}</div>
              </div>
            </div>

            {primaryMembership ? (
              <div className="mt-6 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="panel-label">Primary company</div>
                <Link
                  href={`/companies/${primaryMembership.company.slug}`}
                  className="mt-3 block rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3 transition-colors hover:border-white/14 hover:bg-white/[0.05]"
                >
                  <div className="text-sm font-medium text-white">{primaryMembership.company.name}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/42">
                    {primaryMembership.companyRole.replaceAll("_", " ")}
                  </div>
                </Link>
              </div>
            ) : null}
          </div>
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
          <div className="surface-panel p-4">
            <div className="panel-label">Companies</div>
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
          </div>

          <div className="surface-panel p-4">
            <div className="panel-label">Stats</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-xs">
                <span className="text-muted-foreground">Companies</span>
                <span className="font-medium text-foreground">{user.memberships.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-xs">
                <span className="text-muted-foreground">Badges</span>
                <span className="font-medium text-foreground">{user.badges.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-xs">
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
