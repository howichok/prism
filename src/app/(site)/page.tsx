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

const routeTiles = [
  {
    href: "/discovery",
    label: "Discovery index",
    body: "Explore companies, people, posts, projects, and open requests across the public network.",
  },
  {
    href: "/companies",
    label: "Company directory",
    body: "Browse visible operating hubs with recruiting state, leadership, and active work context.",
  },
  {
    href: "/sign-in",
    label: "Account readiness",
    body: "Start with Discord, shape your identity, then move into company and launcher-ready flows.",
  },
] as const;

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
    <div className="mx-auto w-full max-w-[1380px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <Reveal>
        <section className="surface-panel-strong overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4 sm:px-6">
            <div className="panel-label">PrismMTR operating layer</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Members", value: formatCompactNumber(data.stats.members) },
                { label: "Companies", value: formatCompactNumber(data.stats.companies) },
                { label: "Posts", value: formatCompactNumber(data.stats.posts) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/62"
                >
                  {item.label}: <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-0 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
            <aside className="border-b border-white/8 p-5 sm:p-6 xl:border-b-0 xl:border-r">
              <div className="panel-label">System</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                PrismMTR works best when identity, company context, publishing, and discovery all remain part of the same graph.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  "Discord-first identity",
                  "Company hubs as operating spaces",
                  "Discovery as a live index",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="p-6 sm:p-8 xl:p-10">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="panel-label">Minecraft Transit Railway</div>
                  <h1 className="max-w-4xl font-display text-[2.9rem] leading-[0.9] text-white sm:text-[3.8rem] xl:text-[4.7rem]">
                    PrismMTR turns transit communities into a legible operating network.
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                    Enter through Discord, move through companies and public work, and keep launcher readiness tied to a real account graph instead of a one-off login.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
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
              </div>
            </div>

            <aside className="border-t border-white/8 p-5 sm:p-6 xl:border-l xl:border-t-0">
              <div className="panel-label">Entry route</div>
              <div className="mt-4 space-y-2">
                {[
                  "Authenticate with Discord",
                  "Shape profile and Minecraft nickname",
                  "Join or create a company hub",
                ].map((step, index) => (
                  <div key={step} className="flex items-start gap-3 rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3 py-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/8 text-[10px] uppercase tracking-[0.18em] text-white/60">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6 text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[1rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="panel-label">Launcher relation</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  The launcher stays separate, but it depends on a clean PrismMTR identity and company graph.
                </p>
              </div>
            </aside>
          </div>

          <div className="grid border-t border-white/8 sm:grid-cols-3">
            {routeTiles.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group block p-5 transition-colors hover:bg-white/[0.03] sm:p-6 ${
                  index < routeTiles.length - 1 ? "border-b border-white/8 sm:border-b-0 sm:border-r" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-display text-[1.15rem] leading-none text-white">{item.label}</div>
                  <MoveRight className="size-4 text-white/34 transition-transform group-hover:translate-x-0.5 group-hover:text-white/78" />
                </div>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="surface-panel-strong mt-10 overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-6">
            <div>
              <div className="panel-label">Public network surfaces</div>
              <h2 className="mt-2 font-display text-[1.75rem] leading-[0.95] text-white">
                Publishing, projects, and companies in one visible frame.
              </h2>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
              Open full discovery
            </Button>
          </div>

          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.12fr)_360px]">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="panel-label">Publishing</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Announcements, showcases, and recruitment updates with authorship and company context.
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
              <div className="mt-4 space-y-3">
                {data.featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="border-t border-white/8 xl:border-l xl:border-t-0">
              <div className="border-b border-white/8 p-5 sm:p-6">
                <div className="panel-label">Projects</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Active infrastructure with execution status and company ownership.
                </p>
                <div className="mt-4 space-y-3">
                  {data.featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="panel-label">Company network</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Visible operating centers that can be entered later through the workspace shell.
                </p>
                <div className="mt-4 space-y-3">
                  {data.featuredCompanies.slice(0, 2).map((company) => (
                    <CompanyCard key={company.id} company={company} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
