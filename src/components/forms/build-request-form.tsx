"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BuildRequestCategory } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { createBuildRequestAction } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompanySummary } from "@/lib/data";
import { buildRequestSchema } from "@/lib/validators";

type BuildRequestValues = z.infer<typeof buildRequestSchema>;

export function BuildRequestForm({ companies }: { companies: Array<CompanySummary & { currentRole?: string }> }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<BuildRequestValues>({
    resolver: zodResolver(buildRequestSchema),
    defaultValues: {
      companyId: "",
      title: "",
      description: "",
      category: BuildRequestCategory.STATION,
      needsRecruitment: false,
    },
  });
  const companyId = useWatch({ control: form.control, name: "companyId" });
  const category = useWatch({ control: form.control, name: "category" });
  const needsRecruitment = useWatch({ control: form.control, name: "needsRecruitment" });

  function submit(values: BuildRequestValues) {
    setMessage(null);
    startTransition(async () => {
      const result = await createBuildRequestAction(values);
      setMessage(result.message ?? (result.ok ? "Build request created." : "Unable to create build request."));
      if (result.ok) {
        form.reset();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5 rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="request-title">Title</Label>
          <Input id="request-title" {...form.register("title")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="request-description">Description</Label>
          <Textarea id="request-description" {...form.register("description")} className="min-h-40 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <label className="space-y-2 text-sm text-white/64">
          Company
          <select
            value={companyId ?? ""}
            onChange={(event) => form.setValue("companyId", event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            <option value="">Personal request</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-white/64">
          Category
          <select
            value={category}
            onChange={(event) => form.setValue("category", event.target.value as BuildRequestCategory)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            {Object.values(BuildRequestCategory).map((category) => (
              <option key={category} value={category}>
                {category.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={needsRecruitment}
            onChange={(event) => form.setValue("needsRecruitment", event.target.checked)}
            className="size-4 rounded border-white/10 bg-transparent"
          />
          Flag this request as needing recruitment support
        </label>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/58">{message}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit request"}
        </Button>
      </div>
    </form>
  );
}
