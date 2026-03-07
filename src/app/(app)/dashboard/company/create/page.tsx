import { AppShell } from "@/components/layout/app-shell";
import { CompanyForm } from "@/components/forms/company-form";
import { PageHeader } from "@/components/platform/page-header";
import { dashboardSidebarItems } from "@/lib/navigation";

export default function CreateCompanyPage() {
  return (
    <AppShell title="Dashboard" description="Create a new company hub and send it into moderation review." items={dashboardSidebarItems}>
      <PageHeader
        eyebrow="Company"
        title="Create a company"
        description="New companies begin in moderation review so public discovery stays consistent and trustworthy."
      />
      <CompanyForm mode="create" />
    </AppShell>
  );
}
