import {
  getDeepLogSelectedProjects,
  getTodayTaskScrums,
  isRecordFlowActive,
  SKILL_TAGGING_STATE_KEY,
  STAR_LOG_TASKS_KEY,
} from "@/lib/utils/recordSession";

export const RECORD_FLOW_STEPS = [
  "/record/today-task",
  "/record/deep-log",
  "/record/select-skills",
  "/record/star-log",
  "/record/skill-tagging",
] as const;

export type RecordFlowStepPath = (typeof RECORD_FLOW_STEPS)[number];

export const isRecordFlowPath = (pathname: string) =>
  pathname === "/record" || pathname.startsWith("/record/");

const getStarLogTasks = () => {
  if (typeof window === "undefined") return [];

  const stored = window.sessionStorage.getItem(STAR_LOG_TASKS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const hasSkillTaggingState = () => {
  if (typeof window === "undefined") return false;

  return Boolean(window.sessionStorage.getItem(SKILL_TAGGING_STATE_KEY));
};

/** sessionStorage 기준으로 진입 가능한 record 플로우 최대 단계 */
export const getMaxAccessibleRecordPath = (): RecordFlowStepPath => {
  if (hasSkillTaggingState()) return "/record/skill-tagging";
  if (getStarLogTasks().length > 0) return "/record/star-log";
  if (getDeepLogSelectedProjects().length > 0) return "/record/select-skills";
  if (getTodayTaskScrums()) return "/record/deep-log";

  return "/record/today-task";
};

export const resolveRecordFlowPath = (href: string): string => {
  if (typeof window === "undefined") return href;

  const url = new URL(href, window.location.origin);
  const { pathname } = url;

  if (!isRecordFlowPath(pathname) || pathname === "/record") return href;

  if (!isRecordFlowActive()) return "/record";

  const requestedIndex = RECORD_FLOW_STEPS.indexOf(pathname as RecordFlowStepPath);
  if (requestedIndex === -1) return "/record";

  const maxPath = getMaxAccessibleRecordPath();
  const maxIndex = RECORD_FLOW_STEPS.indexOf(maxPath);

  if (requestedIndex <= maxIndex) return href;

  return maxPath;
};
