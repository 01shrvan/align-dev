"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { useState } from "react";

export default function Step3PersonalDetails() {
    const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore();
    const [location, setLocation] = useState(userData.location || "");
    const [age, setAge] = useState(userData.age?.toString() || "");
    const [gender, setGender] = useState(userData.gender || "");
    const [occupation, setOccupation] = useState(userData.occupation || "");

    const handleNext = () => {
        updateUserData({
            location: location.trim() || undefined,
            age: age ? parseInt(age) : undefined,
            gender: gender || undefined,
            occupation: occupation.trim() || undefined,
        });
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">A bit more about you</h2>
                <p className="text-muted-foreground">
                    These details are optional but help with connections
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g., Mumbai, India"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 25"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="h-12"
                        min="13"
                        max="120"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                        id="occupation"
                        placeholder="e.g., Software Engineer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="h-12"
                    />
                </div>
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
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}