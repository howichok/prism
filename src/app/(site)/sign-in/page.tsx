import Link from "next/link";

import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import { Button } from "@/components/ui/button";
import { isDiscordAuthConfigured } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center px-4 py-10">
      <div className="w-full space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-lg font-bold text-primary">
            P
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Sign in to PrismMTR</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your Discord account as your Prism identity. Build a profile, join companies, and explore the network.
          </p>
        </div>

        <div className="space-y-3">
          <DiscordAuthButton configured={isDiscordAuthConfigured} />
          <Button variant="outline" render={<Link href="/discovery" />} className="w-full">
            Continue as visitor
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="text-sm font-medium text-foreground">Why Discord-first?</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Identity maps to community roles and member discovery</li>
            <li>• Email/password remains optional and future-oriented</li>
            <li>• Microsoft linking reserved for future launcher integration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
