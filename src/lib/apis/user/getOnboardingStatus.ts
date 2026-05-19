import { api } from "@/api/client";
import type { OnboardingStatus } from "@/types/user/onboarding";

export const getOnboardingStatus = () => api.get<OnboardingStatus>("/api/onboarding/status");
