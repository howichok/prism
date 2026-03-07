"use client";

import { LogIn, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function DiscordAuthButton({
  configured,
  redirectTo = "/dashboard",
  variant = "default",
}: {
  configured: boolean;
  redirectTo?: string;
  variant?: "default" | "outline" | "secondary";
}) {
  return (
    <Button
      variant={variant}
      onClick={() => signIn("discord", { callbackUrl: redirectTo })}
      disabled={!configured}
      className="gap-2"
    >
      {configured ? <LogIn className="size-4" /> : <Sparkles className="size-4" />}
      {configured ? "Sign In with Discord" : "Configure Discord Auth"}
    </Button>
  );
}
