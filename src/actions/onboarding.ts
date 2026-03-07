"use server";

import bcrypt from "bcryptjs";
import { CompanyRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validators";
import { requireUser } from "@/lib/session";

type ActionResult = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

export async function completeOnboardingAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const result = onboardingSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Check your profile details and try again.",
    };
  }

  const values = result.data;
  const existingUser = await db.user.findFirst({
    where: {
      username: values.username,
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      ok: false,
      message: "That handle is already taken.",
    };
  }

  if (values.email) {
    const emailOwner = await db.user.findFirst({
      where: {
        email: values.email,
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (emailOwner) {
      return {
        ok: false,
        message: "That email is already linked to another account.",
      };
    }
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName: values.displayName,
      username: values.username,
      bio: values.bio || null,
      minecraftNickname: values.minecraftNickname || null,
      email: values.email || null,
      onboardingCompletedAt: new Date(),
      ...(values.password
        ? {
            passwordHash: await bcrypt.hash(values.password, 10),
          }
        : {}),
    },
  });

  if (values.companyIntent === "join-invite" && values.inviteCode) {
    const invite = await db.companyInvite.findUnique({
      where: {
        code: values.inviteCode.trim().toUpperCase(),
      },
      include: {
        company: true,
      },
    });

    if (!invite || !invite.active) {
      return {
        ok: false,
        message: "That invite code is not active.",
      };
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return {
        ok: false,
        message: "That invite code has expired.",
      };
    }

    if (invite.usageLimit && invite.usageCount >= invite.usageLimit) {
      return {
        ok: false,
        message: "That invite code has reached its usage limit.",
      };
    }

    await db.$transaction([
      db.companyMember.upsert({
        where: {
          companyId_userId: {
            companyId: invite.companyId,
            userId: user.id,
          },
        },
        update: {},
        create: {
          companyId: invite.companyId,
          userId: user.id,
          companyRole: CompanyRole.MEMBER,
        },
      }),
      db.companyInvite.update({
        where: {
          id: invite.id,
        },
        data: {
          usageCount: {
            increment: 1,
          },
        },
      }),
      db.activityEvent.create({
        data: {
          companyId: invite.companyId,
          actorId: user.id,
          type: "MEMBER_JOINED",
          title: "Member joined via invite",
          body: `${values.displayName} joined ${invite.company.name}.`,
        },
      }),
    ]);

    revalidatePath(`/dashboard/company/${invite.company.slug}`);

    return {
      ok: true,
      redirectTo: `/dashboard/company/${invite.company.slug}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/users/${values.username}`);

  if (values.companyIntent === "create-company") {
    return { ok: true, redirectTo: "/dashboard/company/create" };
  }

  if (values.companyIntent === "browse") {
    return { ok: true, redirectTo: "/companies" };
  }

  return { ok: true, redirectTo: "/dashboard" };
}
