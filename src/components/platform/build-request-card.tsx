import Link from "next/link";
import { ClipboardList, Gamepad2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { BuildRequestSummary } from "@/lib/data";

export function BuildRequestCard({ request }: { request: BuildRequestSummary }) {
  return (
    <div className="surface-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-cyan-200/72">
            <ClipboardList className="size-4" />
            <span className="text-xs uppercase tracking-[0.24em]">{request.category.replaceAll("_", " ")}</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-white">{request.title}</h3>
          <p className="mt-2 text-sm leading-7 text-white/62">{request.description}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      {request.needsRecruitment ? (
        <div className="mt-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
          Needs recruitment
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/8 pt-4 text-sm text-white/58">
        <MiniProfileHoverCard user={request.author} primaryCompany={request.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5">
            <UserAvatar name={request.author.displayName} image={request.author.avatarUrl} accentColor={request.author.accentColor} size="sm" />
            <span>{request.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {request.company ? (
          <Link href={`/companies/${request.company.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-2.5 py-1.5 transition hover:text-white">
            <Gamepad2 className="size-4" />
            {request.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
