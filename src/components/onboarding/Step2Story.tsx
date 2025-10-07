"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";

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
];

export default function Step2Story() {
  const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [answers, setAnswers] = useState({
    story: userData.story || "",
    creating: userData.creating || "",
    why: userData.why || "",
  });
  const [showInput, setShowInput] = useState(false);
  const hasTyped = useRef<{ [key: number]: boolean }>({});

  const currentPrompt = PROMPTS[currentPromptIndex];
  const { displayedText, isComplete } = useTypingEffect(
    currentPrompt.question,
    hasTyped.current[currentPromptIndex] ? 0 : 60
  );

  useEffect(() => {
    if (isComplete && !hasTyped.current[currentPromptIndex]) {
      hasTyped.current[currentPromptIndex] = true;
      setTimeout(() => setShowInput(true), 300);
    } else if (hasTyped.current[currentPromptIndex]) {
      setShowInput(true);
    }
  }, [isComplete, currentPromptIndex]);

  const handleNext = () => {
    const currentAnswer = answers[currentPrompt.id as keyof typeof answers];
    
    if (!currentAnswer.trim()) {
      return;
    }

    if (currentPromptIndex < PROMPTS.length - 1) {
      setShowInput(false);
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
      setShowInput(false);
      setCurrentPromptIndex(currentPromptIndex - 1);
    } else {
      prevStep();
    }
  };

  const currentAnswer = answers[currentPrompt.id as keyof typeof answers];
  const canProceed = currentAnswer.trim().length > 0;

  return (
    <div className="space-y-8 min-h-[500px] flex flex-col justify-center">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground/90 leading-relaxed min-h-[80px]">
          {displayedText}
          {!isComplete && !hasTyped.current[currentPromptIndex] && (
            <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
          )}
        </h2>

        <div
          className={`transition-all duration-500 ${
            showInput
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {showInput && (
            <div className="space-y-4">
              <Textarea
                placeholder={currentPrompt.placeholder}
                value={currentAnswer}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentPrompt.id]: e.target.value,
                  })
                }
                className="min-h-[160px] text-base border-2 focus:border-primary transition-colors resize-none"
                maxLength={currentPrompt.maxLength}
                autoFocus
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {currentPromptIndex + 1} of {PROMPTS.length}
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
        <div className="flex gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 h-12 text-base"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-12 text-base"
            disabled={!canProceed}
          >
            {currentPromptIndex < PROMPTS.length - 1 ? "Continue" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}