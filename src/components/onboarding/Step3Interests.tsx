"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  completeOnboarding,
  getGlobalInterests,
} from "@/app/onboarding/actions";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { CheckIcon, Plus, SearchIcon, X } from "@/lib/icons";
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

const MIN_INTERESTS = 3;
const MAX_INTERESTS = 5;

function normalizeInterest(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function formatInterest(value: string) {
  return value
    .split(" ")
    .map((word) => {
      if (!word) {
        return word;
      }

      if (word === word.toUpperCase()) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function dedupeInterests(values: string[]) {
  const map = new Map<string, string>();

  values.forEach((value) => {
    const normalized = normalizeInterest(value);
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (!map.has(key)) {
      map.set(key, formatInterest(normalized));
    }
  });

  return Array.from(map.values());
}

export default function Step3Interests() {
  const { userData, updateUserData, prevStep, resetOnboarding } =
    useOnboardingStore();
  const [availableInterests, setAvailableInterests] = useState<string[]>(() =>
    dedupeInterests([...INTERESTS, ...(userData.interests || [])]),
  );
  const [inputValue, setInputValue] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    dedupeInterests(userData.interests || []).slice(0, MAX_INTERESTS),
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
    async function fetchInterests() {
      try {
        const globalInterests = await getGlobalInterests();
        if (globalInterests.length > 0) {
          setAvailableInterests((prev) =>
            dedupeInterests([...prev, ...globalInterests]),
          );
        }
      } catch (err) {
        console.error("Failed to fetch interests", err);
      }
    }
    fetchInterests();
  }, []);

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
        : prev.length < MAX_INTERESTS
          ? [...prev, interest]
          : prev,
    );
    setError(undefined);
  };

  const removeSelectedInterest = (interest: string) => {
    setSelectedInterests((prev) => prev.filter((item) => item !== interest));
    setError(undefined);
  };

  const normalizedInput = normalizeInterest(inputValue);
  const lowerInput = normalizedInput.toLowerCase();
  const hasSearchInput = normalizedInput.length > 0;

  const exactMatch = availableInterests.find(
    (interest) => interest.toLowerCase() === lowerInput,
  );

  const filteredUnselectedInterests = useMemo(() => {
    const unselected = availableInterests.filter(
      (interest) => !selectedInterests.includes(interest),
    );

    if (!lowerInput) {
      return unselected;
    }

    return unselected
      .filter((interest) => interest.toLowerCase().includes(lowerInput))
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(lowerInput) ? 1 : 0;
        const bStartsWith = b.toLowerCase().startsWith(lowerInput) ? 1 : 0;

        if (aStartsWith !== bStartsWith) {
          return bStartsWith - aStartsWith;
        }

        return a.localeCompare(b);
      });
  }, [availableInterests, lowerInput, selectedInterests]);

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedInput || selectedInterests.length >= MAX_INTERESTS) {
      return;
    }

    if (exactMatch) {
      if (!selectedInterests.includes(exactMatch)) {
        setSelectedInterests((prev) => [...prev, exactMatch]);
      }
    } else {
      const newInterest = formatInterest(normalizedInput);
      setAvailableInterests((prev) => dedupeInterests([newInterest, ...prev]));
      setSelectedInterests((prev) =>
        prev.includes(newInterest) ? prev : [...prev, newInterest],
      );
    }

    setInputValue("");
    setError(undefined);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedInterests.length > 0
    ) {
      const lastInterest = selectedInterests[selectedInterests.length - 1];
      removeSelectedInterest(lastInterest);
    }
  };

  const handleComplete = async () => {
    if (selectedInterests.length < MIN_INTERESTS) {
      setError(`Please select at least ${MIN_INTERESTS} interests`);
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

  const canProceed = selectedInterests.length >= MIN_INTERESTS;
  const reachedLimit = selectedInterests.length >= MAX_INTERESTS;
  const canCreateInterest = hasSearchInput && !exactMatch && !reachedLimit;
  const remainingCount = Math.max(MIN_INTERESTS - selectedInterests.length, 0);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-4 lg:space-y-6">
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
            "text-sm text-muted-foreground transition-all duration-500 sm:text-base flex items-center justify-between gap-3",
            showSubtitle
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          )}
        >
          {showSubtitle && <span>{subtitle}</span>}
          {showSubtitle && (
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                canProceed
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/70 bg-card/50 text-muted-foreground",
              )}
            >
              {selectedInterests.length}/{MAX_INTERESTS} selected
            </span>
          )}
        </p>
      </div>

      {showInterests && (
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 pt-2 transition-all duration-500",
            showInterests
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          )}
        >
          <div className="rounded-2xl border border-border/70 bg-card/30 p-3 sm:p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Selected Interests
            </p>

            {selectedInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => removeSelectedInterest(interest)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                  >
                    <span>{interest}</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start picking topics you genuinely care about.
              </p>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              {canProceed
                ? reachedLimit
                  ? "You hit the max. Remove one to add a different interest."
                  : "Nice. You can continue now or add up to 2 more."
                : `Pick ${remainingCount} more to continue.`}
            </p>
          </div>

          <form
            onSubmit={handleAddInterest}
            className="relative flex items-center gap-2"
          >
            <SearchIcon className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search or add an interest"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={reachedLimit}
              className="h-12 w-full rounded-xl border-border/70 bg-card/40 pl-11 pr-14 sm:pr-24 focus-visible:ring-primary/20"
            />
            <Button
              type="submit"
              disabled={!hasSearchInput || reachedLimit}
              className="absolute right-1.5 h-9 rounded-lg px-2.5 text-xs sm:px-3"
            >
              <Plus className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">{exactMatch ? "Select" : "Add"}</span>
            </Button>
          </form>

          <div className="space-y-3 rounded-2xl border border-border/70 bg-card/20 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Discover Interests
              </p>
              {hasSearchInput && !exactMatch && (
                <span className="text-xs text-muted-foreground">
                  {canCreateInterest
                    ? `Press Enter to add "${formatInterest(normalizedInput)}"`
                    : "Limit reached"}
                </span>
              )}
            </div>

            {filteredUnselectedInterests.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/70 bg-background/60 px-3 py-4 text-sm text-muted-foreground">
                No matches found. Add your own interest and make it yours.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filteredUnselectedInterests.map((interest) => {
                  const isDisabled = reachedLimit;

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "group flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-xl border px-2.5 sm:px-3 text-sm font-medium transition-all",
                        "border-border/70 bg-background/60 text-foreground/90 hover:border-primary/40 hover:bg-card",
                        isDisabled && "cursor-not-allowed opacity-50",
                      )}
                      disabled={isDisabled}
                    >
                      <CheckIcon className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-70" />
                      <span className="truncate">{interest}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-1 pb-2">
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
    </div>
  );
}
