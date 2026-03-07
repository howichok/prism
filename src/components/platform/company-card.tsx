import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, LockKeyhole, Sparkles, UsersRound } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { CompanySummary } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CompanyCard({
  company,
  compact = false,
  href,
}: {
  company: CompanySummary;
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/companies/${company.slug}`}
      className={cn(
        "group block rounded-xl border border-border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-lg hover:shadow-primary/5",
        compact ? "p-4" : "p-5",
      )}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div
          className={cn("h-24", compact ? "sm:h-20" : "sm:h-28")}
          style={{
            background: company.bannerUrl
              ? `linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${company.bannerUrl})`
              : `linear-gradient(135deg, ${company.brandColor ?? "hsl(192 91% 55%)"} 0%, hsl(240 5% 10%) 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge status={company.recruitingStatus} />
          {company.privacy === "PRIVATE" ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white/80 backdrop-blur-sm">
              <LockKeyhole className="size-3" />
              Private
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{company.name}</h3>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
        </div>

        {company.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound className="size-3.5 text-primary/60" />
            {formatCompactNumber(company.counts.members)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseBusiness className="size-3.5 text-primary/60" />
            {company.counts.projects}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary/60" />
            {company.counts.posts}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex -space-x-1.5">
            {company.members.slice(0, 3).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                <div className="cursor-pointer">
                  <UserAvatar
                    name={member.displayName}
                    image={member.avatarUrl}
                    accentColor={member.accentColor}
                    size="sm"
                  />
                </div>
              </MiniProfileHoverCard>
            ))}
          </div>
          <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
            <div className="flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} size="sm" />
              <span>{company.owner.displayName}</span>
            </div>
          </MiniProfileHoverCard>
        </div>
      </div>
    </Link>
  );
}
