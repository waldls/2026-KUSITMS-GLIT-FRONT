import { create } from "zustand";

import type { OnboardingRequest } from "@/types/user/onboarding";

interface OnboardingState extends OnboardingRequest {
  setOnboardingData: (data: OnboardingRequest) => void;
}

export const useOnboardingStore = create<OnboardingState>()(set => ({
  nickname: "",
  jobRole: "",
  userStatus: "",
  setOnboardingData: data => set(data),
}));
