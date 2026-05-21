import { api } from "@/api/client";
import type {
  OnboardingRequest,
  OnboardingResponse,
  OnboardingStatus,
} from "@/types/user/onboarding";

// 온보딩 완료 여부 조회
export const getOnboardingStatus = () => api.get<OnboardingStatus>("/api/onboarding/status");

// 온보딩 완료
export const postOnboardingComplete = (body: OnboardingRequest) =>
  api.post<OnboardingResponse>("/api/onboarding/complete", body);
