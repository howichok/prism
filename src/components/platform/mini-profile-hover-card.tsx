"use client";

import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { Building2, UserRoundPlus, UserSearch } from "lucide-react";
import type { PreviewCard } from "@base-ui/react/preview-card";

import { ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { cn } from "@/lib/utils";

type MiniProfileHoverCardProps = {
  user: UserPreview;
  companyRole?: CompanyRole | null;
  primaryCompany?: CompanyReference | null;
  inviteHref?: string;
  children: React.ReactNode;
  className?: string;
  contentSide?: PreviewCard.Positioner.Props["side"];
  contentAlign?: PreviewCard.Positioner.Props["align"];
  contentSideOffset?: number;
  contentAlignOffset?: number;
};

function QuickActions({
  profileHref,
  companyHref,
  inviteHref,
}: {
  profileHref: string;
  companyHref?: string;
  inviteHref?: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button size="sm" render={<Link href={profileHref} />} className="w-full">
        <UserSearch className="size-3.5" />
        Full profile
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
  const profileHref = `/users/${user.username ?? ""}`;
  const membership = primaryCompany
    ? user.memberships.find((entry) => entry.company.id === primaryCompany.id) ?? user.memberships[0] ?? null
    : user.memberships[0] ?? null;
  const company = primaryCompany ?? membership?.company ?? null;
  const companyHref = company ? `/companies/${company.slug}` : undefined;

  return (
    <ProfileIdentitySurface
      user={user}
      companyRole={companyRole}
      primaryCompany={primaryCompany}
      variant={expanded ? "full" : "preview"}
      className={cn(expanded ? "w-full" : "w-full animate-scale-in")}
      actionRow={
        <QuickActions
          profileHref={profileHref}
          companyHref={companyHref}
          inviteHref={inviteHref}
        />
      }
    />
  );
}

export function MiniProfileHoverCard({
  user,
  companyRole,
  primaryCompany,
  inviteHref,
  children,
  className,
  contentSide = "inline-end",
  contentAlign = "start",
  contentSideOffset = 12,
  contentAlignOffset = 0,
}: MiniProfileHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger delay={160} closeDelay={110} render={<div className="block min-w-0" />}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={contentSide}
        align={contentAlign}
        sideOffset={contentSideOffset}
        alignOffset={contentAlignOffset}
        className={cn("w-[min(23.5rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] border-none bg-transparent p-0 shadow-none", className)}
      >
        <ProfileCard user={user} companyRole={companyRole} primaryCompany={primaryCompany} inviteHref={inviteHref} />
      </HoverCardContent>
    </HoverCard>
  );
}
