"use client";

import Link from "next/link";
import { CompanyRole } from "@prisma/client";
import { Building2, UserRoundPlus, UserSearch } from "lucide-react";

import { ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
};

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
      variant={expanded ? "full" : "compact"}
      className={cn(expanded ? "w-full" : "animate-scale-in")}
      actionRow={<QuickActions profileHref={profileHref} companyHref={companyHref} inviteHref={inviteHref} compact={!expanded} />}
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
