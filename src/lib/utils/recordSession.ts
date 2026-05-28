export const TODAY_TASK_SCRUMS_KEY = "today-task-scrums";
export const DEEP_LOG_SELECTED_SCRUMS_KEY = "deep-log-selected-scrums";
export const RECORD_FLOW_COMPLETED_KEY = "record-flow-completed";
export const TODAY_TASK_SUBMITTED_DATES_KEY = "today-task-submitted-dates";
export const STAR_LOG_TASKS_KEY = "star-log-tasks";
export const STAR_LOG_COMPLETED_STAR_RECORD_IDS_KEY = "star-log-completed-star-record-ids";
export const SKILL_TAGGING_STATE_KEY = "skill-tagging-state";

export type StoredScrumItem = {
  scrumId?: number;
  content?: string;
};

export type StoredScrumProject = {
  titleId?: number;
  projectName?: string;
  freeText?: string;
  scrums?: StoredScrumItem[];
};

export type StoredTodayTaskScrums = {
  date: string;
  projects: StoredScrumProject[];
};

export type DeepLogTask = {
  id: number;
  starRecordId?: number;
  title: string;
};

export type DeepLogProject = {
  id: number;
  tag: string;
  title: string;
  tasks: DeepLogTask[];
};

export const getTodayTaskScrums = (): StoredTodayTaskScrums | null => {
  if (typeof window === "undefined") return null;

  const stored = window.sessionStorage.getItem(TODAY_TASK_SCRUMS_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredTodayTaskScrums;
    if (!parsed?.projects?.length) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const mapStoredScrumsToAddedProjects = (
  data: StoredTodayTaskScrums,
  projectTags: { id: number; name: string }[],
) =>
  data.projects
    .filter(project => project.titleId)
    .map(project => {
      const matchedTag = projectTags.find(tag => tag.name === project.projectName);

      return {
        id: project.titleId!,
        titleId: project.titleId,
        projectId: matchedTag?.id ?? 0,
        label: project.projectName?.trim() ?? "",
        title: project.freeText?.trim() ?? "",
        tasks: project.scrums?.map(item => item.content?.trim() ?? "").filter(Boolean) ?? [],
        scrumIds: project.scrums?.map(item => item.scrumId ?? null) ?? [],
      };
    });

export const mapTodayTaskScrumsToDeepLogProjects = (
  data: StoredTodayTaskScrums,
): DeepLogProject[] =>
  data.projects.flatMap((project, projectIndex) => {
    const tasks =
      project.scrums
        ?.map(item => ({
          id: item.scrumId,
          title: item.content?.trim() ?? "",
        }))
        .filter((task): task is DeepLogTask => Boolean(task.id && task.title)) ?? [];

    if (tasks.length === 0) return [];

    return [
      {
        id: project.titleId ?? projectIndex,
        tag: project.projectName?.trim() ?? "",
        title: project.freeText?.trim() ?? "",
        tasks,
      },
    ];
  });

export const saveDeepLogSelectedScrums = (
  projects: DeepLogProject[],
  selectedTaskIds: number[],
  starRecordIdsByScrumId?: Record<number, number>,
) => {
  if (typeof window === "undefined") return;

  const selectedProjects = projects
    .map(project => ({
      ...project,
      tasks: project.tasks
        .filter(task => selectedTaskIds.includes(task.id))
        .map(task => ({
          ...task,
          starRecordId: starRecordIdsByScrumId?.[task.id] ?? task.starRecordId,
        })),
    }))
    .filter(project => project.tasks.length > 0);

  window.sessionStorage.setItem(
    DEEP_LOG_SELECTED_SCRUMS_KEY,
    JSON.stringify({ projects: selectedProjects }),
  );
};

const readSubmittedDates = (): string[] => {
  if (typeof window === "undefined") return [];

  const stored = window.sessionStorage.getItem(TODAY_TASK_SUBMITTED_DATES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((date): date is string => typeof date === "string")
      : [];
  } catch {
    return [];
  }
};

export const isTodayTaskSubmitted = (date: string) => readSubmittedDates().includes(date);

export const markTodayTaskSubmitted = (date: string) => {
  if (typeof window === "undefined") return;

  const submittedDates = readSubmittedDates();
  if (submittedDates.includes(date)) return;

  window.sessionStorage.setItem(
    TODAY_TASK_SUBMITTED_DATES_KEY,
    JSON.stringify([...submittedDates, date]),
  );
};

export const clearTodayTaskSubmittedDates = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(TODAY_TASK_SUBMITTED_DATES_KEY);
};

export const clearRecordSession = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(TODAY_TASK_SCRUMS_KEY);
  window.sessionStorage.removeItem(DEEP_LOG_SELECTED_SCRUMS_KEY);
  window.sessionStorage.removeItem(STAR_LOG_TASKS_KEY);
  window.sessionStorage.removeItem(STAR_LOG_COMPLETED_STAR_RECORD_IDS_KEY);
  window.sessionStorage.removeItem(SKILL_TAGGING_STATE_KEY);
};

export const markRecordFlowCompleted = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(RECORD_FLOW_COMPLETED_KEY, "true");
};

export const consumeRecordFlowCompleted = () => {
  if (typeof window === "undefined") return false;

  const isCompleted = window.sessionStorage.getItem(RECORD_FLOW_COMPLETED_KEY) === "true";
  if (isCompleted) {
    window.sessionStorage.removeItem(RECORD_FLOW_COMPLETED_KEY);
  }

  return isCompleted;
};

export const buildTodayTaskScrumsSession = (
  date: string,
  groups: {
    titleId?: number;
    projectTag?: string;
    freeText?: string;
    items?: { scrumId?: number; content?: string }[];
  }[],
): StoredTodayTaskScrums => ({
  date,
  projects: groups.map(group => ({
    titleId: group.titleId,
    projectName: group.projectTag,
    freeText: group.freeText,
    scrums:
      group.items?.map(item => ({
        scrumId: item.scrumId,
        content: item.content,
      })) ?? [],
  })),
});
