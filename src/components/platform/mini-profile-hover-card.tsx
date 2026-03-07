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
      backgroundImage: `linear-gradient(180deg, rgba(6, 12, 20, 0.08), rgba(6, 12, 20, 0.8)), url(${user.bannerUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background: `linear-gradient(140deg, ${user.accentColor ?? "hsl(221 83% 53%)"} 0%, hsl(0 0% 10%) 42%, hsl(0 0% 5%) 100%)`,
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
        <UserRoundPlus className="size-3.5" />
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
        "flex h-full flex-col overflow-hidden rounded-[1rem] border border-border bg-popover/95 text-popover-foreground shadow-[0_30px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl",
        expanded ? "w-full" : "animate-scale-in",
      )}
    >
      <div className="relative h-[7.5rem] border-b border-white/8" style={getBannerStyle(user)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4">
          <div className="rounded-full border border-white/12 bg-black/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/72 backdrop-blur-sm">
            Identity console
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3">
          <div className="flex items-center gap-1.5">
            {showSiteRole ? <RoleBadge kind="site" role={user.siteRole} /> : null}
            {resolvedRole ? <RoleBadge kind="company" role={resolvedRole} /> : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="-mt-[3.25rem] flex items-end gap-3">
          <UserAvatar
            name={user.displayName}
            image={user.avatarUrl}
            accentColor={user.accentColor}
            size="lg"
            className="size-16 border-[3px] border-popover"
          />
          <div className="min-w-0 pb-1 flex flex-col gap-1">
            <div className="truncate font-display text-xl leading-none text-foreground">{user.displayName}</div>
            <div className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              @{user.username ?? "member"}
              {user.discordUsername ? ` / ${user.discordUsername}` : ""}
            </div>
          </div>
        </div>

        {user.bio ? (
          <p className={cn("text-sm leading-7 text-muted-foreground", expanded ? "" : "line-clamp-3")}>{user.bio}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {user.badges.slice(0, expanded ? 6 : 3).map((badge) => (
            <span
              key={badge.id}
              className="rounded-md border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
              style={{ borderColor: `${badge.color}45`, backgroundColor: `${badge.color}12`, color: badge.color }}
            >
              {badge.name}
            </span>
          ))}
          {user.badges.length === 0 ? (
            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
              No badges
            </span>
          ) : null}
        </div>

        <div className={cn("grid gap-2", expanded ? "sm:grid-cols-3" : "grid-cols-2")}>
          <div className="rounded-[0.85rem] border border-border/60 bg-muted/30 p-3">
            <div className="panel-label">Identity</div>
            <div className="mt-3 space-y-2 text-xs text-foreground/80">
              {user.discordUsername ? (
                <div className="flex items-center gap-2">
                  <Globe2 className="size-3.5 text-muted-foreground" />
                  <span>{user.discordUsername}</span>
                </div>
              ) : null}
              {user.minecraftNickname ? (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-3.5 text-muted-foreground" />
                  <span>{user.minecraftNickname}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground/60">
                  <Gamepad2 className="size-3.5" />
                  <span>No MC name</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5 text-muted-foreground" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[0.85rem] border border-border/60 bg-muted/30 p-3">
            <div className="panel-label">Company</div>
            <div className="mt-3 space-y-2 text-xs text-foreground/80">
              {company ? (
                <>
                  <div className="font-medium text-foreground">{company.name}</div>
                  <div>{resolvedRole ? resolvedRole.replaceAll("_", " ") : "Member"}</div>
                  <div className="inline-flex rounded-md border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {company.recruitingStatus.replaceAll("_", " ")}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground/60">No company linked</div>
              )}
            </div>
          </div>

          {expanded ? (
            <div className="rounded-[0.85rem] border border-border/60 bg-muted/30 p-3">
              <div className="panel-label">Presence</div>
              <div className="mt-3 space-y-2 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-muted-foreground" />
                  <span>{user.memberships.length} active memberships</span>
                </div>
                <div>{user.badges.length} identity markers unlocked</div>
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
      <HoverCardContent
        align="start"
        sideOffset={12}
        className={cn("w-[23rem] border-none bg-transparent p-0 shadow-none", className)}
      >
        <Dialog>
          <div className="space-y-2">
            <ProfileCard user={user} companyRole={companyRole} primaryCompany={primaryCompany} inviteHref={inviteHref} />
            <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
              Expand identity
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
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
