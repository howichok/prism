import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { canAccessModeration } from "@/lib/permissions";

const sessionUserArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    linkedAccounts: true,
    userBadges: {
      include: {
        badge: true,
      },
    },
    companyMemberships: {
      include: {
        company: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    },
  },
});

export type SessionUser = Prisma.UserGetPayload<typeof sessionUserArgs>;

export async function getSessionUser() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  return db.user.findUnique({
    where: {
      id: session.user.id,
    },
    ...sessionUserArgs,
  });
}

export async function getOptionalSessionUser() {
  try {
    return await getSessionUser();
  } catch (error) {
    console.error("[session] Failed to resolve session user for public rendering.", error);
    return null;
  }
}

export async function requireUser(options?: { onboarded?: boolean }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (options?.onboarded && !user.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  return user;
}

export async function requireStaff() {
  const user = await requireUser({ onboarded: true });

  if (!canAccessModeration(user.siteRole)) {
    redirect("/dashboard");
  }

  return user;
}
