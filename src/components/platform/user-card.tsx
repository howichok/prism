import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { cn } from "@/lib/utils";

export function UserCard({
  user,
  primaryCompany,
  className,
}: {
  user: UserPreview;
  primaryCompany?: CompanyReference | null;
  className?: string;
}) {
  const membership =
    (primaryCompany
      ? user.memberships.find((entry) => entry.company.id === primaryCompany.id)
      : undefined) ?? user.memberships[0];
  const company = primaryCompany ?? membership?.company ?? null;

  return (
    <MiniProfileHoverCard user={user} companyRole={membership?.companyRole} primaryCompany={company}>
      <article
        className={cn(
          "surface-panel group cursor-pointer overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/6",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar name={user.displayName} image={user.avatarUrl} accentColor={user.accentColor} className="size-14" />
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-white">{user.displayName}</div>
              <div className="truncate text-sm text-white/56">@{user.username ?? "member"}</div>
            </div>
          </div>
          {membership ? <RoleBadge kind="company" role={membership.companyRole} /> : null}
        </div>

        <p className="mt-4 text-sm leading-7 text-white/60">{user.bio ?? "No bio added yet. Hover to inspect the full Prism member card."}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {user.badges.slice(0, 3).map((badge) => (
            <span
              key={badge.id}
              className="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white"
              style={{ borderColor: `${badge.color}50`, backgroundColor: `${badge.color}20` }}
            >
              {badge.name}
            </span>
          ))}
          {company ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
              {company.name}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-sm text-white/56">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-100/72" />
            {user.memberships.length} company links
          </div>
          {company ? (
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-cyan-100/72" />
              {company.recruitingStatus.replaceAll("_", " ")}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" render={<Link href={`/users/${user.username ?? ""}`} />} className="flex-1">
            View profile
          </Button>
          {company ? (
            <Button variant="secondary" size="sm" render={<Link href={`/companies/${company.slug}`} />} className="flex-1">
              View company
            </Button>
          ) : null}
        </div>
      </article>
    </MiniProfileHoverCard>
  );
}
