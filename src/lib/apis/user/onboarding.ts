import { api } from "@/lib/apis/client";
import type {
  OnboardingRequest,
  OnboardingResponse,
  OnboardingStatus,
} from "@/types/user/onboarding";

// 온보딩 완료 여부 조회
export const getStatus = () => api.get<OnboardingStatus>("/api/onboarding/status");

// 온보딩 완료
export const postComplete = (body: OnboardingRequest) =>
  api.post<OnboardingResponse>("/api/onboarding/complete", body);
