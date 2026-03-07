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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="panel-label">Directory</div>
          <h1 className="mt-3 font-display text-[1.9rem] leading-[0.95] text-white">Public company directory</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Browse visible company hubs across PrismMTR with enough context to understand who they are, how active they are, and whether they are recruiting.
          </p>
          <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
            Advanced search
          </Button>
        </div>
      </div>
      <div className="surface-panel-strong overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5 p-6 sm:p-8">
            <div className="panel-label">Company index</div>
            <h2 className="max-w-3xl font-display text-[2.7rem] leading-[0.93] text-white">
              Public operating centers across the PrismMTR network.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
              This directory is most useful when it reads like a map of live companies, not a gallery of cards. Each entry should expose identity, recruiting posture, and work context fast.
            </p>
          </div>
          <div className="border-t border-white/8 bg-[hsl(0_0%_5%)]/94 p-6 xl:border-l xl:border-t-0">
            <div className="panel-label">Visible now</div>
            <div className="mt-3 font-display text-[2.2rem] leading-none text-white">{companies.length}</div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Public companies that currently expose enough information to browse without entering the dashboard.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
