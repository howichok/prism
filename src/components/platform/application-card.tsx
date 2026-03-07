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
    <div className="surface-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MiniProfileHoverCard user={application.user}>
          <div className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
            <UserAvatar
              name={application.user.displayName}
              image={application.user.avatarUrl}
              accentColor={application.user.accentColor}
              size="sm"
            />
            <span className="text-sm text-white">{application.user.displayName}</span>
          </div>
        </MiniProfileHoverCard>
        <StatusBadge status={application.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/42">
        <span>Submitted {formatDate(application.createdAt)}</span>
        {application.reviewedBy ? <span>Reviewed by {application.reviewedBy.displayName}</span> : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-white/62">{application.message}</p>
      {canReview ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <form action={approveAction}>
            <Button variant="secondary" className="gap-2 bg-emerald-500/14 text-emerald-100 hover:bg-emerald-500/22">
              <CheckCheck className="size-4" />
              Approve
            </Button>
          </form>
          <form action={rejectAction}>
            <Button variant="secondary" className="gap-2 bg-rose-500/14 text-rose-100 hover:bg-rose-500/22">
              <XCircle className="size-4" />
              Reject
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
