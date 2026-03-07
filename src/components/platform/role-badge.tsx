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
  ADMIN: "border-rose-400/24 bg-rose-500/12 text-rose-100",
  MOD: "border-sky-400/24 bg-sky-500/12 text-sky-100",
  USER: "border-white/10 bg-white/6 text-white/76",
};

const companyToneMap: Partial<Record<CompanyRole, string>> = {
  OWNER: "border-amber-400/24 bg-amber-500/12 text-amber-100",
  CO_OWNER: "border-orange-400/24 bg-orange-500/12 text-orange-100",
  TRUSTED_MEMBER: "border-cyan-400/24 bg-cyan-500/12 text-cyan-100",
  MEMBER: "border-white/10 bg-white/6 text-white/76",
};

export function RoleBadge({ role, kind, className }: RoleBadgeProps) {
  const tone =
    kind === "site"
      ? siteToneMap[role as SiteRole] ?? siteToneMap.USER
      : companyToneMap[role as CompanyRole] ?? companyToneMap.MEMBER;

  return (
    <Badge
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm",
        tone,
        className,
      )}
    >
      {titleCase(role)}
    </Badge>
  );
}
