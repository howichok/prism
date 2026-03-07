import { CheckCheck, XCircle } from "lucide-react";

import { reviewCompanyApplicationAction } from "@/actions/company";
import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { Button } from "@/components/ui/button";
import type { ApplicationSummary } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function ApplicationCard({
  application,
  canReview = false,
}: {
  application: ApplicationSummary;
  canReview?: boolean;
}) {
  async function approveAction() {
    "use server";
    await reviewCompanyApplicationAction({ applicationId: application.id, status: "APPROVED" });
  }

  async function rejectAction() {
    "use server";
    await reviewCompanyApplicationAction({ applicationId: application.id, status: "REJECTED" });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <MiniProfileHoverCard user={application.user}>
          <div className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5">
            <UserAvatar
              name={application.user.displayName}
              image={application.user.avatarUrl}
              accentColor={application.user.accentColor}
              size="sm"
            />
            <span className="text-sm font-medium text-foreground">{application.user.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        <StatusBadge status={application.status} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>Submitted {formatDate(application.createdAt)}</span>
        {application.reviewedBy ? <span>· Reviewed by {application.reviewedBy.displayName}</span> : null}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{application.message}</p>
      {canReview ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <form action={approveAction}>
            <Button size="sm" className="gap-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
              <CheckCheck className="size-3.5" />
              Approve
            </Button>
          </form>
          <form action={rejectAction}>
            <Button size="sm" className="gap-1.5 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25">
              <XCircle className="size-3.5" />
              Reject
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
