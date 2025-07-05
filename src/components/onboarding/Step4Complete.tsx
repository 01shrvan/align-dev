"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { completeOnboarding } from "@/app/onboarding/actions";
import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";

export default function Step4Complete() {
    const { userData, prevStep, resetOnboarding } = useOnboardingStore();
    const [error, setError] = useState<string>();
    const [isPending, startTransition] = useTransition();

    const handleComplete = () => {
        if (!userData.displayName || !userData.interests || userData.interests.length < 3) {
            setError("Please complete all required fields");
            return;
        }

        setError(undefined);
        startTransition(async () => {
            const result = await completeOnboarding({
                displayName: userData.displayName!,
                bio: userData.bio,
                interests: userData.interests!,
                location: userData.location,
                age: userData.age,
                gender: userData.gender as any,
                occupation: userData.occupation,
            });

            if (result.error) {
                setError(result.error);
            } else {
                resetOnboarding();
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
                <p className="text-muted-foreground">
                    Review your information and join the Align community
                </p>
            </div>

            <div className="space-y-4 bg-card p-6 rounded-lg">
                <h3 className="font-semibold">Your Profile Summary</h3>
                <div className="space-y-2 text-sm">
                    <p><strong>Display Name:</strong> {userData.displayName}</p>
                    {userData.bio && <p><strong>Bio:</strong> {userData.bio}</p>}
                    <p><strong>Interests:</strong> {userData.interests?.join(", ")}</p>
                    {userData.location && <p><strong>Location:</strong> {userData.location}</p>}
                    {userData.age && <p><strong>Age:</strong> {userData.age}</p>}
                    {userData.gender && <p><strong>Gender:</strong> {userData.gender}</p>}
                    {userData.occupation && <p><strong>Occupation:</strong> {userData.occupation}</p>}
                </div>
            </div>

            {error && (
                <div className="text-center text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <Button 
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 h-12"
                    disabled={isPending}
                >
                    Back
                </Button>
                <LoadingButton 
                    onClick={handleComplete}
                    className="flex-1 h-12"
                    loading={isPending}
                >
                    Complete Setup
                </LoadingButton>
            </div>
        </div>
    );
}