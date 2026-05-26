import { api } from "@/api/client";

export type SocialProvider = "kakao" | "naver" | "google";

// 소셜 로그인
export const loginWithSocial = (provider: SocialProvider) => {
  // const env = process.env.NODE_ENV === "development" ? "local" : "production";
  // const env = process.env.NEXT_PUBLIC_API_BASE_URL?.includes("stg") ? "local" : "production";
  const env = window.location.protocol === "https:" ? "production" : "local";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  window.location.assign(`${baseUrl}/oauth2/authorization/${provider}?env=${env}`);
};

// 로그아웃
export const postLogout = () => api.post("/api/auth/logout");
