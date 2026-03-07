import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { LinkedAccountProvider, SiteRole } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "@/lib/db";
import { authSecret, env, isDiscordAuthConfigured } from "@/lib/env";
import { buildUserHandle } from "@/lib/slug";

type DiscordProfile = {
  id: string;
  username: string;
  global_name?: string | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: authSecret,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: isDiscordAuthConfigured
    ? [
        DiscordProvider({
          clientId: env.AUTH_DISCORD_ID!,
          clientSecret: env.AUTH_DISCORD_SECRET!,
          authorization: {
            params: {
              scope: "identify email",
            },
          },
        }),
      ]
    : [],
  events: {
    async createUser({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: buildUserHandle(user.name ?? "member", user.id),
          displayName: user.name ?? "New Prism member",
          avatarUrl: user.image ?? null,
          image: user.image ?? null,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.id || account?.provider !== "discord") {
        return true;
      }

      const currentUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          username: true,
          displayName: true,
          siteRole: true,
        },
      });
      const discordProfile = profile as DiscordProfile | undefined;
      const nextDisplayName =
        currentUser?.displayName ?? discordProfile?.global_name ?? user.name ?? "New Prism member";

      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          discordId: account.providerAccountId,
          discordUsername: discordProfile?.username ?? user.name ?? null,
          username:
            currentUser?.username ??
            buildUserHandle(discordProfile?.username ?? user.name ?? "member", user.id),
          displayName: nextDisplayName,
          name: nextDisplayName,
          avatarUrl: user.image ?? null,
          image: user.image ?? null,
          siteRole: currentUser?.siteRole ?? SiteRole.USER,
        },
      });

      await db.linkedAccount.upsert({
        where: {
          userId_provider: {
            userId: user.id,
            provider: LinkedAccountProvider.DISCORD,
          },
        },
        update: {
          providerAccountId: account.providerAccountId,
          accountEmail: user.email ?? null,
          metadata: {
            username: discordProfile?.username ?? null,
          },
        },
        create: {
          userId: user.id,
          provider: LinkedAccountProvider.DISCORD,
          providerAccountId: account.providerAccountId,
          accountEmail: user.email ?? null,
          metadata: {
            username: discordProfile?.username ?? null,
          },
        },
      });

      return true;
    },
    async session({ session, user }) {
      if (!session.user) {
        return session;
      }

      session.user.id = user.id;
      session.user.siteRole = user.siteRole;
      session.user.username = user.username;
      session.user.displayName = user.displayName;
      session.user.avatarUrl = user.avatarUrl;
      session.user.onboardingCompletedAt = user.onboardingCompletedAt;

      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
