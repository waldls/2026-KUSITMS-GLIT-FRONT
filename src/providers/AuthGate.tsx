"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import LoadingScreen from "@/components/common/LoadingScreen";
import { reissue } from "@/lib/apis/client";
import { isTokenExpired } from "@/lib/utils/token";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/types/api";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith("/auth");

  const [ready, setReady] = useState(false);

  const routerRef = useRef(router);

  useEffect(() => {
    if (isAuthPath) return;

    const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (accessToken && !isTokenExpired(accessToken)) {
      Promise.resolve().then(() => setReady(true));
      return;
    }

    const canReissue = !!refreshToken || window.location.protocol === "https:";
    if (!canReissue) {
      clearTokens();
      routerRef.current.replace("/auth");
      return;
    }

    let active = true;

    const attemptReissue = (retryCount = 0) => {
      reissue()
        .then(tokens => {
          if (!active) return;
          setTokens(tokens.accessToken, tokens.refreshToken);
          setReady(true);
        })
        .catch(error => {
          if (!active) return;
          if (error instanceof ApiError) {
            clearTokens();
            routerRef.current.replace("/auth");
          } else if (retryCount < 1) {
            setTimeout(() => {
              if (active) attemptReissue(retryCount + 1);
            }, 2000);
          } else {
            clearTokens();
            routerRef.current.replace("/auth");
          }
        });
    };

    attemptReissue();

    return () => {
      active = false;
    };
  }, [isAuthPath]);

  if (!ready && !isAuthPath) return <LoadingScreen />;
  return <>{children}</>;
}
