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

function SectionHeader({
  eyebrow,
  title,
  count,
  description,
}: {
  eyebrow: string;
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="panel-label">{eyebrow}</div>
        <h2 className="mt-3 font-display text-[1.45rem] leading-[0.96] text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/46">{count} results</div>
    </div>
  );
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

  const companiesSection = (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Companies"
        title="Visible operating centers"
        count={filteredCompanies.length}
        description="Public companies with visible recruiting posture, leadership, and work context."
      />
      {filteredCompanies.length ? (
        <div className="grid gap-3">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} compact />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchSlash} title="No companies match" description="Try broadening the current filters." className="p-6 sm:p-7" />
      )}
    </section>
  );

  const usersSection = (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Members"
        title="Public identity surfaces"
        count={filteredUsers.length}
        description="People with visible company, role, and badge context."
      />
      {filteredUsers.length ? (
        <div className="grid gap-3">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <EmptyState icon={UsersRound} title="No members match" description="Try a different search term." className="p-6 sm:p-7" />
      )}
    </section>
  );

  const postsSection = (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Posts"
        title="Public publishing stream"
        count={filteredPosts.length}
        description="Announcements, showcases, and recruiting updates with authorship and company context."
      />
      {filteredPosts.length ? (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Newspaper} title="No posts match" description="Try a broader publishing search." className="p-6 sm:p-7" />
      )}
    </section>
  );

  const projectsSection = (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Projects"
        title="Work in motion"
        count={filteredProjects.length}
        description="Active infrastructure and build surfaces with status and company ownership."
      />
      {filteredProjects.length ? (
        <div className="grid gap-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Sparkles} title="No projects match" description="No visible project matches this lens." className="p-6 sm:p-7" />
      )}
    </section>
  );

  const requestsSection = (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Requests"
        title="Operational needs"
        count={filteredRequests.length}
        description="Open build requests and public needs visible across the network."
      />
      {filteredRequests.length ? (
        <div className="grid gap-3">
          {filteredRequests.map((request) => (
            <BuildRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <EmptyState icon={ClipboardList} title="No requests match" description="No build request matches the current view." className="p-6 sm:p-7" />
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      <section className="surface-panel-strong overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-white/8 px-5 py-5 sm:px-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="panel-label">Discovery index</div>
            <h2 className="mt-3 font-display text-[2.05rem] leading-[0.92] text-white sm:text-[2.5rem]">
              Browse PrismMTR as a public network, not a stack of isolated lists.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Search the network, switch lenses, then inspect the visible graph of companies, members, publishing, projects, and requests.
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4 xl:min-w-[18rem]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Visible results</div>
            <div className="mt-3 font-display text-[2rem] leading-none text-white">{tabCounts[tab]}</div>
            <div className="mt-2 text-xs leading-6 text-muted-foreground">
              {deferredQuery ? `Filtered by "${deferredQuery}"` : "Across the selected discovery lens"}
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="border-b border-white/8 p-5 sm:p-6 xl:border-b-0 xl:border-r">
            <SearchBar value={query} onChange={setQuery} placeholder="Search companies, members, tags, and work surfaces" />
            <div className="mt-5 flex min-w-max gap-2 overflow-x-auto pb-1">
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

          <div className="p-5 sm:p-6">
            <div className="panel-label">Filters</div>
            <div className="mt-4 grid gap-3">
              <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Sort
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as DiscoverySort)}
                  className="mt-2 h-10 w-full rounded-[0.9rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
                >
                  <option value="activity">Most active</option>
                  <option value="latest">Latest</option>
                  <option value="a-z">A-Z</option>
                </select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Recruiting
                <select
                  value={recruiting}
                  onChange={(event) => setRecruiting(event.target.value)}
                  className="mt-2 h-10 w-full rounded-[0.9rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
                >
                  <option value="all">All</option>
                  <option value="OPEN">Open</option>
                  <option value="LIMITED">Limited</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Privacy
                <select
                  value={privacy}
                  onChange={(event) => setPrivacy(event.target.value)}
                  className="mt-2 h-10 w-full rounded-[0.9rem] border border-white/8 bg-[hsl(0_0%_5%)]/92 px-3 text-sm text-white outline-none transition-colors focus:border-blue-400/28"
                >
                  <option value="all">All</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </label>
            </div>

            <div className="mt-5 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/42">Current lens</div>
              <div className="mt-2 font-medium text-white">{activeTabMeta.label}</div>
              <div className="mt-1 text-xs leading-6 text-muted-foreground">
                {deferredQuery ? `Filtered by "${deferredQuery}" / ${titleCase(sort)}` : `Sorted by ${titleCase(sort)}`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {tab === "all" ? (
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_0.96fr]">
          <div className="space-y-8">
            {companiesSection}
            {postsSection}
          </div>
          <div className="space-y-8">
            {usersSection}
            {projectsSection}
            {requestsSection}
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          {tab === "companies" ? companiesSection : null}
          {tab === "users" ? usersSection : null}
          {tab === "posts" ? postsSection : null}
          {tab === "projects" ? projectsSection : null}
          {tab === "requests" ? requestsSection : null}
        </section>
      )}

      <div className="flex flex-wrap gap-2 border-t border-white/8 pt-5">
        {resultSplit.map((item) => (
          <div key={item.label} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/58">
            {item.label}: <span className="text-white">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
