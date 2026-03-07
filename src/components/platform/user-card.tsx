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
          "group cursor-pointer rounded-[1rem] border border-white/8 bg-card/90 p-4 transition-colors duration-200 hover:border-white/14 hover:bg-card/96",
          className,
        )}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <UserAvatar
                name={user.displayName}
                image={user.avatarUrl}
                accentColor={user.accentColor}
                className="size-14"
              />
              <div className="min-w-0">
                <div className="panel-label">Member</div>
                <div className="mt-2 truncate font-display text-[1.35rem] leading-none text-white">{user.displayName}</div>
                <div className="mt-2 truncate text-[10px] uppercase tracking-[0.2em] text-white/44">@{user.username ?? "member"}</div>
              </div>
            </div>
            {membership ? <RoleBadge kind="company" role={membership.companyRole} /> : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {company ? (
              <span className="rounded-[0.75rem] border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58">
                {company.name}
              </span>
            ) : null}
            <span className="rounded-[0.75rem] border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58">
              Identity surface
            </span>
          </div>

          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-muted-foreground">
            {user.bio ?? "This Prism member has not added a public bio yet."}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {user.badges.slice(0, 3).map((badge) => (
              <span
                key={badge.id}
                className="rounded-md border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                style={{ borderColor: `${badge.color}45`, backgroundColor: `${badge.color}12`, color: badge.color }}
              >
                {badge.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-white/8 pt-4">
            <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] px-3 py-3">
              <Sparkles className="size-3.5 text-primary/78" />
              <div className="mt-2 text-base font-semibold text-white">{user.badges.length}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Badges</div>
            </div>
            <div className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] px-3 py-3">
              <Building2 className="size-3.5 text-primary/78" />
              <div className="mt-2 text-base font-semibold text-white">{user.memberships.length}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Companies</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" render={<Link href={`/users/${user.username ?? ""}`} />} className="flex-1">
              View profile
            </Button>
            {company ? (
              <Button variant="secondary" size="sm" render={<Link href={`/companies/${company.slug}`} />} className="flex-1">
                Company
              </Button>
            ) : null}
          </div>
        </div>
      </article>
    </MiniProfileHoverCard>
  );
}
