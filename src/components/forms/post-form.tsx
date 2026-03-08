"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PostType, Visibility } from "@prisma/client";
import { FileImage, LayoutTemplate, Tags, Trash2, Upload, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { createPostAction } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyMembershipSummary } from "@/lib/data";
import { postCreateSchema } from "@/lib/validators";

type PostValues = z.infer<typeof postCreateSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-rose-300">{message}</p>;
}

export function PostForm({ companies }: { companies: CompanyMembershipSummary[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const coverInputRef = useRef<HTMLInputElement | null>(null);
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

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverFile(file);
    setCoverPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function clearCover() {
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }

    setCoverFile(null);
    setCoverPreviewUrl(null);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }

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

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <section className="surface-panel-strong space-y-6 p-5 sm:p-6">
        <div className="border-b border-white/8 pb-4">
          <div className="panel-label">Post basics</div>
          <h2 className="mt-3 font-display text-[1.85rem] leading-none text-white">Start with the post surface</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Set the title, choose one cover image, write the main description, and pick the post category before tuning publishing details.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="panel-label">Cover image</div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />

            {coverPreviewUrl ? (
              <div className="space-y-3">
                <div
                  className="h-[18.5rem] rounded-[1.25rem] border border-white/10 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(4,8,12,0.12), rgba(4,8,12,0.78)), url(${coverPreviewUrl})` }}
                />
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                  <div className="text-sm font-medium text-white">{coverFile?.name}</div>
                  <div className="mt-1 text-xs leading-6 text-muted-foreground">One cover image maximum. This is preview-only until media storage is connected.</div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => coverInputRef.current?.click()}>
                    <Upload className="size-3.5" />
                    Replace
                  </Button>
                  <Button type="button" variant="secondary" className="flex-1" onClick={clearCover}>
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="group flex min-h-[18.5rem] w-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-white/12 bg-white/[0.025] px-5 text-center transition-colors hover:border-white/18 hover:bg-white/[0.04]"
              >
                <div className="flex size-14 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-primary/82">
                  <FileImage className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Select a cover image</div>
                  <div className="mt-1 text-xs leading-6 text-muted-foreground">PNG, JPG, or WEBP. One file maximum.</div>
                </div>
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" {...form.register("title")} className="h-12 text-base" placeholder="Write a post title" />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Description</Label>
              <Textarea
                id="post-content"
                {...form.register("content")}
                className="min-h-[15rem]"
                placeholder="Describe the update, showcase, announcement, or recruitment post."
              />
              <FieldError message={errors.content?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-type">Category</Label>
              <select
                id="post-type"
                value={postType}
                onChange={(event) => form.setValue("type", event.target.value as PostType)}
                className="h-12 w-full rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
              >
                {Object.values(PostType).map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel space-y-5 p-5 sm:p-6">
        <div className="border-b border-white/8 pb-4">
          <div className="panel-label">Publishing context</div>
          <h2 className="mt-3 inline-flex items-center gap-2 font-display text-[1.5rem] leading-none text-white">
            <LayoutTemplate className="size-4.5 text-primary/72" />
            Audience, company, and tags
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-white/72">
            Company
            <select
              value={companyId ?? ""}
              onChange={(event) => form.setValue("companyId", event.target.value)}
              className="h-12 w-full rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
            >
              <option value="">Personal post</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/72">
            Visibility
            <select
              value={visibility}
              onChange={(event) => form.setValue("visibility", event.target.value as Visibility)}
              className="h-12 w-full rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
            >
              <option value={Visibility.PUBLIC}>Public</option>
              <option value={Visibility.COMPANY}>Company only</option>
              <option value={Visibility.PRIVATE}>Private draft</option>
            </select>
          </label>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="post-excerpt">Short summary</Label>
            <Textarea
              id="post-excerpt"
              {...form.register("excerpt")}
              className="min-h-24"
              placeholder="Optional short summary for discovery cards and moderation context."
            />
            <div className="text-xs text-muted-foreground">Optional. Keep it concise and readable in previews.</div>
            <FieldError message={errors.excerpt?.message} />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="post-tags">Tags</Label>
            <Input
              id="post-tags"
              value={tagsInput}
              onChange={(event) => {
                const nextValue = event.target.value;
                setTagsInput(nextValue);
                form.setValue(
                  "tags",
                  nextValue
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .slice(0, 6),
                );
              }}
              placeholder="recruitment, station, showcase"
            />
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Tags className="size-3.5" />
              Up to six tags. Use commas to separate them.
            </div>
            <FieldError message={errors.tags?.message} />
          </div>
        </div>
      </section>

      <section className="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-2">
          <div className="panel-label">Ready to publish</div>
          <div className="text-sm text-white">
            {visibility === Visibility.PUBLIC ? "Public posts enter moderation review." : "Non-public posts publish directly."}
          </div>
          <div className="text-xs text-muted-foreground">You can still adjust company context, visibility, and cover before submitting.</div>
          {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        </div>
        <Button type="submit" disabled={isPending} className="sm:min-w-44">
          <WandSparkles className="size-4" />
          {isPending ? "Publishing..." : "Create post"}
        </Button>
      </section>
    </form>
  );
}
