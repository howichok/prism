"use client";

import { memo, useMemo } from "react";
import { CompanyRole } from "@prisma/client";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { DecorativeBadgeChip, filterRenderableDecorativeBadges, RoleBadge } from "@/components/platform/role-badge";
import { resolveProfilePresence } from "@/components/platform/profile-identity";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { getCompanyRoleLabel, getSiteRoleLabel, getSiteRoleTheme } from "@/lib/role-system";
import { cn } from "@/lib/utils";

function highlightText(text: string, query: string) {
  const normalized = query.trim();
  if (!normalized) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalized.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + normalized.length);
  const after = text.slice(matchIndex + normalized.length);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-blue-400/18 px-0.5 text-white">{match}</mark>
      {after}
    </>
  );
}

export const ProfileRosterRow = memo(function ProfileRosterRow({
  user,
  primaryCompany,
  companyRole,
  searchTerm = "",
  active = false,
  onSelect,
  rightRailExtra,
  variant = "directory",
  className,
}: {
  user: UserPreview;
  primaryCompany?: CompanyReference | null;
  companyRole?: CompanyRole | null;
  searchTerm?: string;
  active?: boolean;
  onSelect?: () => void;
  rightRailExtra?: React.ReactNode;
  variant?: "directory" | "identity";
  className?: string;
}) {
  const { membership, company } = resolveProfilePresence(user, primaryCompany);
  const resolvedCompanyRole = companyRole ?? membership?.companyRole ?? null;
  const theme = getSiteRoleTheme(user.siteRole);
  const isIdentityVariant = variant === "identity";

  const visibleBadges = useMemo(
    () =>
      filterRenderableDecorativeBadges({
        badges: user.badges,
        siteRoleLabel: getSiteRoleLabel(user.siteRole),
        companyRoleLabel: resolvedCompanyRole ? getCompanyRoleLabel(resolvedCompanyRole) : null,
      }),
    [resolvedCompanyRole, user.badges, user.siteRole],
  );

  const secondaryLine = useMemo(
    () =>
      isIdentityVariant
        ? [
            resolvedCompanyRole ? getCompanyRoleLabel(resolvedCompanyRole) : null,
            !resolvedCompanyRole && company ? company.name : null,
            !resolvedCompanyRole && !company ? `@${user.username ?? "member"}` : null,
          ]
            .filter(Boolean)
            .join(" - ")
        : [
            `@${user.username ?? "member"}`,
            user.minecraftNickname ?? null,
            !resolvedCompanyRole && company ? company.name : null,
          ]
            .filter(Boolean)
            .join(" / "),
    [company, isIdentityVariant, resolvedCompanyRole, user.minecraftNickname, user.username],
  );

  const showPrivilegedSiteRole = user.siteRole !== "USER";
  const showCompanyChip = !isIdentityVariant && Boolean(resolvedCompanyRole);
  const showDecorativeBadges = !isIdentityVariant;

  return (
    <MiniProfileHoverCard
      user={user}
      companyRole={resolvedCompanyRole}
      primaryCompany={company}
      contentSide="bottom"
      contentAlign="start"
      contentSideOffset={10}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-[0.95rem] border px-3 py-3 text-left transition-[background-color,border-color,box-shadow] duration-[var(--motion-duration-normal)] ease-[var(--motion-ease)]",
          isIdentityVariant ? theme.inlineSurfaceClass : theme.rosterSurfaceClass,
          active ? theme.rosterRowActiveClass : theme.rosterRowHoverClass,
          className,
        )}
      >
        <span className={cn("absolute inset-x-0 top-0 h-px opacity-70", theme.topRailClass)} />
        <span
          className={cn(
            "absolute inset-y-2 left-0 w-px rounded-full opacity-0 transition-opacity duration-[var(--motion-duration-normal)] ease-[var(--motion-ease)]",
            theme.rosterRowEdgeClass,
            active ? "opacity-100" : "group-hover:opacity-80",
          )}
        />

        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={user.displayName}
            image={user.avatarUrl}
            accentColor={user.accentColor}
            size={isIdentityVariant ? "default" : "sm"}
            className={cn("border", theme.avatarRingClass, active ? "border-white/18" : "")}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{highlightText(user.displayName, searchTerm)}</div>
            <div className={cn("truncate text-xs leading-5", isIdentityVariant ? "text-white/64" : "text-white/58")}>
              {highlightText(secondaryLine, searchTerm)}
            </div>
          </div>
        </div>

        <div className="ml-2 flex shrink-0 flex-wrap items-center justify-end gap-1.5 md:max-w-none">
          {showPrivilegedSiteRole ? (
            <RoleBadge
              kind="site"
              role={user.siteRole}
              className={isIdentityVariant ? "px-2 py-0.5 text-[9px] tracking-[0.15em]" : undefined}
            />
          ) : null}
          {showCompanyChip ? (
            <RoleBadge
              kind="company"
              role={resolvedCompanyRole}
              contextLabel={company?.name}
              contextClassName="normal-case tracking-[0.01em]"
            />
          ) : null}
          {showDecorativeBadges && visibleBadges[0] ? <DecorativeBadgeChip badge={visibleBadges[0]} /> : null}
          {showDecorativeBadges && visibleBadges.length > 1 ? (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/60">
              +{visibleBadges.length - 1}
            </span>
          ) : null}
          {rightRailExtra}
        </div>
      </button>
    </MiniProfileHoverCard>
  );
});

ProfileRosterRow.displayName = "ProfileRosterRow";
