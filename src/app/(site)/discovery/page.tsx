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
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="Discovery could not load"
          description="The public catalog is reachable, but Prisma could not return the current discovery dataset."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
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
