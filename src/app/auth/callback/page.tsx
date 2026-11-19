"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import LoadingScreen from "@/components/common/LoadingScreen";
import { getStatus } from "@/lib/apis/user/onboarding";
import { clearAttribution, withAttribution } from "@/lib/utils/attribution";
import { popLoginMethod, trackGA } from "@/lib/utils/ga";
import { useAuthStore } from "@/store/authStore";

const CallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore(state => state.setTokens);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const error = searchParams.get("error");
    const accessToken = searchParams.get("access");
    const refreshToken = searchParams.get("refresh") ?? undefined;

    if (error || !accessToken) {
      router.replace(withAttribution("/auth"));
      return;
    }

    const redirectTo = (path: string) => {
      const target = withAttribution(path);
      // 홈 도착이 가입 플로우의 끝이므로 유입 파라미터를 붙인 뒤 쿠키 삭제
      if (path === "/") clearAttribution();

      router.replace(target);
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/auth/callback")) {
          window.location.replace(target);
        }
      }, 1_500);
    };

    const handleCallback = async () => {
      setTokens(accessToken, refreshToken);

      try {
        const status = await Promise.race([
          getStatus(),
          new Promise<never>((_, reject) => {
            window.setTimeout(() => reject(new Error("STATUS_TIMEOUT")), 8000);
          }),
        ]);

        const method = popLoginMethod();
        // 백엔드에 신규 가입 여부가 없어 온보딩 미완료 = 신규로 판단
        if (!status?.isOnboardingCompleted) trackGA("sign_up", { method });

        redirectTo(status?.isOnboardingCompleted ? "/" : "/onboarding");
      } catch {
        // 토큰은 저장됐으므로 API 실패 시에도 로그인 화면으로 보내지 않음
        redirectTo("/");
      }
    };

    void handleCallback();
  }, [searchParams, setTokens, router]);

  return <LoadingScreen />;
};

const Page = () => (
  <Suspense fallback={<LoadingScreen />}>
    <CallbackHandler />
  </Suspense>
);

export default Page;
