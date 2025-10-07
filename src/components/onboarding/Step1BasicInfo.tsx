"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";

export default function Step1BasicInfo() {
  const { userData, updateUserData, nextStep } = useOnboardingStore();
  const [displayName, setDisplayName] = useState(userData.displayName || "");
  const [showInput, setShowInput] = useState(false);
  const hasTyped = useRef(false);
  
  const question = "first things first... what should we call you?";
  const { displayedText, isComplete } = useTypingEffect(
    question,
    hasTyped.current ? 0 : 30
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && displayName.trim()) {
      handleNext();
    }
  };

  return (
    <div className="space-y-8 min-h-[400px] flex flex-col justify-center">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground/90 leading-relaxed min-h-[120px]">
          {displayedText}
          {!isComplete && !hasTyped.current && (
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
              <Input
                placeholder="your name here..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-lg border-2 focus:border-primary transition-colors"
                autoFocus
              />
              <Button
                onClick={handleNext}
                className="w-full h-12 text-base"
                disabled={!displayName.trim()}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}