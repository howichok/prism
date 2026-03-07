import { CompanyRole, SiteRole } from "@prisma/client";

const siteRoleRank: Record<SiteRole, number> = {
  USER: 0,
  MOD: 1,
  ADMIN: 2,
};

const companyRoleRank: Record<CompanyRole, number> = {
  MEMBER: 0,
  TRUSTED_MEMBER: 1,
  CO_OWNER: 2,
  OWNER: 3,
};

export function hasSiteRole(current: SiteRole, required: SiteRole) {
  return siteRoleRank[current] >= siteRoleRank[required];
}

export function hasCompanyRole(current: CompanyRole, required: CompanyRole) {
  return companyRoleRank[current] >= companyRoleRank[required];
}

export function canAccessModeration(role: SiteRole) {
  return hasSiteRole(role, SiteRole.MOD);
}

export function canOverrideModeration(role: SiteRole) {
  return hasSiteRole(role, SiteRole.ADMIN);
}

export function canManageCompany(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.TRUSTED_MEMBER);
}

export function canReviewApplications(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.TRUSTED_MEMBER);
}

export function canManageInvites(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.CO_OWNER);
}

export function canEditCompanySettings(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.CO_OWNER);
}

export function canArchiveCompany(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.OWNER);
}

export function canTransferOwnership(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.OWNER);
}

export function canManageRole(actorRole: CompanyRole, targetRole: CompanyRole) {
  if (actorRole === CompanyRole.OWNER) {
    return targetRole !== CompanyRole.OWNER;
  }

  if (actorRole === CompanyRole.CO_OWNER) {
    return targetRole === CompanyRole.MEMBER || targetRole === CompanyRole.TRUSTED_MEMBER;
  }

  if (actorRole === CompanyRole.TRUSTED_MEMBER) {
    return targetRole === CompanyRole.MEMBER;
  }

  return false;
}

export function canInviteToCompany(role: CompanyRole) {
  return hasCompanyRole(role, CompanyRole.TRUSTED_MEMBER);
}

export function canLeaveCompany(role: CompanyRole) {
  return role !== CompanyRole.OWNER;
}
