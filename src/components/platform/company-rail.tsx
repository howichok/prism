import Link from "next/link";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { RoleBadge } from "@/components/platform/role-badge";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import type { CompanyRole } from "@prisma/client";
import type { CompanySummary } from "@/lib/data";

export function CompanyRail({
  company,
  currentRole,
}: {
  company: CompanySummary;
  currentRole?: CompanyRole | null;
}) {
  return (
    <>
      <div className="surface-panel p-4">
        <div className="panel-label">HQ snapshot</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusBadge status={company.status} />
          <StatusBadge status={company.recruitingStatus} />
          {currentRole ? <RoleBadge kind="company" role={currentRole} /> : null}
        </div>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between rounded-[0.8rem] border border-white/6 bg-background/70 px-3 py-2.5">
            <span>Members</span>
            <span className="font-medium text-foreground">{company.counts.members}</span>
          </div>
          <div className="flex items-center justify-between rounded-[0.8rem] border border-white/6 bg-background/70 px-3 py-2.5">
            <span>Posts</span>
            <span className="font-medium text-foreground">{company.counts.posts}</span>
          </div>
          <div className="flex items-center justify-between rounded-[0.8rem] border border-white/6 bg-background/70 px-3 py-2.5">
            <span>Projects</span>
            <span className="font-medium text-foreground">{company.counts.projects}</span>
          </div>
        </div>
        {company.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <span key={tag} className="rounded-[0.65rem] border border-white/6 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4">
          <Button variant="outline" size="sm" render={<Link href={`/companies/${company.slug}`} />} className="w-full">
            View public page
          </Button>
        </div>
      </div>

      <div className="surface-panel p-4">
        <div className="panel-label">Leadership</div>
        <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
          <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-[0.85rem] border border-white/6 bg-white/[0.03] p-2.5 transition-colors hover:border-primary/20 hover:bg-white/[0.05]">
            <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} size="sm" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{company.owner.displayName}</div>
              <div className="truncate text-xs text-muted-foreground">@{company.owner.username ?? "member"}</div>
            </div>
          </div>
        </MiniProfileHoverCard>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          Public company pages stay discoverable while the internal hub provides structured workflows.
        </p>
      </div>
    </>
  );
}
