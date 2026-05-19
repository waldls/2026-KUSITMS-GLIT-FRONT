import type { UserProfile } from "./user";

export interface OnboardingStatus {
  isOnboardingCompleted: boolean;
}

export interface OnboardingRequest {
  nickname: string;
  jobRole: string;
  userStatus: string;
}

export type OnboardingResponse = UserProfile;
