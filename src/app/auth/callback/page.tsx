"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import LoadingScreen from "@/components/common/LoadingScreen";
import { getStatus } from "@/lib/apis/user/onboarding";
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
      router.replace("/auth");
      return;
    }

    const redirectTo = (path: string) => {
      router.replace(path);
      window.setTimeout(() => {
        if (window.location.pathname.startsWith("/auth/callback")) {
          window.location.replace(path);
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
