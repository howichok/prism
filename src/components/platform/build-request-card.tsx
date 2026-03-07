import Link from "next/link";
import { ClipboardList, Gamepad2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { BuildRequestSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function BuildRequestCard({ request }: { request: BuildRequestSummary }) {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 shadow-[0_22px_58px_-36px_rgba(0,0,0,0.92)] transition-all duration-300 hover:border-blue-400/18">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-200/76">
            <ClipboardList className="size-3.5" />
            {titleCase(request.category)}
          </div>
          <h3 className="font-display text-[1.5rem] leading-[1.02] text-white">{request.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{request.description}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {request.needsRecruitment ? (
          <div className="inline-flex rounded-full border border-amber-500/24 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-300">
            Needs recruitment
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4 text-sm text-muted-foreground">
        <MiniProfileHoverCard user={request.author} primaryCompany={request.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-2 py-1.5">
            <UserAvatar
              name={request.author.displayName}
              image={request.author.avatarUrl}
              accentColor={request.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white">{request.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {request.company ? (
          <Link
            href={`/companies/${request.company.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/62 transition-colors hover:border-white/12 hover:text-white"
          >
            <Gamepad2 className="size-3.5 text-blue-200/56" />
            {request.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
