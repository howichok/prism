import { CompanyRole, SiteRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

type RoleBadgeProps = {
  role: CompanyRole | SiteRole;
  kind: "company" | "site";
  className?: string;
};

const siteToneMap: Partial<Record<SiteRole, string>> = {
  ADMIN: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  MOD: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  USER: "border-border bg-secondary text-muted-foreground",
};

const companyToneMap: Partial<Record<CompanyRole, string>> = {
  OWNER: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  CO_OWNER: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  TRUSTED_MEMBER: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  MEMBER: "border-border bg-secondary text-muted-foreground",
};

export function RoleBadge({ role, kind, className }: RoleBadgeProps) {
  const tone =
    kind === "site"
      ? siteToneMap[role as SiteRole] ?? siteToneMap.USER
      : companyToneMap[role as CompanyRole] ?? companyToneMap.MEMBER;

  return (
    <Badge
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tone,
        className,
      )}
    >
      {titleCase(role)}
    </Badge>
  );
}
