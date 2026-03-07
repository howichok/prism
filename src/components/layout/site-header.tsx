import Link from "next/link";

import { ProfileMenu } from "@/components/layout/profile-menu";
import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import type { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/discovery", label: "Discovery" },
];

export function SiteHeader({
  viewer,
  discordAuthConfigured,
}: {
  viewer: SessionUser | null;
  discordAuthConfigured: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050a14]/72 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="flex size-11 items-center justify-center rounded-[1.35rem] border border-cyan-400/20 bg-cyan-400/10 font-semibold tracking-[0.2em] text-cyan-100">
              PM
            </div>
            <div>
              <div className="font-display text-base font-semibold tracking-wide">PrismMTR</div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/45">Transit Network Platform</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 p-1 text-sm text-white/68 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 transition hover:text-white",
                  "hover:bg-white/8",
                )}
              >
                {item.label}
              </Link>
            ))}
            {viewer ? (
              <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white">
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>
        {viewer ? (
          <ProfileMenu
            displayName={viewer.displayName ?? viewer.username ?? "Prism member"}
            username={viewer.username}
            avatarUrl={viewer.avatarUrl}
            accentColor={viewer.accentColor}
          />
        ) : (
          <DiscordAuthButton configured={discordAuthConfigured} redirectTo="/dashboard" />
        )}
      </div>
    </header>
  );
}
