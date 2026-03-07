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
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 text-foreground">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
              P
            </div>
            <span className="text-base font-semibold tracking-tight">PrismMTR</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors",
                  "hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            {viewer ? (
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
