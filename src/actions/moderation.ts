"use server";

import { ModerationStatus, ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireStaff } from "@/lib/session";
import { moderationReviewSchema } from "@/lib/validators";

export async function reviewModerationItemAction(input: unknown) {
  const staff = await requireStaff();
  const result = moderationReviewSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Moderation update failed.",
    };
  }

  const { targetId, targetType, decision } = result.data;

  if (targetType === "company") {
    const status =
      decision === "approve"
        ? ModerationStatus.APPROVED
        : decision === "reject"
          ? ModerationStatus.REJECTED
          : ModerationStatus.ARCHIVED;

    const company = await db.company.update({
      where: {
        id: targetId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/moderation/companies");
    revalidatePath(`/companies/${company.slug}`);

    return {
      ok: true,
      message: "Company moderation status updated.",
    };
  }

  if (targetType === "post") {
    const status =
      decision === "approve"
        ? ModerationStatus.PUBLISHED
        : decision === "reject"
          ? ModerationStatus.REJECTED
          : ModerationStatus.ARCHIVED;

    const post = await db.post.update({
      where: {
        id: targetId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/moderation/posts");
    revalidatePath(`/posts/${post.slug}`);

    return {
      ok: true,
      message: "Post moderation status updated.",
    };
  }

  await db.report.update({
    where: {
      id: targetId,
    },
    data: {
      status:
        decision === "approve"
          ? ReportStatus.ACTIONED
          : decision === "reject"
            ? ReportStatus.REJECTED
            : ReportStatus.RESOLVED,
      reviewedById: staff.id,
    },
  });

  revalidatePath("/moderation/reports");

  return {
    ok: true,
    message: "Report review updated.",
  };
}
