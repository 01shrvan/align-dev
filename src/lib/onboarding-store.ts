import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  step: number;
  totalSteps: number;
  userData: {
    displayName?: string;
    bio?: string;
    interests?: string[];
    location?: string;
    age?: number;
    gender?: string;
    occupation?: string;
  };
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserData: (data: Partial<OnboardingState['userData']>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      step: 1,
      totalSteps: 4,
      userData: {},
      setStep: (step) => set({ step }),
      nextStep: () => {
        const { step, totalSteps } = get();
        if (step < totalSteps) {
          set({ step: step + 1 });
        }
      },
      prevStep: () => {
        const { step } = get();
        if (step > 1) {
          set({ step: step - 1 });
        }
      },
      updateUserData: (data) =>
        set((state) => ({
          userData: { ...state.userData, ...data },
        })),
      resetOnboarding: () => set({ step: 1, userData: {} }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);