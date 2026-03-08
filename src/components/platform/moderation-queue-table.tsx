"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArrowUpRight, Building2, CheckCircle2, ClipboardList, Loader2, Megaphone, SearchSlash, XCircle } from "lucide-react";

import { reviewModerationItemAction } from "@/actions/moderation";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ModerationQueueRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  targetType: "company" | "post" | "report";
  submittedAt: Date;
  submittedBy?: string | null;
  context?: string | null;
  href?: string | null;
};

type QueueFilter = ModerationQueueRow["targetType"] | "all";
type ModerationDecision = "approve" | "reject" | "archive";

const targetMeta: Record<
  ModerationQueueRow["targetType"],
  {
    label: string;
    icon: typeof Building2;
    chipClass: string;
  }
> = {
  company: {
    label: "Company",
    icon: Building2,
    chipClass: "border-amber-400/16 bg-amber-400/8 text-amber-200",
  },
  post: {
    label: "Post",
    icon: Megaphone,
    chipClass: "border-blue-400/16 bg-blue-400/8 text-blue-200",
  },
  report: {
    label: "Report",
    icon: ClipboardList,
    chipClass: "border-rose-300/16 bg-rose-300/8 text-rose-100",
  },
};

export function ModerationQueueTable({
  rows,
  emptyTitle = "Queue is clear",
  emptyDescription = "There are no moderation items waiting for staff review.",
  showOverview = false,
  defaultFilter = "all",
  showTypeFilters = true,
}: {
  rows: ModerationQueueRow[];
  emptyTitle?: string;
  emptyDescription?: string;
  showOverview?: boolean;
  defaultFilter?: QueueFilter;
  showTypeFilters?: boolean;
}) {
  const router = useRouter();
  const [queueRows, setQueueRows] = useState(rows);
  const [activeFilter, setActiveFilter] = useState<QueueFilter>(defaultFilter);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [pendingAction, setPendingAction] = useState<{ rowId: string; decision: ModerationDecision } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQueueRows(rows);
  }, [rows]);

  const filteredRows = useMemo(() => {
    const nextRows = activeFilter === "all" ? queueRows : queueRows.filter((row) => row.targetType === activeFilter);
    return [...nextRows].sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime());
  }, [activeFilter, queueRows]);

  const summary = useMemo(
    () => ({
      total: queueRows.length,
      company: queueRows.filter((row) => row.targetType === "company").length,
      post: queueRows.filter((row) => row.targetType === "post").length,
      report: queueRows.filter((row) => row.targetType === "report").length,
    }),
    [queueRows],
  );

  async function handleDecision(row: ModerationQueueRow, decision: ModerationDecision) {
    if (decision !== "approve") {
      const confirmed = window.confirm(
        decision === "reject"
          ? `Reject "${row.title}" and remove it from the active moderation queue?`
          : `Archive "${row.title}" and remove it from the active moderation queue?`,
      );

      if (!confirmed) {
        return;
      }
    }

    setFeedback(null);
    setPendingAction({ rowId: row.id, decision });

    startTransition(async () => {
      const result = await reviewModerationItemAction({
        targetId: row.id,
        targetType: row.targetType,
        decision,
      });

      if (!result.ok) {
        setFeedback({
          tone: "error",
          message: result.message ?? "Moderation action failed.",
        });
        setPendingAction(null);
        return;
      }

      setQueueRows((currentRows) => currentRows.filter((entry) => entry.id !== row.id));
      setFeedback({
        tone: "success",
        message: result.message ?? "Moderation action completed.",
      });
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {showOverview ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ModerationSummaryCell label="Needs attention" value={summary.total} emphasis />
          <ModerationSummaryCell label="Companies" value={summary.company} />
          <ModerationSummaryCell label="Posts" value={summary.post} />
          <ModerationSummaryCell label="Reports" value={summary.report} />
        </div>
      ) : null}

      <div className="surface-panel-strong overflow-hidden">
        <div className="border-b border-white/8 px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="panel-label">Review queue</div>
              <h2 className="mt-2 font-display text-[1.6rem] leading-none text-white">Pending moderation</h2>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Review public-facing submissions, process reports, and keep the queue moving without leaving stale items behind.
              </p>
            </div>

            {showTypeFilters ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {(["all", "company", "post", "report"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors",
                      activeFilter === filter
                        ? "border-blue-400/24 bg-blue-400/12 text-blue-100"
                        : "border-white/8 bg-white/[0.03] text-white/54 hover:border-white/12 hover:text-white/82",
                    )}
                  >
                    {filter === "all" ? "All" : targetMeta[filter].label}
                    <span className="ml-2 text-[10px] text-white/40">
                      {filter === "all" ? summary.total : summary[filter]}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {feedback ? (
            <div
              className={cn(
                "mt-4 flex items-center gap-2 rounded-[0.9rem] border px-3 py-2.5 text-sm",
                feedback.tone === "success"
                  ? "border-emerald-400/16 bg-emerald-400/10 text-emerald-100"
                  : "border-rose-400/16 bg-rose-400/10 text-rose-100",
              )}
            >
              {feedback.tone === "success" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
              {feedback.message}
            </div>
          ) : null}
        </div>

        <div className="divide-y divide-white/8">
          {filteredRows.length ? (
            filteredRows.map((row) => {
              const meta = targetMeta[row.targetType];
              const Icon = meta.icon;
              const rowPending = isPending && pendingAction?.rowId === row.id;

              return (
                <section key={row.id} className="px-5 py-4">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.95fr)_auto] xl:items-start">
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]", meta.chipClass)}>
                          <Icon className="size-3.5" />
                          {meta.label}
                        </span>
                        <StatusBadge status={row.status as never} />
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-base font-medium text-white">{row.title}</div>
                        <p className="max-w-2xl text-sm leading-6 text-white/56">{row.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="border-l border-white/8 pl-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">Submitted</div>
                        <div className="mt-1.5 text-white/78">{formatDate(row.submittedAt)}</div>
                        <div className="mt-1 text-xs text-white/46">{formatRelativeTime(row.submittedAt)}</div>
                      </div>
                      {row.submittedBy ? (
                        <div className="border-l border-white/8 pl-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">Submitted by</div>
                          <div className="mt-1.5 text-white/72">{row.submittedBy}</div>
                        </div>
                      ) : null}
                      {row.context ? (
                        <div className="border-l border-white/8 pl-3">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">Context</div>
                          <div className="mt-1.5 text-white/62">{row.context}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                      {row.href ? (
                        <Button size="sm" variant="outline" render={<Link href={row.href} />}>
                          <ArrowUpRight className="size-3.5" />
                          Inspect
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-500/16 text-emerald-100 hover:bg-emerald-500/24"
                        onClick={() => handleDecision(row, "approve")}
                        disabled={isPending}
                      >
                        {rowPending && pendingAction?.decision === "approve" ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 border-rose-400/16 bg-rose-400/10 text-rose-100 hover:bg-rose-400/18"
                        onClick={() => handleDecision(row, "reject")}
                        disabled={isPending}
                      >
                        {rowPending && pendingAction?.decision === "reject" ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => handleDecision(row, "archive")}
                        disabled={isPending}
                      >
                        {rowPending && pendingAction?.decision === "archive" ? <Loader2 className="size-3.5 animate-spin" /> : <Archive className="size-3.5" />}
                        Archive
                      </Button>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="px-5 py-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-[0.95rem] border border-white/10 bg-white/[0.03]">
                  <SearchSlash className="size-4 text-white/42" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white/84">{emptyTitle}</div>
                  <p className="text-sm leading-6 text-white/54">{emptyDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModerationSummaryCell({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1rem] border px-4 py-4",
        emphasis ? "border-blue-400/16 bg-blue-400/[0.08]" : "border-white/8 bg-white/[0.02]",
      )}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/42">{label}</div>
      <div className="mt-2 font-display text-[1.9rem] leading-none text-white">{value}</div>
      <div className="mt-1 text-xs text-white/42">
        {value ? (emphasis ? "Across all active queues" : `Pending in ${label.toLowerCase()}`) : "Nothing waiting"}
      </div>
    </div>
  );
}
