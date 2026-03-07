import { CheckCircle2, Archive, XCircle } from "lucide-react";

import { reviewModerationItemAction } from "@/actions/moderation";
import { StatusBadge } from "@/components/platform/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ModerationRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  targetType: "company" | "post" | "report";
};

export function ModerationQueueTable({ rows }: { rows: ModerationRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Item</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-border">
              <TableCell>
                <div className="text-sm font-medium text-foreground">{row.title}</div>
                <div className="text-xs text-muted-foreground">{row.subtitle}</div>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status as never} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "approve" });
                    }}
                  >
                    <Button size="sm" className="gap-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
                      <CheckCircle2 className="size-3.5" />
                      Approve
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "reject" });
                    }}
                  >
                    <Button size="sm" variant="secondary" className="gap-1.5 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25">
                      <XCircle className="size-3.5" />
                      Reject
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "archive" });
                    }}
                  >
                    <Button size="sm" variant="outline">
                      <Archive className="size-3.5" />
                      Archive
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
