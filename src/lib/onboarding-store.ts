import { create } from "zustand";

interface OnboardingUserData {
    displayName?: string;
    bio?: string;
    interests?: string[];
    location?: string;
    age?: number;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    occupation?: string;
}

interface OnboardingStore {
    step: number;
    totalSteps: number;
    userData: OnboardingUserData;
    updateUserData: (data: Partial<OnboardingUserData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
    step: 1,
    totalSteps: 4,
    userData: {},
    updateUserData: (data) =>
        set((state) => ({
            userData: { ...state.userData, ...data },
        })),
    nextStep: () =>
        set((state) => ({
            step: Math.min(state.step + 1, state.totalSteps),
        })),
    prevStep: () =>
        set((state) => ({
            step: Math.max(state.step - 1, 1),
        })),
    resetOnboarding: () =>
        set({
            step: 1,
            userData: {},
        }),
}));