import { useMutation } from "@tanstack/react-query";

import { postOnboardingComplete } from "@/lib/apis/user/postOnboardingComplete";
import type { OnboardingRequest } from "@/types/user/onboarding";

export const usePostOnboardingComplete = () =>
  useMutation({
    mutationFn: (body: OnboardingRequest) => postOnboardingComplete(body),
  });
