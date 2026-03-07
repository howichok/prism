import Link from "next/link";

import { CompanyCard } from "@/components/platform/company-card";
import { PageHeader } from "@/components/platform/page-header";
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Directory"
        title="Companies"
        description="Browse all public companies across the PrismMTR network."
        actions={
          <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
            Advanced search
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
