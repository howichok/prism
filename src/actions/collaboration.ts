"use server";

import { CollaborationStatus, NotificationType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  ACTIVE_COLLABORATION_LIMIT,
  blockingCollaborationStatuses,
  canManageCompanyCollaboration,
  countActiveCollaborations,
  getCounterpartyCompanyId,
  normalizeCompanyPair,
} from "@/lib/company-collaborations";
import { db } from "@/lib/db";
import { createNotificationsForUsers } from "@/lib/notifications";
import { requireUser } from "@/lib/session";
import {
  companyCollaborationDecisionSchema,
  companyCollaborationEndSchema,
  companyCollaborationRejectSchema,
  companyCollaborationRequestSchema,
} from "@/lib/validators";

async function getCompanyAccess(userId: string, companyId: string) {
  return db.companyMember.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
    select: {
      companyRole: true,
    },
  });
}

async function getCompanyBasics(companyId: string) {
  return db.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
    },
  });
}

async function getCollaborationRecord(collaborationId: string) {
  return db.companyCollaboration.findUnique({
    where: {
      id: collaborationId,
    },
    select: {
      id: true,
      companyAId: true,
      companyBId: true,
      requestingCompanyId: true,
      createdByUserId: true,
      status: true,
      message: true,
      companyA: {
        select: { id: true, name: true, slug: true, ownerId: true },
      },
      companyB: {
        select: { id: true, name: true, slug: true, ownerId: true },
      },
    },
  });
}

function revalidateCollaborationPaths(sourceSlug: string, targetSlug: string) {
  const companyPaths = [
    `/companies/${sourceSlug}`,
    `/companies/${targetSlug}`,
    `/dashboard/company/${sourceSlug}`,
    `/dashboard/company/${targetSlug}`,
    `/dashboard/company/${sourceSlug}/collaborations`,
    `/dashboard/company/${targetSlug}/collaborations`,
    "/dashboard/notifications",
  ];

  for (const path of companyPaths) {
    revalidatePath(path);
  }
}

async function createCompanyActivity(
  tx: Prisma.TransactionClient,
  input: {
    companyId: string;
    actorId: string;
    title: string;
    body: string;
  },
) {
  await tx.activityEvent.create({
    data: {
      companyId: input.companyId,
      actorId: input.actorId,
      type: "COMPANY_UPDATED",
      title: input.title,
      body: input.body,
    },
  });
}

export async function requestCompanyCollaborationAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCollaborationRequestSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Collaboration request is invalid." };
  }

  const { sourceCompanyId, targetCompanyId, message } = result.data;

  if (sourceCompanyId === targetCompanyId) {
    return { ok: false, message: "A company cannot collaborate with itself." };
  }

  const [sourceCompany, targetCompany] = await Promise.all([
    getCompanyBasics(sourceCompanyId),
    getCompanyBasics(targetCompanyId),
  ]);

  if (!sourceCompany || !targetCompany) {
    return { ok: false, message: "Company record was not found." };
  }

  const isAdmin = user.siteRole === "ADMIN";
  const sourceAccess = isAdmin ? { companyRole: null } : await getCompanyAccess(user.id, sourceCompanyId);

  if (!isAdmin && !canManageCompanyCollaboration({ siteRole: user.siteRole, companyRole: sourceAccess?.companyRole })) {
    return { ok: false, message: "Only a company owner can request collaborations." };
  }

  const pair = normalizeCompanyPair(sourceCompanyId, targetCompanyId);
  const existing = await db.companyCollaboration.findFirst({
    where: {
      companyAId: pair.companyAId,
      companyBId: pair.companyBId,
      status: {
        in: [...blockingCollaborationStatuses],
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return { ok: false, message: "An active or pending collaboration already exists for this company pair." };
  }

  await db.$transaction(async (tx) => {
    await tx.companyCollaboration.create({
      data: {
        companyAId: pair.companyAId,
        companyBId: pair.companyBId,
        requestingCompanyId: sourceCompanyId,
        createdByUserId: user.id,
        status: CollaborationStatus.PENDING,
        message: message || null,
      },
    });

    await createCompanyActivity(tx, {
      companyId: sourceCompany.id,
      actorId: user.id,
      title: "Collaboration requested",
      body: `A collaboration request was sent to ${targetCompany.name}.`,
    });

    await createCompanyActivity(tx, {
      companyId: targetCompany.id,
      actorId: user.id,
      title: "Collaboration request received",
      body: `${sourceCompany.name} sent a collaboration request.`,
    });

    await createNotificationsForUsers(tx, [targetCompany.ownerId], {
      type: NotificationType.COLLABORATION,
      title: "New collaboration request",
      body: `${sourceCompany.name} requested to collaborate with ${targetCompany.name}.`,
    });
  });

  revalidateCollaborationPaths(sourceCompany.slug, targetCompany.slug);

  return {
    ok: true,
    message: `Collaboration request sent to ${targetCompany.name}.`,
  };
}

export async function acceptCompanyCollaborationAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCollaborationDecisionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Unable to accept collaboration." };
  }

  const collaboration = await getCollaborationRecord(result.data.collaborationId);

  if (!collaboration) {
    return { ok: false, message: "Collaboration request not found." };
  }

  if (collaboration.status !== CollaborationStatus.PENDING) {
    return { ok: false, message: "Only pending requests can be accepted." };
  }

  const receivingCompanyId = getCounterpartyCompanyId({
    companyAId: collaboration.companyAId,
    companyBId: collaboration.companyBId,
    companyId: collaboration.requestingCompanyId,
  });

  const isAdmin = user.siteRole === "ADMIN";
  const access = isAdmin ? { companyRole: null } : await getCompanyAccess(user.id, receivingCompanyId);

  if (!isAdmin && !canManageCompanyCollaboration({ siteRole: user.siteRole, companyRole: access?.companyRole })) {
    return { ok: false, message: "Only the receiving company owner can accept this collaboration." };
  }

  const sourceCompany = collaboration.companyAId === collaboration.requestingCompanyId ? collaboration.companyA : collaboration.companyB;
  const targetCompany = collaboration.companyAId === receivingCompanyId ? collaboration.companyA : collaboration.companyB;

  const resultState = await db.$transaction(async (tx) => {
    const fresh = await tx.companyCollaboration.findUnique({
      where: { id: collaboration.id },
      select: {
        id: true,
        status: true,
        companyAId: true,
        companyBId: true,
      },
    });

    if (!fresh || fresh.status !== CollaborationStatus.PENDING) {
      return { ok: false as const, message: "This collaboration request is no longer pending." };
    }

    const [sourceActiveCount, targetActiveCount] = await Promise.all([
      countActiveCollaborations(tx, sourceCompany.id),
      countActiveCollaborations(tx, targetCompany.id),
    ]);

    if (sourceActiveCount >= ACTIVE_COLLABORATION_LIMIT || targetActiveCount >= ACTIVE_COLLABORATION_LIMIT) {
      return {
        ok: false as const,
        message: `Each company can have at most ${ACTIVE_COLLABORATION_LIMIT} active collaborations.`,
      };
    }

    await tx.companyCollaboration.update({
      where: {
        id: collaboration.id,
      },
      data: {
        status: CollaborationStatus.ACTIVE,
        respondedAt: new Date(),
        startedAt: new Date(),
      },
    });

    await createCompanyActivity(tx, {
      companyId: sourceCompany.id,
      actorId: user.id,
      title: "Collaboration activated",
      body: `${sourceCompany.name} and ${targetCompany.name} are now active collaborators.`,
    });

    await createCompanyActivity(tx, {
      companyId: targetCompany.id,
      actorId: user.id,
      title: "Collaboration activated",
      body: `${sourceCompany.name} and ${targetCompany.name} are now active collaborators.`,
    });

    await createNotificationsForUsers(tx, [sourceCompany.ownerId, targetCompany.ownerId], {
      type: NotificationType.COLLABORATION,
      title: "Collaboration accepted",
      body: `${targetCompany.name} accepted the collaboration request from ${sourceCompany.name}.`,
    });

    return { ok: true as const };
  });

  if (!resultState.ok) {
    return resultState;
  }

  revalidateCollaborationPaths(sourceCompany.slug, targetCompany.slug);

  return {
    ok: true,
    message: `${sourceCompany.name} and ${targetCompany.name} are now collaborating.`,
  };
}

export async function rejectCompanyCollaborationAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCollaborationRejectSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Unable to reject collaboration." };
  }

  const collaboration = await getCollaborationRecord(result.data.collaborationId);

  if (!collaboration) {
    return { ok: false, message: "Collaboration request not found." };
  }

  if (collaboration.status !== CollaborationStatus.PENDING) {
    return { ok: false, message: "Only pending requests can be rejected." };
  }

  const receivingCompanyId = getCounterpartyCompanyId({
    companyAId: collaboration.companyAId,
    companyBId: collaboration.companyBId,
    companyId: collaboration.requestingCompanyId,
  });
  const isAdmin = user.siteRole === "ADMIN";
  const access = isAdmin ? { companyRole: null } : await getCompanyAccess(user.id, receivingCompanyId);

  if (!isAdmin && !canManageCompanyCollaboration({ siteRole: user.siteRole, companyRole: access?.companyRole })) {
    return { ok: false, message: "Only the receiving company owner can reject this collaboration." };
  }

  const sourceCompany = collaboration.companyAId === collaboration.requestingCompanyId ? collaboration.companyA : collaboration.companyB;
  const targetCompany = collaboration.companyAId === receivingCompanyId ? collaboration.companyA : collaboration.companyB;

  await db.$transaction(async (tx) => {
    await tx.companyCollaboration.update({
      where: { id: collaboration.id },
      data: {
        status: CollaborationStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    await createCompanyActivity(tx, {
      companyId: targetCompany.id,
      actorId: user.id,
      title: "Collaboration rejected",
      body: result.data.reason
        ? `The request from ${sourceCompany.name} was rejected. ${result.data.reason}`
        : `The request from ${sourceCompany.name} was rejected.`,
    });

    await createNotificationsForUsers(tx, [sourceCompany.ownerId], {
      type: NotificationType.COLLABORATION,
      title: "Collaboration rejected",
      body: result.data.reason
        ? `${targetCompany.name} rejected the collaboration request. ${result.data.reason}`
        : `${targetCompany.name} rejected the collaboration request.`,
    });
  });

  revalidateCollaborationPaths(sourceCompany.slug, targetCompany.slug);

  return {
    ok: true,
    message: `Collaboration request to ${targetCompany.name} was rejected.`,
  };
}

export async function cancelCompanyCollaborationRequestAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCollaborationDecisionSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Unable to cancel collaboration request." };
  }

  const collaboration = await getCollaborationRecord(result.data.collaborationId);

  if (!collaboration) {
    return { ok: false, message: "Collaboration request not found." };
  }

  if (collaboration.status !== CollaborationStatus.PENDING) {
    return { ok: false, message: "Only pending requests can be cancelled." };
  }

  const isAdmin = user.siteRole === "ADMIN";
  const access = isAdmin ? { companyRole: null } : await getCompanyAccess(user.id, collaboration.requestingCompanyId);

  if (!isAdmin && !canManageCompanyCollaboration({ siteRole: user.siteRole, companyRole: access?.companyRole })) {
    return { ok: false, message: "Only the sending company owner can cancel this request." };
  }

  const sourceCompany = collaboration.companyAId === collaboration.requestingCompanyId ? collaboration.companyA : collaboration.companyB;
  const targetCompany = collaboration.companyAId === collaboration.requestingCompanyId ? collaboration.companyB : collaboration.companyA;

  await db.$transaction(async (tx) => {
    await tx.companyCollaboration.update({
      where: { id: collaboration.id },
      data: {
        status: CollaborationStatus.CANCELLED,
        respondedAt: new Date(),
      },
    });

    await createCompanyActivity(tx, {
      companyId: sourceCompany.id,
      actorId: user.id,
      title: "Collaboration request cancelled",
      body: `The pending request to ${targetCompany.name} was cancelled.`,
    });

    await createNotificationsForUsers(tx, [targetCompany.ownerId], {
      type: NotificationType.COLLABORATION,
      title: "Collaboration request cancelled",
      body: `${sourceCompany.name} cancelled its pending collaboration request.`,
    });
  });

  revalidateCollaborationPaths(sourceCompany.slug, targetCompany.slug);

  return {
    ok: true,
    message: `Request to ${targetCompany.name} was cancelled.`,
  };
}

export async function endCompanyCollaborationAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCollaborationEndSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, message: result.error.issues[0]?.message ?? "Unable to end collaboration." };
  }

  const collaboration = await getCollaborationRecord(result.data.collaborationId);

  if (!collaboration) {
    return { ok: false, message: "Collaboration was not found." };
  }

  if (collaboration.status !== CollaborationStatus.ACTIVE) {
    return { ok: false, message: "Only active collaborations can be ended." };
  }

  const isAdmin = user.siteRole === "ADMIN";
  let endingCompanyId: string | null = null;

  if (isAdmin) {
    endingCompanyId =
      result.data.companyId && [collaboration.companyAId, collaboration.companyBId].includes(result.data.companyId)
        ? result.data.companyId
        : null;
  } else {
    const [accessA, accessB] = await Promise.all([
      getCompanyAccess(user.id, collaboration.companyAId),
      getCompanyAccess(user.id, collaboration.companyBId),
    ]);

    const manageableCompanyId = [collaboration.companyAId, collaboration.companyBId].find((companyId, index) =>
      canManageCompanyCollaboration({
        siteRole: user.siteRole,
        companyRole: index === 0 ? accessA?.companyRole : accessB?.companyRole,
      }),
    );

    if (!manageableCompanyId) {
      return { ok: false, message: "Only an owner of either company can end this collaboration." };
    }

    endingCompanyId = manageableCompanyId;
  }

  await db.$transaction(async (tx) => {
    await tx.companyCollaboration.update({
      where: { id: collaboration.id },
      data: {
        status: CollaborationStatus.ENDED,
        endedAt: new Date(),
        endedByCompanyId: endingCompanyId,
      },
    });

    await createCompanyActivity(tx, {
      companyId: collaboration.companyA.id,
      actorId: user.id,
      title: "Collaboration ended",
      body: `${collaboration.companyA.name} and ${collaboration.companyB.name} are no longer active collaborators.`,
    });

    await createCompanyActivity(tx, {
      companyId: collaboration.companyB.id,
      actorId: user.id,
      title: "Collaboration ended",
      body: `${collaboration.companyA.name} and ${collaboration.companyB.name} are no longer active collaborators.`,
    });

    await createNotificationsForUsers(tx, [collaboration.companyA.ownerId, collaboration.companyB.ownerId], {
      type: NotificationType.COLLABORATION,
      title: "Collaboration ended",
      body: `${collaboration.companyA.name} and ${collaboration.companyB.name} are no longer active collaborators.`,
    });
  });

  revalidateCollaborationPaths(collaboration.companyA.slug, collaboration.companyB.slug);

  return {
    ok: true,
    message: `The collaboration between ${collaboration.companyA.name} and ${collaboration.companyB.name} has ended.`,
  };
}
