"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { getOnboardingStatus } from "@/lib/apis/user/onboarding";
import { useAuthStore } from "@/store/authStore";

const CallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore(state => state.setTokens);

  useEffect(() => {
    const error = searchParams.get("error");
    const accessToken = searchParams.get("access");
    const refreshToken = searchParams.get("refresh") ?? undefined;

    if (error || !accessToken) {
      router.replace("/auth");
      return;
    }

    const handleCallback = async () => {
      setTokens(accessToken, refreshToken);
      try {
        const status = await getOnboardingStatus();
        router.replace(status?.isOnboardingCompleted ? "/" : "/onboarding");
      } catch {
        router.replace("/auth");
      }
    };

    handleCallback();
  }, [searchParams, setTokens, router]);

  return null;
};

const Page = () => (
  <Suspense>
    <CallbackHandler />
  </Suspense>
);

export default Page;
