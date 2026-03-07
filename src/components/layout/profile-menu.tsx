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
  DropdownMenuLabel,
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
          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 p-1.5 transition hover:border-white/20 hover:bg-white/10" />
        }
      >
        <UserAvatar name={displayName} image={avatarUrl} accentColor={accentColor} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 border border-white/10 bg-[#0a1020]/98">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <UserAvatar name={displayName} image={avatarUrl} accentColor={accentColor} />
            <div>
              <div className="font-medium text-white">{displayName}</div>
              <div className="text-xs text-white/60">@{username ?? "member"}</div>
            </div>
          </div>
        </DropdownMenuLabel>
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
