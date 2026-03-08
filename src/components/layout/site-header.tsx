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
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/66 lg:block">
          Guest mode
        </div>
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(10,10,10,0.98),rgba(10,10,10,0.94))]">
      <div className="mx-auto flex h-[3.85rem] max-w-[1400px] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5 lg:gap-7">
          <Link href="/" className="group flex min-w-0 items-center gap-3 text-foreground">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/18 bg-[linear-gradient(140deg,rgba(14,165,233,0.18),rgba(10,10,10,0.94))] text-primary">
              <span className="font-display text-sm font-semibold tracking-[-0.08em]">P</span>
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-[1.05rem] leading-none text-white">PrismMTR</div>
              <div className="hidden truncate text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:block">
                Transit Network Platform
              </div>
            </div>
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
                    "rounded-[0.85rem] border px-3.5 py-2 text-[13px] font-medium transition-colors duration-200",
                    active
                      ? "border-white/10 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "border-transparent text-muted-foreground hover:border-white/8 hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex items-center justify-end gap-3">
          <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground xl:block">
            Public network
          </div>
          {authControls}
        </div>
      </div>
    </header>
  );
}
