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
      <div className="surface-panel p-6">
        <div className="panel-label">HQ snapshot</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={company.status} />
          <StatusBadge status={company.recruitingStatus} />
          {currentRole ? <RoleBadge kind="company" role={currentRole} /> : null}
        </div>
        <div className="mt-5 grid gap-3 text-sm text-white/62">
          <div className="surface-panel-soft p-3">{company.counts.members} members</div>
          <div className="surface-panel-soft p-3">{company.counts.posts} posts</div>
          <div className="surface-panel-soft p-3">{company.counts.projects} projects</div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" render={<Link href={`/companies/${company.slug}`} />} className="w-full">
            View public profile
          </Button>
        </div>
      </div>

      <div className="surface-panel p-6">
        <div className="panel-label">Leadership</div>
        <MiniProfileHoverCard user={company.owner} companyRole="OWNER" primaryCompany={company}>
          <div className="mt-4 flex cursor-pointer items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/6 p-3 transition hover:bg-white/10">
            <UserAvatar name={company.owner.displayName} image={company.owner.avatarUrl} accentColor={company.owner.accentColor} />
            <div className="min-w-0">
              <div className="truncate font-medium text-white">{company.owner.displayName}</div>
              <div className="truncate text-sm text-white/56">@{company.owner.username ?? "member"}</div>
            </div>
          </div>
        </MiniProfileHoverCard>
        <p className="mt-4 text-sm leading-7 text-white/58">
          Public company pages stay discoverable while the internal hub remains structured around members, projects, posts, invites, and moderation-aware workflows.
        </p>
      </div>
    </>
  );
}
