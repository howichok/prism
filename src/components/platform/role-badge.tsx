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
  ADMIN: "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
  MOD: "border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20",
  USER: "border-border bg-secondary text-muted-foreground",
};

const companyToneMap: Partial<Record<CompanyRole, string>> = {
  OWNER: "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
  CO_OWNER: "border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20",
  TRUSTED_MEMBER: "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
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
        "rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
        tone,
        className,
      )}
    >
      {titleCase(role)}
    </Badge>
  );
}
