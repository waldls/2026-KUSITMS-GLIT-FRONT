import { useMutation } from "@tanstack/react-query";

import { postComplete } from "@/lib/apis/user/onboarding";
import type { OnboardingRequest } from "@/types/user/onboarding";

export const usePostOnboardingComplete = () =>
  useMutation({
    mutationFn: (body: OnboardingRequest) => postComplete(body),
  });
