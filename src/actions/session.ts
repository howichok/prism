"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { GUEST_SESSION_COOKIE } from "@/lib/session";

function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export async function startGuestSessionAction() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, "1", sessionCookieOptions());
  revalidatePath("/");
  redirect("/dashboard");
}

export async function endGuestSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_SESSION_COOKIE);
  revalidatePath("/");
  redirect("/");
}
