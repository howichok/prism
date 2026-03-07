"use client";

import { CompanyRole } from "@prisma/client";
import { useState, useTransition } from "react";

import { updateCompanyMemberRoleAction } from "@/actions/company";
import { Button } from "@/components/ui/button";

export function MemberRoleEditor({
  companyId,
  memberId,
  currentRole,
}: {
  companyId: string;
  memberId: string;
  currentRole: CompanyRole;
}) {
  const [role, setRole] = useState(currentRole);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-2">
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as CompanyRole)}
        className="h-10 rounded-xl border border-white/10 bg-white/6 px-3 text-sm text-white outline-none"
      >
        {Object.values(CompanyRole).map((value) => (
          <option key={value} value={value}>
            {value.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        variant="outline"
        className="border-white/10 bg-white/6 text-white hover:bg-white/10"
        onClick={() =>
          startTransition(async () => {
            const result = await updateCompanyMemberRoleAction({ companyId, memberId, companyRole: role });
            setMessage(result.message ?? (result.ok ? "Role updated." : "Unable to update role."));
          })
        }
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save role"}
      </Button>
      {message ? <span className="text-xs text-white/48">{message}</span> : null}
    </div>
  );
}
