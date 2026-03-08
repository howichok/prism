import Link from "next/link";
import { ClipboardList, Gamepad2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { BuildRequestSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function BuildRequestCard({ request }: { request: BuildRequestSummary }) {
  return (
    <div className="group rounded-xl border border-white/6 bg-white/[0.02] p-5 motion-lift hover:border-white/12 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-blue-300/60">
              <ClipboardList className="size-3" />
              {titleCase(request.category)}
            </span>
            <StatusBadge status={request.status} />
            {request.needsRecruitment ? (
              <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-amber-300">
                Needs recruitment
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-lg leading-tight text-white">{request.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/40">{request.description}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.04] pt-3">
        <MiniProfileHoverCard user={request.author} primaryCompany={request.company}>
          <div className="inline-flex cursor-pointer items-center gap-2">
            <UserAvatar
              name={request.author.displayName}
              image={request.author.avatarUrl}
              accentColor={request.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white/60">{request.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {request.company ? (
          <Link
            href={`/companies/${request.company.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
          >
            <Gamepad2 className="size-3.5" />
            {request.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
