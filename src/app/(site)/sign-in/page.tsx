import Link from "next/link";

import { endGuestSessionAction, startGuestSessionAction } from "@/actions/session";
import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import { Button } from "@/components/ui/button";
import { isDiscordAuthConfigured } from "@/lib/env";
import { getOptionalViewer, isGuestViewer } from "@/lib/session";

export default async function SignInPage() {
  const viewer = await getOptionalViewer();
  const guestMode = isGuestViewer(viewer);
  const signedIn = Boolean(viewer && !guestMode);
  const primaryMembership = viewer && !guestMode ? viewer.companyMemberships[0] ?? null : null;
  const primaryCompanyHref = primaryMembership ? `/dashboard/company/${primaryMembership.company.slug}` : "/dashboard";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1180px] items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8 border-b border-white/8 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[0.95rem] border border-blue-400/16 bg-blue-400/[0.08] font-display text-lg text-blue-200">
              P
            </div>
            <div>
              <div className="font-display text-xl text-white">PrismMTR</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/38">Identity gateway</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel-label">{signedIn ? "Session active" : guestMode ? "Guest mode" : "Access"}</div>
            <h1 className="max-w-3xl font-display text-[2.7rem] leading-[0.9] text-white sm:text-[3.2rem]">
              {signedIn
                ? "You are already inside the PrismMTR workspace."
                : guestMode
                  ? "Guest mode is active. Upgrade when you want real access."
                  : "Authenticate once, then stay inside the operating layer."}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {signedIn
                ? "Go back to dashboard, continue company work, or open discovery without repeating guest-only entry flows."
                : guestMode
                  ? "The local dashboard tour stays available, but posting, moderation, and company control unlock only after Discord sign-in."
                  : "Discord remains the primary identity because roles, company access, moderation, and future launcher readiness all depend on one stable account."}
            </p>
          </div>

          <div className="grid gap-4 border-t border-white/8 pt-6 sm:grid-cols-[minmax(0,1.1fr)_0.9fr]">
            <div className="space-y-3">
              {(signedIn
                ? [
                    "Your account is already active in the dashboard shell.",
                    primaryMembership
                      ? `Primary company access is available through ${primaryMembership.company.name}.`
                      : "You can create or join a company from the existing account.",
                    "Discovery remains available as a public browsing layer.",
                  ]
                : guestMode
                  ? [
                      "Guest mode keeps account data isolated and local-only.",
                      "You can inspect dashboard structure, discovery, and public company surfaces.",
                      "Restricted actions remain visibly locked instead of failing silently.",
                    ]
                  : [
                      "Identity flows into public profile, company role, and hover presence.",
                      "Dashboard becomes the main work surface after sign-in.",
                      "Launcher readiness remains connected to the same account graph.",
                    ]).map((line) => (
                <div key={line} className="border-l border-white/8 pl-4 text-sm leading-7 text-muted-foreground">
                  {line}
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/8 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <div className="panel-label">Route focus</div>
              {[
                signedIn ? "Dashboard and company workspace" : guestMode ? "Guest dashboard and upgrade path" : "Discord identity and dashboard access",
                "Profile presence and public discovery",
                "Future launcher-linked readiness",
              ].map((item) => (
                <div key={item} className="text-sm leading-7 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel-label">Access paths</div>
          <div className="space-y-3">
            {signedIn ? (
              <>
                <Button render={<Link href="/dashboard" />} className="w-full">
                  Open dashboard
                </Button>
                <Button variant="outline" render={<Link href={primaryCompanyHref} />} className="w-full">
                  {primaryMembership ? "Continue company hub" : "Open workspace"}
                </Button>
                <Button variant="secondary" render={<Link href="/discovery" />} className="w-full">
                  Browse discovery
                </Button>
              </>
            ) : guestMode ? (
              <>
                <Button render={<Link href="/dashboard" />} className="w-full">
                  Continue guest dashboard
                </Button>
                <DiscordAuthButton configured={isDiscordAuthConfigured} />
                <form action={endGuestSessionAction}>
                  <Button type="submit" variant="outline" className="w-full">
                    Exit guest mode
                  </Button>
                </form>
              </>
            ) : (
              <>
                <DiscordAuthButton configured={isDiscordAuthConfigured} />
                <form action={startGuestSessionAction}>
                  <Button type="submit" variant="outline" className="w-full">
                    Continue as guest
                  </Button>
                </form>
                <Button variant="secondary" render={<Link href="/discovery" />} className="w-full">
                  Continue as visitor
                </Button>
              </>
            )}
          </div>

          <div className="border-t border-white/8 pt-5">
            <div className="panel-label">{signedIn ? "Already active" : guestMode ? "Guest boundaries" : "Why Discord-first"}</div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
              {signedIn ? (
                <>
                  <li>Your current session already unlocks dashboard, profile, and company actions.</li>
                  <li>Discovery stays available without leaving the authenticated workspace.</li>
                </>
              ) : guestMode ? (
                <>
                  <li>Guest mode never impersonates a full PrismMTR user.</li>
                  <li>Publishing, moderation, and company management remain restricted until sign-in.</li>
                </>
              ) : (
                <>
                  <li>Identity maps directly into roles, member discovery, and public profile surfaces.</li>
                  <li>Email/password and Microsoft linkage remain secondary and future-oriented.</li>
                </>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
