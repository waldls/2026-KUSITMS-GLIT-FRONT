import { useMutation } from "@tanstack/react-query";

import { postComplete } from "@/lib/apis/user/onboarding";
import { trackGA } from "@/lib/utils/ga";
import { trackCompleteRegistration } from "@/lib/utils/metaPixel";
import { savePendingRecordGuide } from "@/lib/utils/recordGuide";
import type { OnboardingRequest } from "@/types/user/onboarding";

export const usePostOnboardingComplete = () =>
  useMutation({
    mutationFn: (body: OnboardingRequest) => postComplete(body),
    // 훅 수준 onSuccess는 요청 중 페이지를 떠나도 실행돼 가입 전환·가이드 플래그가 누락되지 않음
    onSuccess: (_, { jobRole, userStatus }) => {
      // 기록하기 페이지 첫 [기록하러 가기] 클릭 시 가이드 시트 노출
      savePendingRecordGuide();
      // 신규 가입자만 온보딩을 거치고, API 성공 시점이라 새로고침·뒤로가기로 중복 전송 안 됨
      trackCompleteRegistration();
      trackGA("onboarding_completed", { role: jobRole, status: userStatus });
    },
  });
