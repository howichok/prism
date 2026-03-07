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
    <div className="surface-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Invite code</div>
          <div className="mt-2 font-mono text-lg text-white">{invite.code}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-white/10 bg-white/6 text-white hover:bg-white/10"
        >
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
          {invite.active ? "Active" : "Inactive"}
        </span>
        <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
          {invite.usageCount} / {invite.usageLimit ?? "Unlimited"} uses
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/56">
        <div className="inline-flex items-center gap-2">
          <Hourglass className="size-4" />
          {invite.expiresAt ? formatDate(invite.expiresAt) : "No expiry"}
        </div>
        <div>Created {formatDate(invite.createdAt)}</div>
      </div>
    </div>
  );
}
