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
        "group relative block overflow-hidden rounded-[1rem] border border-border bg-card/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_24px_40px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      <div className="relative space-y-4">
        <div className="relative overflow-hidden rounded-[0.95rem] border border-white/8">
          <div
            className={cn("h-40", compact ? "sm:h-[7.5rem]" : "sm:h-40")}
            style={{
              background: company.bannerUrl
                ? `linear-gradient(180deg, rgba(10, 10, 10, 0.08), rgba(10, 10, 10, 0.72)), url(${company.bannerUrl})`
                : `linear-gradient(140deg, ${company.brandColor ?? "hsl(221 83% 53%)"} 0%, hsl(0 0% 10%) 42%, hsl(0 0% 5%) 100%)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="rounded-full border border-white/12 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/74 backdrop-blur-sm">
              Company hub
            </div>
            {company.privacy === "PRIVATE" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/74 backdrop-blur-sm">
                <LockKeyhole className="size-3" />
                Private
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="mt-2 flex items-end justify-between gap-4">
              <div className="min-w-0 flex flex-col gap-1">
                <h3 className="truncate font-display text-[1.9rem] leading-none text-white">{company.name}</h3>
                <div className="truncate text-[11px] uppercase tracking-[0.18em] text-white/62">
                  {company.owner.displayName} leading / {formatCompactNumber(company.counts.members)} members visible
                </div>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[0.8rem] border border-white/20 bg-black/40 text-white/70 transition-colors group-hover:border-primary/30 group-hover:bg-white/10 group-hover:text-white backdrop-blur-sm">
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_230px]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{company.description}</p>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Recruiting</div>
                <StatusBadge status={company.recruitingStatus} />
              </div>
            </div>
            {company.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[0.65rem] border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-[0.18em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[0.9rem] border border-white/6 bg-white/[0.03] p-2.5">
            {[
              { label: "Members", value: formatCompactNumber(company.counts.members), icon: UsersRound },
              { label: "Projects", value: company.counts.projects, icon: BriefcaseBusiness },
              { label: "Posts", value: company.counts.posts, icon: Sparkles },
            ].map((item) => (
              <div key={item.label} className="rounded-[0.8rem] border border-white/6 bg-background/75 px-3 py-2.5">
                <item.icon className="size-3.5 text-primary/80" />
                <div className="mt-2 text-base font-semibold text-foreground">{item.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/80 pt-4">
          <div className="flex -space-x-2">
            {company.members.slice(0, 3).map((member) => (
              <MiniProfileHoverCard
                key={member.id}
                user={member}
                companyRole={member.companyRole}
                primaryCompany={company}
              >
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
            <div className="flex cursor-pointer items-center gap-2 rounded-[0.8rem] border border-white/6 bg-white/[0.03] px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground">
              <UserAvatar
                name={company.owner.displayName}
                image={company.owner.avatarUrl}
                accentColor={company.owner.accentColor}
                size="sm"
              />
              <div className="hidden text-left sm:block">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">Owner</div>
                <div className="max-w-[8rem] truncate text-xs font-medium text-foreground">
                  {company.owner.displayName}
                </div>
              </div>
            </div>
          </MiniProfileHoverCard>
        </div>
      </div>
    </Link>
  );
}
