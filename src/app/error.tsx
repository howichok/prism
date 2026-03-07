"use client";

import Link from "next/link";
import { AlertTriangle, Compass, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] Unhandled application error.", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="size-5 text-destructive" />
        </div>
        <div className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Application error</div>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          PrismMTR is online, but this request failed. Retry once, then fall back to discovery.
        </p>
        {error.digest ? <div className="mt-3 text-xs text-muted-foreground/60">Ref: {error.digest}</div> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={reset}>
            <RefreshCcw className="size-3.5" />
            Try again
          </Button>
          <Button variant="outline" size="sm" render={<Link href="/" />}>
            Home
          </Button>
          <Button variant="outline" size="sm" render={<Link href="/discovery" />}>
            <Compass className="size-3.5" />
            Discovery
          </Button>
        </div>
      </div>
    </div>
  );
}
