"use server";

import { BuildRequestStatus, ModerationStatus, Visibility } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { slugifyText } from "@/lib/slug";
import { buildRequestSchema, postCreateSchema } from "@/lib/validators";

async function ensureMembership(userId: string, companyId: string) {
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
    throw new Error("You are not a member of that company.");
  }

  return membership;
}

export async function createPostAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = postCreateSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Post creation failed.",
    };
  }

  const values = result.data;
  const companyId = values.companyId || null;
  let companySlug: string | null = null;

  if (companyId) {
    const membership = await ensureMembership(user.id, companyId);
    companySlug = membership.company.slug;
  }

  const post = await db.post.create({
    data: {
      companyId,
      authorId: user.id,
      title: values.title,
      slug: `${slugifyText(values.title)}-${Date.now().toString().slice(-5)}`,
      excerpt: values.excerpt || null,
      content: values.content,
      type: values.type,
      visibility: values.visibility,
      tags: values.tags,
      status: values.visibility === Visibility.PUBLIC ? ModerationStatus.PENDING_REVIEW : ModerationStatus.PUBLISHED,
    },
  });

  revalidatePath("/dashboard/posts");
  if (companySlug) {
    revalidatePath(`/dashboard/company/${companySlug}/posts`);
  }

  return {
    ok: true,
    redirectTo: values.visibility === Visibility.PUBLIC ? "/dashboard/posts" : `/posts/${post.slug}`,
  };
}

export async function createBuildRequestAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = buildRequestSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Build request creation failed.",
    };
  }

  const values = result.data;
  const companyId = values.companyId || null;

  if (companyId) {
    await ensureMembership(user.id, companyId);
  }

  await db.buildRequest.create({
    data: {
      authorId: user.id,
      companyId,
      title: values.title,
      description: values.description,
      category: values.category,
      needsRecruitment: values.needsRecruitment,
      status: BuildRequestStatus.OPEN,
    },
  });

  revalidatePath("/dashboard/applications");

  return {
    ok: true,
    message: "Build request submitted.",
  };
}
