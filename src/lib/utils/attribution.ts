// 광고 유입 파라미터(utm·fbclid)를 가입 플로우의 모든 리다이렉트에서 유지하기 위한 유틸
// proxy에서 첫 진입 시 쿠키에 저장 → 클라이언트 이동 시 URL에 다시 붙임 → 플로우 끝(/ 이동)에서 삭제

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
] as const;

export const ATTRIBUTION_COOKIE = "glit_attribution";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24;

// proxy(Edge)에서도 사용하므로 document에 의존하지 않음
export const pickAttribution = (params: URLSearchParams): string => {
  const picked = new URLSearchParams();
  ATTRIBUTION_KEYS.forEach(key => {
    const value = params.get(key);
    if (value) picked.set(key, value);
  });
  return picked.toString();
};

const readAttributionCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${ATTRIBUTION_COOKIE}=`))
    ?.slice(ATTRIBUTION_COOKIE.length + 1);
  if (!raw) return null;

  // proxy(NextResponse.cookies.set)가 값을 encodeURIComponent로 저장함
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
};

export const withAttribution = (path: string): string => {
  const stored = readAttributionCookie();
  if (!stored) return path;

  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  const attribution = new URLSearchParams(pickAttribution(new URLSearchParams(stored)));

  attribution.forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const clearAttribution = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${ATTRIBUTION_COOKIE}=; path=/; max-age=0`;
};
