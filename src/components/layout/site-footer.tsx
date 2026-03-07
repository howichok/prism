import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-foreground">PrismMTR</div>
          <p className="max-w-md text-sm text-muted-foreground">
            Community identity and company management platform for Minecraft Transit Railway.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/discovery" className="transition-colors hover:text-foreground">
            Discovery
          </Link>
          <Link href="/companies" className="transition-colors hover:text-foreground">
            Companies
          </Link>
          <Link href="/sign-in" className="transition-colors hover:text-foreground">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
