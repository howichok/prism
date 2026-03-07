"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Building2, ClipboardList, Compass, Newspaper, SearchSlash, Sparkles, UsersRound } from "lucide-react";

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

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      {/* Sidebar filters */}
      <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <FilterPanel title="Search" description="Find companies, members, posts, projects, and build requests.">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, tag, or keyword" />
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block text-xs text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as DiscoverySort)}
                className="mt-1.5 h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="activity">Most active</option>
                <option value="latest">Latest</option>
                <option value="a-z">A–Z</option>
              </select>
            </label>
            <label className="block text-xs text-muted-foreground">
              Recruiting
              <select
                value={recruiting}
                onChange={(e) => setRecruiting(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="all">All</option>
                <option value="OPEN">Open</option>
                <option value="LIMITED">Limited</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          </div>
          <label className="block text-xs text-muted-foreground">
            Privacy
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="all">All</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </label>
        </FilterPanel>

        {/* Tab pills */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">Focus</div>
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((value) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  tab === value
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {titleCase(value)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">Results</div>
          <div className="space-y-1 text-xs">
            {[
              { label: "Companies", count: filteredCompanies.length },
              { label: "Members", count: filteredUsers.length },
              { label: "Posts + Projects", count: filteredPosts.length + filteredProjects.length },
              { label: "Build requests", count: filteredRequests.length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {/* Hero */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Compass className="size-3.5" />
            Discovery
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Find companies, members, and projects
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Explore the PrismMTR network — visible communities, rich member identity, public posts, and active work.
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            {totalResults} results{deferredQuery ? ` for "${deferredQuery}"` : ""}
          </div>
        </div>

        {/* Companies */}
        {(tab === "all" || tab === "companies") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Building2 className="size-4 text-primary/60" />
                Companies
              </h2>
              <span className="text-xs text-muted-foreground">{filteredCompanies.length}</span>
            </div>
            {filteredCompanies.length ? (
              <div className="grid gap-4 2xl:grid-cols-2">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} compact />
                ))}
              </div>
            ) : (
              <EmptyState icon={SearchSlash} title="No companies match" description="Try broadening your filters." />
            )}
          </section>
        )}

        {/* Users */}
        {(tab === "all" || tab === "users") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <UsersRound className="size-4 text-primary/60" />
                Members
              </h2>
              <span className="text-xs text-muted-foreground">{filteredUsers.length}</span>
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

        {/* Posts */}
        {(tab === "all" || tab === "posts") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Newspaper className="size-4 text-primary/60" />
                Posts
              </h2>
              <span className="text-xs text-muted-foreground">{filteredPosts.length}</span>
            </div>
            {filteredPosts.length ? (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Newspaper} title="No posts found" description="Search broader topics." />
            )}
          </section>
        )}

        {/* Projects */}
        {(tab === "all" || tab === "projects") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Sparkles className="size-4 text-primary/60" />
                Projects
              </h2>
              <span className="text-xs text-muted-foreground">{filteredProjects.length}</span>
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

        {/* Build requests */}
        {(tab === "all" || tab === "requests") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ClipboardList className="size-4 text-primary/60" />
                Build Requests
              </h2>
              <span className="text-xs text-muted-foreground">{filteredRequests.length}</span>
            </div>
            {filteredRequests.length ? (
              <div className="space-y-3">
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
