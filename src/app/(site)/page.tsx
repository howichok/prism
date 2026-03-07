import Link from "next/link";
import {
  ArrowRight,
  Layers3,
  LayoutTemplate,
  MoveRight,
  UsersRound,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { CompanyCard } from "@/components/platform/company-card";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

const featureRows = [
  {
    icon: UsersRound,
    title: "Identity that feels operational, not decorative",
    body: "Hover profiles, roles, badges, and public presence behave like part of the system itself.",
  },
  {
    icon: Layers3,
    title: "Company hubs built as structured headquarters",
    body: "Members, projects, posts, invites, review flows, and visibility all live in one operating space.",
  },
  {
    icon: LayoutTemplate,
    title: "Launcher-ready account architecture",
    body: "Discord leads today. Optional email and Microsoft linkage slot in later without rebuilding identity.",
  },
] as const;

export default async function HomePage() {
  const data = await getHomeData().catch((error) => {
    console.error("[home] Failed to load public home data.", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="PrismMTR overview is temporarily offline"
          description="We could not load companies, posts, and project highlights right now."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-20 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
      <Reveal>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_392px] xl:items-stretch">
          <div className="surface-panel-strong p-7 sm:p-9 lg:p-12">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-primary/35" />
                  <div className="panel-label">Community infrastructure for Minecraft Transit Railway</div>
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-4xl font-display text-[3.35rem] leading-[0.88] text-foreground sm:text-[4.45rem] lg:text-[5.5rem]">
                    The operating layer
                    <br />
                    for MTR companies,
                    <br />
                    identities, and public work.
                  </h1>
                  <p className="max-w-2xl text-[0.98rem] leading-8 text-muted-foreground">
                    PrismMTR brings together Discord identity, company operations, public publishing, discovery, and
                    future launcher-readiness in one coordinated system. It should feel like network software, not a
                    generic community template.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button render={<Link href="/sign-in" />} size="lg" className="justify-between">
                    Enter with Discord
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" render={<Link href="/discovery" />} size="lg">
                    Explore discovery
                  </Button>
                  <Button variant="secondary" render={<Link href="/companies" />} size="lg">
                    Browse companies
                  </Button>
                </div>

                <div className="grid gap-3 border-t border-border/80 pt-6 sm:grid-cols-3">
                  <div className="rounded-[0.9rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="panel-label">Identity</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Mini profiles, badges, roles, and presence belong to the product core.
                    </p>
                  </div>
                  <div className="rounded-[0.9rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="panel-label">Operations</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Company hubs act as structured HQs for members, projects, feed, and review flows.
                    </p>
                  </div>
                  <div className="rounded-[0.9rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="panel-label">Readiness</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Discord leads today, while linked accounts and launcher access stay future-ready.
                    </p>
                  </div>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="rounded-[1rem] border border-white/8 bg-background/68 p-4">
                  <div className="panel-label">Network pulse</div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Members", value: data.stats.members },
                      { label: "Companies", value: data.stats.companies },
                      { label: "Posts", value: data.stats.posts },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-[0.8rem] border border-white/6 bg-white/[0.03] px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</div>
                        <div className="mt-2 font-display text-2xl leading-none text-foreground">
                          {formatCompactNumber(stat.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1rem] border border-white/8 bg-background/68 p-4">
                  <div className="panel-label">Entry route</div>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.03] px-3 py-2.5">
                      Sign in with Discord
                    </div>
                    <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.03] px-3 py-2.5">
                      Shape profile and nickname
                    </div>
                    <div className="rounded-[0.8rem] border border-white/6 bg-white/[0.03] px-3 py-2.5">
                      Join or create company
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <aside className="flex h-full flex-col gap-4">
            <div className="surface-panel flex-1 p-5">
              <div className="panel-label">Public access</div>
              <h2 className="mt-4 font-display text-[1.9rem] leading-[0.95] text-foreground">Operational entry points</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Old PrismMTR was strongest when download, support, discovery, and company work all felt like connected
                surfaces. The new product should keep that rhythm.
              </p>
            </div>

            <div className="space-y-3">
              {data.featuredCompanies.slice(0, 2).map((company, index) => (
                <div
                  key={company.id}
                  className="surface-panel px-4 py-4"
                >
                  <div className="panel-label">Featured company 0{index + 1}</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-display text-lg leading-none text-foreground">{company.name}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {formatCompactNumber(company.counts.members)} members / {company.counts.projects} projects
                      </div>
                    </div>
                    <Button variant="outline" size="icon-sm" render={<Link href={`/companies/${company.slug}`} />}>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-panel-strong mt-auto p-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">Launcher relation</div>
              <div className="mt-3 font-display text-xl leading-none text-foreground">The launcher stays separate. The account graph does not.</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Discord-first today. Microsoft linking, launcher access, and account portability later.
              </p>
            </div>
          </aside>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary/35" />
              <div className="panel-label">Product disciplines</div>
            </div>
            <h2 className="max-w-xl font-display text-4xl leading-[0.94] text-foreground sm:text-5xl">
              Not a startup template.
              <br />
              A control surface for communities and companies.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              The old PrismMTR site was useful because it privileged structure, support, and product entry points.
              The new version should preserve that practicality while upgrading the craft, identity, and density.
            </p>
          </div>

          <div className="space-y-4">
            {featureRows.map((item) => (
              <div
                key={item.title}
                className="surface-panel flex items-start gap-4 px-5 py-5 transition-colors hover:border-primary/16"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-[0.8rem] border border-white/6 bg-background/70 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-xl leading-none text-foreground">{item.title}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 xl:sticky xl:top-[5.45rem] xl:self-start">
          <div className="panel-label">Featured companies</div>
          <h2 className="font-display text-3xl leading-[0.95] text-foreground">Company hubs should feel like operating centers, not profile tabs.</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Public companies stay discoverable, while internal company spaces handle the real structure: members,
            projects, applications, invites, and feed events.
          </p>
          <Button variant="outline" render={<Link href="/companies" />} size="lg">
            Browse all companies
            <MoveRight className="size-4" />
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {data.featuredCompanies.map((company, index) => (
            <CompanyCard
              key={company.id}
              company={company}
              compact={index !== 0}
              className={index === 0 ? "lg:col-span-2" : undefined}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary/35" />
            <div className="panel-label">Recent publishing</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl leading-[0.95] text-foreground">Posts should carry authorship, company context, and operational clarity.</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                Public announcements, showcases, and recruitment updates stay tied to people and companies.
              </p>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
              Open discovery
            </Button>
          </div>
          <div className="space-y-4">
            {data.featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary/35" />
            <div className="panel-label">Project surface</div>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-[0.95] text-foreground">Projects should read like live infrastructure, not a dead portfolio grid.</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              Instead of a dead portfolio grid, projects show ownership, company context, and execution status.
            </p>
          </div>
          <div className="space-y-4">
            {data.featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="surface-panel-strong p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary/35" />
            <div className="panel-label">How the network comes online</div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              "Authenticate with Discord and shape a Prism profile that can appear across member lists, posts, and hover cards.",
              "Create or join a company, then move through a structured hub built around members, feed items, posts, and projects.",
              "Keep the account launcher-ready with optional secondary credentials and future Microsoft linkage.",
            ].map((step, index) => (
              <div key={step} className="rounded-[1rem] border border-white/6 bg-white/[0.03] p-5">
                <div className="panel-label">Step 0{index + 1}</div>
                <p className="mt-3 text-sm leading-7 text-foreground/80">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="surface-panel flex flex-col justify-between p-6">
          <div>
            <div className="panel-label">Readiness and support</div>
            <h3 className="mt-3 font-display text-2xl leading-[0.95] text-foreground">Launcher readiness belongs to identity, onboarding, and settings.</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              PrismMTR already models linked accounts and identity layers so the future launcher can connect to a stable,
              structured member profile instead of a one-off login flow.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <div className="rounded-[0.85rem] border border-white/6 bg-background/70 p-4">
              <div className="panel-label">Current readiness path</div>
              <div className="mt-3 text-sm leading-7 text-muted-foreground">
                Discord auth, public profile setup, Minecraft nickname, company join/create, then future launcher access.
              </div>
            </div>
            <Button render={<Link href="/sign-in" />} size="lg" className="w-full justify-between">
              Start with Discord
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
}
