"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INTEREST_CATEGORIES = [
  {
    title: "Content & Digital Arts",
    interests: [
      "Content Creation", "Video Editing", "Photography", "Graphic Design",
      "Animation", "Digital Art", "UI/UX Design", "Illustration",
      "3D Modeling", "Music Production", "Film Making", "Podcasting"
    ]
  },
  {
    title: "Tech & Development",
    interests: [
      "Web Development", "App Development", "AI/ML", "Cryptocurrency",
      "NFTs", "Coding", "Game Development", "Tech Reviews",
      "Startups", "Cybersecurity", "Data Science", "Robotics"
    ]
  },
  {
    title: "Entertainment & Pop Culture",
    interests: [
      "Anime", "K-Pop", "Gaming", "Streaming", "Memes",
      "TikTok Trends", "Stand-up Comedy", "Reality TV", "Manga",
      "Cosplay", "Fan Fiction", "Pop Culture Commentary"
    ]
  },
  {
    title: "Lifestyle & Wellness",
    interests: [
      "Fitness", "Mental Health", "Skincare", "Fashion", "Thrifting",
      "Plant Care", "Cooking", "Baking", "Minimalism",
      "Sustainability", "Self-Care", "Aesthetic Living"
    ]
  },
  {
    title: "Social & Community",
    interests: [
      "Social Justice", "Environmental Issues", "LGBTQ+", "Diversity & Inclusion",
      "Online Communities", "Discord Servers", "Reddit Culture", "Twitter Spaces",
      "Activism", "Volunteer Work", "Community Building", "Cultural Commentary"
    ]
  },
  {
    title: "Creative & Learning",
    interests: [
      "Creative Writing", "Poetry", "Music", "Language Learning",
      "Philosophy", "Psychology", "Book Reviews", "Educational Content",
      "DIY Crafts", "Jewelry Making", "Vintage Collecting", "Journaling"
    ]
  }
];

export default function Step2Interests() {
  const { userData, updateUserData, nextStep, prevStep } = useOnboardingStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    userData.interests || []
  );
  const [currentCategory, setCurrentCategory] = useState(0);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const handleNext = () => {
    if (selectedInterests.length >= 3) {
      updateUserData({ interests: selectedInterests });
      nextStep();
    }
  };

  const nextCategory = () => {
    setCurrentCategory(prev => (prev + 1) % INTEREST_CATEGORIES.length);
  };

  const prevCategory = () => {
    setCurrentCategory(prev => (prev - 1 + INTEREST_CATEGORIES.length) % INTEREST_CATEGORIES.length);
  };

  const currentCategoryData = INTEREST_CATEGORIES[currentCategory];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What are your interests?</h2>
        <p className="text-muted-foreground">
          Select at least 3 interests (up to 5) that inspire your content
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={prevCategory}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{currentCategoryData.title}</h3>
            <div className="flex gap-1 mt-2 justify-center">
              {INTEREST_CATEGORIES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCategory(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentCategory
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
          
          <Button
            onClick={nextCategory}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-[280px] flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentCategoryData.interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-all hover:scale-[1.02] duration-200 h-12 flex items-center justify-center",
                  selectedInterests.includes(interest)
                    ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary/20"
                    : "bg-card hover:bg-accent/50 border-border hover:border-accent-foreground/50 hover:shadow-sm text-foreground hover:text-foreground"
                )}
                disabled={
                  !selectedInterests.includes(interest) && selectedInterests.length >= 5
                }
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[60px] flex flex-col justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedInterests.length}/5 selected
            </p>
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