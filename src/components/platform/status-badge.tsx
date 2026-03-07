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
  OPEN: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  COMPLETE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PLANNING: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  LIMITED: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  IN_PROGRESS: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  IN_REVIEW: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  REVIEW: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  PENDING: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  PENDING_REVIEW: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  ACTIONED: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  REJECTED: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  CLOSED: "border-border bg-secondary text-muted-foreground",
  ARCHIVED: "border-border bg-secondary text-muted-foreground",
  WITHDRAWN: "border-border bg-secondary text-muted-foreground",
  ON_HOLD: "border-border bg-secondary text-muted-foreground",
  RESOLVED: "border-border bg-secondary text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: StatusValue; className?: string }) {
  return (
    <Badge
      className={cn(
        "rounded-full px-2.5 py-1 text-[10px] tracking-[0.18em]",
        toneMap[status] ?? toneMap.ARCHIVED,
        className,
      )}
    >
      {titleCase(status)}
    </Badge>
  );
}
