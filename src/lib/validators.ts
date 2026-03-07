import {
  ApplicationStatus,
  BuildRequestCategory,
  CompanyRole,
  PostType,
  Privacy,
  RecruitingStatus,
  Visibility,
} from "@prisma/client";
import { z } from "zod";

const usernamePattern = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;

export const onboardingSchema = z
  .object({
    displayName: z.string().trim().min(2).max(40),
    username: z.string().trim().min(3).max(30).regex(usernamePattern, "Use lowercase letters, numbers, and dashes only."),
    bio: z.string().trim().max(280).optional().or(z.literal("")),
    minecraftNickname: z.string().trim().max(24).optional().or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    password: z.string().min(8).max(72).optional().or(z.literal("")),
    companyIntent: z.enum(["create-company", "join-invite", "browse", "skip"]),
    inviteCode: z.string().trim().max(64).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.password && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required when setting a password placeholder.",
        path: ["email"],
      });
    }

    if (value.companyIntent === "join-invite" && !value.inviteCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an invite code to join a company.",
        path: ["inviteCode"],
      });
    }
  });

export const profileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(40),
    username: z.string().trim().min(3).max(30).regex(usernamePattern, "Use lowercase letters, numbers, and dashes only."),
    bio: z.string().trim().max(280).optional().or(z.literal("")),
    minecraftNickname: z.string().trim().max(24).optional().or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    password: z.string().min(8).max(72).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.password && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required when setting a password placeholder.",
        path: ["email"],
      });
    }
  });

export const companyCreateSchema = z.object({
  name: z.string().trim().min(3).max(60),
  slug: z.string().trim().min(3).max(48).regex(usernamePattern, "Use lowercase letters, numbers, and dashes only."),
  description: z.string().trim().min(24).max(600),
  privacy: z.nativeEnum(Privacy),
  recruitingStatus: z.nativeEnum(RecruitingStatus),
  tags: z.array(z.string().trim().min(2).max(20)).max(6),
  brandColor: z.string().trim().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).optional().or(z.literal("")),
});

export const companySettingsSchema = companyCreateSchema.extend({
  companyId: z.string().cuid(),
});

export const inviteCreateSchema = z.object({
  companyId: z.string().cuid(),
  expiresInDays: z.coerce.number().min(1).max(90).default(14),
  usageLimit: z.coerce.number().min(1).max(100).default(10),
});

export const companyApplicationReviewSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.nativeEnum(ApplicationStatus),
});

export const postCreateSchema = z.object({
  companyId: z.string().cuid().optional().or(z.literal("")),
  title: z.string().trim().min(4).max(80),
  excerpt: z.string().trim().max(180).optional().or(z.literal("")),
  content: z.string().trim().min(24).max(4000),
  type: z.nativeEnum(PostType),
  visibility: z.nativeEnum(Visibility),
  tags: z.array(z.string().trim().min(2).max(20)).max(6),
});

export const buildRequestSchema = z.object({
  companyId: z.string().cuid().optional().or(z.literal("")),
  title: z.string().trim().min(4).max(80),
  description: z.string().trim().min(24).max(2400),
  category: z.nativeEnum(BuildRequestCategory),
  needsRecruitment: z.boolean(),
});

export const moderationReviewSchema = z.object({
  targetType: z.enum(["company", "post", "report"]),
  targetId: z.string().cuid(),
  decision: z.enum(["approve", "reject", "archive"]),
});

export const companyRoleUpdateSchema = z.object({
  companyId: z.string().cuid(),
  memberId: z.string().cuid(),
  companyRole: z.nativeEnum(CompanyRole),
});
