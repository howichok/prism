import Link from "next/link";
import { Building2 } from "lucide-react";

import { MiniProfileHoverCard } from "@/components/platform/mini-profile-hover-card";
import { ProfileIdentitySurface } from "@/components/platform/profile-identity";
import { Button } from "@/components/ui/button";
import type { CompanyReference, UserPreview } from "@/lib/data";
import { cn } from "@/lib/utils";

export function UserCard({
  user,
  primaryCompany,
  className,
}: {
  user: UserPreview;
  primaryCompany?: CompanyReference | null;
  className?: string;
}) {
  const membership =
    (primaryCompany
      ? user.memberships.find((entry) => entry.company.id === primaryCompany.id)
      : undefined) ?? user.memberships[0];
  const company = primaryCompany ?? membership?.company ?? null;

  return (
    <MiniProfileHoverCard user={user} companyRole={membership?.companyRole} primaryCompany={company}>
      <article className={cn("group cursor-pointer transition-colors duration-200", className)}>
        <ProfileIdentitySurface
          user={user}
          companyRole={membership?.companyRole}
          primaryCompany={company}
          variant="compact"
          actionRow={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" render={<Link href={`/users/${user.username ?? ""}`} />} className="flex-1">
                View profile
              </Button>
              {company ? (
                <Button variant="secondary" size="sm" render={<Link href={`/companies/${company.slug}`} />} className="flex-1">
                  <Building2 className="size-3.5" />
                  Company
                </Button>
              ) : null}
            </div>
          }
        />
      </article>
    </MiniProfileHoverCard>
  );
}
