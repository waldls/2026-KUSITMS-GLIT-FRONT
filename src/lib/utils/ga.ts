import type { SocialProvider } from "@/types/auth/auth";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// GA 미로드(ID 없는 환경)면 아무 일도 하지 않음
// GA 스크립트는 hydration 이후 실행돼, 첫 화면 마운트 시점 호출은 gtag가 생길 때까지 최대 5초 대기
export const trackGA = (event: string, params?: Record<string, unknown>, retries = 20) => {
  if (typeof window === "undefined" || !GA_ID) return;
  if (window.gtag) {
    window.gtag("event", event, params);
    return;
  }
  if (retries > 0) window.setTimeout(() => trackGA(event, params, retries - 1), 250);
};

// OAuth 콜백에 소셜 종류 정보가 없어 로그인 클릭 시 저장해 두고 콜백에서 사용
const LOGIN_METHOD_KEY = "glit-login-method";

export const saveLoginMethod = (provider: SocialProvider) => {
  try {
    localStorage.setItem(LOGIN_METHOD_KEY, provider);
  } catch {}
};

export const popLoginMethod = () => {
  try {
    const method = localStorage.getItem(LOGIN_METHOD_KEY);
    localStorage.removeItem(LOGIN_METHOD_KEY);
    return method;
  } catch {
    return null;
  }
};
