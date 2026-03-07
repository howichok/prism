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
          "group relative cursor-pointer overflow-hidden rounded-[1rem] border border-border bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_22px_36px_rgba(0,0,0,0.28)]",
          className,
        )}
      >
        <div
          className="absolute inset-x-0 top-0 h-24 border-b border-white/6"
          style={{
            background: `linear-gradient(140deg, ${user.accentColor ?? "hsl(221 83% 53%)"} 0%, hsl(0 0% 10%) 46%, hsl(0 0% 5%) 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-end gap-3">
              <UserAvatar
                name={user.displayName}
                image={user.avatarUrl}
                accentColor={user.accentColor}
                className="mt-10 size-14 border-[3px] border-card"
              />
              <div className="min-w-0 pb-1">
                <div className="truncate font-display text-xl leading-none text-foreground">{user.displayName}</div>
                <div className="mt-1 truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  @{user.username ?? "member"}
                </div>
              </div>
            </div>
            {membership ? <RoleBadge kind="company" role={membership.companyRole} className="mt-3" /> : null}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <div className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Identity surface
            </div>
            {company ? (
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {company.name}
              </div>
            ) : null}
          </div>

          <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-muted-foreground">
            {user.bio ?? "This Prism member has not added a public bio yet."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
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

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-[0.9rem] border border-white/6 bg-white/[0.03] p-2.5">
            <div className="rounded-[0.8rem] border border-white/6 bg-background/75 px-3 py-2.5">
              <Sparkles className="size-3.5 text-primary/80" />
              <div className="mt-2 text-base font-semibold text-foreground">{user.badges.length}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Badges</div>
            </div>
            <div className="rounded-[0.8rem] border border-white/6 bg-background/75 px-3 py-2.5">
              <Building2 className="size-3.5 text-primary/80" />
              <div className="mt-2 text-base font-semibold text-foreground">{user.memberships.length}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Companies</div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/users/${user.username ?? ""}`} />}
              className="flex-1"
            >
              View profile
            </Button>
            {company ? (
              <Button
                variant="secondary"
                size="sm"
                render={<Link href={`/companies/${company.slug}`} />}
                className="flex-1"
              >
                Company
              </Button>
            ) : null}
          </div>
        </div>
      </article>
    </MiniProfileHoverCard>
  );
}
