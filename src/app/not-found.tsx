import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Not Found</div>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">This page doesn't exist</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you requested does not exist or is no longer public.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button size="sm" render={<Link href="/" />}>Home</Button>
          <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
            Discovery
          </Button>
        </div>
      </div>
    </div>
  );
}
