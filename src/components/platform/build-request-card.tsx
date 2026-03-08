import Link from "next/link";
import { ClipboardList, Gamepad2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { BuildRequestSummary } from "@/lib/data";
import { titleCase } from "@/lib/format";

export function BuildRequestCard({ request }: { request: BuildRequestSummary }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.01] p-5 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/20 hover:bg-white/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
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

      <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 text-sm text-muted-foreground">
        <MiniProfileHoverCard user={request.author} primaryCompany={request.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
            <UserAvatar
              name={request.author.displayName}
              image={request.author.avatarUrl}
              accentColor={request.author.accentColor}
              size="sm"
            />
            <span className="text-xs font-medium text-white/80">{request.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {request.company ? (
          <Link
            href={`/companies/${request.company.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
          >
            <Gamepad2 className="size-3.5 text-blue-200/50 group-hover:text-blue-200/80 transition-colors" />
            {request.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
