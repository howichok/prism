"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PostType, Visibility } from "@prisma/client";
import { FileImage, ImagePlus, LayoutTemplate, Tags, Trash2, Upload, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
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

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-rose-300">{message}</p>;
}

export function PostForm({ companies }: { companies: Array<CompanySummary & { currentRole?: string }> }) {
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
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className="surface-panel space-y-5 p-5 sm:p-6">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Editor</div>
            <h2 className="mt-3 font-display text-[1.75rem] leading-none text-white">Post surface</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Shape the main publishing surface first, then tune audience, company context, and cover treatment in the side rail.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" {...form.register("title")} className="h-12" />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-excerpt">Excerpt</Label>
              <Textarea
                id="post-excerpt"
                {...form.register("excerpt")}
                className="min-h-24"
                placeholder="Short public summary for previews, cards, and moderation context."
              />
              <div className="text-xs text-muted-foreground">Optional. Keep it concise and readable in discovery cards.</div>
              <FieldError message={errors.excerpt?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                {...form.register("content")}
                className="min-h-[22rem]"
                placeholder="Write the post body, status update, recruitment details, showcase context, or release notes."
              />
              <FieldError message={errors.content?.message} />
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="surface-panel space-y-4 p-5">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Publish setup</div>
            <h2 className="mt-3 inline-flex items-center gap-2 font-display text-[1.5rem] leading-none text-white">
              <LayoutTemplate className="size-4.5 text-primary/72" />
              Context and visibility
            </h2>
          </div>

          <div className="space-y-4">
            <label className="space-y-2 text-sm text-white/72">
              Company
              <select
                value={companyId ?? ""}
                onChange={(event) => form.setValue("companyId", event.target.value)}
                className="h-12 w-full rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
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
              Type
              <select
                value={postType}
                onChange={(event) => form.setValue("type", event.target.value as PostType)}
                className="h-12 w-full rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
              >
                {Object.values(PostType).map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/72">
              Visibility
              <select
                value={visibility}
                onChange={(event) => form.setValue("visibility", event.target.value as Visibility)}
                className="h-12 w-full rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-primary/30 focus:bg-white/[0.06]"
              >
                <option value={Visibility.PUBLIC}>Public</option>
                <option value={Visibility.COMPANY}>Company only</option>
                <option value={Visibility.PRIVATE}>Private draft</option>
              </select>
            </label>

            <div className="space-y-2">
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

        <section className="surface-panel space-y-4 p-5">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Cover image</div>
            <h2 className="mt-3 inline-flex items-center gap-2 font-display text-[1.5rem] leading-none text-white">
              <ImagePlus className="size-4.5 text-primary/72" />
              One-image placeholder upload
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Attach one cover image for the post surface. Preview works now; storage wiring can be connected later without changing the layout.
            </p>
          </div>

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
                className="h-44 rounded-[1rem] border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(4,8,12,0.05), rgba(4,8,12,0.72)), url(${coverPreviewUrl})` }}
              />
              <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] p-3">
                <div className="text-sm font-medium text-white">{coverFile?.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">Selected as the single cover image placeholder for this post.</div>
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
              className="group flex w-full flex-col items-center justify-center gap-3 rounded-[1rem] border border-dashed border-white/12 bg-white/[0.025] px-4 py-8 text-center transition-colors hover:border-white/18 hover:bg-white/[0.04]"
            >
              <div className="flex size-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-primary/82">
                <FileImage className="size-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Select one cover image</div>
                <div className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP. One file maximum.</div>
              </div>
            </button>
          )}

          <div className="rounded-[0.95rem] border border-amber-400/12 bg-amber-400/[0.05] px-3.5 py-3 text-xs leading-6 text-amber-100/78">
            Placeholder-only for now. The selected image previews in the UI but is not stored with the post yet.
          </div>
        </section>

        <section className="surface-panel space-y-4 p-5">
          <div className="border-b border-white/8 pb-4">
            <div className="panel-label">Publish</div>
            <h2 className="mt-3 inline-flex items-center gap-2 font-display text-[1.5rem] leading-none text-white">
              <WandSparkles className="size-4.5 text-primary/72" />
              Final review
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Audience</div>
              <div className="mt-2 text-white">{visibility.replaceAll("_", " ")}</div>
            </div>
            <div className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Submission path</div>
              <div className="mt-2 text-white">{visibility === Visibility.PUBLIC ? "Public posts enter moderation review." : "Non-public posts publish directly."}</div>
            </div>
          </div>

          {message ? <p className="text-sm text-rose-300">{message}</p> : null}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Publishing..." : "Create post"}
          </Button>
        </section>
      </aside>
    </form>
  );
}
