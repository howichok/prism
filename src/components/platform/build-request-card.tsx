import Link from "next/link";
import { ClipboardList, Gamepad2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import type { BuildRequestSummary } from "@/lib/data";

export function BuildRequestCard({ request }: { request: BuildRequestSummary }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 text-xs text-primary">
            <ClipboardList className="size-3.5" />
            <span className="font-medium">{request.category.replaceAll("_", " ")}</span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{request.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{request.description}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      {request.needsRecruitment ? (
        <div className="mt-3 inline-flex rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
          Needs recruitment
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
        <MiniProfileHoverCard user={request.author} primaryCompany={request.company}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2 py-1">
            <UserAvatar name={request.author.displayName} image={request.author.avatarUrl} accentColor={request.author.accentColor} size="sm" />
            <span className="text-xs font-medium text-foreground">{request.author.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        {request.company ? (
          <Link href={`/companies/${request.company.slug}`} className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-xs transition-colors hover:text-foreground">
            <Gamepad2 className="size-3.5" />
            {request.company.name}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
