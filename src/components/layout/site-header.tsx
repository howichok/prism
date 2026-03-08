"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteRole } from "@prisma/client";

import { ProfileMenu } from "@/components/layout/profile-menu";
import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import { canAccessModeration } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const baseNavItems = [
  { href: "/", label: "Home" },
  { href: "/discovery", label: "Discovery" },
];

export type HeaderViewer = {
  displayName: string | null;
  username: string | null;
  avatarUrl?: string | null;
  accentColor?: string | null;
  siteRole: SiteRole;
  isGuest?: boolean;
};

export function SiteHeader({
  viewer,
  discordAuthConfigured,
}: {
  viewer: HeaderViewer | null;
  discordAuthConfigured: boolean;
}) {
  const pathname = usePathname();
  const showModeration = viewer ? canAccessModeration(viewer.siteRole) : false;
  const navItems = viewer
    ? [...baseNavItems, { href: "/dashboard", label: "Dashboard" }, ...(showModeration ? [{ href: "/moderation", label: "Staff" }] : [])]
    : baseNavItems;
  const authControls = viewer ? (
    viewer.isGuest ? (
      <>
        <span className="hidden text-xs text-white/30 lg:block">Guest</span>
        <DiscordAuthButton configured={discordAuthConfigured} redirectTo="/dashboard" variant="outline" />
      </>
    ) : (
      <ProfileMenu
        displayName={viewer.displayName ?? viewer.username ?? "Prism member"}
        username={viewer.username}
        avatarUrl={viewer.avatarUrl}
        accentColor={viewer.accentColor}
        siteRole={viewer.siteRole}
      />
    )
  ) : (
    <DiscordAuthButton configured={discordAuthConfigured} redirectTo="/dashboard" variant="outline" />
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[hsl(0_0%_4%)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
            <span className="font-display text-sm">P</span>
          </div>
          <span className="font-display text-base text-white">PrismMTR</span>
        </Link>

        <nav className={cn("hidden items-center gap-1 md:flex", pathname.startsWith("/dashboard") && "md:hidden")}>
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/40 hover:text-white/70",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {authControls}
        </div>
      </div>
    </header>
  );
}
