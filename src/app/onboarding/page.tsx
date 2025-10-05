"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import Step1BasicInfo from "@/components/onboarding/Step1BasicInfo";
import Step2Interests from "@/components/onboarding/Step2Interests";
import Step3PersonalDetails from "@/components/onboarding/Step3PersonalDetails";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import Step4Complete from "@/components/onboarding/Step4Complete";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Interests />;
      case 3:
        return <Step3PersonalDetails />;
      case 4:
        return <Step4Complete />;
      default:
        return <Step1BasicInfo />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-80 h-80">
          <Image
            src={logo || "/placeholder.svg"}
            alt="Align Logo"
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-8">
        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden mb-8 w-12 h-12">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Align Logo"
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <OnboardingProgress />
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
