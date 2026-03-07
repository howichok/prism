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
        "surface-panel group block overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/6",
        compact ? "p-5" : "p-6",
      )}
    >
      <div className="relative mb-5 overflow-hidden rounded-[1.4rem] border border-white/8">
        <div
          className={cn("h-28", compact ? "sm:h-24" : "sm:h-30")}
          style={{
            background: company.bannerUrl
              ? `linear-gradient(135deg, rgba(5,10,20,0.18), rgba(5,10,20,0.82)), url(${company.bannerUrl})`
              : `linear-gradient(135deg, ${company.brandColor ?? "#55d4ff"} 0%, rgba(9,14,26,0.98) 72%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="inline-flex rounded-full border border-white/12 bg-[#07101d]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62">
            Company hub
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={company.recruitingStatus} />
            {company.privacy === "PRIVATE" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-[#07101d]/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <LockKeyhole className="size-3.5" />
                Private
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-white">{company.name}</h3>
            <ArrowUpRight className="size-4 text-white/34 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-100" />
          </div>
          <p className="text-sm leading-7 text-white/65">{company.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/65">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-3 text-sm text-white/62 sm:grid-cols-3">
          <div className="surface-panel-soft flex items-center gap-2 p-3">
            <UsersRound className="size-4 text-cyan-200/70" />
            {formatCompactNumber(company.counts.members)} members
          </div>
          <div className="surface-panel-soft flex items-center gap-2 p-3">
            <BriefcaseBusiness className="size-4 text-cyan-200/70" />
            {company.counts.projects} projects
          </div>
          <div className="surface-panel-soft flex items-center gap-2 p-3">
            <Sparkles className="size-4 text-cyan-200/70" />
            {company.counts.posts} posts
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-4">
          <div className="flex items-center gap-2">
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
            <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 transition hover:bg-white/10">
              <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} size="sm" />
              <span className="text-sm text-white/62">Owner: {company.owner.displayName}</span>
            </div>
          </MiniProfileHoverCard>
        </div>
      </div>
    </Link>
  );
}
