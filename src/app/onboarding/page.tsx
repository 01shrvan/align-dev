"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import Step1BasicInfo from "@/components/onboarding/Step1BasicInfo";
import Step2Story from "@/components/onboarding/Step2Story";
import Step3Interests from "@/components/onboarding/Step3Interests";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Story />;
      case 3:
        return <Step3Interests />;
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
        <div className="max-w-xl mx-auto w-full">
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