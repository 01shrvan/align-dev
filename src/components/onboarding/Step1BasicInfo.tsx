"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useState } from "react";

export default function Step1BasicInfo() {
  const { userData, updateUserData, nextStep } = useOnboardingStore();
  const [displayName, setDisplayName] = useState(userData.displayName || "");
  const [bio, setBio] = useState(userData.bio || "");

  const handleNext = () => {
    if (displayName.trim()) {
      updateUserData({ displayName: displayName.trim(), bio: bio.trim() });
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          Let&apos;s start with the basics
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name *</Label>
          <Input
            id="displayName"
            placeholder="How should others see you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (Optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell others about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-24 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {bio.length}/500
          </p>
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full h-12"
        disabled={!displayName.trim()}
      >
        Continue
      </Button>
    </div>
  );
}
