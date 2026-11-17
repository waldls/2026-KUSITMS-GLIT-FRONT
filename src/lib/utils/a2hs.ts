// 홈 화면 추가(A2HS) 안내 바텀시트 노출 조건. 기기 단위 안내라 localStorage에만 저장
const HAS_RECORD_KEY = "a2hsHasRecord";
const VISIT_COUNT_KEY = "a2hsVisitCount";
const SHOWN_COUNT_KEY = "a2hsShownCount";
const LAST_SHOWN_AT_KEY = "a2hsLastShownAt";
// 앱을 새로 연 경우만 "홈 진입"으로 세기 위해 세션 단위로 표시
const VISIT_COUNTED_SESSION_KEY = "a2hsVisitCounted";
const SHOWN_SESSION_KEY = "a2hsShownThisSession";

export const A2HS_MAX_SHOWN = 3;
export const A2HS_INTERVAL_MS = 72 * 60 * 60 * 1000;

const readNumber = (key: string) => Number(window.localStorage.getItem(key)) || 0;

export const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

export const isAndroid = (): boolean =>
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

export const saveA2hsHasRecord = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(HAS_RECORD_KEY, "true");
  } catch {}
};

export const countA2hsVisit = () => {
  if (typeof window === "undefined") return;

  try {
    if (window.sessionStorage.getItem(VISIT_COUNTED_SESSION_KEY)) return;
    window.sessionStorage.setItem(VISIT_COUNTED_SESSION_KEY, "true");
    window.localStorage.setItem(VISIT_COUNT_KEY, String(readNumber(VISIT_COUNT_KEY) + 1));
  } catch {}
};

export const shouldShowA2hs = (now = Date.now()): boolean => {
  if (typeof window === "undefined" || isStandalone()) return false;

  try {
    if (window.sessionStorage.getItem(SHOWN_SESSION_KEY)) return false;

    const shownCount = readNumber(SHOWN_COUNT_KEY);
    if (shownCount >= A2HS_MAX_SHOWN) return false;

    // 첫 노출: 첫 기록 저장 후 또는 두 번째 홈 진입 중 먼저 오는 쪽
    if (shownCount === 0) {
      return (
        window.localStorage.getItem(HAS_RECORD_KEY) === "true" || readNumber(VISIT_COUNT_KEY) >= 2
      );
    }

    return now - readNumber(LAST_SHOWN_AT_KEY) >= A2HS_INTERVAL_MS;
  } catch {
    return false;
  }
};

export const markA2hsShown = (now = Date.now()) => {
  if (typeof window === "undefined") return;

  try {
    // 리포트 모달에 가려졌다 다시 열려도 한 세션에선 1회만 집계
    if (window.sessionStorage.getItem(SHOWN_SESSION_KEY)) return;
    window.sessionStorage.setItem(SHOWN_SESSION_KEY, "true");
    window.localStorage.setItem(SHOWN_COUNT_KEY, String(readNumber(SHOWN_COUNT_KEY) + 1));
    window.localStorage.setItem(LAST_SHOWN_AT_KEY, String(now));
  } catch {}
};
