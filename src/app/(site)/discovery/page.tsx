import { DiscoveryExplorer } from "@/components/platform/discovery-explorer";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { getDiscoveryData } from "@/lib/data";

export default async function DiscoveryPage() {
  const data = await getDiscoveryData().catch((error) => {
    console.error("[discovery] Failed to load discovery data.", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="panel-label">Discovery</div>
            <h1 className="mt-3 font-display text-[1.9rem] leading-[0.95] text-white">Public network browser</h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Browse companies, members, posts, projects, and build requests across the network.
          </p>
        </div>
        <PublicDataUnavailable
          title="Discovery could not load"
          description="The public catalog is reachable, but Prisma could not return the current discovery dataset."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="panel-label">Discovery</div>
          <h1 className="mt-3 font-display text-[1.9rem] leading-[0.95] text-white">Public network browser</h1>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Browse companies, members, posts, projects, and build requests across the network.
        </p>
      </div>
      <DiscoveryExplorer
        companies={data.companies}
        users={data.users}
        posts={data.posts}
        projects={data.projects}
        buildRequests={data.buildRequests}
      />
    </div>
  );
}
