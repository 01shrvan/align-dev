"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useEffect, useRef, useState } from "react";

export default function Step1BasicInfo() {
  const { userData, updateUserData, nextStep } = useOnboardingStore();
  const [displayName, setDisplayName] = useState(userData.displayName || "");
  const [showInput, setShowInput] = useState(false);
  const hasTyped = useRef(false);

  const question = "first things first... what should we call you?";
  const { displayedText, isComplete } = useTypingEffect(
    question,
    hasTyped.current ? 0 : 30,
  );

  useEffect(() => {
    if (isComplete && !hasTyped.current) {
      hasTyped.current = true;
      setTimeout(() => setShowInput(true), 300);
    } else if (hasTyped.current) {
      setShowInput(true);
    }
  }, [isComplete]);

  const handleNext = () => {
    if (displayName.trim()) {
      updateUserData({ displayName: displayName.trim() });
      nextStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && displayName.trim()) {
      handleNext();
    }
  };

  return (
    <div className="flex min-h-[460px] flex-col justify-between gap-8">
      <div className="space-y-6">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Step 1 - Basics
        </span>

        <h2 className="min-h-[120px] font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {displayedText}
          {!isComplete && !hasTyped.current && (
            <span className="ml-1 inline-block h-7 w-0.5 animate-pulse bg-primary" />
          )}
        </h2>

        <div
          className={cn(
            "transition-all duration-500",
            showInput ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          {showInput && (
            <div className="space-y-3">
              <Input
                placeholder="your name here..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 rounded-2xl border-border/70 bg-card/40 px-5 text-lg text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/20"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This name appears on your profile and posts.
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          showInput ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {showInput && (
          <Button
            onClick={handleNext}
            className="h-11 w-full rounded-xl text-sm font-semibold sm:w-auto sm:px-8"
            disabled={!displayName.trim()}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
