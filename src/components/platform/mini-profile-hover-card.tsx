"use client";

import Link from "next/link";
import { CompanyRole, SiteRole } from "@prisma/client";
import {
  Building2,
  CalendarDays,
  Gamepad2,
  Globe2,
  MessageSquare,
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
      backgroundImage: `linear-gradient(to bottom, transparent 40%, hsl(240 5% 8%)), url(${user.bannerUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background: `linear-gradient(135deg, ${user.accentColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 8%) 100%)`,
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
    <div className={cn("grid gap-2", compact ? "grid-cols-3" : "sm:grid-cols-3")}>
      <Button size="sm" render={<Link href={profileHref} />} className="w-full">
        <UserSearch className="size-3.5" />
        Profile
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={<Link href={companyHref ?? "#"} />}
        disabled={!companyHref}
        className="w-full"
      >
        <Building2 className="size-3.5" />
        Company
      </Button>
      <Button
        variant="secondary"
        size="sm"
        render={<Link href={inviteHref ?? "#"} />}
        disabled={!inviteHref}
        className="w-full"
      >
        <MessageSquare className="size-3.5" />
        Message
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
        "overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl",
        expanded ? "w-full" : "animate-scale-in",
      )}
    >
      {/* Banner */}
      <div className="relative h-24 border-b border-border" style={getBannerStyle(user)}>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3">
          <div className="flex items-center gap-1.5">
            {showSiteRole ? <RoleBadge kind="site" role={user.siteRole} /> : null}
            {resolvedRole ? <RoleBadge kind="company" role={resolvedRole} /> : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Avatar + Name */}
        <div className="-mt-12 flex items-end gap-3">
          <UserAvatar
            name={user.displayName}
            image={user.avatarUrl}
            accentColor={user.accentColor}
            size="lg"
            className="size-16 border-[3px] border-card"
          />
          <div className="min-w-0 pb-1">
            <div className="truncate text-lg font-semibold text-foreground">{user.displayName}</div>
            <div className="text-sm text-muted-foreground">
              @{user.username ?? "member"}
              {user.discordUsername ? ` · ${user.discordUsername}` : ""}
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p className={cn("text-sm text-muted-foreground", expanded ? "" : "line-clamp-3")}>{user.bio}</p>
        ) : null}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {user.badges.slice(0, expanded ? 6 : 3).map((badge) => (
            <span
              key={badge.id}
              className="rounded-md border px-2 py-0.5 text-xs font-medium text-foreground"
              style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
            >
              {badge.name}
            </span>
          ))}
          {user.badges.length === 0 ? (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              No badges yet
            </span>
          ) : null}
        </div>

        {/* Info panels */}
        <div className={cn("grid gap-2", expanded ? "sm:grid-cols-3" : "grid-cols-2")}>
          {/* Identity */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Identity</div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {user.discordUsername ? (
                <div className="flex items-center gap-2">
                  <Globe2 className="size-3.5 text-primary" />
                  <span>{user.discordUsername}</span>
                </div>
              ) : null}
              {user.minecraftNickname ? (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-3.5 text-primary" />
                  <span>{user.minecraftNickname}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-3.5 text-muted-foreground/40" />
                  <span className="text-muted-foreground/60">No MC name</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5 text-primary" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Company</div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {company ? (
                <>
                  <div className="font-medium text-foreground">{company.name}</div>
                  <div>{resolvedRole ? resolvedRole.replaceAll("_", " ") : "Member"}</div>
                  <div className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-[11px]">
                    {company.recruitingStatus.replaceAll("_", " ")}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground/60">No company linked</div>
              )}
            </div>
          </div>

          {/* Presence (expanded only) */}
          {expanded ? (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Presence</div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>{user.memberships.length} {user.memberships.length === 1 ? "company" : "companies"}</span>
                </div>
                <div>{user.badges.length} {user.badges.length === 1 ? "badge" : "badges"} unlocked</div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
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
      <HoverCardContent align="start" sideOffset={12} className={cn("w-[22rem] border-none bg-transparent p-0 shadow-none", className)}>
        <Dialog>
          <div className="space-y-2">
            <ProfileCard user={user} companyRole={companyRole} primaryCompany={primaryCompany} inviteHref={inviteHref} />
            <DialogTrigger render={<Button variant="secondary" size="sm" className="w-full text-xs" />}>
              Open full profile
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-2xl border-border bg-card p-0 shadow-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{user.displayName}</DialogTitle>
              <DialogDescription>PrismMTR member profile card.</DialogDescription>
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
