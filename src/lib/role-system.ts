import { CompanyRole, SiteRole } from "@prisma/client";
import { Crown, Shield, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";

export const siteRoleRank: Record<SiteRole, number> = {
  USER: 0,
  MOD: 1,
  ADMIN: 2,
};

export const companyRoleRank: Record<CompanyRole, number> = {
  MEMBER: 0,
  TRUSTED_MEMBER: 1,
  CO_OWNER: 2,
  OWNER: 3,
};

export const discoverySiteRoleOrder: SiteRole[] = [SiteRole.ADMIN, SiteRole.MOD, SiteRole.USER];
export const companyRoleOrder: CompanyRole[] = [
  CompanyRole.OWNER,
  CompanyRole.CO_OWNER,
  CompanyRole.TRUSTED_MEMBER,
  CompanyRole.MEMBER,
];

export const siteRoleMeta: Record<
  SiteRole,
  {
    label: string;
    shortLabel: string;
    directoryGroupLabel: string;
    privileged: boolean;
    themeKey: "admin" | "moderator" | "user";
    searchAliases: string[];
  }
> = {
  ADMIN: {
    label: "Admin",
    shortLabel: "Admin",
    directoryGroupLabel: "Admin",
    privileged: true,
    themeKey: "admin",
    searchAliases: ["admin", "administrator", "command", "staff"],
  },
  MOD: {
    label: "Moderator",
    shortLabel: "Mod",
    directoryGroupLabel: "Moderators",
    privileged: true,
    themeKey: "moderator",
    searchAliases: ["moderator", "mod", "oversight", "staff"],
  },
  USER: {
    label: "User",
    shortLabel: "User",
    directoryGroupLabel: "Members",
    privileged: false,
    themeKey: "user",
    searchAliases: ["user", "member", "builder"],
  },
};

export const companyRoleMeta: Record<
  CompanyRole,
  {
    label: string;
    shortLabel: string;
    chipClass: string;
    icon?: LucideIcon;
    searchAliases: string[];
  }
> = {
  OWNER: {
    label: "Owner",
    shortLabel: "Owner",
    chipClass: "rounded-full border-amber-500/18 bg-amber-500/10 text-amber-300",
    icon: Crown,
    searchAliases: ["owner", "lead", "company owner"],
  },
  CO_OWNER: {
    label: "Co Owner",
    shortLabel: "Co Owner",
    chipClass: "rounded-full border-orange-500/18 bg-orange-500/10 text-orange-300",
    icon: Crown,
    searchAliases: ["co owner", "co-owner", "deputy"],
  },
  TRUSTED_MEMBER: {
    label: "Trusted Member",
    shortLabel: "Trusted",
    chipClass: "rounded-full border-cyan-500/18 bg-cyan-500/10 text-cyan-300",
    searchAliases: ["trusted", "trusted member", "staff"],
  },
  MEMBER: {
    label: "Member",
    shortLabel: "Member",
    chipClass: "rounded-full border-white/10 bg-white/[0.03] text-white/58",
    searchAliases: ["member", "builder"],
  },
};

export const siteRoleThemes: Record<
  SiteRole,
  {
    chipClass: string;
    chipIcon: LucideIcon;
    bannerBackground: string;
    bannerSheenBackground: string;
    bannerGlowBackground?: string;
    usernameClass: string;
    surfaceClass: string;
    softPanelClass: string;
    avatarRingClass: string;
    contextLabelClass: string;
    dividerClass: string;
    topRailClass: string;
    rosterGroupClass: string;
    rosterGroupCountClass: string;
    rosterRowHoverClass: string;
    rosterRowActiveClass: string;
    rosterRowEdgeClass: string;
  }
> = {
  ADMIN: {
    chipClass:
      "rounded-[0.65rem] border-rose-300/20 bg-[linear-gradient(180deg,rgba(111,29,36,0.28),rgba(22,10,12,0.92))] text-rose-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
    chipIcon: Shield,
    bannerBackground:
      "radial-gradient(circle at 14% 18%, rgba(251, 113, 133, 0.12), transparent 32%), linear-gradient(135deg, rgba(18, 21, 25, 0.985) 0%, rgba(11, 13, 17, 0.992) 42%, rgba(8, 10, 12, 1) 100%)",
    bannerSheenBackground:
      "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.00) 12%, rgba(251, 113, 133, 0.12) 34%, rgba(255, 255, 255, 0.16) 48%, rgba(244, 63, 94, 0.18) 64%, rgba(255,255,255,0.00) 84%, transparent 100%)",
    bannerGlowBackground:
      "radial-gradient(circle at 18% 30%, rgba(244, 63, 94, 0.12), transparent 32%), radial-gradient(circle at 72% 18%, rgba(190, 24, 93, 0.07), transparent 24%)",
    usernameClass: "text-rose-200",
    surfaceClass: "border-white/8 bg-[linear-gradient(180deg,rgba(12,12,14,0.992),rgba(8,10,12,0.992))]",
    softPanelClass: "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]",
    avatarRingClass: "border-rose-300/24",
    contextLabelClass:
      "rounded-[0.72rem] border-rose-300/16 bg-[linear-gradient(180deg,rgba(120,32,32,0.18),rgba(24,12,14,0.82))] text-rose-100/88",
    dividerClass: "border-white/8",
    topRailClass: "bg-gradient-to-r from-rose-300/40 via-rose-200/18 to-transparent",
    rosterGroupClass: "border-rose-300/16 bg-[linear-gradient(90deg,rgba(92,25,31,0.24),rgba(255,255,255,0.00))] text-rose-100/86",
    rosterGroupCountClass: "text-rose-200/54",
    rosterRowHoverClass: "hover:border-rose-300/14 hover:bg-[linear-gradient(90deg,rgba(92,25,31,0.12),rgba(255,255,255,0.00))]",
    rosterRowActiveClass: "border-rose-300/18 bg-[linear-gradient(90deg,rgba(92,25,31,0.18),rgba(255,255,255,0.00))]",
    rosterRowEdgeClass: "bg-gradient-to-b from-rose-300/50 to-transparent",
  },
  MOD: {
    chipClass:
      "rounded-full border-sky-300/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,47,73,0.62))] text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
    chipIcon: ShieldCheck,
    bannerBackground:
      "radial-gradient(circle at 18% 16%, rgba(59, 130, 246, 0.22), transparent 34%), linear-gradient(135deg, rgba(16, 33, 62, 0.96) 0%, rgba(12, 20, 36, 0.98) 42%, rgba(8, 10, 12, 1) 100%)",
    bannerSheenBackground:
      "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.00) 10%, rgba(125, 211, 252, 0.10) 34%, rgba(255, 255, 255, 0.12) 48%, rgba(59, 130, 246, 0.14) 64%, rgba(255,255,255,0.00) 84%, transparent 100%)",
    bannerGlowBackground:
      "radial-gradient(circle at 18% 34%, rgba(56, 189, 248, 0.22), transparent 34%), radial-gradient(circle at 76% 16%, rgba(96, 165, 250, 0.14), transparent 26%)",
    usernameClass: "text-sky-200",
    surfaceClass: "border-sky-300/12 bg-[linear-gradient(180deg,rgba(9,14,20,0.985),rgba(10,10,10,0.985))]",
    softPanelClass: "border-sky-300/10 bg-[linear-gradient(180deg,rgba(14,42,78,0.10),rgba(255,255,255,0.01))]",
    avatarRingClass: "border-sky-300/22",
    contextLabelClass:
      "rounded-full border-sky-300/14 bg-[linear-gradient(180deg,rgba(18,36,64,0.96),rgba(11,25,40,0.92))] text-sky-100/90",
    dividerClass: "border-sky-300/10",
    topRailClass: "bg-gradient-to-r from-sky-300/32 via-cyan-200/10 to-transparent",
    rosterGroupClass: "border-sky-300/14 bg-[linear-gradient(90deg,rgba(24,56,104,0.18),rgba(255,255,255,0.00))] text-sky-100/84",
    rosterGroupCountClass: "text-sky-100/46",
    rosterRowHoverClass: "hover:border-sky-300/12 hover:bg-[linear-gradient(90deg,rgba(24,56,104,0.10),rgba(255,255,255,0.00))]",
    rosterRowActiveClass: "border-sky-300/16 bg-[linear-gradient(90deg,rgba(24,56,104,0.16),rgba(255,255,255,0.00))]",
    rosterRowEdgeClass: "bg-gradient-to-b from-sky-300/44 to-transparent",
  },
  USER: {
    chipClass: "rounded-full border-white/10 bg-white/[0.04] text-white/68",
    chipIcon: UserRound,
    bannerBackground:
      "radial-gradient(circle at 14% 14%, rgba(96, 165, 250, 0.08), transparent 28%), linear-gradient(135deg, rgba(17, 22, 30, 0.96) 0%, rgba(11, 13, 18, 0.98) 42%, rgba(8, 10, 12, 1) 100%)",
    bannerSheenBackground:
      "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.00) 14%, rgba(148, 163, 184, 0.06) 38%, rgba(255, 255, 255, 0.08) 50%, rgba(96, 165, 250, 0.06) 66%, rgba(255,255,255,0.00) 86%, transparent 100%)",
    usernameClass: "text-white/72",
    surfaceClass: "border-white/8 bg-popover/95",
    softPanelClass: "border-border/60 bg-muted/30",
    avatarRingClass: "border-white/12",
    contextLabelClass: "border-white/12 bg-black/25 text-white/72",
    dividerClass: "border-white/8",
    topRailClass: "bg-gradient-to-r from-white/16 via-white/5 to-transparent",
    rosterGroupClass: "border-white/10 bg-white/[0.02] text-white/72",
    rosterGroupCountClass: "text-white/34",
    rosterRowHoverClass: "hover:border-white/8 hover:bg-white/[0.03]",
    rosterRowActiveClass: "border-white/12 bg-white/[0.05]",
    rosterRowEdgeClass: "bg-gradient-to-b from-white/22 to-transparent",
  },
};

export function getSiteRoleMeta(role: SiteRole) {
  return siteRoleMeta[role];
}

export function getCompanyRoleMeta(role: CompanyRole) {
  return companyRoleMeta[role];
}

export function getSiteRoleLabel(role: SiteRole) {
  return siteRoleMeta[role].label;
}

export function getCompanyRoleLabel(role: CompanyRole) {
  return companyRoleMeta[role].label;
}

export function getDiscoveryGroupLabel(role: SiteRole) {
  return siteRoleMeta[role].directoryGroupLabel;
}

export function getSiteRoleTheme(role: SiteRole) {
  return siteRoleThemes[role];
}

export function getSiteRoleSearchAliases(role: SiteRole) {
  return siteRoleMeta[role].searchAliases;
}

export function getCompanyRoleSearchAliases(role: CompanyRole) {
  return companyRoleMeta[role].searchAliases;
}
