"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const INTERESTS = [
    "Technology", "Travel", "Food", "Music", "Movies", "Books", "Sports",
    "Gaming", "Art", "Photography", "Fitness", "Fashion", "Nature",
    "Science", "History", "Politics", "Business", "Education", "Health",
    "Design", "Programming", "Writing", "Dancing", "Cooking", "Gardening",
    "Meditation", "Yoga", "Hiking", "Swimming", "Cycling", "Running"
];

export default function Step2Interests() {
    const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore();
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        userData.interests || []
    );

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : prev.length < 10 ? [...prev, interest] : prev
        );
    };

    const handleNext = () => {
        if (selectedInterests.length >= 3) {
            updateUserData({ interests: selectedInterests });
            nextStep();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">What are your interests?</h2>
                <p className="text-muted-foreground">
                    Select at least 3 interests (up to 10)
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map((interest) => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all",
                            selectedInterests.includes(interest)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card hover:bg-accent border-border"
                        )}
                        disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 10}
                    >
                        {interest}
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {selectedInterests.length}/10 selected
                </p>
            </div>

            <div className="flex gap-3">
                <Button 
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 h-12"
                >
                    Back
                </Button>
                <Button 
                    onClick={handleNext}
                    className="flex-1 h-12"
                    disabled={selectedInterests.length < 3}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}