import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, Gamepad2, Globe2, Sparkles } from "lucide-react";

import { FeedItem } from "@/components/platform/feed-item";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { getPublicUserByUsername } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  let data;

  try {
    data = await getPublicUserByUsername(username);
  } catch (error) {
    console.error(`[user:${username}] Failed to load public user profile.`, error);

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8">
        <PublicDataUnavailable
          title="This profile could not be loaded"
          description="The public profile route responded, but the server could not fetch the member data. The production Prisma or Supabase connection likely needs attention."
        />
      </div>
    );
  }

  if (!data) {
    notFound();
  }

  const { user, posts, activity } = data;
  const primaryMembership = user.memberships[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <section className="surface-panel-strong overflow-hidden">
        <div
          className="h-56 border-b border-white/10"
          style={{
            background: user.bannerUrl
              ? `linear-gradient(135deg, rgba(5,10,20,0.2), rgba(5,10,20,0.88)), url(${user.bannerUrl})`
              : `linear-gradient(135deg, ${user.accentColor ?? "#55d4ff"} 0%, rgba(8,15,30,0.96) 78%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="space-y-6 p-8">
          <div className="-mt-24 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-5">
              <UserAvatar
                name={user.displayName}
                image={user.avatarUrl}
                accentColor={user.accentColor}
                size="lg"
                className="size-28 border-4 border-[#060b16]"
              />
              <div className="pb-2">
                <div className="font-display text-4xl font-semibold text-white">{user.displayName}</div>
                <div className="mt-1 text-sm text-white/58">
                  @{user.username ?? "member"}
                  {user.discordUsername ? ` | ${user.discordUsername}` : ""}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.siteRole !== "USER" ? <RoleBadge kind="site" role={user.siteRole} /> : null}
              {primaryMembership ? <RoleBadge kind="company" role={primaryMembership.companyRole} /> : null}
              {primaryMembership ? (
                <Button variant="outline" render={<Link href={`/companies/${primaryMembership.company.slug}`} />}>
                  <Building2 className="size-4" />
                  View company
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <PageHeader
              eyebrow="Profile"
              title={user.displayName}
              description={user.bio ?? "This member has not added a bio yet."}
              className="border-none bg-transparent p-0 shadow-none before:hidden"
            />
            <div className="surface-panel-soft p-5 text-sm text-white/62">
              <div className="panel-label">Identity details</div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-cyan-100" />
                  Joined PrismMTR: {formatDate(user.createdAt)}
                </div>
                {user.discordUsername ? (
                  <div className="flex items-center gap-2">
                    <Globe2 className="size-4 text-cyan-100" />
                    Discord: {user.discordUsername}
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-cyan-100" />
                  Minecraft: {user.minecraftNickname ?? "Not set"}
                </div>
                {primaryMembership ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-cyan-100" />
                    Company: {primaryMembership.company.name}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="surface-panel p-6">
            <div className="panel-label">Badges and companies</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white"
                  style={{ borderColor: `${badge.color}55`, backgroundColor: `${badge.color}22` }}
                >
                  {badge.name}
                </span>
              ))}
              {user.memberships.map((membership) => (
                <span
                  key={membership.company.id}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/70"
                >
                  {membership.company.name}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-100" />
              <div className="panel-label">Recent activity</div>
            </div>
            <div className="mt-4 space-y-4">
              {activity.map((item) => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel-label">Recent public posts</div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
