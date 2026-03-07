import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#060b16]/90">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-lg space-y-3">
          <div className="text-lg font-semibold text-white">PrismMTR</div>
          <p className="text-sm leading-6 text-white/60">
            Community identity, company operations, moderation, and future launcher readiness for Minecraft Transit Railway.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/60">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/discovery" className="transition hover:text-white">
            Discovery
          </Link>
          <Link href="/companies" className="transition hover:text-white">
            Companies
          </Link>
          <Link href="/sign-in" className="transition hover:text-white">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
