import { CompanyRole, SiteRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type RoleBadgeProps = {
  role: CompanyRole | SiteRole;
  kind: "company" | "site";
  className?: string;
};

const siteToneMap: Partial<Record<SiteRole, string>> = {
  ADMIN: "border-rose-500/28 bg-rose-500/12 text-rose-300 hover:bg-rose-500/20",
  MOD: "border-sky-500/28 bg-sky-500/12 text-sky-300 hover:bg-sky-500/20",
  USER: "border-border bg-secondary text-muted-foreground",
};

const companyToneMap: Partial<Record<CompanyRole, string>> = {
  OWNER: "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
  CO_OWNER: "border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20",
  TRUSTED_MEMBER: "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
  MEMBER: "border-border bg-secondary text-muted-foreground",
};

const siteRoleLabelMap: Record<SiteRole, string> = {
  ADMIN: "Admin",
  MOD: "Moderator",
  USER: "User",
};

const companyRoleLabelMap: Record<CompanyRole, string> = {
  OWNER: "Owner",
  CO_OWNER: "Co Owner",
  TRUSTED_MEMBER: "Trusted Member",
  MEMBER: "Member",
};

export function getSiteIdentityTheme(role: SiteRole) {
  switch (role) {
    case SiteRole.ADMIN:
      return {
        usernameClass: "text-rose-300",
        surfaceClass: "border-rose-500/20 bg-[linear-gradient(180deg,rgba(18,10,12,0.985),rgba(10,10,10,0.985))]",
        softPanelClass: "border-rose-500/14 bg-rose-500/[0.05]",
        avatarRingClass: "border-rose-400/30",
        accentLabelClass: "border-rose-400/18 bg-rose-500/14 text-rose-200/88",
        dividerClass: "border-rose-500/14",
      };
    case SiteRole.MOD:
      return {
        usernameClass: "text-sky-300",
        surfaceClass: "border-sky-500/20 bg-[linear-gradient(180deg,rgba(8,12,18,0.985),rgba(10,10,10,0.985))]",
        softPanelClass: "border-sky-500/14 bg-sky-500/[0.05]",
        avatarRingClass: "border-sky-400/30",
        accentLabelClass: "border-sky-400/18 bg-sky-500/14 text-sky-200/88",
        dividerClass: "border-sky-500/14",
      };
    default:
      return {
        usernameClass: "text-white/72",
        surfaceClass: "border-white/8 bg-popover/95",
        softPanelClass: "border-border/60 bg-muted/30",
        avatarRingClass: "border-white/12",
        accentLabelClass: "border-white/12 bg-black/25 text-white/72",
        dividerClass: "border-white/8",
      };
  }
}

export function RoleBadge({ role, kind, className }: RoleBadgeProps) {
  const tone =
    kind === "site"
      ? siteToneMap[role as SiteRole] ?? siteToneMap.USER
      : companyToneMap[role as CompanyRole] ?? companyToneMap.MEMBER;
  const label =
    kind === "site"
      ? siteRoleLabelMap[role as SiteRole] ?? titleCase(role)
      : companyRoleLabelMap[role as CompanyRole] ?? titleCase(role);

  return (
    <Badge
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
        tone,
        className,
      )}
    >
      {label}
    </Badge>
  );
}
