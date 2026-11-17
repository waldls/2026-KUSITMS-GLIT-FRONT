// "닫았음"이 아니라 "보여줘야 함"을 저장 → 플래그가 없는 다른 저장소(PWA·다른 기기)에선 재노출 안 됨
const PENDING_HOME_GUIDE_KEY = "pendingHomeGuide";

export const savePendingHomeGuide = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PENDING_HOME_GUIDE_KEY, "true");
  } catch {}
};

export const hasPendingHomeGuide = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(PENDING_HOME_GUIDE_KEY) === "true";
  } catch {
    return false;
  }
};

export const clearPendingHomeGuide = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(PENDING_HOME_GUIDE_KEY);
  } catch {}
};
