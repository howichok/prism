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
    label: "All",
    summary: "Cross-network view across public companies, members, publishing, work, and requests.",
    icon: LayoutGrid,
  },
  companies: {
    label: "Companies",
    summary: "Operating hubs, recruiting posture, and leadership context.",
    icon: Building2,
  },
  users: {
    label: "Members",
    summary: "Identity surfaces with company, role, and badge context.",
    icon: UsersRound,
  },
  posts: {
    label: "Posts",
    summary: "Public publishing surfaces for announcements, showcases, and recruitment.",
    icon: Newspaper,
  },
  projects: {
    label: "Projects",
    summary: "Active work with authorship, status, and company ownership.",
    icon: Sparkles,
  },
  requests: {
    label: "Requests",
    summary: "Open operational needs and build requests across the network.",
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
  const lensResults = tabCounts[tab];

  return (
    <div className="space-y-6">
      <section className="surface-panel-strong overflow-hidden p-0">
        <div className="border-b border-white/8 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-[48rem] text-center">
            <div className="panel-label">Explore</div>
            <h2 className="mt-4 font-display text-[3rem] leading-[0.9] text-white sm:text-[4rem]">Discovery</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              Explore PrismMTR as a live network of companies, people, posts, projects, and requests instead of browsing isolated lists.
            </p>
            <div className="mt-6">
              <SearchBar value={query} onChange={setQuery} placeholder="Search companies, members, tags, and work surfaces" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border-b border-white/8">
          <div className="flex min-w-max gap-2 px-4 py-3 sm:px-6">
            {tabs.map((value) => {
              const meta = tabMeta[value];
              const Icon = meta.icon;

              return (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[0.9rem] border px-3.5 py-2.5 text-left text-sm transition-colors",
                    tab === value
                      ? "border-white/14 bg-white/[0.06] text-white"
                      : "border-transparent text-muted-foreground hover:border-white/8 hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{meta.label}</span>
                  <span className="rounded-full border border-white/8 bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/58">
                    {tabCounts[value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <label className="min-w-[11rem] text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as DiscoverySort)}
                className="mt-2 h-11 w-full rounded-[0.95rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
              >
                <option value="activity">Most active</option>
                <option value="latest">Latest</option>
                <option value="a-z">A-Z</option>
              </select>
            </label>
            <label className="min-w-[11rem] text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Recruiting
              <select
                value={recruiting}
                onChange={(event) => setRecruiting(event.target.value)}
                className="mt-2 h-11 w-full rounded-[0.95rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
              >
                <option value="all">All</option>
                <option value="OPEN">Open</option>
                <option value="LIMITED">Limited</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
            <label className="min-w-[11rem] text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Privacy
              <select
                value={privacy}
                onChange={(event) => setPrivacy(event.target.value)}
                className="mt-2 h-11 w-full rounded-[0.95rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
              >
                <option value="all">All</option>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {resultSplit.map((item) => (
              <div
                key={item.label}
                className="rounded-[0.95rem] border border-white/8 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">{item.label}</div>
                <div className="mt-1.5 text-sm font-medium text-white">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="panel-label">Current lens</div>
          <h3 className="mt-3 font-display text-[1.8rem] leading-[0.95] text-white">{activeTabMeta.label}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{activeTabMeta.summary}</p>
        </div>
        <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4 lg:min-w-[15rem]">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Visible results</div>
          <div className="mt-3 font-display text-[2rem] leading-none text-white">{lensResults}</div>
          <div className="mt-2 text-xs leading-6 text-muted-foreground">
            {deferredQuery ? `Filtered by "${deferredQuery}" / ${titleCase(sort)}` : `Sorted by ${titleCase(sort)}`}
          </div>
        </div>
      </section>

      {(tab === "all" || tab === "companies") && (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="panel-label">Companies</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-white">Visible company operating centers</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{filteredCompanies.length} results</div>
          </div>
          {filteredCompanies.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
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
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="panel-label">Members</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-white">Public identity surfaces</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{filteredUsers.length} results</div>
          </div>
          {filteredUsers.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
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
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="panel-label">Posts</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-white">Publishing stream</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{filteredPosts.length} results</div>
          </div>
          {filteredPosts.length ? (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Newspaper} title="No posts match" description="Try a broader publishing search." />
          )}
        </section>
      )}

      {(tab === "all" || tab === "projects") && (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="panel-label">Projects</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-white">Work in motion</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{filteredProjects.length} results</div>
          </div>
          {filteredProjects.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="No projects match" description="No visible project matches this lens." />
          )}
        </section>
      )}

      {(tab === "all" || tab === "requests") && (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="panel-label">Requests</div>
              <h2 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-white">Operational needs</h2>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{filteredRequests.length} results</div>
          </div>
          {filteredRequests.length ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {filteredRequests.map((request) => (
                <BuildRequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <EmptyState icon={ClipboardList} title="No requests match" description="No build request matches the current view." />
          )}
        </section>
      )}
    </div>
  );
}
