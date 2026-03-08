"use server";

import { ModerationStatus, Prisma, ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { canAccessModeration } from "@/lib/permissions";
import { getSessionUser } from "@/lib/session";
import { moderationReviewSchema } from "@/lib/validators";

export async function reviewModerationItemAction(input: unknown) {
  const result = moderationReviewSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Moderation update failed.",
    };
  }

  const staff = await getSessionUser();

  if (!staff || !canAccessModeration(staff.siteRole)) {
    return {
      ok: false,
      message: "You are not authorized to review moderation items.",
    };
  }

  const { targetId, targetType, decision } = result.data;

  try {
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

      revalidatePath("/moderation");
      revalidatePath("/moderation/companies");
      revalidatePath("/companies");
      revalidatePath(`/companies/${company.slug}`);
      revalidatePath("/discovery");

      return {
        ok: true,
        targetId,
        targetType,
        nextStatus: status,
        message:
          decision === "approve"
            ? "Company approved and removed from the active queue."
            : decision === "reject"
              ? "Company rejected and removed from the active queue."
              : "Company archived and removed from the active queue.",
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

      revalidatePath("/moderation");
      revalidatePath("/moderation/posts");
      revalidatePath("/posts");
      revalidatePath(`/posts/${post.slug}`);
      revalidatePath("/discovery");

      return {
        ok: true,
        targetId,
        targetType,
        nextStatus: status,
        message:
          decision === "approve"
            ? "Post approved and published."
            : decision === "reject"
              ? "Post rejected and removed from the review queue."
              : "Post archived and removed from the review queue.",
      };
    }

    const status =
      decision === "approve"
        ? ReportStatus.ACTIONED
        : decision === "reject"
          ? ReportStatus.REJECTED
          : ReportStatus.RESOLVED;

    await db.report.update({
      where: {
        id: targetId,
      },
      data: {
        status,
        reviewedById: staff.id,
      },
    });

    revalidatePath("/moderation");
    revalidatePath("/moderation/reports");

    return {
      ok: true,
      targetId,
      targetType,
      nextStatus: status,
      message:
        decision === "approve"
          ? "Report marked as actioned."
          : decision === "reject"
            ? "Report rejected and removed from the active queue."
            : "Report resolved and archived from active review.",
    };
  } catch (error) {
    console.error("[moderation] Failed to update moderation item.", {
      targetId,
      targetType,
      decision,
      error,
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        ok: false,
        message: "This moderation item could not be found anymore.",
      };
    }

    return {
      ok: false,
      message: "Moderation update failed. Try again.",
    };
  }
}
