import Link from "next/link";
import { LockKeyhole, UsersRound } from "lucide-react";

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
  className,
}: {
  company: CompanySummary;
  compact?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group rounded-xl border border-white/6 bg-white/[0.02] p-5 motion-lift hover:border-white/12 hover:bg-white/[0.04]",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href={href ?? `/companies/${company.slug}`}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
              style={{
                background: company.brandColor ?? "hsl(221 83% 53%)",
              }}
            >
              {company.name.slice(0, 2).toUpperCase()}
            </Link>
            <div className="min-w-0">
              <Link href={href ?? `/companies/${company.slug}`} className="block truncate text-sm font-medium text-white transition-colors hover:text-white/80">
                {company.name}
              </Link>
              <div className="mt-0.5 truncate text-xs text-white/30">
                Led by {company.owner.displayName}
              </div>
            </div>
          </div>
          {company.privacy === "PRIVATE" ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white/40">
              <LockKeyhole className="size-3" />
              Private
            </span>
          ) : null}
        </div>

        <p className={cn("text-sm leading-6 text-white/45", compact ? "line-clamp-2" : "line-clamp-3")}>
          {company.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={company.recruitingStatus} />
          {company.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/6 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white/35"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/6 pt-3">
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <UsersRound className="size-3.5" />
              {formatCompactNumber(company.counts.members)}
            </span>
            <span>{company.counts.projects} projects</span>
            <span>{company.counts.posts} posts</span>
          </div>

          <div className="flex -space-x-1.5">
            {company.members.slice(0, 3).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                <div className="cursor-pointer rounded-full border-2 border-[hsl(0_0%_4%)]">
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
        </div>
      </div>
    </article>
  );
}
