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
    <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/4">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8">
            <TableHead className="text-white/52">Item</TableHead>
            <TableHead className="text-white/52">Status</TableHead>
            <TableHead className="text-right text-white/52">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-white/8">
              <TableCell>
                <div className="font-medium text-white">{row.title}</div>
                <div className="text-sm text-white/58">{row.subtitle}</div>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status as never} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "approve" });
                    }}
                  >
                    <Button size="sm" className="gap-2 bg-emerald-500/14 text-emerald-100 hover:bg-emerald-500/22">
                      <CheckCircle2 className="size-4" />
                      Approve
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "reject" });
                    }}
                  >
                    <Button size="sm" variant="secondary" className="gap-2 bg-rose-500/14 text-rose-100 hover:bg-rose-500/22">
                      <XCircle className="size-4" />
                      Reject
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await reviewModerationItemAction({ targetId: row.id, targetType: row.targetType, decision: "archive" });
                    }}
                  >
                    <Button size="sm" variant="outline" className="gap-2 border-white/10 bg-white/6 text-white hover:bg-white/12">
                      <Archive className="size-4" />
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
