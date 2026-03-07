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
          "group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-primary/5",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={user.displayName} image={user.avatarUrl} accentColor={user.accentColor} className="size-12" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{user.displayName}</div>
              <div className="truncate text-xs text-muted-foreground">@{user.username ?? "member"}</div>
            </div>
          </div>
          {membership ? <RoleBadge kind="company" role={membership.companyRole} /> : null}
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{user.bio ?? "No bio added yet."}</p>

        {(user.badges.length > 0 || company) ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.badges.slice(0, 3).map((badge) => (
              <span
                key={badge.id}
                className="rounded-md border px-2 py-0.5 text-xs text-foreground"
                style={{ borderColor: `${badge.color}40`, backgroundColor: `${badge.color}15` }}
              >
                {badge.name}
              </span>
            ))}
            {company ? (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {company.name}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary/60" />
            {user.memberships.length} companies
          </span>
          {company ? (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary/60" />
              {company.recruitingStatus.replaceAll("_", " ")}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" render={<Link href={`/users/${user.username ?? ""}`} />} className="flex-1">
            View profile
          </Button>
          {company ? (
            <Button variant="secondary" size="sm" render={<Link href={`/companies/${company.slug}`} />} className="flex-1">
              Company
            </Button>
          ) : null}
        </div>
      </article>
    </MiniProfileHoverCard>
  );
}
