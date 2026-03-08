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
    <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
      <section className="space-y-4 border-b border-white/8 pb-8">
        <div className="space-y-2">
          <div className="panel-label">Identity</div>
          <h2 className="font-display text-[1.55rem] leading-none text-white">Public identity basics</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            These fields shape how you appear in discovery, company hubs, hover profiles, and public member pages.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-display-name">Display name</Label>
            <Input id="profile-display-name" {...form.register("displayName")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-username">Handle</Label>
            <Input id="profile-username" {...form.register("username")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-mc">Minecraft nickname</Label>
            <Input id="profile-mc" {...form.register("minecraftNickname")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" {...form.register("email")} className="h-11" />
          </div>
        </div>
      </section>

      <section className="space-y-4 border-b border-white/8 pb-8">
        <div className="space-y-2">
          <div className="panel-label">Profile surface</div>
          <h2 className="font-display text-[1.55rem] leading-none text-white">Presence and description</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Keep the bio short and legible. It should explain who you are and where you fit in the network.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea id="profile-bio" {...form.register("bio")} className="min-h-28" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <div className="panel-label">Future-ready access</div>
          <h2 className="font-display text-[1.55rem] leading-none text-white">Reserved account fields</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Discord stays primary today. Password and secondary identity fields remain reserved for future launcher-connected flows.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-password">Password placeholder</Label>
          <Input id="profile-password" type="password" {...form.register("password")} className="h-11" />
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{message ?? "Changes update your public PrismMTR identity surface."}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
