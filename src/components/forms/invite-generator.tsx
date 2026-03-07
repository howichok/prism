"use client";

import { useState, useTransition } from "react";

import { createInviteAction } from "@/actions/company";
import { Button } from "@/components/ui/button";

export function InviteGenerator({ companyId }: { companyId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
      <h3 className="text-lg font-semibold text-white">Generate invite</h3>
      <p className="mt-2 text-sm leading-6 text-white/58">
        Create a 14-day invite with a default usage limit of 10. Expand this flow later if you want advanced invite controls.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          onClick={() =>
            startTransition(async () => {
              const result = await createInviteAction({ companyId, expiresInDays: 14, usageLimit: 10 });
              setMessage(result.ok ? `Invite created: ${result.inviteCode}` : result.message ?? "Unable to create invite.");
            })
          }
          disabled={isPending}
        >
          {isPending ? "Generating..." : "Generate invite"}
        </Button>
        <span className="text-sm text-white/58">{message}</span>
      </div>
    </div>
  );
}
