"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

const PROMPTS = [
  {
    id: "story",
    question: "tell us your story",
    placeholder:
      "who are you? what drives you? what got you into creating? no essay needed, just be real...",
    maxLength: 500,
  },
  {
    id: "creating",
    question: "what are you creating?",
    placeholder:
      "what kind of content do you make or want to make? could be anything - videos, music, art, whatever...",
    maxLength: 300,
  },
  {
    id: "why",
    question: "why does this matter to you?",
    placeholder:
      "what's the point? what impact do you want to have? why should anyone care?",
    maxLength: 300,
  },
] as const;

type PromptId = (typeof PROMPTS)[number]["id"];
type PromptAnswers = Record<PromptId, string>;

export default function Step2Story() {
  const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [answers, setAnswers] = useState<PromptAnswers>({
    story: userData.story || "",
    creating: userData.creating || "",
    why: userData.why || "",
  });
  const [showInput, setShowInput] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  const currentPrompt = PROMPTS[currentPromptIndex];
  const { displayedText, isComplete } = useTypingEffect(
    currentPrompt.question,
    shouldAnimate ? 30 : 0,
  );

  useEffect(() => {
    setShowInput(false);
    setShouldAnimate(true);
  }, [currentPromptIndex]);

  useEffect(() => {
    if (isComplete) {
      setShouldAnimate(false);
      setTimeout(() => setShowInput(true), 300);
    }
  }, [isComplete]);

  const handleNext = () => {
    const currentAnswer = answers[currentPrompt.id];

    if (!currentAnswer.trim()) {
      return;
    }

    if (currentPromptIndex < PROMPTS.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      updateUserData({
        story: answers.story.trim(),
        creating: answers.creating.trim(),
        why: answers.why.trim(),
      });
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    } else {
      prevStep();
    }
  };

  const currentAnswer = answers[currentPrompt.id];
  const canProceed = currentAnswer.trim().length > 0;

  return (
    <div className="flex min-h-[500px] flex-col justify-between gap-8">
      <div className="space-y-6">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Step 2 - Story
        </span>

        <h2 className="min-h-[80px] font-serif text-3xl leading-tight text-foreground sm:text-4xl">
          {displayedText}
          {!isComplete && shouldAnimate && (
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
              <Textarea
                placeholder={currentPrompt.placeholder}
                value={currentAnswer}
                onChange={(e) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentPrompt.id]: e.target.value,
                  }));
                }}
                className="min-h-[180px] resize-none rounded-2xl border-border/70 bg-card/40 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/20"
                maxLength={currentPrompt.maxLength}
                autoFocus
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="uppercase tracking-[0.14em]">
                  Prompt {currentPromptIndex + 1} / {PROMPTS.length}
                </span>
                <span>
                  {currentAnswer.length}/{currentPrompt.maxLength}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showInput && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleBack}
            variant="outline"
            className="h-11 flex-1 rounded-xl border-dashed text-sm"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="h-11 flex-1 rounded-xl text-sm"
            disabled={!canProceed}
          >
            {currentPromptIndex < PROMPTS.length - 1 ? "Continue" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
