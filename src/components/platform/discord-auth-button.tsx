"use client";

import { LogIn, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      className={cn(
        "relative gap-2 overflow-hidden transition-all duration-300",
        variant === "default" &&
        "bg-gradient-to-b from-primary/90 to-primary shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-1 ring-white/10 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]",
        variant === "outline" &&
        "border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/10 hover:text-primary shadow-[0_0_15px_rgba(59,130,246,0.05)]",
      )}
    >
      {variant === "default" && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {configured ? <LogIn className="size-4" /> : <Sparkles className="size-4" />}
        {configured ? "Sign in with Discord" : "Configure Discord Auth"}
      </span>
    </Button>
  );
}
