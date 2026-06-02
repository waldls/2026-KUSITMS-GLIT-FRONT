"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { reissue } from "@/lib/apis/client";
import { isTokenExpired } from "@/lib/utils/token";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/types/api";

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGatePlaceholder = () => (
  <div className="h-dvh w-full bg-gray-900" aria-busy="true" aria-label="로딩 중" />
);

export default function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith("/auth");

  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setTokens = useAuthStore(state => state.setTokens);
  const clearTokens = useAuthStore(state => state.clearTokens);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const reissueInFlightRef = useRef(false);
  const redirectStartedRef = useRef(false);

  const hasValidToken = !!accessToken && !isTokenExpired(accessToken);
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const canReissue = !!refreshToken || isHttps;

  const shouldRedirect = !isAuthPath && !hasValidToken && !canReissue;
  const needsReissue = !isAuthPath && !hasValidToken && canReissue;

  useEffect(() => {
    if (!shouldRedirect) {
      redirectStartedRef.current = false;
      return;
    }
    if (redirectStartedRef.current) return;
    redirectStartedRef.current = true;
    clearTokens();
    router.replace("/auth");
  }, [shouldRedirect, clearTokens, router]);

  useEffect(() => {
    if (!needsReissue || hasValidToken || isRedirecting || reissueInFlightRef.current) return;

    reissueInFlightRef.current = true;
    let active = true;

    const redirectToAuth = () => {
      setIsRedirecting(true);
      clearTokens();
      router.replace("/auth");
    };

    const attemptReissue = (retryCount = 0) => {
      reissue()
        .then(tokens => {
          if (!active) return;
          setTokens(tokens.accessToken, tokens.refreshToken);
        })
        .catch(error => {
          if (!active) return;
          if (error instanceof ApiError) {
            redirectToAuth();
          } else if (retryCount < 1) {
            setTimeout(() => {
              if (active) attemptReissue(retryCount + 1);
            }, 2000);
          } else {
            redirectToAuth();
          }
        });
    };

    attemptReissue();

    return () => {
      active = false;
      reissueInFlightRef.current = false;
    };
  }, [needsReissue, hasValidToken, isRedirecting, setTokens, clearTokens, router]);

  if (isAuthPath || hasValidToken) return <>{children}</>;
  if (shouldRedirect || isRedirecting) return null;

  return <AuthGatePlaceholder />;
}
