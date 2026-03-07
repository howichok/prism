import Link from "next/link";
import { ArrowRight, Building2, Compass, Layers3, LayoutTemplate, Sparkles, UsersRound } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CompanyCard } from "@/components/platform/company-card";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 lg:px-8">
      <Reveal>
        <section className="surface-panel-strong soft-grid overflow-hidden p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                <Sparkles className="size-3.5" />
                Discord identity, company operations, launcher-ready accounts
              </div>
              <div className="space-y-5">
                <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  The premium company platform for Minecraft Transit Railway communities.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-white/64">
                  PrismMTR gives communities and companies a shared structure for profiles, roles, discovery, moderation, public posts, and company hubs that feel social and alive without becoming chat.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button render={<Link href="/sign-in" />} size="lg">
                  Enter with Discord
                </Button>
                <Button variant="outline" render={<Link href="/discovery" />} size="lg">
                  Explore discovery
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="surface-panel-soft p-5">
                  <div className="panel-label">Members</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{formatCompactNumber(data.stats.members)}</div>
                </div>
                <div className="surface-panel-soft p-5">
                  <div className="panel-label">Companies</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{formatCompactNumber(data.stats.companies)}</div>
                </div>
                <div className="surface-panel-soft p-5">
                  <div className="panel-label">Published posts</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{formatCompactNumber(data.stats.posts)}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: UsersRound,
                  title: "Discord-inspired identity",
                  body: "Hover cards, richer member surfaces, role badges, and public profiles make community identity a first-class system.",
                },
                {
                  icon: Layers3,
                  title: "Company hubs without chat",
                  body: "Feed, members, projects, posts, invites, applications, and settings combine into a structured operational HQ.",
                },
                {
                  icon: LayoutTemplate,
                  title: "Launcher-ready account model",
                  body: "Discord-first today, with optional email/password and Microsoft linking reserved for the separate launcher product later.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-panel-soft p-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100">
                    <item.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/58">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <PageHeader
          eyebrow="Featured"
          title="Explore the current PrismMTR network"
          description="Featured companies, recent posts, and public-facing projects provide an immediate view of what the ecosystem is building."
          actions={
            <Button variant="outline" render={<Link href="/companies" />}>
              Browse companies
              <ArrowRight className="size-4" />
            </Button>
          }
        />
      </Reveal>

      <section className="grid gap-5 xl:grid-cols-3">
        {data.featuredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-cyan-200/70">
            <Building2 className="size-4" />
            Featured posts
          </div>
          <div className="space-y-4">
            {data.featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-cyan-200/70">
            <Compass className="size-4" />
            Active projects
          </div>
          <div className="space-y-4">
            {data.featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: "How PrismMTR works",
            body: "Members authenticate with Discord, complete a Prism profile, then create or join companies with moderation and permission-aware workflows.",
          },
          {
            title: "Company-first structure",
            body: "Company hubs feel like a server structure, but they focus on roles, posts, projects, applications, invites, and operational visibility rather than live messaging.",
          },
          {
            title: "Future launcher integration",
            body: "The launcher is a separate future product. PrismMTR simply prepares the identity graph and linked account surfaces it will need later.",
          },
        ].map((item) => (
          <div key={item.title} className="surface-panel p-6">
            <h3 className="font-display text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
