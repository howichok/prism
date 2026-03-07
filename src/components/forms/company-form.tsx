"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Privacy, RecruitingStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { createCompanyAction, updateCompanySettingsAction } from "@/actions/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { companyCreateSchema } from "@/lib/validators";

type CompanyValues = z.infer<typeof companyCreateSchema>;

export function CompanyForm({
  mode,
  initialValues,
  companyId,
}: {
  mode: "create" | "edit";
  initialValues?: CompanyValues;
  companyId?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CompanyValues>({
    resolver: zodResolver(companyCreateSchema),
    defaultValues: initialValues ?? {
      name: "",
      slug: "",
      description: "",
      privacy: Privacy.PUBLIC,
      recruitingStatus: RecruitingStatus.OPEN,
      tags: [],
      brandColor: "#55d4ff",
    },
  });
  const privacy = useWatch({ control: form.control, name: "privacy" });
  const recruitingStatus = useWatch({ control: form.control, name: "recruitingStatus" });

  function submit(values: CompanyValues) {
    setMessage(null);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCompanyAction(values)
          : await updateCompanySettingsAction({ ...values, companyId });

      if (!result.ok) {
        setMessage(result.message ?? "Unable to save company.");
        return;
      }

      if ("redirectTo" in result && result.redirectTo) {
        router.push(result.redirectTo);
      }

      setMessage(result.message ?? "Company saved.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5 rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name">Name</Label>
          <Input id="company-name" {...form.register("name")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-slug">Slug</Label>
          <Input id="company-slug" {...form.register("slug")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company-description">Description</Label>
          <Textarea id="company-description" {...form.register("description")} className="min-h-36 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-brand-color">Brand color</Label>
          <Input id="company-brand-color" {...form.register("brandColor")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company-tags">Tags (comma separated)</Label>
          <Input
            id="company-tags"
            defaultValue={initialValues?.tags.join(", ")}
            onChange={(event) =>
              form.setValue(
                "tags",
                event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .slice(0, 6),
              )
            }
            className="h-12 rounded-2xl border-white/10 bg-white/6 text-white"
          />
        </div>
        <label className="space-y-2 text-sm text-white/64">
          Privacy
          <select
            value={privacy}
            onChange={(event) => form.setValue("privacy", event.target.value as Privacy)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            <option value={Privacy.PUBLIC}>Public</option>
            <option value={Privacy.PRIVATE}>Private</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-white/64">
          Recruiting
          <select
            value={recruitingStatus}
            onChange={(event) => form.setValue("recruitingStatus", event.target.value as RecruitingStatus)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            <option value={RecruitingStatus.OPEN}>Open</option>
            <option value={RecruitingStatus.LIMITED}>Limited</option>
            <option value={RecruitingStatus.CLOSED}>Closed</option>
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/58">{message}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create company" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
