"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  Building2,
  ClipboardList,
  LayoutGrid,
  Newspaper,
  SearchSlash,
  Sparkles,
  type LucideIcon,
  UsersRound,
} from "lucide-react";

import { BuildRequestCard } from "@/components/platform/build-request-card";
import { CompanyCard } from "@/components/platform/company-card";
import { EmptyState } from "@/components/platform/empty-state";
import { FilterPanel } from "@/components/platform/filter-panel";
import { PostCard } from "@/components/platform/post-card";
import { ProjectCard } from "@/components/platform/project-card";
import { SearchBar } from "@/components/platform/search-bar";
import { UserCard } from "@/components/platform/user-card";
import type { BuildRequestSummary, CompanySummary, PostSummary, ProjectSummary, UserPreview } from "@/lib/data";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type DiscoveryTab = "all" | "companies" | "users" | "posts" | "projects" | "requests";
type DiscoverySort = "activity" | "latest" | "a-z";

const tabs: DiscoveryTab[] = ["all", "companies", "users", "posts", "projects", "requests"];

const tabMeta: Record<
  DiscoveryTab,
  {
    label: string;
    summary: string;
    icon: LucideIcon;
  }
> = {
  all: {
    label: "All surfaces",
    summary: "Cross-network view across public companies, people, publishing, work, and requests.",
    icon: LayoutGrid,
  },
  companies: {
    label: "Companies",
    summary: "Operating hubs, recruiting state, and visible leadership context.",
    icon: Building2,
  },
  users: {
    label: "Members",
    summary: "Identity surfaces with company context, badges, and visible roles.",
    icon: UsersRound,
  },
  posts: {
    label: "Posts",
    summary: "Publishing surfaces for announcements, showcases, and public updates.",
    icon: Newspaper,
  },
  projects: {
    label: "Projects",
    summary: "Work in motion with status, authorship, and company ownership.",
    icon: Sparkles,
  },
  requests: {
    label: "Requests",
    summary: "Open operational needs and build requests visible to the network.",
    icon: ClipboardList,
  },
};

function sortByName<T extends { title?: string; name?: string; displayName?: string }>(left: T, right: T) {
  const a = left.name ?? left.title ?? left.displayName ?? "";
  const b = right.name ?? right.title ?? right.displayName ?? "";
  return a.localeCompare(b);
}

export function DiscoveryExplorer({
  companies,
  users,
  posts,
  projects,
  buildRequests,
}: {
  companies: CompanySummary[];
  users: UserPreview[];
  posts: PostSummary[];
  projects: ProjectSummary[];
  buildRequests: BuildRequestSummary[];
}) {
  const [tab, setTab] = useState<DiscoveryTab>("all");
  const [query, setQuery] = useState("");
  const [recruiting, setRecruiting] = useState("all");
  const [privacy, setPrivacy] = useState("all");
  const [sort, setSort] = useState<DiscoverySort>("activity");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredCompanies = useMemo(() => {
    const results = companies.filter((company) => {
      const searchSpace = [company.name, company.description, company.tags.join(" "), company.owner.displayName].join(" ");
      const privacyMatch = privacy === "all" || company.privacy === privacy;
      const recruitingMatch = recruiting === "all" || company.recruitingStatus === recruiting;
      return (!deferredQuery || searchSpace.toLowerCase().includes(deferredQuery)) && privacyMatch && recruitingMatch;
    });
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      if (sort === "latest") return right.updatedAt.getTime() - left.updatedAt.getTime();
      return right.counts.members + right.counts.posts + right.counts.projects - (left.counts.members + left.counts.posts + left.counts.projects);
    });
  }, [companies, deferredQuery, privacy, recruiting, sort]);

  const filteredUsers = useMemo(() => {
    const results = users.filter((user) => {
      const searchSpace = [user.displayName, user.username ?? "", user.bio ?? "", user.memberships.map((m) => m.company.name).join(" ")].join(" ");
      return !deferredQuery || searchSpace.toLowerCase().includes(deferredQuery);
    });
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      if (sort === "latest") return right.createdAt.getTime() - left.createdAt.getTime();
      return right.memberships.length + right.badges.length - (left.memberships.length + left.badges.length);
    });
  }, [deferredQuery, sort, users]);

  const filteredPosts = useMemo(() => {
    const results = posts.filter((post) =>
      !deferredQuery || [post.title, post.excerpt ?? "", post.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.createdAt.getTime() - left.createdAt.getTime();
    });
  }, [deferredQuery, posts, sort]);

  const filteredProjects = useMemo(() => {
    const results = projects.filter((project) =>
      !deferredQuery || [project.title, project.description, project.tags.join(" ")].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [deferredQuery, projects, sort]);

  const filteredRequests = useMemo(() => {
    const results = buildRequests.filter((request) =>
      !deferredQuery ||
      [request.title, request.description, request.category, request.company?.name ?? ""].join(" ").toLowerCase().includes(deferredQuery),
    );
    return [...results].sort((left, right) => {
      if (sort === "a-z") return sortByName(left, right);
      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });
  }, [buildRequests, deferredQuery, sort]);

  const totalResults =
    filteredCompanies.length + filteredUsers.length + filteredPosts.length + filteredProjects.length + filteredRequests.length;

  const resultSplit = [
    { label: "Companies", count: filteredCompanies.length },
    { label: "Members", count: filteredUsers.length },
    { label: "Publishing", count: filteredPosts.length + filteredProjects.length },
    { label: "Requests", count: filteredRequests.length },
  ];

  const tabCounts: Record<DiscoveryTab, number> = {
    all: totalResults,
    companies: filteredCompanies.length,
    users: filteredUsers.length,
    posts: filteredPosts.length,
    projects: filteredProjects.length,
    requests: filteredRequests.length,
  };

  const activeTabMeta = tabMeta[tab];
  const ActiveTabIcon = activeTabMeta.icon;

  return (
    <div className="grid gap-10 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-12">
      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <FilterPanel
          title="Discovery controls"
          description="Search the public network with the same mental model the platform uses internally: lens first, filters second, results always visible."
        >
          <SearchBar value={query} onChange={setQuery} placeholder="Search names, tags, roles, and surfaces" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as DiscoverySort)}
                className="mt-2 h-11 w-full rounded-[1rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
              >
                <option value="activity">Most active</option>
                <option value="latest">Latest</option>
                <option value="a-z">A-Z</option>
              </select>
            </label>
            <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Recruiting
              <select
                value={recruiting}
                onChange={(e) => setRecruiting(e.target.value)}
                className="mt-2 h-11 w-full rounded-[1rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
              >
                <option value="all">All</option>
                <option value="OPEN">Open</option>
                <option value="LIMITED">Limited</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          </div>

          <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Privacy
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="mt-2 h-11 w-full rounded-[1rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
            >
              <option value="all">All</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </label>
        </FilterPanel>

        <div className="surface-panel p-5">
          <div className="panel-label">Result split</div>
          <div className="mt-4 space-y-2 text-sm">
            {resultSplit.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-[hsl(0_0%_5%)]/90 px-3.5 py-3"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-5">
          <div className="panel-label">Browsing logic</div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Use tabs as a network lens, not just a visual filter.</p>
            <p>Search terms match names, descriptions, tags, visible roles, and company context.</p>
          </div>
        </div>
      </aside>

      <div className="space-y-10">
        <div className="surface-panel-strong overflow-hidden p-0">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="p-6 sm:p-8 xl:p-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-muted-foreground/30" />
                <div className="panel-label">Discovery index</div>
              </div>
              <h2 className="mt-6 max-w-4xl font-display text-[2.85rem] leading-[0.92] text-foreground sm:text-[3.6rem]">
                Browse PrismMTR like a network, not a directory.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                The old platform was strongest when discovery behaved like an index of live systems. This surface keeps that
                logic, but with better identity, cleaner filters, and denser operating context.
              </p>

              <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
                <div className="space-y-3">
                  <div className="panel-label">Index query</div>
                  <SearchBar value={query} onChange={setQuery} placeholder="Search companies, members, tags, and work surfaces" />
                </div>
                <div className="rounded-[1.35rem] border border-white/8 bg-[hsl(0_0%_5%)]/88 p-4">
                  <div className="panel-label">Visible results</div>
                  <div className="mt-3 font-display text-[2.3rem] leading-none text-white">{totalResults}</div>
                  <div className="mt-2 text-sm leading-7 text-muted-foreground">
                    {deferredQuery ? `Filtered for "${deferredQuery}"` : "Across the full public PrismMTR index"}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                {tabs.map((value) => {
                  const meta = tabMeta[value];
                  const Icon = meta.icon;

                  return (
                    <button
                      key={value}
                      onClick={() => setTab(value)}
                      className={cn(
                        "group rounded-[1.2rem] border px-4 py-3 text-left transition-all duration-200",
                        tab === value
                          ? "border-blue-400/28 bg-blue-400/[0.08] shadow-[0_18px_42px_-30px_rgba(37,99,235,0.45)]"
                          : "border-white/8 bg-[hsl(0_0%_5%)]/88 hover:border-white/14 hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-blue-200/76">
                            <Icon className="size-3.5" />
                            {meta.label}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{meta.summary}</p>
                        </div>
                        <div
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
                            tab === value
                              ? "border-blue-400/22 bg-blue-400/12 text-blue-200"
                              : "border-white/8 bg-white/[0.03] text-white/58 group-hover:text-white/74",
                          )}
                        >
                          {tabCounts[value]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
              <div className="panel-label">Current lens</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[1rem] border border-blue-400/16 bg-blue-400/[0.08] text-blue-200">
                  <ActiveTabIcon className="size-4.5" />
                </div>
                <div>
                  <div className="font-display text-[1.55rem] leading-none text-white">{activeTabMeta.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{titleCase(sort)} sort</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{activeTabMeta.summary}</p>

              <div className="mt-6 space-y-2">
                {[
                  { label: "Recruiting", value: recruiting === "all" ? "Any state" : titleCase(recruiting) },
                  { label: "Privacy", value: privacy === "all" ? "Any surface" : titleCase(privacy) },
                  { label: "Query", value: deferredQuery || "No free-text query" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3.5 py-3"
                  >
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">{item.label}</div>
                    <div className="mt-2 text-sm text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(tab === "all" || tab === "companies") && (
          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="panel-label">Companies</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white">Structured company operating centers</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Public companies should read like real operating units: leadership, work density, recruiting state, and visible context.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/62">
                {filteredCompanies.length} visible
              </div>
            </div>
            {filteredCompanies.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} compact />
                ))}
              </div>
            ) : (
              <EmptyState icon={SearchSlash} title="No companies match" description="Try broadening the current filters." />
            )}
          </section>
        )}

        {(tab === "all" || tab === "users") && (
          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="panel-label">Members</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white">Identity surfaces with company context</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  People appear here with enough structure to understand who they are, where they work, and how they show up publicly.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/62">
                {filteredUsers.length} visible
              </div>
            </div>
            {filteredUsers.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <EmptyState icon={UsersRound} title="No members match" description="Try a different search term." />
            )}
          </section>
        )}

        {(tab === "all" || tab === "posts") && (
          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="panel-label">Posts</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white">Public publishing stream</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Announcements, recruitment posts, showcases, and progress updates with visible authorship and company context.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/62">
                {filteredPosts.length} visible
              </div>
            </div>
            {filteredPosts.length ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Newspaper} title="No posts found" description="Search broader topics." />
            )}
          </section>
        )}

        {(tab === "all" || tab === "projects") && (
          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="panel-label">Projects</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white">Visible work in motion</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Project cards should explain ownership, state, and intent quickly enough to scan the network without extra clicks.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/62">
                {filteredProjects.length} visible
              </div>
            </div>
            {filteredProjects.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Sparkles} title="No projects yet" description="Projects will appear as companies publish work." />
            )}
          </section>
        )}

        {(tab === "all" || tab === "requests") && (
          <section className="space-y-5">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="panel-label">Build requests</div>
                <h2 className="mt-3 font-display text-[2rem] leading-[0.94] text-white">Requests that surface live operational needs</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Requests make the network feel alive by exposing where companies need support, contributors, or build help.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/62">
                {filteredRequests.length} visible
              </div>
            </div>
            {filteredRequests.length ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <BuildRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <EmptyState icon={ClipboardList} title="No build requests" description="Requests appear as companies publish needs." />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
