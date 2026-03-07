"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings, User2 } from "lucide-react";
import { signOut } from "next-auth/react";

import { UserAvatar } from "@/components/platform/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProfileMenuProps = {
  displayName: string;
  username: string | null;
  avatarUrl?: string | null;
  accentColor?: string | null;
};

export function ProfileMenu({ displayName, username, avatarUrl, accentColor }: ProfileMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.03] p-1 pr-3 transition-all duration-200 hover:border-primary/20 hover:bg-white/[0.06]" />
        }
      >
        <UserAvatar name={displayName} image={avatarUrl} accentColor={accentColor} size="sm" />
        <div className="hidden text-left sm:block">
          <div className="max-w-[8rem] truncate text-[13px] font-medium text-white">{displayName}</div>
          <div className="max-w-[8rem] truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            @{username ?? "member"}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 p-2">
          <UserAvatar name={displayName} image={avatarUrl} accentColor={accentColor} />
          <div className="min-w-0 flex flex-col gap-0.5">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              @{username ?? "member"}
            </p>
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
