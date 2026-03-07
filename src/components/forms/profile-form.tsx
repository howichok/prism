"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SessionUser } from "@/lib/session";
import { profileSchema } from "@/lib/validators";

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm({ viewer }: { viewer: SessionUser }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: viewer.displayName ?? "",
      username: viewer.username ?? "",
      bio: viewer.bio ?? "",
      minecraftNickname: viewer.minecraftNickname ?? "",
      email: viewer.email ?? "",
      password: "",
    },
  });

  function submit(values: ProfileValues) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileAction(values);
      setMessage(result.message ?? (result.ok ? "Profile updated." : "Profile update failed."));
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-display-name">Display name</Label>
          <Input id="profile-display-name" {...form.register("displayName")} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-username">Handle</Label>
          <Input id="profile-username" {...form.register("username")} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-mc">Minecraft nickname</Label>
          <Input id="profile-mc" {...form.register("minecraftNickname")} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" {...form.register("email")} className="h-10" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea id="profile-bio" {...form.register("bio")} className="min-h-24" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profile-password">Password placeholder</Label>
          <Input id="profile-password" type="password" {...form.register("password")} className="h-10" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
