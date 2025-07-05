"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";

export default function OnboardingProgress() {
    const { step, totalSteps } = useOnboardingStore();
    const progress = (step / totalSteps) * 100;

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                    Step {step} of {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}% complete
                </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}