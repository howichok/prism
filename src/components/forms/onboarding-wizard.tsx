"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Compass, Link2, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { completeOnboardingAction } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SessionUser } from "@/lib/session";
import { onboardingSchema } from "@/lib/validators";

type OnboardingValues = z.infer<typeof onboardingSchema>;

const steps = [
  { key: "welcome", title: "Welcome", description: "Your Discord identity is in. Finish the PrismMTR profile shape before entering the network." },
  { key: "profile", title: "Basic Profile", description: "Create the public-facing member card that appears across companies, posts, and hover interactions." },
  { key: "linked", title: "Linked Accounts", description: "Optional credentials and future launcher linkage live here. Discord remains your primary login." },
  { key: "company", title: "Company Choice", description: "Create a company, join with an invite, browse the ecosystem, or skip for now." },
] as const;

const intentCards = [
  { value: "create-company", title: "Create a company", body: "Start a moderated company hub with members, projects, posts, invites, and settings." },
  { value: "join-invite", title: "Join via invite", body: "Redeem a company invite and land directly in its hub after onboarding." },
  { value: "browse", title: "Browse companies", body: "Finish your profile and head to public discovery before committing." },
  { value: "skip", title: "Skip for now", body: "Go straight to your dashboard and decide later." },
] as const;

export function OnboardingWizard({ viewer }: { viewer: SessionUser }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: viewer.displayName ?? "",
      username: viewer.username ?? "",
      bio: viewer.bio ?? "",
      minecraftNickname: viewer.minecraftNickname ?? "",
      email: viewer.email ?? "",
      password: "",
      companyIntent: "skip",
      inviteCode: "",
    },
  });

  const companyIntent = useWatch({ control: form.control, name: "companyIntent" });
  const currentStep = steps[step];

  async function nextStep() {
    if (step === 1) {
      const valid = await form.trigger(["displayName", "username", "bio", "minecraftNickname"]);
      if (!valid) return;
    }

    if (step === 2) {
      const valid = await form.trigger(["email", "password"]);
      if (!valid) return;
    }

    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  function submit(values: OnboardingValues) {
    setMessage(null);
    startTransition(async () => {
      const result = await completeOnboardingAction(values);

      if (!result.ok) {
        setMessage(result.message ?? "Unable to finish onboarding.");
        return;
      }

      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-border bg-card p-6 shadow-sm h-min">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Onboarding</div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">Set up your Prism identity</h1>
        <div className="mt-5 h-1.5 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-6 space-y-2">
          {steps.map((entry, index) => (
            <div key={entry.key} className={`rounded-lg border p-3 ${index === step ? "border-border bg-muted/50" : "border-transparent bg-transparent"}`}>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Step {index + 1}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{entry.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">{entry.description}</p>
            </div>
          ))}
        </div>
      </aside>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <motion.div
          key={currentStep.key}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="p-6 sm:p-8 flex-1"
        >
          <div className="mb-8 flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground">
              {step === 0 ? <Compass className="size-4" /> : step === 1 ? <UserCircle2 className="size-4" /> : step === 2 ? <Link2 className="size-4" /> : <Building2 className="size-4" />}
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{currentStep.title}</div>
              <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">{currentStep.description}</h2>
            </div>
          </div>

          {step === 0 ? (
            <div className="rounded-lg border border-border/50 bg-muted/20 p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Signed in as</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{viewer.displayName ?? viewer.username ?? viewer.discordUsername}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Discord stays as your primary identity. The steps ahead shape how you appear across member hover cards, company hubs, moderation queues, and future launcher linking.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" {...form.register("displayName")} className="h-10" />
                <p className="text-xs text-destructive">{form.formState.errors.displayName?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Handle</Label>
                <Input id="username" {...form.register("username")} className="h-10" />
                <p className="text-xs text-destructive">{form.formState.errors.username?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minecraftNickname">Minecraft nickname</Label>
                <Input id="minecraftNickname" {...form.register("minecraftNickname")} className="h-10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" {...form.register("bio")} className="min-h-24" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" {...form.register("email")} className="h-10" />
                <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password placeholder (optional)</Label>
                <Input id="password" type="password" {...form.register("password")} className="h-10" />
                <p className="text-xs text-destructive">{form.formState.errors.password?.message}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 md:col-span-2">
                <div className="text-sm font-medium text-foreground">Microsoft linking</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Microsoft account linking is already represented in the data model and account structure, but the launcher-side flow ships separately. You can add it later without rebuilding your profile.
                </p>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {intentCards.map((intent) => (
                  <button
                    key={intent.value}
                    type="button"
                    onClick={() => form.setValue("companyIntent", intent.value as OnboardingValues["companyIntent"])}
                    className={`rounded-xl border p-4 text-left transition-colors ${companyIntent === intent.value ? "border-foreground/30 bg-muted/40" : "border-border bg-transparent hover:border-border hover:bg-muted/10"}`}
                  >
                    <div className="font-medium text-foreground">{intent.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{intent.body}</p>
                  </button>
                ))}
              </div>
              {companyIntent === "join-invite" ? (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite code</Label>
                  <Input id="inviteCode" {...form.register("inviteCode")} className="h-10" />
                  <p className="text-xs text-destructive">{form.formState.errors.inviteCode?.message}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.div>
        <div className="flex flex-col gap-3 border-t border-border bg-muted/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-destructive">{message}</div>
          <div className="flex flex-wrap gap-2">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(value - 1, 0))}>
                Back
              </Button>
            ) : null}
            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Enter PrismMTR"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
