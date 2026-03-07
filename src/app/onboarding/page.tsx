"use client";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import Step1BasicInfo from "@/components/onboarding/Step1BasicInfo";
import Step2Story from "@/components/onboarding/Step2Story";
import Step3Interests from "@/components/onboarding/Step3Interests";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { MeshGradient } from "@paper-design/shaders-react";

export default function OnboardingPage() {
  const { step } = useOnboardingStore();
  const steps = ["Basics", "Story", "Interests"];

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex">
      <div className="hidden lg:block w-1/2 relative h-screen border-r border-border/50">
        <MeshGradient
          className="absolute inset-0 w-full h-full"
          colors={["#121212", "#dddbcb", "#83e665", "#c1ff70"]}
          distortion={0.53}
          swirl={0.23}
          grainMixer={0.0}
          grainOverlay={0.33}
          speed={0.2}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none z-10">
          <div className="space-y-6">
            <Image src={logo} alt="Align" className="h-14 w-14" priority />
            <div className="space-y-4">
              {/*<p className="text-xs uppercase tracking-[0.28em] text-foreground/80 drop-shadow-md">
                Onboarding
              </p>*/}
              <h1 className="font-serif text-6xl leading-[1.05] text-foreground drop-shadow-sm">
                Let&apos;s tune
                <br />
                your profile.
              </h1>
            </div>
          </div>
          <div className="space-y-3 max-w-sm pointer-events-auto">
            {steps.map((label, index) => {
              const isActive = step === index + 1;

              return (
                <div
                  key={label}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm transition-all",
                    isActive
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/40 bg-background/20 text-muted-foreground",
                  )}
                >
                  <span className="mr-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    0{index + 1}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-8 relative">
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <Image src={logo} alt="Align" className="h-10 w-10" priority />
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Onboarding
              </span>
            </div>
            <span className="rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
              Step {step}/3
            </span>
          </div>

          <OnboardingProgress />
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
