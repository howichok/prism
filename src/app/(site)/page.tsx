import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CompanyCard } from "@/components/platform/company-card";
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
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="PrismMTR overview is temporarily offline"
          description="We could not load companies, posts, and project highlights right now."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center border-b border-white/8 pb-[4.5rem] pt-10 text-center sm:pb-24">
          <div className="panel-label">Minecraft Transit Railway</div>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[0.86] text-white sm:text-[4.6rem] lg:text-[5.9rem]">
            <span className="block text-[0.32em] font-medium uppercase tracking-[0.16em] text-white/66">Transit network platform</span>
            <span className="mt-4 block">PrismMTR</span>
          </h1>
          <p className="mt-6 max-w-[46rem] text-base leading-8 text-muted-foreground sm:text-[1.02rem]">
            The structured layer for community identity, company operations, public publishing, and future launcher
            readiness. Discover work, enter your workspace, then move through the network with real context.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/sign-in" />} size="lg">
              Sign in with Discord
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/discovery" />} size="lg">
              Open discovery
            </Button>
            <Button variant="secondary" render={<Link href="/companies" />} size="lg">
              Browse companies
            </Button>
          </div>
          <div className="mt-10 grid w-full max-w-[52rem] gap-3 border-t border-white/8 pt-6 sm:grid-cols-3">
            {[
              { value: formatCompactNumber(data.stats.members), label: "Members" },
              { value: formatCompactNumber(data.stats.companies), label: "Companies" },
              { value: formatCompactNumber(data.stats.posts), label: "Posts" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-left sm:text-center">
                <div className="font-display text-[2rem] leading-none text-white">{stat.value}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1.08fr)_360px]">
          <div className="space-y-8">
            <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-5">
              <div>
                <div className="panel-label">Latest network activity</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white sm:text-[2.35rem]">
                  Public work moving through PrismMTR.
                </h2>
              </div>
              <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
                View all
              </Button>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="panel-label">Posts</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Announcements, showcases, and recruiting updates with clear authorship.
                  </p>
                </div>
                <Link
                  href="/discovery"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-white"
                >
                  Discovery
                  <MoveRight className="size-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {data.featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            <section className="space-y-4 border-t border-white/8 pt-6">
              <div>
                <div className="panel-label">Projects</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Active infrastructure and builds with company ownership and execution status.
                </p>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {data.featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="surface-panel-strong p-5">
              <div className="panel-label">Company network</div>
              <h2 className="mt-3 font-display text-[1.55rem] leading-[0.95] text-white">
                Visible operating centers across the PrismMTR graph.
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Companies stay public enough to browse, but their real operating surfaces live behind the workspace shell.
              </p>
            </div>

            <div className="space-y-3">
              {data.featuredCompanies.slice(0, 2).map((company) => (
                <CompanyCard key={company.id} company={company} compact />
              ))}
            </div>

            <div className="surface-panel p-5">
              <div className="panel-label">Launcher relation</div>
              <div className="mt-3 font-display text-[1.4rem] leading-[0.98] text-white">
                Account readiness lives here. The launcher remains a separate utility.
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Discord identity, Minecraft nickname, company membership, and linked accounts prepare the graph that the
                future launcher can connect to.
              </p>
              <div className="mt-4 space-y-2">
                {[
                  "Sign in with Discord",
                  "Shape profile and nickname",
                  "Join or create a company",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/8 text-[10px] uppercase tracking-[0.18em] text-white/64">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </Reveal>
    </div>
  );
}
