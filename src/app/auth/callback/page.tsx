"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

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

    setTokens(accessToken, refreshToken);
    router.replace("/");
  }, [searchParams, setTokens, router]);

  return null;
};

const Page = () => (
  <Suspense>
    <CallbackHandler />
  </Suspense>
);

export default Page;
