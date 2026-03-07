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
      <aside className="rounded-[2rem] border border-white/10 bg-white/4 p-6 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.92)]">
        <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Onboarding</div>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white">Set up your Prism identity</h1>
        <div className="mt-6 h-2 rounded-full bg-white/6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-amber-300 transition-[width]"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-6 space-y-3">
          {steps.map((entry, index) => (
            <div key={entry.key} className={`rounded-2xl border p-4 ${index === step ? "border-cyan-400/20 bg-cyan-400/10" : "border-white/8 bg-white/4"}`}>
              <div className="text-xs uppercase tracking-[0.2em] text-white/42">Step {index + 1}</div>
              <div className="mt-1 font-medium text-white">{entry.title}</div>
              <p className="mt-1 text-sm leading-6 text-white/56">{entry.description}</p>
            </div>
          ))}
        </div>
      </aside>
      <form onSubmit={form.handleSubmit(submit)} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.92)]">
        <motion.div
          key={currentStep.key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="p-8"
        >
          <div className="mb-8 flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100">
              {step === 0 ? <Compass className="size-5" /> : step === 1 ? <UserCircle2 className="size-5" /> : step === 2 ? <Link2 className="size-5" /> : <Building2 className="size-5" />}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{currentStep.title}</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white">{currentStep.description}</h2>
            </div>
          </div>

          {step === 0 ? (
            <div className="rounded-[1.6rem] border border-white/10 bg-[#08101d] p-6">
              <div className="text-sm text-white/60">Signed in as</div>
              <div className="mt-2 text-2xl font-semibold text-white">{viewer.displayName ?? viewer.username ?? viewer.discordUsername}</div>
              <p className="mt-3 text-sm leading-7 text-white/58">
                Discord stays as your primary identity. The steps ahead shape how you appear across member hover cards, company hubs, moderation queues, and future launcher linking.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" {...form.register("displayName")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
                <p className="text-sm text-rose-200">{form.formState.errors.displayName?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Handle</Label>
                <Input id="username" {...form.register("username")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
                <p className="text-sm text-rose-200">{form.formState.errors.username?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minecraftNickname">Minecraft nickname</Label>
                <Input id="minecraftNickname" {...form.register("minecraftNickname")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" {...form.register("bio")} className="min-h-32 rounded-2xl border-white/10 bg-white/6 text-white" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" {...form.register("email")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
                <p className="text-sm text-rose-200">{form.formState.errors.email?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password placeholder (optional)</Label>
                <Input id="password" type="password" {...form.register("password")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
                <p className="text-sm text-rose-200">{form.formState.errors.password?.message}</p>
              </div>
              <div className="rounded-[1.6rem] border border-cyan-400/12 bg-cyan-400/8 p-5 md:col-span-2">
                <div className="text-sm font-medium text-cyan-100">Microsoft linking</div>
                <p className="mt-2 text-sm leading-7 text-white/62">
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
                    className={`rounded-[1.5rem] border p-5 text-left transition ${companyIntent === intent.value ? "border-cyan-400/24 bg-cyan-400/10" : "border-white/10 bg-white/4 hover:border-white/18 hover:bg-white/6"}`}
                  >
                    <div className="font-medium text-white">{intent.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/58">{intent.body}</p>
                  </button>
                ))}
              </div>
              {companyIntent === "join-invite" ? (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite code</Label>
                  <Input id="inviteCode" {...form.register("inviteCode")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
                  <p className="text-sm text-rose-200">{form.formState.errors.inviteCode?.message}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.div>
        <div className="flex flex-col gap-3 border-t border-white/8 bg-white/4 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-rose-200">{message}</div>
          <div className="flex flex-wrap gap-3">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep((value) => Math.max(value - 1, 0))} className="border-white/10 bg-white/6 text-white hover:bg-white/10">
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
