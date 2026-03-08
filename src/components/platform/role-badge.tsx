import { CompanyRole, SiteRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import type { BadgeChip } from "@/lib/data";
import { companyRoleMeta, getCompanyRoleLabel, getSiteRoleLabel, getSiteRoleTheme } from "@/lib/role-system";
import { cn } from "@/lib/utils";

type RoleBadgeProps = {
  role: CompanyRole | SiteRole;
  kind: "company" | "site";
  className?: string;
  contextLabel?: string | null;
  contextClassName?: string;
};

export function getSiteIdentityTheme(role: SiteRole) {
  return getSiteRoleTheme(role);
}

export function RoleBadge({ role, kind, className, contextLabel, contextClassName }: RoleBadgeProps) {
  const siteTheme = kind === "site" ? getSiteRoleTheme(role as SiteRole) : null;
  const companyMeta = kind === "company" ? companyRoleMeta[role as CompanyRole] : null;
  const Icon = kind === "site" ? siteTheme?.chipIcon : companyMeta?.icon;
  const tone =
    kind === "site" ? siteTheme?.chipClass : companyMeta?.chipClass;
  const label =
    kind === "site"
      ? getSiteRoleLabel(role as SiteRole)
      : getCompanyRoleLabel(role as CompanyRole);

  return (
    <Badge
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 overflow-hidden px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors",
        tone ?? "rounded-full border-white/10 bg-white/[0.03] text-white/62",
        className,
      )}
      aria-label={contextLabel ? `${label}, ${contextLabel}` : label}
    >
      {Icon ? <Icon className="size-3 shrink-0" /> : null}
      <span className="shrink-0">{label}</span>
      {kind === "company" && contextLabel ? (
        <span className={cn("whitespace-nowrap border-l border-current/18 pl-1.5 text-[10px] text-white/68", contextClassName)}>
          {contextLabel}
        </span>
      ) : null}
    </Badge>
  );
}

export function DecorativeBadgeChip({
  badge,
  className,
}: {
  badge: BadgeChip;
  className?: string;
}) {
  return (
    <span
      className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", className)}
      style={{ borderColor: `${badge.color}45`, backgroundColor: `${badge.color}12`, color: badge.color }}
    >
      {badge.name}
    </span>
  );
}

function normalizeBadgeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[_\s-]+/g, " ");
}

export function filterRenderableDecorativeBadges({
  badges,
  siteRoleLabel,
  companyRoleLabel,
}: {
  badges: BadgeChip[];
  siteRoleLabel?: string | null;
  companyRoleLabel?: string | null;
}) {
  const blockedLabels = new Set(
    [siteRoleLabel, companyRoleLabel]
      .filter(Boolean)
      .map((label) => normalizeBadgeLabel(label as string)),
  );

  return badges.filter((badge) => !blockedLabels.has(normalizeBadgeLabel(badge.name)));
}

export function DecorativeBadgeStack({
  badges,
  limit = 3,
  className,
}: {
  badges: BadgeChip[];
  limit?: number;
  className?: string;
}) {
  const visibleBadges = badges.slice(0, limit);
  const overflow = badges.length - visibleBadges.length;

  if (!badges.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visibleBadges.map((badge) => (
        <DecorativeBadgeChip key={badge.id} badge={badge} />
      ))}
      {overflow > 0 ? (
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/62">
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
