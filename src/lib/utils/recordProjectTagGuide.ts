const RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY = "record-project-tag-add-guide-seen";

export const hasSeenProjectTagAddGuide = (): boolean => {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY) === "true";
  } catch {
    return true;
  }
};

export const markProjectTagAddGuideSeen = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY, "true");
  } catch {}
};
