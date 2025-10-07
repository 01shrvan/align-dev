"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/app/onboarding/actions";
import LoadingButton from "@/components/LoadingButton";

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
  const { userData, updateUserData, prevStep, resetOnboarding } = useOnboardingStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    userData.interests || []
  );
  const [showInterests, setShowInterests] = useState(false);
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);
  const hasTyped = useRef(false);

  const question = "what topics light you up?";
  const subtitle = "pick 3-5 things you're passionate about";
  const { displayedText, isComplete } = useTypingEffect(
    hasTyped.current ? question : question,
    hasTyped.current ? 0 : 30
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
        : prev
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
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  const canProceed = selectedInterests.length >= 3;

  return (
    <div className="space-y-8 min-h-[500px] flex flex-col justify-center">
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground/90 leading-relaxed min-h-[80px]">
          {displayedText}
          {!isComplete && !hasTyped.current && (
            <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
          )}
        </h2>

        <p
          className={`text-base text-muted-foreground transition-all duration-500 ${
            showSubtitle
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {showSubtitle && subtitle}
        </p>

        <div
          className={`transition-all duration-500 ${
            showInterests
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {showInterests && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-all hover:scale-[1.02] duration-200 h-12 flex items-center justify-center",
                      selectedInterests.includes(interest)
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card hover:bg-accent/50 border-border hover:border-accent-foreground/50"
                    )}
                    disabled={
                      !selectedInterests.includes(interest) &&
                      selectedInterests.length >= 5
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {selectedInterests.length}/5 selected
                {selectedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-center text-destructive text-sm">{error}</div>
      )}

      {showInterests && (
        <div className="flex gap-3">
          <Button
            onClick={prevStep}
            variant="outline"
            className="flex-1 h-12 text-base"
            disabled={isPending}
          >
            Back
          </Button>
          <LoadingButton
            onClick={handleComplete}
            className="flex-1 h-12 text-base"
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