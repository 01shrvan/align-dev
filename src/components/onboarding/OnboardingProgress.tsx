"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";

export default function OnboardingProgress() {
  const { step, totalSteps } = useOnboardingStore();
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-8 w-full space-y-3">
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span>
          Step {step} of {totalSteps}
        </span>
        <span>
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-border/70 bg-muted/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
