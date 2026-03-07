import { CompanyCard } from "@/components/platform/company-card";
import { PageHeader } from "@/components/platform/page-header";
import { getCompaniesDirectory } from "@/lib/data";

export default async function CompaniesPage() {
  const companies = await getCompaniesDirectory();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <PageHeader
        eyebrow="Companies"
        title="Public company directory"
        description="Browse approved public companies, their recruitment status, member density, and current focus areas."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
