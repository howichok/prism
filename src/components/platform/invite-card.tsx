"use client";

import { useState } from "react";
import { Copy, Hourglass } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { InviteSummary } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function InviteCard({ invite }: { invite: InviteSummary }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(invite.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Invite code</div>
          <div className="mt-1.5 font-mono text-base font-medium text-foreground">{invite.code}</div>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="size-3.5" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {invite.active ? "Active" : "Inactive"}
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {invite.usageCount} / {invite.usageLimit ?? "∞"} uses
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Hourglass className="size-3.5" />
          {invite.expiresAt ? formatDate(invite.expiresAt) : "No expiry"}
        </span>
        <span>Created {formatDate(invite.createdAt)}</span>
      </div>
    </div>
  );
}
