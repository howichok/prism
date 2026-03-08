import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Newspaper } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { getPublicPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug).catch((error) => {
    console.error("[post-detail] Error loading post", error);
    return null;
  });

  if (!post) return notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-fade-up space-y-4">
        <div className="flex items-center gap-2 text-xs text-primary">
          <Newspaper className="size-3.5" />
          <span className="font-medium">{post.type.replaceAll("_", " ")}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
            <div className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5">
              <UserAvatar name={post.author.displayName} image={post.author.avatarUrl} accentColor={post.author.accentColor} size="sm" />
              <span className="text-sm font-medium text-foreground">{post.author.displayName}</span>
            </div>
          </MiniProfileHoverCard>
          {post.company ? (
            <Link href={`/companies/${post.company.slug}`} className="rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              {post.company.name}
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDate(post.createdAt)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={post.status} />
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-invert max-w-none rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
        {post.content}
      </article>

      {/* Author card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Author</div>
        <MiniProfileHoverCard user={post.author} primaryCompany={post.company}>
          <div className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80">
            <UserAvatar name={post.author.displayName} image={post.author.avatarUrl} accentColor={post.author.accentColor} />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{post.author.displayName}</div>
              <div className="truncate text-xs text-muted-foreground">@{post.author.username ?? "member"}</div>
              {post.author.bio ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.author.bio}</p> : null}
            </div>
          </div>
        </MiniProfileHoverCard>
      </div>
    </div>
  );
}
