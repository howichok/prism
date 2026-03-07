import { DiscoveryExplorer } from "@/components/platform/discovery-explorer";
import { PageHeader } from "@/components/platform/page-header";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { getDiscoveryData } from "@/lib/data";

export default async function DiscoveryPage() {
  const data = await getDiscoveryData().catch((error) => {
    console.error("[discovery] Failed to load discovery data.", error);
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Discovery"
          title="Search the PrismMTR ecosystem"
          description="Browse companies, members, posts, projects, and build requests across the network."
        />
        <PublicDataUnavailable
          title="Discovery could not load"
          description="The public catalog is reachable, but Prisma could not return the current discovery dataset."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Discovery"
        title="Search the PrismMTR ecosystem"
        description="Browse companies, members, posts, projects, and build requests across the network."
      />
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
