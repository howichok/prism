import { DiscoveryExplorer } from "@/components/platform/discovery-explorer";
import { PageHeader } from "@/components/platform/page-header";
import { getDiscoveryData } from "@/lib/data";

export default async function DiscoveryPage() {
  const data = await getDiscoveryData();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <PageHeader
        eyebrow="Discovery"
        title="Search the PrismMTR ecosystem"
        description="Search across companies, members, posts, projects, and build requests. The discovery surface stays useful even on small datasets and scales cleanly as the network grows."
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
