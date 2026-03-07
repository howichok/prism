import Link from "next/link";
import { ArrowRight, Building2, Compass, Layers3, LayoutTemplate, Sparkles, UsersRound } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CompanyCard } from "@/components/platform/company-card";
import { PageHeader } from "@/components/platform/page-header";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

export default async function HomePage() {
  const data = await getHomeData().catch((error) => {
    console.error("[home] Failed to load public home data.", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="PrismMTR overview is temporarily offline"
          description="We could not load companies, posts, and project highlights right now."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <Reveal>
        <section className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Community platform for Minecraft Transit Railway
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The modern company platform for MTR communities
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            PrismMTR gives communities a shared structure for profiles, roles, discovery, moderation, public posts, and company hubs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button render={<Link href="/sign-in" />} size="lg">
              Enter with Discord
            </Button>
            <Button variant="outline" render={<Link href="/discovery" />} size="lg">
              Explore discovery
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid w-full max-w-lg gap-3 sm:grid-cols-3">
            {[
              { label: "Members", value: data.stats.members },
              { label: "Companies", value: data.stats.companies },
              { label: "Posts", value: data.stats.posts },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-2xl font-semibold text-foreground">{formatCompactNumber(stat.value)}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Features */}
      <Reveal delay={0.05}>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: UsersRound,
              title: "Discord-inspired identity",
              body: "Hover cards, role badges, and rich public profiles make community identity first-class.",
            },
            {
              icon: Layers3,
              title: "Company hubs",
              body: "Feed, members, projects, posts, invites, and settings combine into a structured HQ.",
            },
            {
              icon: LayoutTemplate,
              title: "Launcher-ready accounts",
              body: "Discord-first today, with optional email/password and Microsoft linking for the future.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Featured companies */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Featured companies</h2>
          <Button variant="outline" size="sm" render={<Link href="/companies" />}>
            Browse all
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} compact />
          ))}
        </div>
      </section>

      {/* Posts & Projects */}
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Building2 className="size-4 text-primary/60" />
            Recent posts
          </h2>
          <div className="space-y-3">
            {data.featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Compass className="size-4 text-primary/60" />
            Active projects
          </h2>
          <div className="space-y-3">
            {data.featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "How PrismMTR works",
            body: "Members authenticate with Discord, complete a Prism profile, then create or join companies.",
          },
          {
            title: "Company-first structure",
            body: "Company hubs focus on roles, posts, projects, applications, invites, and operational visibility.",
          },
          {
            title: "Future launcher integration",
            body: "The launcher is a separate future product. PrismMTR prepares the identity graph and linked accounts.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
