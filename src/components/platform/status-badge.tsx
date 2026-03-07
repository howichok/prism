import { ApplicationStatus, BuildRequestStatus, ModerationStatus, ProjectStatus, RecruitingStatus, ReportStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type StatusValue =
  | ApplicationStatus
  | BuildRequestStatus
  | ModerationStatus
  | ProjectStatus
  | RecruitingStatus
  | ReportStatus;

const toneMap: Record<string, string> = {
  OPEN: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  APPROVED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  PUBLISHED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  COMPLETE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  PLANNING: "border-violet-500/20 bg-violet-500/10 text-violet-100",
  LIMITED: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  IN_PROGRESS: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  IN_REVIEW: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  REVIEW: "border-amber-500/20 bg-amber-500/10 text-amber-100",
  PENDING: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  PENDING_REVIEW: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  ACTIONED: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  REJECTED: "border-rose-500/20 bg-rose-500/10 text-rose-100",
  CLOSED: "border-white/12 bg-white/6 text-white/72",
  ARCHIVED: "border-white/12 bg-white/6 text-white/72",
  WITHDRAWN: "border-white/12 bg-white/6 text-white/72",
  ON_HOLD: "border-white/12 bg-white/6 text-white/72",
  RESOLVED: "border-white/12 bg-white/6 text-white/72",
};

export function StatusBadge({ status, className }: { status: StatusValue; className?: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm",
        toneMap[status] ?? toneMap.ARCHIVED,
        className,
      )}
    >
      {titleCase(status)}
    </Badge>
  );
}
