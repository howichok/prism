"use client";

import Link from "next/link";
import { CompanyRole, SiteRole } from "@prisma/client";
import {
  Building2,
  CalendarDays,
  Gamepad2,
  Globe2,
  Sparkles,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";

import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type MiniProfileHoverCardProps = {
  user: UserPreview;
  companyRole?: CompanyRole | null;
  primaryCompany?: CompanyReference | null;
  inviteHref?: string;
  children: React.ReactNode;
  className?: string;
};

function getBannerStyle(user: UserPreview) {
  if (user.bannerUrl) {
    return {
      backgroundImage: `linear-gradient(135deg, rgba(5, 10, 20, 0.28), rgba(5, 10, 20, 0.88)), url(${user.bannerUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background: `linear-gradient(135deg, ${user.accentColor ?? "#55d4ff"} 0%, rgba(8, 15, 30, 0.96) 100%)`,
  };
}

function getMembership(user: UserPreview, primaryCompany?: CompanyReference | null) {
  if (!primaryCompany) {
    return user.memberships[0] ?? null;
  }

  return user.memberships.find((membership) => membership.company.id === primaryCompany.id) ?? user.memberships[0] ?? null;
}

function QuickActions({
  profileHref,
  companyHref,
  inviteHref,
  compact = false,
}: {
  profileHref: string;
  companyHref?: string;
  inviteHref?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3")}>
      <Button render={<Link href={profileHref} />} className="w-full">
        <UserSearch className="size-4" />
        View Profile
      </Button>
      <Button
        variant="outline"
        render={<Link href={companyHref ?? "#"} />}
        disabled={!companyHref}
        className="w-full"
      >
        <Building2 className="size-4" />
        View Company
      </Button>
      <Button
        variant="secondary"
        render={<Link href={inviteHref ?? "#"} />}
        disabled={!inviteHref}
        className={cn("w-full", compact ? "" : "sm:col-span-2 lg:col-span-1")}
      >
        <UserRoundPlus className="size-4" />
        Invite
      </Button>
    </div>
  );
}

function ProfileCard({
  user,
  companyRole,
  primaryCompany,
  inviteHref,
  expanded = false,
}: {
  user: UserPreview;
  companyRole?: CompanyRole | null;
  primaryCompany?: CompanyReference | null;
  inviteHref?: string;
  expanded?: boolean;
}) {
  const membership = getMembership(user, primaryCompany);
  const company = primaryCompany ?? membership?.company ?? null;
  const resolvedRole = companyRole ?? membership?.companyRole ?? null;
  const profileHref = `/users/${user.username ?? ""}`;
  const companyHref = company ? `/companies/${company.slug}` : undefined;
  const showSiteRole = user.siteRole !== SiteRole.USER;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07101d]/96 text-white shadow-[0_34px_100px_-48px_rgba(0,0,0,0.96)]",
        expanded ? "w-full" : "",
      )}
    >
      <div className="relative h-28 border-b border-white/10" style={getBannerStyle(user)}>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2">
            {showSiteRole ? <RoleBadge kind="site" role={user.siteRole} /> : null}
            {resolvedRole ? <RoleBadge kind="company" role={resolvedRole} /> : null}
          </div>
          <div className="rounded-full border border-white/12 bg-[#07101d]/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
            Prism member
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="-mt-16 flex items-end justify-between gap-4">
          <div className="flex min-w-0 items-end gap-4">
            <UserAvatar
              name={user.displayName}
              image={user.avatarUrl}
              accentColor={user.accentColor}
              size="lg"
              className="size-22 border-4 border-[#07101d]"
            />
            <div className="min-w-0 pb-2">
              <div className="truncate font-display text-2xl font-semibold text-white">{user.displayName}</div>
              <div className="text-sm text-white/58">
                @{user.username ?? "member"}
                {user.discordUsername ? ` • ${user.discordUsername}` : ""}
              </div>
            </div>
          </div>
          {!expanded ? (
            <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/58">
              Hover card
            </div>
          ) : null}
        </div>

        {user.bio ? <p className="text-sm leading-7 text-white/72">{user.bio}</p> : null}

        <div className="flex flex-wrap gap-2">
          {user.badges.slice(0, expanded ? 6 : 3).map((badge) => (
            <span
              key={badge.id}
              className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              style={{ borderColor: `${badge.color}55`, backgroundColor: `${badge.color}20` }}
            >
              {badge.name}
            </span>
          ))}
          {user.badges.length === 0 ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/52">
              No badges yet
            </span>
          ) : null}
        </div>

        <div className={cn("grid gap-3", expanded ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          <div className="surface-panel-soft p-4">
            <div className="panel-label">Identity</div>
            <div className="mt-3 space-y-2 text-sm text-white/68">
              {user.discordUsername ? (
                <div className="flex items-center gap-2">
                  <Globe2 className="size-4 text-cyan-100" />
                  <span>{user.discordUsername}</span>
                </div>
              ) : null}
              {user.minecraftNickname ? (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-cyan-100" />
                  <span>{user.minecraftNickname}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-white/38" />
                  <span className="text-white/48">Minecraft nickname not set</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-cyan-100" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="surface-panel-soft p-4">
            <div className="panel-label">Company</div>
            <div className="mt-3 space-y-2 text-sm text-white/68">
              {company ? (
                <>
                  <div className="font-medium text-white">{company.name}</div>
                  <div>{resolvedRole ? resolvedRole.replaceAll("_", " ") : "Member"}</div>
                </>
              ) : (
                <div className="text-white/48">No active company linked yet.</div>
              )}
              {company ? (
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                  {company.recruitingStatus.replaceAll("_", " ")}
                </div>
              ) : null}
            </div>
          </div>

          {expanded ? (
            <div className="surface-panel-soft p-4">
              <div className="panel-label">Presence</div>
              <div className="mt-3 space-y-2 text-sm text-white/68">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-100" />
                  <span>{user.memberships.length} company connection{user.memberships.length === 1 ? "" : "s"}</span>
                </div>
                <div>{user.badges.length} badge{user.badges.length === 1 ? "" : "s"} unlocked</div>
              </div>
            </div>
          ) : null}
        </div>

        <QuickActions profileHref={profileHref} companyHref={companyHref} inviteHref={inviteHref} compact={!expanded} />
      </div>
    </div>
  );
}

export function MiniProfileHoverCard({
  user,
  companyRole,
  primaryCompany,
  inviteHref,
  children,
  className,
}: MiniProfileHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={14} className={cn("w-[25rem] border-none bg-transparent p-0 shadow-none", className)}>
        <Dialog>
          <div className="space-y-3">
            <ProfileCard user={user} companyRole={companyRole} primaryCompany={primaryCompany} inviteHref={inviteHref} />
            <DialogTrigger render={<Button variant="secondary" className="w-full bg-white/8 text-white hover:bg-white/12" />}>
              Open Profile Card
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-3xl border border-white/10 bg-[#050b16] p-0 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.98)]">
            <DialogHeader className="sr-only">
              <DialogTitle>{user.displayName}</DialogTitle>
              <DialogDescription>Expanded PrismMTR member profile card.</DialogDescription>
            </DialogHeader>
            <ProfileCard
              user={user}
              companyRole={companyRole}
              primaryCompany={primaryCompany}
              inviteHref={inviteHref}
              expanded
            />
          </DialogContent>
        </Dialog>
      </HoverCardContent>
    </HoverCard>
  );
}
