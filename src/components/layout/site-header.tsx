"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Radar } from "lucide-react";

import { ProfileMenu } from "@/components/layout/profile-menu";
import { DiscordAuthButton } from "@/components/platform/discord-auth-button";
import type { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const baseNavItems = [
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
  const pathname = usePathname();
  const navItems = viewer
    ? [...baseNavItems, { href: "/dashboard", label: "Dashboard" }]
    : baseNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[hsl(0_0%_6%/0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.35rem] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-7">
          <Link href="/" className="group flex min-w-0 items-center gap-3 text-foreground">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-[linear-gradient(145deg,rgba(37,99,235,0.28),rgba(10,10,10,0.92))] text-primary shadow-[0_12px_30px_rgba(37,99,235,0.16)]">
              <span className="font-display text-sm font-semibold tracking-[-0.08em]">PM</span>
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-[1.05rem] leading-none text-white">PrismMTR</div>
              <div className="hidden truncate text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:block">
                Transit Network Platform
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 md:flex">
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
                    "rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground xl:flex">
            <Radar className="size-3.5 text-primary" />
            <span>Network live</span>
          </div>
          <div className="hidden h-5 w-px bg-border xl:block" />
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
          <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] px-2 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground 2xl:flex">
            <span>Public</span>
            <ArrowUpRight className="size-3" />
          </div>
        </div>
      </div>
    </header>
  );
}
