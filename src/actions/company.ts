"use server";

import crypto from "node:crypto";

import { CompanyRole, ModerationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  canEditCompanySettings,
  canManageInvites,
  canManageRole,
  canReviewApplications,
} from "@/lib/permissions";
import { requireUser } from "@/lib/session";
import {
  companyApplicationReviewSchema,
  companyCreateSchema,
  companyRoleUpdateSchema,
  companySettingsSchema,
  inviteCreateSchema,
} from "@/lib/validators";

function generateInviteCode(companyName: string) {
  const prefix = companyName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 10);

  return `${prefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

async function getMembershipOrThrow(userId: string, companyId: string) {
  const membership = await db.companyMember.findUnique({
    where: {
      companyId_userId: {
        companyId,
        userId,
      },
    },
    include: {
      company: true,
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this company.");
  }

  return membership;
}

export async function createCompanyAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyCreateSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Check the company details and try again.",
    };
  }

  const values = result.data;
  const slugOwner = await db.company.findUnique({
    where: {
      slug: values.slug,
    },
    select: {
      id: true,
    },
  });

  if (slugOwner) {
    return {
      ok: false,
      message: "That company slug is already taken.",
    };
  }

  const company = await db.company.create({
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description,
      privacy: values.privacy,
      recruitingStatus: values.recruitingStatus,
      brandColor: values.brandColor || null,
      tags: values.tags,
      ownerId: user.id,
      status: ModerationStatus.PENDING_REVIEW,
      members: {
        create: {
          userId: user.id,
          companyRole: CompanyRole.OWNER,
        },
      },
      activityEvents: {
        create: {
          actorId: user.id,
          type: "COMPANY_UPDATED",
          title: "Company created",
          body: `${values.name} was submitted for review.`,
        },
      },
    },
  });

  revalidatePath("/companies");
  revalidatePath("/dashboard");

  return {
    ok: true,
    redirectTo: `/dashboard/company/${company.slug}`,
  };
}

export async function updateCompanySettingsAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companySettingsSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Company update failed.",
    };
  }

  const values = result.data;
  const membership = await getMembershipOrThrow(user.id, values.companyId);

  if (!canEditCompanySettings(membership.companyRole)) {
    return {
      ok: false,
      message: "You do not have permission to update company settings.",
    };
  }

  const slugOwner = await db.company.findFirst({
    where: {
      slug: values.slug,
      NOT: {
        id: values.companyId,
      },
    },
    select: {
      id: true,
    },
  });

  if (slugOwner) {
    return {
      ok: false,
      message: "That company slug is already taken.",
    };
  }

  const company = await db.company.update({
    where: {
      id: values.companyId,
    },
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description,
      privacy: values.privacy,
      recruitingStatus: values.recruitingStatus,
      brandColor: values.brandColor || null,
      tags: values.tags,
      status:
        membership.company.status === ModerationStatus.APPROVED ? ModerationStatus.PENDING_REVIEW : membership.company.status,
      activityEvents: {
        create: {
          actorId: user.id,
          type: "COMPANY_UPDATED",
          title: "Company settings updated",
          body: `${values.name} updated its public-facing settings.`,
        },
      },
    },
  });

  revalidatePath(`/dashboard/company/${company.slug}`);
  revalidatePath(`/dashboard/company/${company.slug}/settings`);
  revalidatePath(`/companies/${company.slug}`);

  return {
    ok: true,
    message: "Company settings saved.",
  };
}

export async function createInviteAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = inviteCreateSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Invite creation failed.",
    };
  }

  const values = result.data;
  const membership = await getMembershipOrThrow(user.id, values.companyId);

  if (!canManageInvites(membership.companyRole)) {
    return {
      ok: false,
      message: "You do not have permission to create invites.",
    };
  }

  const invite = await db.companyInvite.create({
    data: {
      companyId: membership.companyId,
      code: generateInviteCode(membership.company.name),
      createdById: user.id,
      usageLimit: values.usageLimit,
      expiresAt: new Date(Date.now() + values.expiresInDays * 24 * 60 * 60 * 1000),
    },
  });

  revalidatePath(`/dashboard/company/${membership.company.slug}/invites`);

  return {
    ok: true,
    inviteCode: invite.code,
  };
}

export async function reviewCompanyApplicationAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyApplicationReviewSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Application review failed.",
    };
  }

  const application = await db.companyApplication.findUnique({
    where: {
      id: result.data.applicationId,
    },
    include: {
      company: true,
    },
  });

  if (!application) {
    return {
      ok: false,
      message: "Application not found.",
    };
  }

  const membership = await getMembershipOrThrow(user.id, application.companyId);

  if (!canReviewApplications(membership.companyRole)) {
    return {
      ok: false,
      message: "You do not have permission to review applications.",
    };
  }

  await db.companyApplication.update({
    where: {
      id: application.id,
    },
    data: {
      status: result.data.status,
      reviewedById: user.id,
    },
  });

  revalidatePath(`/dashboard/company/${application.company.slug}/applications`);

  return {
    ok: true,
    message: "Application updated.",
  };
}

export async function updateCompanyMemberRoleAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = companyRoleUpdateSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Member update failed.",
    };
  }

  const membership = await getMembershipOrThrow(user.id, result.data.companyId);
  const target = await db.companyMember.findUnique({
    where: {
      id: result.data.memberId,
    },
    include: {
      company: true,
    },
  });

  if (!target || target.companyId !== result.data.companyId) {
    return {
      ok: false,
      message: "Member record not found.",
    };
  }

  if (!canManageRole(membership.companyRole, target.companyRole)) {
    return {
      ok: false,
      message: "You do not have permission to change that member role.",
    };
  }

  await db.companyMember.update({
    where: {
      id: target.id,
    },
    data: {
      companyRole: result.data.companyRole,
    },
  });

  revalidatePath(`/dashboard/company/${target.company.slug}/members`);

  return {
    ok: true,
    message: "Member role updated.",
  };
}
