import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/forms/onboarding-wizard";
import { requireUser } from "@/lib/session";

export default async function OnboardingPage() {
  const viewer = await requireUser();

  if (viewer.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <OnboardingWizard viewer={viewer} />
    </div>
  );
}
