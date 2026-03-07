"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { profileSchema } from "@/lib/validators";

export async function updateProfileAction(input: unknown) {
  const user = await requireUser({ onboarded: true });
  const result = profileSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "Profile update failed.",
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
      message: "That handle is already in use.",
    };
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
      ...(values.password
        ? {
            passwordHash: await bcrypt.hash(values.password, 10),
          }
        : {}),
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath(`/users/${values.username}`);

  return {
    ok: true,
    message: "Profile updated.",
  };
}
