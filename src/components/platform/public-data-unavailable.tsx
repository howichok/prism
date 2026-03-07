import Link from "next/link";
import { AlertTriangle, Compass, Home, LogIn } from "lucide-react";

import { EmptyState } from "@/components/platform/empty-state";
import { Button } from "@/components/ui/button";

type PublicDataUnavailableProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function PublicDataUnavailable({
  title = "PrismMTR is temporarily unavailable",
  description = "We could not load this public page right now. The deployment is online, but the data layer did not respond successfully.",
  className,
}: PublicDataUnavailableProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
      className={className}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button render={<Link href="/" />}>
            <Home className="size-4" />
            Home
          </Button>
          <Button variant="outline" render={<Link href="/discovery" />}>
            <Compass className="size-4" />
            Discovery
          </Button>
          <Button variant="outline" render={<Link href="/sign-in" />}>
            <LogIn className="size-4" />
            Sign in
          </Button>
        </div>
      }
    />
  );
}
