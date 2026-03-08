import { Prisma, type SiteRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

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
export const GUEST_SESSION_COOKIE = "prismmtr-guest";

export type GuestSessionUser = {
  id: "guest-local";
  name: "Guest Explorer";
  email: null;
  emailVerified: null;
  image: null;
  discordId: null;
  discordUsername: null;
  username: "guest";
  displayName: "Guest Explorer";
  bio: string;
  minecraftNickname: null;
  passwordHash: null;
  siteRole: SiteRole;
  avatarUrl: null;
  bannerUrl: null;
  accentColor: "#55d4ff";
  onboardingCompletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  linkedAccounts: [];
  userBadges: [];
  companyMemberships: [];
  isGuest: true;
};

export type AppViewer = SessionUser | GuestSessionUser;

function buildGuestSessionUser(): GuestSessionUser {
  const now = new Date();

  return {
    id: "guest-local",
    name: "Guest Explorer",
    email: null,
    emailVerified: null,
    image: null,
    discordId: null,
    discordUsername: null,
    username: "guest",
    displayName: "Guest Explorer",
    bio: "Local guest mode for exploring the PrismMTR dashboard and work surfaces without a full account.",
    minecraftNickname: null,
    passwordHash: null,
    siteRole: "USER" as SiteRole,
    avatarUrl: null,
    bannerUrl: null,
    accentColor: "#55d4ff",
    onboardingCompletedAt: now,
    createdAt: now,
    updatedAt: now,
    linkedAccounts: [],
    userBadges: [],
    companyMemberships: [],
    isGuest: true,
  };
}

export function isGuestViewer(viewer: AppViewer | null | undefined): viewer is GuestSessionUser {
  return Boolean(viewer && "isGuest" in viewer && viewer.isGuest);
}

async function resolveSessionUser() {
  let session;

  try {
    session = await getAuthSession();
  } catch (error) {
    console.error("[session] Failed to resolve NextAuth session.", error);
    return null;
  }

  if (!session?.user?.id) {
    return null;
  }

  try {
    return await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      ...sessionUserArgs,
    });
  } catch (error) {
    console.error("[session] Failed to load session user.", {
      userId: session.user.id,
      error,
    });
    return null;
  }
}

const getCachedSessionUser = cache(resolveSessionUser);
const getCachedGuestSessionUser = cache(async () => {
  const cookieStore = await cookies();

  if (cookieStore.get(GUEST_SESSION_COOKIE)?.value !== "1") {
    return null;
  }

  return buildGuestSessionUser();
});

const getCachedOptionalViewer = cache(async () => {
  const user = await getOptionalSessionUser();

  if (user) {
    return user;
  }

  return getGuestSessionUser();
});

export async function getSessionUser() {
  return getCachedSessionUser();
}

export async function getGuestSessionUser() {
  return getCachedGuestSessionUser();
}

export async function getOptionalSessionUser() {
  try {
    return await getSessionUser();
  } catch (error) {
    console.error("[session] Failed to resolve session user for public rendering.", error);
    return null;
  }
}

export async function getOptionalViewer() {
  return getCachedOptionalViewer();
}

export async function requireAppViewer(options?: { onboarded?: boolean }) {
  const viewer = await getOptionalViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  if (!isGuestViewer(viewer) && options?.onboarded && !viewer.onboardingCompletedAt) {
    redirect("/onboarding");
  }

  return viewer;
}

export async function requireUser(options?: { onboarded?: boolean }) {
  const user = await getSessionUser();

  if (!user) {
    const guest = await getGuestSessionUser();

    if (guest) {
      redirect("/dashboard");
    }

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
