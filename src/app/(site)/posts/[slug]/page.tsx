import { notFound } from "next/navigation";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { PageHeader } from "@/components/platform/page-header";
import { StatusBadge } from "@/components/platform/status-badge";
import { UserAvatar } from "@/components/platform/user-avatar";
import { getPublicPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function PublicPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/4 p-8 shadow-[0_34px_120px_-54px_rgba(0,0,0,0.95)]">
        <PageHeader
          eyebrow={post.type.replaceAll("_", " ")}
          title={post.title}
          description={post.excerpt ?? post.content}
          actions={<StatusBadge status={post.status} />}
          className="border-none bg-transparent p-0 shadow-none"
        />
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/58">
          <MiniProfileHoverCard user={post.author}>
            <div className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <UserAvatar name={post.author.displayName} image={post.author.avatarUrl} accentColor={post.author.accentColor} size="sm" />
              <span>{post.author.displayName}</span>
            </div>
          </MiniProfileHoverCard>
          {post.company ? <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">{post.company.name}</span> : null}
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="mt-8 space-y-4 rounded-[1.8rem] border border-white/10 bg-[#08101d] p-6">
          {post.content.split("\n").map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-white/72">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
