import Link from "next/link";

import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import { Button } from "@/components/ui/button";
import { isDiscordAuthConfigured } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1100px] items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel-strong grid w-full overflow-hidden p-0 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[1rem] border border-blue-400/16 bg-blue-400/[0.08] font-display text-lg text-blue-200">
              P
            </div>
            <div>
              <div className="font-display text-xl text-white">PrismMTR</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/38">Identity gateway</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-label">Sign in</div>
            <h1 className="max-w-3xl font-display text-[2.85rem] leading-[0.93] text-white">
              Enter the network through a real identity layer.
            </h1>
            <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
              PrismMTR is Discord-first because roles, companies, discovery, and future launcher readiness all depend on a
              stable community identity instead of a throwaway auth form.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Identity",
                body: "Discord maps into public identity, company presence, and profile surfaces.",
              },
              {
                label: "Coordination",
                body: "Dashboard, company hubs, and moderation flows all build on the same account layer.",
              },
              {
                label: "Readiness",
                body: "Minecraft nickname and future Microsoft linking stay attached to the same account.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{item.label}</div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="panel-label">Access</div>
          <div className="mt-4 space-y-3">
            <DiscordAuthButton configured={isDiscordAuthConfigured} />
            <Button variant="outline" render={<Link href="/discovery" />} className="w-full">
              Continue as visitor
            </Button>
          </div>

          <div className="mt-6 rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4">
            <div className="panel-label">Why Discord-first</div>
            <ul className="mt-3 space-y-2 text-xs leading-6 text-muted-foreground">
              <li>Identity maps to community roles and member discovery.</li>
              <li>Email and password remain optional and future-oriented.</li>
              <li>Microsoft linking stays reserved for future launcher integration.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
