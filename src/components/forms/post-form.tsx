"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PostType, Visibility } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { createPostAction } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompanySummary } from "@/lib/data";
import { postCreateSchema } from "@/lib/validators";

type PostValues = z.infer<typeof postCreateSchema>;

export function PostForm({ companies }: { companies: Array<CompanySummary & { currentRole?: string }> }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<PostValues>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      companyId: "",
      title: "",
      excerpt: "",
      content: "",
      type: PostType.ANNOUNCEMENT,
      visibility: Visibility.PUBLIC,
      tags: [],
    },
  });
  const companyId = useWatch({ control: form.control, name: "companyId" });
  const postType = useWatch({ control: form.control, name: "type" });
  const visibility = useWatch({ control: form.control, name: "visibility" });

  function submit(values: PostValues) {
    setMessage(null);
    startTransition(async () => {
      const result = await createPostAction(values);

      if (!result.ok) {
        setMessage(result.message ?? "Unable to create post.");
        return;
      }

      router.push(result.redirectTo ?? "/dashboard/posts");
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5 rounded-[1.8rem] border border-white/10 bg-white/4 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="post-title">Title</Label>
          <Input id="post-title" {...form.register("title")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="post-excerpt">Excerpt</Label>
          <Input id="post-excerpt" {...form.register("excerpt")} className="h-12 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="post-content">Content</Label>
          <Textarea id="post-content" {...form.register("content")} className="min-h-44 rounded-2xl border-white/10 bg-white/6 text-white" />
        </div>
        <label className="space-y-2 text-sm text-white/64">
          Company
          <select
            value={companyId ?? ""}
            onChange={(event) => form.setValue("companyId", event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            <option value="">Personal post</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-white/64">
          Type
          <select
            value={postType}
            onChange={(event) => form.setValue("type", event.target.value as PostType)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            {Object.values(PostType).map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-white/64">
          Visibility
          <select
            value={visibility}
            onChange={(event) => form.setValue("visibility", event.target.value as Visibility)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none"
          >
            <option value={Visibility.PUBLIC}>Public</option>
            <option value={Visibility.COMPANY}>Company only</option>
            <option value={Visibility.PRIVATE}>Private draft</option>
          </select>
        </label>
        <div className="space-y-2">
          <Label htmlFor="post-tags">Tags (comma separated)</Label>
          <Input
            id="post-tags"
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
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/58">{message}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Publishing..." : "Create post"}
        </Button>
      </div>
    </form>
  );
}
