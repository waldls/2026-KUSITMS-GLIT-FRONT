import { api } from "@/lib/apis/client";
import type { SocialProvider } from "@/types/auth/auth";

export type { SocialProvider };

// 소셜 로그인
export const loginWithSocial = (provider: SocialProvider) => {
  const env = window.location.protocol === "https:" ? "production" : "local";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  window.location.assign(`${baseUrl}/oauth2/authorization/${provider}?env=${env}`);
};

// 로그아웃
export const postLogout = () => api.post("/api/auth/logout");
