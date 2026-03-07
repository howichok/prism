import Link from "next/link";

import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import { Button } from "@/components/ui/button";
import { isDiscordAuthConfigured } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center px-6 py-10 lg:px-8">
      <div className="grid w-full gap-8 rounded-[2.2rem] border border-white/10 bg-white/4 p-8 shadow-[0_34px_120px_-54px_rgba(0,0,0,0.95)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Sign In</div>
          <h1 className="font-display text-5xl font-semibold text-white">Use Discord as your Prism identity.</h1>
          <p className="text-sm leading-8 text-white/62">
            Discord is the primary authentication surface for PrismMTR. Once signed in, you can finish onboarding, build a profile, optionally add Minecraft and email details, and prepare for future launcher account linking.
          </p>
          <div className="flex flex-wrap gap-3">
            <DiscordAuthButton configured={isDiscordAuthConfigured} />
            <Button variant="outline" render={<Link href="/discovery" />} className="border-white/10 bg-white/6 text-white hover:bg-white/10">
              Continue as visitor
            </Button>
          </div>
        </div>
        <div className="rounded-[1.8rem] border border-white/10 bg-[#08101d] p-6">
          <div className="text-sm font-medium text-white">Why Discord-first?</div>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-white/58">
            <li>Identity maps naturally to community roles, hover profiles, and member discovery.</li>
            <li>Email/password remains optional and future-oriented instead of replacing the main login flow.</li>
            <li>Microsoft linkage is reserved for future launcher integration, not for accessing the current web platform.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
