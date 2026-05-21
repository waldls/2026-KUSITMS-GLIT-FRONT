export type SocialProvider = "kakao" | "naver" | "google";

// 소셜 로그인
export const loginWithSocial = (provider: SocialProvider) => {
  const env = process.env.NODE_ENV === "development" ? "local" : "production";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  window.location.assign(`${baseUrl}/oauth2/authorization/${provider}?env=${env}`);
};
