import Link from "next/link";

import { CompanyCard } from "@/components/platform/company-card";
import { PublicDataUnavailable } from "@/components/platform/public-data-unavailable";
import { Button } from "@/components/ui/button";
import { getPublicCompanies } from "@/lib/data";

export default async function CompaniesPage() {
  const companies = await getPublicCompanies().catch((error) => {
    console.error("[companies] Failed to load companies.", error);
    return null;
  });

  if (!companies) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PublicDataUnavailable
          title="Company directory is offline"
          description="We could not load the public company listing."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-fade-up flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white">Companies</h1>
          <p className="mt-1 text-sm text-white/40">
            {companies.length} public {companies.length === 1 ? "company" : "companies"} on the network.
          </p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
          Discovery
        </Button>
      </div>

      <div className="motion-stagger grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
