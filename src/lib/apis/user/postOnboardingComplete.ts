import { api } from "@/api/client";
import type { OnboardingRequest, OnboardingResponse } from "@/types/user/onboarding";

export const postOnboardingComplete = (body: OnboardingRequest) =>
  api.post<OnboardingResponse>("/api/onboarding/complete", body);
