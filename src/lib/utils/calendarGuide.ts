const IS_FIRST_STAR_KEY = "isFirstStar";
const CALENDAR_GUIDE_DISMISSED_KEY = "calendarGuideDismissed";

export const saveIsFirstStar = (isFirstStar: boolean) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(IS_FIRST_STAR_KEY, String(isFirstStar));
  } catch {}
};

export const getIsFirstStar = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(IS_FIRST_STAR_KEY) === "true";
  } catch {
    return false;
  }
};

export const hasDismissedCalendarGuide = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(CALENDAR_GUIDE_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
};

export const dismissCalendarGuide = () => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CALENDAR_GUIDE_DISMISSED_KEY, "true");
  } catch {}
};
