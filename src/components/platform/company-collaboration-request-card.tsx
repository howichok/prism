"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Handshake, Send } from "lucide-react";

import { requestCompanyCollaborationAction } from "@/actions/collaboration";
import type { CompanyReference } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CompanyCollaborationRequestCard({
  targetCompany,
  sourceCompanies,
}: {
  targetCompany: CompanyReference;
  sourceCompanies: CompanyReference[];
}) {
  const router = useRouter();
  const [selectedSourceId, setSelectedSourceId] = useState(sourceCompanies[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitRequest() {
    if (!selectedSourceId) {
      setFeedback({
        tone: "error",
        message: "Select one of your companies before sending a collaboration request.",
      });
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await requestCompanyCollaborationAction({
        sourceCompanyId: selectedSourceId,
        targetCompanyId: targetCompany.id,
        message,
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
      setMessage("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2">
        <Handshake className="size-4 text-primary/76" />
        <div className="text-sm font-medium text-white">Request collaboration</div>
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        Send an official collaboration request from one of your owner-level companies to {targetCompany.name}.
      </p>

      <div className="mt-4 space-y-3">
        {sourceCompanies.length > 1 ? (
          <label className="space-y-2 text-sm text-white/70">
            Source company
            <select
              value={selectedSourceId}
              onChange={(event) => setSelectedSourceId(event.target.value)}
              className="h-11 w-full rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
            >
              {sourceCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="space-y-2 text-sm text-white/70">
          Request note
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-24"
            placeholder="Optional short note for the receiving company."
          />
        </label>
      </div>

      {feedback ? (
        <div
          className={cn(
            "mt-4 rounded-[0.95rem] border px-3.5 py-3 text-sm",
            feedback.tone === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/20 bg-rose-500/10 text-rose-200",
          )}
        >
          {feedback.message}
        </div>
      ) : null}

      <Button className="mt-4 w-full" disabled={isPending || !selectedSourceId} onClick={submitRequest}>
        <Send className="size-4" />
        {isPending ? "Sending..." : "Request collaboration"}
      </Button>
    </div>
  );
}
