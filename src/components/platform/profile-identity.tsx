import { CompanyRole } from "@prisma/client";
import { Building2, CalendarDays, Gamepad2, Globe2, Sparkles } from "lucide-react";

import { DecorativeBadgeStack, filterRenderableDecorativeBadges, getSiteIdentityTheme, RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getCompanyRoleLabel, getSiteRoleLabel, getSiteRoleTheme } from "@/lib/role-system";
import { cn } from "@/lib/utils";

export type ProfileSurfaceVariant = "compact" | "preview" | "full";

export function resolveProfilePresence(user: UserPreview, primaryCompany?: CompanyReference | null) {
  const membership =
    (primaryCompany ? user.memberships.find((entry) => entry.company.id === primaryCompany.id) : undefined) ??
    user.memberships[0] ??
    null;

  return {
    membership,
    company: primaryCompany ?? membership?.company ?? null,
  };
}

function getBannerStyle(user: UserPreview) {
  const theme = getSiteRoleTheme(user.siteRole);

  if (user.bannerUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(6, 12, 20, 0.24), rgba(6, 12, 20, 0.72)), url(${user.bannerUrl}), ${theme.bannerBackground}`,
      backgroundSize: "cover, cover, auto",
      backgroundPosition: "center, center, center",
    };
  }

  return {
    background: theme.bannerBackground,
  };
}

export function PresenceBadge({
  label,
  icon: Icon = Building2,
  className,
}: {
  label: string;
  icon?: typeof Building2;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58",
        className,
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function ProfileHeader({
  user,
  companyRole,
  primaryCompany,
  variant = "full",
  headerLabel,
}: {
  user: UserPreview;
  companyRole?: CompanyRole | null;
  primaryCompany?: CompanyReference | null;
  variant?: ProfileSurfaceVariant;
  headerLabel?: string | null;
}) {
  const { membership, company } = resolveProfilePresence(user, primaryCompany);
  const resolvedRole = companyRole ?? membership?.companyRole ?? null;
  const theme = getSiteIdentityTheme(user.siteRole);
  const isPreview = variant === "preview";
  const bannerHeight =
    variant === "compact" ? "h-[6.1rem]" : isPreview ? "h-[6.8rem]" : "h-[10.5rem] sm:h-[12rem]";
  const avatarClass =
    variant === "compact"
      ? "border-[3px] border-[hsl(0_0%_6%)]"
      : isPreview
        ? "border-[3px] border-[hsl(0_0%_6%)]"
        : "size-24 border-4 border-[hsl(0_0%_6%)]";
  const avatarSize = isPreview ? "xl" : "lg";
  const topSpacing = variant === "compact" ? "-mt-[3.55rem]" : isPreview ? "-mt-[0.9rem]" : "-mt-[4.6rem]";
  const titleClass =
    variant === "compact"
      ? "text-[1.3rem]"
      : isPreview
        ? "text-[1.65rem]"
        : "text-[2.25rem] sm:text-[2.7rem]";

  return (
    <div className="overflow-hidden">
      <div className={cn("relative border-b", bannerHeight, theme.dividerClass)} style={getBannerStyle(user)}>
        <div
          className={cn(
            "absolute inset-0 z-0",
            variant === "compact"
              ? "bg-gradient-to-b from-black/12 via-black/26 to-black/62"
              : "bg-gradient-to-b from-black/6 via-black/20 to-black/58",
          )}
        />
        <div className={cn("absolute inset-x-0 top-0 h-px", theme.topRailClass)} />
        {variant !== "compact" ? (
          <>
            {theme.bannerGlowBackground ? (
              <div
                className="profile-banner-drift absolute inset-0 z-[1] opacity-95"
                style={{ background: theme.bannerGlowBackground }}
              />
            ) : null}
            <div
              className={cn(
                "profile-banner-sheen absolute inset-y-0 left-[-28%] z-[1] w-[56%] opacity-90",
                isPreview ? "top-0" : "top-0",
              )}
              style={{ background: theme.bannerSheenBackground }}
            />
          </>
        ) : null}
        {headerLabel ? (
          <div className="absolute inset-x-0 top-0 z-[2] flex items-center justify-start px-4 pt-4">
            <div className={cn("rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]", theme.contextLabelClass)}>
              {headerLabel}
            </div>
          </div>
        ) : null}
      </div>

      <div className={cn("space-y-4 p-4", isPreview ? "pt-5" : "", variant === "full" ? "sm:p-6" : "")}>
        <div className={cn("flex min-w-0", isPreview ? "items-start gap-5" : "items-end gap-4", topSpacing)}>
          <UserAvatar
            name={user.displayName}
            image={user.avatarUrl}
            accentColor={user.accentColor}
            size={avatarSize}
            className={cn(
              avatarClass,
              "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.72)]",
              theme.avatarRingClass,
            )}
          />
          <div className={cn("min-w-0 flex-1 space-y-2 pb-1", isPreview ? "pt-4" : "")}>
            <div className={cn("truncate font-display leading-none text-white", titleClass)}>{user.displayName}</div>
            <div className={cn("truncate text-[11px] uppercase tracking-[0.2em]", theme.usernameClass)}>
              @{user.username ?? "member"}
            </div>
            <div className={cn("flex flex-wrap items-center gap-1.5", isPreview ? "pt-1.5" : "")}>
              <RoleBadge kind="site" role={user.siteRole} />
              {resolvedRole ? (
                <RoleBadge
                  kind="company"
                  role={resolvedRole}
                  contextLabel={company?.name}
                  contextClassName={cn(
                    isPreview ? "normal-case tracking-[0.01em]" : "normal-case tracking-[0.01em]",
                  )}
                />
              ) : null}
              {!resolvedRole && company ? <PresenceBadge label={company.name} /> : null}
            </div>
          </div>
        </div>

        {user.bio ? (
          <p className={cn("text-sm leading-7 text-muted-foreground", variant === "compact" ? "line-clamp-3" : "")}>{user.bio}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ProfileMeta({
  user,
  primaryCompany,
  companyRole,
  variant = "full",
}: {
  user: UserPreview;
  primaryCompany?: CompanyReference | null;
  companyRole?: CompanyRole | null;
  variant?: ProfileSurfaceVariant;
}) {
  const { membership, company } = resolveProfilePresence(user, primaryCompany);
  const resolvedRole = companyRole ?? membership?.companyRole ?? null;

  return (
    <div className={cn("grid gap-2", variant === "full" ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      <div className="border-t border-white/8 pt-3">
        <div className="panel-label">Identity</div>
        <div className="mt-3 space-y-2 text-xs text-foreground/82">
          {user.discordUsername ? (
            <div className="flex items-center gap-2">
              <Globe2 className="size-3.5 text-muted-foreground" />
              <span className="truncate">{user.discordUsername}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Gamepad2 className="size-3.5 text-muted-foreground" />
            <span>{user.minecraftNickname ?? "No MC name linked"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 pt-3">
        <div className="panel-label">Presence</div>
        <div className="mt-3 space-y-2 text-xs text-foreground/82">
          <div className="font-medium text-foreground">{company ? company.name : "Independent member"}</div>
          <div>{resolvedRole ? getCompanyRoleLabel(resolvedRole) : "No company role"}</div>
          <div className="inline-flex rounded-md border border-white/8 bg-background/75 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {company ? company.recruitingStatus.replaceAll("_", " ") : `${user.memberships.length} memberships`}
          </div>
        </div>
      </div>

      {variant === "full" ? (
        <div className="border-t border-white/8 pt-3">
          <div className="panel-label">Network footprint</div>
          <div className="mt-3 space-y-2 text-xs text-foreground/82">
            <div className="flex items-center justify-between border-b border-white/8 pb-2">
              <span className="text-muted-foreground">Memberships</span>
              <span className="text-sm font-medium text-white">{user.memberships.length}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">Decorative badges</span>
              <span className="text-sm font-medium text-white">{user.badges.length}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function IdentityPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-white/8 pt-4", className)}>
      <div className="panel-label">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function ProfileIdentitySurface({
  user,
  companyRole,
  primaryCompany,
  variant = "full",
  headerLabel,
  actionRow,
  className,
}: {
  user: UserPreview;
  companyRole?: CompanyRole | null;
  primaryCompany?: CompanyReference | null;
  variant?: ProfileSurfaceVariant;
  headerLabel?: string;
  actionRow?: React.ReactNode;
  className?: string;
}) {
  const theme = getSiteIdentityTheme(user.siteRole);
  const { membership } = resolveProfilePresence(user, primaryCompany);
  const resolvedCompanyRole = companyRole ?? membership?.companyRole ?? null;
  const renderableBadges = filterRenderableDecorativeBadges({
    badges: user.badges,
    siteRoleLabel: getSiteRoleLabel(user.siteRole),
    companyRoleLabel: resolvedCompanyRole ? getCompanyRoleLabel(resolvedCompanyRole) : null,
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.03]",
        theme.surfaceClass,
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <ProfileHeader
        user={user}
        companyRole={companyRole}
        primaryCompany={primaryCompany}
        variant={variant}
        headerLabel={headerLabel ?? null}
      />
      <div className={cn("space-y-4 px-4 pb-4", variant === "full" ? "sm:px-6 sm:pb-6" : "")}>
        <ProfileMeta user={user} primaryCompany={primaryCompany} companyRole={companyRole} variant={variant} />
        {variant === "full" && renderableBadges.length > 0 ? (
          <div className="border-t border-white/8 pt-3">
            <div className="panel-label">Decorative badges</div>
            <DecorativeBadgeStack badges={renderableBadges} limit={6} className="mt-3" />
          </div>
        ) : null}
        {actionRow ? <div>{actionRow}</div> : null}
      </div>
    </div>
  );
}

export function ProfileStatsRail({
  stats,
}: {
  stats: Array<{ label: string; value: string | number; note?: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
      {stats.map((stat) => (
        <IdentityPanel key={stat.label} title={stat.label}>
          <div className="flex items-center gap-3 border-l border-blue-400/22 pl-3">
            <div className="flex size-9 items-center justify-center rounded-[0.85rem] border border-blue-400/16 bg-blue-400/[0.07] text-blue-200">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="font-display text-[1.4rem] leading-none text-white">{stat.value}</div>
              {stat.note ? <p className="mt-1 text-xs leading-6 text-muted-foreground">{stat.note}</p> : null}
            </div>
          </div>
        </IdentityPanel>
      ))}
    </div>
  );
}
