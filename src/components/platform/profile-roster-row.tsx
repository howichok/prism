"use client";

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

export function ProfileRosterRow({
  user,
  primaryCompany,
  companyRole,
  searchTerm = "",
  active = false,
  onSelect,
  rightRailExtra,
  className,
}: {
  user: UserPreview;
  primaryCompany?: CompanyReference | null;
  companyRole?: CompanyRole | null;
  searchTerm?: string;
  active?: boolean;
  onSelect?: () => void;
  rightRailExtra?: React.ReactNode;
  className?: string;
}) {
  const { membership, company } = resolveProfilePresence(user, primaryCompany);
  const resolvedCompanyRole = companyRole ?? membership?.companyRole ?? null;
  const theme = getSiteRoleTheme(user.siteRole);
  const visibleBadges = filterRenderableDecorativeBadges({
    badges: user.badges,
    siteRoleLabel: getSiteRoleLabel(user.siteRole),
    companyRoleLabel: resolvedCompanyRole ? getCompanyRoleLabel(resolvedCompanyRole) : null,
  });

  const secondaryLine = [
    `@${user.username ?? "member"}`,
    user.minecraftNickname ?? null,
    !resolvedCompanyRole && company ? company.name : null,
  ]
    .filter(Boolean)
    .join(" / ");

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
          "group relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[0.95rem] border border-transparent px-3 py-3 text-left transition-[background-color,border-color]",
          active ? theme.rosterRowActiveClass : theme.rosterRowHoverClass,
          className,
        )}
      >
        <span
          className={cn(
            "absolute inset-y-2 left-0 w-px rounded-full opacity-0 transition-opacity",
            theme.rosterRowEdgeClass,
            active ? "opacity-100" : "group-hover:opacity-80",
          )}
        />

        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={user.displayName}
            image={user.avatarUrl}
            accentColor={user.accentColor}
            size="sm"
            className={cn("border border-white/10", active ? "border-white/18" : "")}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{highlightText(user.displayName, searchTerm)}</div>
            <div className="truncate text-xs leading-5 text-white/58">{highlightText(secondaryLine, searchTerm)}</div>
          </div>
        </div>

        <div className="ml-2 flex shrink-0 flex-wrap items-center justify-end gap-1.5 md:max-w-none">
          <RoleBadge kind="site" role={user.siteRole} />
          {resolvedCompanyRole ? (
            <RoleBadge
              kind="company"
              role={resolvedCompanyRole}
              contextLabel={company?.name}
              contextClassName="normal-case tracking-[0.01em]"
            />
          ) : null}
          {visibleBadges[0] ? <DecorativeBadgeChip badge={visibleBadges[0]} /> : null}
          {visibleBadges.length > 1 ? (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/60">
              +{visibleBadges.length - 1}
            </span>
          ) : null}
          {rightRailExtra}
        </div>
      </button>
    </MiniProfileHoverCard>
  );
}
