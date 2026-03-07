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
  className,
}: {
  company: CompanySummary;
  compact?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href ?? `/companies/${company.slug}`}
      className={cn(
        "group block rounded-[1rem] border border-white/8 bg-card/90 p-4 transition-colors duration-200 hover:border-white/14 hover:bg-card/96",
        className,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-[1rem] border border-white/10 text-sm font-semibold text-white"
              style={{
                background: company.bannerUrl
                  ? `linear-gradient(160deg, rgba(10,10,10,0.16), rgba(10,10,10,0.7)), url(${company.bannerUrl})`
                  : `linear-gradient(140deg, ${company.brandColor ?? "hsl(221 83% 53%)"} 0%, hsl(0 0% 8%) 100%)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="panel-label">Company</div>
              <h3 className="mt-2 truncate font-display text-[1.35rem] leading-none text-white">{company.name}</h3>
              <div className="mt-2 truncate text-[10px] uppercase tracking-[0.2em] text-white/44">
                Led by {company.owner.displayName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {company.privacy === "PRIVATE" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/56">
                <LockKeyhole className="size-3" />
                Private
              </span>
            ) : null}
            <ArrowUpRight className="size-4 text-white/34 transition-colors group-hover:text-white/72" />
          </div>
        </div>

        <p className={cn("text-sm leading-7 text-muted-foreground", compact ? "line-clamp-2" : "line-clamp-3")}>
          {company.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={company.recruitingStatus} />
          {company.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="rounded-[0.7rem] border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/8 pt-4">
          {[
            { label: "Members", value: formatCompactNumber(company.counts.members), icon: UsersRound },
            { label: "Projects", value: company.counts.projects, icon: BriefcaseBusiness },
            { label: "Posts", value: company.counts.posts, icon: Sparkles },
          ].map((item) => (
            <div key={item.label} className="rounded-[0.9rem] border border-white/8 bg-white/[0.03] px-3 py-3">
              <item.icon className="size-3.5 text-primary/78" />
              <div className="mt-2 text-base font-semibold text-white">{item.value}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <div className="flex -space-x-2">
            {company.members.slice(0, 3).map((member) => (
              <MiniProfileHoverCard key={member.id} user={member} companyRole={member.companyRole} primaryCompany={company}>
                <div className="cursor-pointer rounded-full border border-card bg-card transition-colors hover:border-primary/25">
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
            <div className="flex cursor-pointer items-center gap-2 rounded-[0.8rem] border border-white/8 bg-white/[0.03] px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:border-white/14 hover:text-foreground">
              <UserAvatar
                name={company.owner.displayName}
                image={company.owner.avatarUrl}
                accentColor={company.owner.accentColor}
                size="sm"
              />
              <div className="hidden text-left sm:block">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Owner</div>
                <div className="max-w-[8rem] truncate text-xs font-medium text-foreground">{company.owner.displayName}</div>
              </div>
            </div>
          </MiniProfileHoverCard>
        </div>
      </div>
    </Link>
  );
}
