import { CollaborationStatus, type CompanyRole, type Prisma, type SiteRole } from "@prisma/client";

import { canManageCompanyCollaborations } from "@/lib/permissions";

export const ACTIVE_COLLABORATION_LIMIT = 5;
export const blockingCollaborationStatuses = [CollaborationStatus.PENDING, CollaborationStatus.ACTIVE] as const;

export function normalizeCompanyPair(leftCompanyId: string, rightCompanyId: string) {
  return leftCompanyId < rightCompanyId
    ? { companyAId: leftCompanyId, companyBId: rightCompanyId }
    : { companyAId: rightCompanyId, companyBId: leftCompanyId };
}

export function getCounterpartyCompanyId({
  companyAId,
  companyBId,
  companyId,
}: {
  companyAId: string;
  companyBId: string;
  companyId: string;
}) {
  return companyAId === companyId ? companyBId : companyAId;
}

export function canManageCompanyCollaboration({
  siteRole,
  companyRole,
}: {
  siteRole: SiteRole;
  companyRole?: CompanyRole | null;
}) {
  return siteRole === "ADMIN" || Boolean(companyRole && canManageCompanyCollaborations(companyRole));
}

export async function countActiveCollaborations(
  tx: Prisma.TransactionClient,
  companyId: string,
) {
  return tx.companyCollaboration.count({
    where: {
      status: CollaborationStatus.ACTIVE,
      OR: [{ companyAId: companyId }, { companyBId: companyId }],
    },
  });
}

export function getCollaborationLifecycleLabel(status: CollaborationStatus) {
  switch (status) {
    case CollaborationStatus.PENDING:
      return "Pending";
    case CollaborationStatus.ACTIVE:
      return "Active";
    case CollaborationStatus.REJECTED:
      return "Rejected";
    case CollaborationStatus.CANCELLED:
      return "Cancelled";
    case CollaborationStatus.ENDED:
      return "Ended";
    default:
      return status;
  }
}
