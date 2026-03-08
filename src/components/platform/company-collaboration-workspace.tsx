"use client";

import Link from "next/link";
import { CollaborationStatus } from "@prisma/client";
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  Handshake,
  History,
  Inbox,
  Link2Off,
  Send,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  acceptCompanyCollaborationAction,
  cancelCompanyCollaborationRequestAction,
  endCompanyCollaborationAction,
  rejectCompanyCollaborationAction,
  requestCompanyCollaborationAction,
} from "@/actions/collaboration";
import { ACTIVE_COLLABORATION_LIMIT, getCollaborationLifecycleLabel } from "@/lib/company-collaborations";
import type {
  CompanyCollaborationBuckets,
  CompanyCollaborationSummary,
  CompanyReference,
  CompanySummary,
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/platform/status-badge";
import { cn } from "@/lib/utils";

type FeedbackState =
  | {
      tone: "success" | "error";
      message: string;
    }
  | null;

function bucketCollaborations(
  collaborations: CompanyCollaborationSummary[],
  companyId: string,
): CompanyCollaborationBuckets {
  return {
    active: collaborations.filter((collaboration) => collaboration.status === CollaborationStatus.ACTIVE),
    incoming: collaborations.filter(
      (collaboration) =>
        collaboration.status === CollaborationStatus.PENDING &&
        collaboration.requestingCompanyId !== companyId,
    ),
    outgoing: collaborations.filter(
      (collaboration) =>
        collaboration.status === CollaborationStatus.PENDING &&
        collaboration.requestingCompanyId === companyId,
    ),
    history: collaborations.filter((collaboration) =>
      (
        [CollaborationStatus.REJECTED, CollaborationStatus.CANCELLED, CollaborationStatus.ENDED] as CollaborationStatus[]
      ).includes(collaboration.status),
    ),
  };
}

function CompactEmpty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.025] px-4 py-3 text-sm text-muted-foreground">
      <span className="font-medium text-white/78">{title}</span>
      <span className="ml-2">{body}</span>
    </div>
  );
}

function CollaborationSection({
  title,
  count,
  icon: Icon,
  rows,
}: {
  title: string;
  count: number;
  icon: typeof ArrowRightLeft;
  rows: React.ReactNode;
}) {
  return (
    <section className="surface-panel space-y-4 p-5">
      <div className="flex items-center justify-between border-b border-white/8 pb-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary/76" />
          <div className="text-sm font-medium text-white">{title}</div>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
          {count}
        </div>
      </div>
      {rows}
    </section>
  );
}

function CollaborationRow({
  collaboration,
  companyId,
  canManage,
  isAdmin,
  isPending,
  onAccept,
  onReject,
  onCancel,
  onEnd,
}: {
  collaboration: CompanyCollaborationSummary;
  companyId: string;
  canManage: boolean;
  isAdmin: boolean;
  isPending: boolean;
  onAccept: (collaborationId: string) => void;
  onReject: (collaborationId: string) => void;
  onCancel: (collaborationId: string) => void;
  onEnd: (collaborationId: string) => void;
}) {
  const otherCompany = collaboration.otherCompany ?? collaboration.targetCompany;
  const isIncomingPending =
    collaboration.status === CollaborationStatus.PENDING &&
    collaboration.requestingCompanyId !== companyId;
  const isOutgoingPending =
    collaboration.status === CollaborationStatus.PENDING &&
    collaboration.requestingCompanyId === companyId;
  const showActiveEnd = collaboration.status === CollaborationStatus.ACTIVE;

  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/[0.025] px-4 py-4 transition-colors duration-[var(--motion-duration-normal)] ease-[var(--motion-ease)] hover:border-white/14 hover:bg-white/[0.04]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/companies/${otherCompany.slug}`}
              className="text-sm font-medium text-white transition-colors hover:text-white/76"
            >
              {otherCompany.name}
            </Link>
            <StatusBadge status={collaboration.status} />
          </div>

          <div className="space-y-1 text-xs leading-6 text-muted-foreground">
            <div>
              {collaboration.status === CollaborationStatus.PENDING
                ? `Requested by ${collaboration.requestingCompany.name}`
                : `${collaboration.sourceCompany.name} ↔ ${collaboration.targetCompany.name}`}
            </div>
            <div>
              Created {formatDate(collaboration.createdAt)}
              {collaboration.startedAt ? ` · Active since ${formatDate(collaboration.startedAt)}` : ""}
              {collaboration.endedAt ? ` · Ended ${formatDate(collaboration.endedAt)}` : ""}
              {collaboration.respondedAt && !collaboration.startedAt && !collaboration.endedAt
                ? ` · Responded ${formatDate(collaboration.respondedAt)}`
                : ""}
            </div>
            {collaboration.message ? <div className="text-white/62">{collaboration.message}</div> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Button variant="outline" size="sm" render={<Link href={`/companies/${otherCompany.slug}`} />}>
            View company
          </Button>

          {canManage && isIncomingPending ? (
            <>
              <Button size="sm" disabled={isPending} onClick={() => onAccept(collaboration.id)}>
                <CheckCircle2 className="size-3.5" />
                {isPending ? "Accepting..." : "Accept"}
              </Button>
              <Button variant="destructive" size="sm" disabled={isPending} onClick={() => onReject(collaboration.id)}>
                <XCircle className="size-3.5" />
                {isPending ? "Rejecting..." : "Reject"}
              </Button>
            </>
          ) : null}

          {canManage && isOutgoingPending ? (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => onCancel(collaboration.id)}>
              <Link2Off className="size-3.5" />
              {isPending ? "Cancelling..." : "Cancel request"}
            </Button>
          ) : null}

          {canManage && showActiveEnd ? (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => onEnd(collaboration.id)}>
              <History className="size-3.5" />
              {isPending ? "Ending..." : isAdmin ? "End as admin" : "End"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CompanyCollaborationWorkspace({
  company,
  canManageCollaborations,
  isAdmin,
  availableTargets,
  collaborations,
}: {
  company: CompanySummary;
  canManageCollaborations: boolean;
  isAdmin: boolean;
  availableTargets: CompanyReference[];
  collaborations: CompanyCollaborationBuckets;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState(availableTargets[0]?.id ?? "");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, CollaborationStatus>>({});
  const [isPending, startTransition] = useTransition();

  const allCollaborations = useMemo(
    () => [
      ...collaborations.active,
      ...collaborations.incoming,
      ...collaborations.outgoing,
      ...collaborations.history,
    ],
    [collaborations],
  );

  const derivedCollaborations = useMemo(
    () =>
      allCollaborations.map((collaboration) => ({
        ...collaboration,
        status: statusOverrides[collaboration.id] ?? collaboration.status,
      })),
    [allCollaborations, statusOverrides],
  );

  const derivedBuckets = useMemo(
    () => bucketCollaborations(derivedCollaborations, company.id),
    [company.id, derivedCollaborations],
  );

  const derivedCounts = {
    active: derivedBuckets.active.length,
    incoming: derivedBuckets.incoming.length,
    outgoing: derivedBuckets.outgoing.length,
    history: derivedBuckets.history.length,
    total: derivedCollaborations.length,
  };

  function runAction(
    collaborationId: string,
    nextStatus: CollaborationStatus,
    action: () => Promise<{ ok: boolean; message?: string }>,
  ) {
    setFeedback(null);
    setPendingActionId(collaborationId);
    startTransition(async () => {
      const result = await action();
      setPendingActionId(null);

      if (!result.ok) {
        setFeedback({
          tone: "error",
          message: result.message ?? "Collaboration action failed.",
        });
        return;
      }

      setStatusOverrides((current) => ({
        ...current,
        [collaborationId]: nextStatus,
      }));
      setFeedback({
        tone: "success",
        message: result.message ?? "Collaboration updated.",
      });
      router.refresh();
    });
  }

  function submitRequest() {
    if (!selectedTargetId) {
      setFeedback({
        tone: "error",
        message: "Select a company to request collaboration with.",
      });
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await requestCompanyCollaborationAction({
        sourceCompanyId: company.id,
        targetCompanyId: selectedTargetId,
        message: requestMessage,
      });

      if (!result.ok) {
        setFeedback({
          tone: "error",
          message: result.message ?? "Unable to send collaboration request.",
        });
        return;
      }

      setFeedback({
        tone: "success",
        message: result.message ?? "Collaboration request sent.",
      });
      setRequestMessage("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="surface-panel-strong space-y-5 p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
          <div>
            <div className="panel-label">Collaboration workspace</div>
            <h2 className="mt-3 font-display text-[1.9rem] leading-[0.94] text-white">Coordinate official company links</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              Collaborations are bilateral, status-driven, and limited to {ACTIVE_COLLABORATION_LIMIT} active connections per company.
            </p>
          </div>

          <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-4">
            <div className="panel-label">Current queue</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-[0.9rem] border border-white/8 bg-background/75 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Active</div>
                <div className="mt-2 text-sm text-white">{derivedCounts.active}</div>
              </div>
              <div className="rounded-[0.9rem] border border-white/8 bg-background/75 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Pending</div>
                <div className="mt-2 text-sm text-white">{derivedCounts.incoming + derivedCounts.outgoing}</div>
              </div>
            </div>
          </div>
        </div>

        {feedback ? (
          <div
            className={cn(
              "rounded-[0.95rem] border px-4 py-3 text-sm",
              feedback.tone === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : "border-rose-500/20 bg-rose-500/10 text-rose-200",
            )}
          >
            {feedback.message}
          </div>
        ) : null}

        {canManageCollaborations ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-2">
              <label className="space-y-2 text-sm text-white/70">
                Target company
                <select
                  value={selectedTargetId}
                  onChange={(event) => setSelectedTargetId(event.target.value)}
                  className="h-11 w-full rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
                >
                  {availableTargets.length ? (
                    availableTargets.map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No eligible companies</option>
                  )}
                </select>
              </label>

              <label className="space-y-2 text-sm text-white/70">
                Request note
                <Textarea
                  value={requestMessage}
                  onChange={(event) => setRequestMessage(event.target.value)}
                  className="min-h-24"
                  placeholder="Optional short note describing the collaboration."
                />
              </label>
            </div>

            <div className="rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="panel-label">Request rules</div>
              <div className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                <div>Only owners can manage collaborations for their company.</div>
                <div>Pending requests do not count toward the active limit.</div>
                <div>Duplicate pending or active pairs are rejected automatically.</div>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={isPending || !availableTargets.length || !selectedTargetId}
                onClick={submitRequest}
              >
                <Send className="size-4" />
                {isPending ? "Sending..." : "Request collaboration"}
              </Button>
            </div>
          </div>
        ) : (
          <CompactEmpty
            title="Collaborations are read-only."
            body="Only the company owner or a site admin can send and manage official collaboration requests."
          />
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CollaborationSection
          title="Active collaborations"
          count={derivedCounts.active}
          icon={Handshake}
          rows={
            derivedBuckets.active.length ? (
              <div className="space-y-3">
                {derivedBuckets.active.map((collaboration) => (
                  <CollaborationRow
                    key={collaboration.id}
                    collaboration={collaboration}
                    companyId={company.id}
                    canManage={canManageCollaborations}
                    isAdmin={isAdmin}
                    isPending={pendingActionId === collaboration.id && isPending}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onCancel={() => {}}
                    onEnd={(collaborationId) =>
                      runAction(collaborationId, CollaborationStatus.ENDED, () =>
                        endCompanyCollaborationAction({ collaborationId, companyId: company.id }),
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <CompactEmpty
                title="No active collaborations."
                body="Accepted collaboration pairs will appear here."
              />
            )
          }
        />

        <CollaborationSection
          title="Incoming requests"
          count={derivedCounts.incoming}
          icon={Inbox}
          rows={
            derivedBuckets.incoming.length ? (
              <div className="space-y-3">
                {derivedBuckets.incoming.map((collaboration) => (
                  <CollaborationRow
                    key={collaboration.id}
                    collaboration={collaboration}
                    companyId={company.id}
                    canManage={canManageCollaborations}
                    isAdmin={isAdmin}
                    isPending={pendingActionId === collaboration.id && isPending}
                    onAccept={(collaborationId) =>
                      runAction(collaborationId, CollaborationStatus.ACTIVE, () =>
                        acceptCompanyCollaborationAction({ collaborationId }),
                      )
                    }
                    onReject={(collaborationId) =>
                      runAction(collaborationId, CollaborationStatus.REJECTED, () =>
                        rejectCompanyCollaborationAction({ collaborationId }),
                      )
                    }
                    onCancel={() => {}}
                    onEnd={() => {}}
                  />
                ))}
              </div>
            ) : (
              <CompactEmpty
                title="Inbox is clear."
                body="New collaboration requests from other companies will appear here."
              />
            )
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CollaborationSection
          title="Outgoing requests"
          count={derivedCounts.outgoing}
          icon={Clock3}
          rows={
            derivedBuckets.outgoing.length ? (
              <div className="space-y-3">
                {derivedBuckets.outgoing.map((collaboration) => (
                  <CollaborationRow
                    key={collaboration.id}
                    collaboration={collaboration}
                    companyId={company.id}
                    canManage={canManageCollaborations}
                    isAdmin={isAdmin}
                    isPending={pendingActionId === collaboration.id && isPending}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onCancel={(collaborationId) =>
                      runAction(collaborationId, CollaborationStatus.CANCELLED, () =>
                        cancelCompanyCollaborationRequestAction({ collaborationId }),
                      )
                    }
                    onEnd={() => {}}
                  />
                ))}
              </div>
            ) : (
              <CompactEmpty
                title="No outgoing requests."
                body="Sent requests stay here until they are accepted, rejected, or cancelled."
              />
            )
          }
        />

        <CollaborationSection
          title="History"
          count={derivedCounts.history}
          icon={ShieldAlert}
          rows={
            derivedBuckets.history.length ? (
              <div className="space-y-3">
                {derivedBuckets.history.map((collaboration) => (
                  <div
                    key={collaboration.id}
                    className="rounded-[1rem] border border-white/8 bg-white/[0.025] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/companies/${(collaboration.otherCompany ?? collaboration.targetCompany).slug}`}
                            className="text-sm font-medium text-white transition-colors hover:text-white/76"
                          >
                            {(collaboration.otherCompany ?? collaboration.targetCompany).name}
                          </Link>
                          <StatusBadge status={collaboration.status} />
                        </div>
                        <div className="mt-1 text-xs leading-6 text-muted-foreground">
                          {getCollaborationLifecycleLabel(collaboration.status)} · {formatDate(collaboration.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CompactEmpty title="No collaboration history." body="Ended, rejected, and cancelled requests will be listed here." />
            )
          }
        />
      </div>
    </div>
  );
}
