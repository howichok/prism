"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteRole } from "@prisma/client";
import { LayoutDashboard, LogOut, Settings, Shield, User2 } from "lucide-react";
import { signOut } from "next-auth/react";

import { UserAvatar } from "@/components/platform/user-avatar";
import { RoleBadge } from "@/components/platform/role-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canAccessModeration } from "@/lib/permissions";
import { getSiteRoleTheme } from "@/lib/role-system";
import { cn } from "@/lib/utils";

type ProfileMenuProps = {
  displayName: string;
  username: string | null;
  avatarUrl?: string | null;
  accentColor?: string | null;
  siteRole: SiteRole;
};

export function ProfileMenu({ displayName, username, avatarUrl, accentColor, siteRole }: ProfileMenuProps) {
  const router = useRouter();
  const showModeration = canAccessModeration(siteRole);
  const theme = getSiteRoleTheme(siteRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex items-center gap-2 rounded-full border p-1 pr-3 motion-lift",
              theme.inlineSurfaceClass,
              theme.inlineHoverClass,
            )}
          />
        }
      >
        <UserAvatar
          name={displayName}
          image={avatarUrl}
          accentColor={accentColor}
          size="sm"
          className={theme.avatarRingClass}
        />
        <div className="hidden text-left sm:block">
          <div className="max-w-[8rem] truncate text-[13px] font-medium text-white">{displayName}</div>
          <div className={cn("max-w-[8rem] truncate text-[10px] uppercase tracking-[0.2em]", theme.usernameClass)}>
            @{username ?? "member"}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className={cn("mx-2 mt-2 flex items-center gap-3 rounded-[1rem] border p-2.5", theme.menuSurfaceClass)}>
          <UserAvatar
            name={displayName}
            image={avatarUrl}
            accentColor={accentColor}
            className={theme.avatarRingClass}
          />
          <div className="min-w-0 flex flex-col gap-0.5">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className={cn("truncate text-xs", theme.usernameClass)}>
              @{username ?? "member"}
            </p>
            <div className="pt-1">
              <RoleBadge kind="site" role={siteRole} />
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            <User2 className="size-4" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
          {showModeration ? (
            <DropdownMenuItem onClick={() => router.push("/moderation")}>
              <Shield className="size-4" />
              Staff Inbox
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/users/${username ?? ""}`} className="w-full">
            Public Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
