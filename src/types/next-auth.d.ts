import { SiteRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      siteRole: SiteRole;
      username: string | null;
      displayName: string | null;
      avatarUrl: string | null;
      onboardingCompletedAt: Date | null;
    };
  }

  interface User {
    siteRole: SiteRole;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    onboardingCompletedAt: Date | null;
  }
}
