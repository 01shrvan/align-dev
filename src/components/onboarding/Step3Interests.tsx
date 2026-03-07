"use client";

import { useEffect, useRef, useState } from "react";
import { completeOnboarding } from "@/app/onboarding/actions";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Content Creation",
  "Video Editing",
  "Photography",
  "Graphic Design",
  "Animation",
  "Music Production",
  "Web Development",
  "App Development",
  "AI/ML",
  "Gaming",
  "Streaming",
  "Podcasting",
  "Writing",
  "Fitness",
  "Fashion",
  "Cooking",
  "Travel",
  "Tech",
  "Art",
  "Film Making",
  "3D Modeling",
  "UI/UX Design",
  "Startups",
  "Crypto/Web3",
  "E-commerce",
  "Social Media",
  "Marketing",
  "Teaching",
];

export default function Step3Interests() {
  const { userData, updateUserData, prevStep, resetOnboarding } =
    useOnboardingStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    userData.interests || [],
  );
  const [showInterests, setShowInterests] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const hasTyped = useRef(false);

  const question = "what topics light you up?";
  const subtitle = "pick 3-5 things you're passionate about";
  const { displayedText, isComplete } = useTypingEffect(
    question,
    hasTyped.current ? 0 : 30,
  );
  const [showSubtitle, setShowSubtitle] = useState(hasTyped.current);

  useEffect(() => {
    if (isComplete && !hasTyped.current) {
      hasTyped.current = true;
      setTimeout(() => setShowSubtitle(true), 200);
      setTimeout(() => setShowInterests(true), 500);
    } else if (hasTyped.current) {
      setShowSubtitle(true);
      setShowInterests(true);
    }
  }, [isComplete]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
          ? [...prev, interest]
          : prev,
    );
  };

  const handleComplete = async () => {
    if (selectedInterests.length < 3) {
      setError("Please select at least 3 interests");
      return;
    }

    if (!userData.displayName) {
      setError("Missing required information");
      return;
    }

    setError(undefined);
    setIsPending(true);

    try {
      updateUserData({ interests: selectedInterests });

      const result = await completeOnboarding({
        displayName: userData.displayName,
        story: userData.story,
        creating: userData.creating,
        why: userData.why,
        interests: selectedInterests,
      });

      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      } else {
        resetOnboarding();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  const canProceed = selectedInterests.length >= 3;

  return (
    <div className="flex min-h-[500px] flex-col justify-between gap-8">
      <div className="space-y-6">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Step 3 - Interests
        </span>

        <h2 className="min-h-[80px] font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {displayedText}
          {!isComplete && !hasTyped.current && (
            <span className="ml-1 inline-block h-7 w-0.5 animate-pulse bg-primary" />
          )}
        </h2>

        <p
          className={cn(
            "text-sm text-muted-foreground transition-all duration-500 sm:text-base",
            showSubtitle ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {showSubtitle && subtitle}
        </p>

        <div
          className={cn(
            "transition-all duration-500",
            showInterests
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          )}
        >
          {showInterests && (
            <div className="space-y-4 pt-4">
              <div className="grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto pr-2 sm:grid-cols-3 custom-scrollbar">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const isDisabled =
                    !selectedInterests.includes(interest) &&
                    selectedInterests.length >= 5;

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "flex h-12 items-center justify-center rounded-xl border p-3 text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "border-border/70 bg-card/40 text-foreground/90 hover:border-primary/40 hover:bg-card/80",
                        isDisabled &&
                          "cursor-not-allowed opacity-45 hover:border-border/70 hover:bg-card/40",
                      )}
                      disabled={isDisabled}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="uppercase tracking-[0.14em]">
                  Pick 3 to 5 interests
                </span>
                <span>{selectedInterests.length}/5 selected</span>
              </div>

              {selectedInterests.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-card/35 p-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {showInterests && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={prevStep}
            variant="outline"
            className="h-11 flex-1 rounded-xl border-dashed text-sm"
            disabled={isPending}
          >
            Back
          </Button>
          <LoadingButton
            onClick={handleComplete}
            className="h-11 flex-1 rounded-xl text-sm"
            disabled={!canProceed}
            loading={isPending}
          >
            Complete Setup
          </LoadingButton>
        </div>
      )}
    </div>
  );
}
