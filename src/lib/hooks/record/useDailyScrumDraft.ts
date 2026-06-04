import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

import { getDaily } from "@/lib/apis/record/calendar";
import {
  postWrite,
  putDaily,
  type ScrumBulkWriteRequest,
  type ScrumBulkWriteResponse,
  type SyncDailyScrumRequest,
} from "@/lib/apis/record/scrum";
import { parseApiDate } from "@/lib/utils/calendar";
import { normalizeTasks } from "@/lib/utils/record/projectSheetValidation";
import { clearCreatedProjectTagIds } from "@/lib/utils/recordCreatedProjectTags";
import {
  buildTodayTaskScrumsSession,
  getTodayTaskScrums,
  isTodayTaskSubmitted,
  mapStoredScrumsToAddedProjects,
  markTodayTaskSubmitted,
  TODAY_TASK_SCRUMS_KEY,
} from "@/lib/utils/recordSession";
import { type AddedProject, useRecordDraftStore } from "@/store/recordDraftStore";
import type { DailyCalendarGroup } from "@/types/record/calendar";

import type { ProjectTag } from "./useProjects";

type UseDailyScrumDraftParams = {
  projectTagItems: ProjectTag[];
  selectedProjectTag: string | null;
  projectTitle: string;
  projectTasks: string[];
  totalTaskCount: number;
  showProjectTagToast: (message: string) => void;
  showScrumToast: (message: string) => void;
  isStarDate: (date: Date) => boolean;
};

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const mapDailyGroupsToAddedProjects = (
  groups: DailyCalendarGroup[],
  projectTags: ProjectTag[],
): AddedProject[] =>
  groups
    .filter(group => group.titleId)
    .map(group => {
      const matchedTag = projectTags.find(tag => tag.name === group.projectTag);

      return {
        id: group.titleId!,
        titleId: group.titleId,
        projectId: matchedTag?.id ?? 0,
        label: group.projectTag ?? "",
        title: group.freeText ?? "",
        tasks: group.items?.map(item => item.content ?? "") ?? [],
        scrumIds: group.items?.map(item => item.scrumId ?? null) ?? [],
      };
    });

const resolveTitleId = (project: AddedProject, dailyGroups: DailyCalendarGroup[]) =>
  project.titleId ??
  dailyGroups.find(group => group.projectTag === project.label && group.freeText === project.title)
    ?.titleId;

const buildSyncDailyScrumRequest = (
  projects: AddedProject[],
  dailyGroups: DailyCalendarGroup[],
): SyncDailyScrumRequest => ({
  groups: projects.flatMap(project => {
    const titleId = resolveTitleId(project, dailyGroups);
    if (!titleId) return [];

    const dailyGroup = dailyGroups.find(group => group.titleId === titleId);
    const tasks = normalizeTasks(project.tasks);

    return [
      {
        titleId,
        items: tasks.map((content, index) => ({
          scrumId: project.scrumIds?.[index] ?? dailyGroup?.items?.[index]?.scrumId ?? null,
          content,
        })),
      },
    ];
  }),
});

const buildBulkWriteRequest = (date: string, projects: AddedProject[]): ScrumBulkWriteRequest => ({
  date,
  scrumsByTitle: projects.map(project => ({
    projectId: project.projectId,
    freeText: project.title,
    scrums: normalizeTasks(project.tasks).map(content => ({ content })),
  })),
});

type TodayTaskSessionGroup = Parameters<typeof buildTodayTaskScrumsSession>[1][number];

const buildSyncedSessionGroups = (
  projects: AddedProject[],
  dailyGroups: DailyCalendarGroup[],
): TodayTaskSessionGroup[] =>
  projects.flatMap(project => {
    const titleId = resolveTitleId(project, dailyGroups);
    if (!titleId) return [];

    const dailyGroup = dailyGroups.find(group => group.titleId === titleId);

    return [
      {
        titleId,
        projectTag: project.label,
        freeText: project.title,
        items: normalizeTasks(project.tasks).map((content, index) => ({
          scrumId: project.scrumIds?.[index] ?? dailyGroup?.items?.[index]?.scrumId,
          content,
        })),
      },
    ];
  });

const buildBulkWriteSessionGroups = (
  projects: AddedProject[],
  responses: ScrumBulkWriteResponse[],
): TodayTaskSessionGroup[] =>
  projects.map((project, projectIndex) => {
    const response = responses[projectIndex];

    return {
      titleId: project.titleId,
      projectTag: response?.projectName ?? project.label,
      freeText: response?.freeText ?? project.title,
      items: normalizeTasks(project.tasks).map((content, taskIndex) => ({
        scrumId:
          response?.scrums?.[taskIndex]?.scrumId ?? project.scrumIds?.[taskIndex] ?? undefined,
        content,
      })),
    };
  });

const hasMissingScrumIds = (groups: TodayTaskSessionGroup[]) =>
  groups.some(group => group.items?.some(item => !item.scrumId));

const mapSessionGroupsToAddedProjects = (
  projects: AddedProject[],
  groups: TodayTaskSessionGroup[],
): AddedProject[] =>
  projects.map((project, projectIndex) => {
    const group = groups[projectIndex];

    return {
      ...project,
      titleId: group?.titleId ?? project.titleId,
      label: group?.projectTag ?? project.label,
      title: group?.freeText ?? project.title,
      tasks: group?.items?.map(item => item.content?.trim() ?? "").filter(Boolean) ?? project.tasks,
      scrumIds: group?.items?.map(item => item.scrumId ?? null) ?? project.scrumIds,
    };
  });

const isSameCalendarDay = (left: Date, right: Date) =>
  formatDateForApi(left) === formatDateForApi(right);

const isUnsavedLocalProject = (project: AddedProject) => !project.titleId;

const mergeLoadedProjectsWithLocalDraft = (
  loadedProjects: AddedProject[],
  targetDateKey: string,
) => {
  if (loadedProjects.length > 0) return loadedProjects;

  const storeState = useRecordDraftStore.getState();
  if (storeState.selectedDate !== targetDateKey) return loadedProjects;

  const unsavedLocalProjects = storeState.addedProjects.filter(isUnsavedLocalProject);

  return unsavedLocalProjects.length > 0 ? unsavedLocalProjects : loadedProjects;
};

type LoadDailyProjectsParams = {
  date: Date;
  todayDateKey: string;
  setDraft: (draft: { selectedDate: string; addedProjects: AddedProject[] }) => void;
  setHasTodayRecordFromServer: Dispatch<SetStateAction<boolean>>;
  loadDailyProjectsRequestRef: { current: number };
  projectTagItemsRef: { current: ProjectTag[] };
  options?: { preferSession?: boolean };
};

const loadDailyProjects = async ({
  date,
  todayDateKey,
  setDraft,
  setHasTodayRecordFromServer,
  loadDailyProjectsRequestRef,
  projectTagItemsRef,
  options,
}: LoadDailyProjectsParams) => {
  const dateKey = formatDateForApi(date);
  const requestId = loadDailyProjectsRequestRef.current + 1;
  loadDailyProjectsRequestRef.current = requestId;
  const applyDraft = (draft: { selectedDate: string; addedProjects: AddedProject[] }) => {
    if (loadDailyProjectsRequestRef.current !== requestId) return;

    setDraft(draft);
  };

  const applyHasTodayRecordFromServer = (value: boolean) => {
    if (loadDailyProjectsRequestRef.current !== requestId) return;

    setHasTodayRecordFromServer(value);
  };

  if (options?.preferSession) {
    const sessionScrums = getTodayTaskScrums();
    if (sessionScrums?.date === dateKey && sessionScrums.projects.length > 0) {
      const restoredProjects = mapStoredScrumsToAddedProjects(
        sessionScrums,
        projectTagItemsRef.current,
      );

      if (restoredProjects.length > 0) {
        applyDraft({
          selectedDate: dateKey,
          addedProjects: mergeLoadedProjectsWithLocalDraft(restoredProjects, dateKey),
        });
        if (dateKey === todayDateKey && isTodayTaskSubmitted(dateKey)) {
          applyHasTodayRecordFromServer(true);
        }
        return;
      }
    }
  }

  try {
    const daily = await getDaily(dateKey);
    const loadedProjects = mapDailyGroupsToAddedProjects(
      daily?.groups ?? [],
      projectTagItemsRef.current,
    );

    applyDraft({
      selectedDate: dateKey,
      addedProjects: mergeLoadedProjectsWithLocalDraft(loadedProjects, dateKey),
    });
    applyHasTodayRecordFromServer(dateKey === todayDateKey && loadedProjects.length > 0);
  } catch {
    applyDraft({
      selectedDate: dateKey,
      addedProjects: mergeLoadedProjectsWithLocalDraft([], dateKey),
    });
    if (dateKey === todayDateKey) {
      applyHasTodayRecordFromServer(false);
    }
  }
};

export const useDailyScrumDraft = ({
  projectTagItems,
  selectedProjectTag,
  projectTitle,
  projectTasks,
  totalTaskCount,
  showProjectTagToast,
  showScrumToast,
  isStarDate,
}: UseDailyScrumDraftParams) => {
  const selectedDateStr = useRecordDraftStore(state => state.selectedDate);
  const addedProjects = useRecordDraftStore(state => state.addedProjects);
  const setDraft = useRecordDraftStore(state => state.setDraft);
  const selectedDate = selectedDateStr ? parseApiDate(selectedDateStr) : getToday();
  const projectTagItemsRef = useRef(projectTagItems);
  const loadDailyProjectsRequestRef = useRef(0);
  const hasLoadedInitialDateRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasTodayRecordFromServer, setHasTodayRecordFromServer] = useState(false);
  const todayDateKey = formatDateForApi(getToday());
  const isSelectedToday = isSameCalendarDay(selectedDate, getToday());
  const isTodayWithExistingRecord =
    isSelectedToday &&
    (isTodayTaskSubmitted(todayDateKey) || isStarDate(selectedDate) || hasTodayRecordFromServer);

  useEffect(() => {
    projectTagItemsRef.current = projectTagItems;
  }, [projectTagItems]);

  useEffect(() => {
    if (projectTagItems.length === 0) return;

    const currentProjects = useRecordDraftStore.getState().addedProjects;
    if (currentProjects.length === 0) return;

    let hasProjectIdChange = false;
    const nextProjects = currentProjects.map(project => {
      const matchedTag = projectTagItems.find(tag => tag.name === project.label);
      if (!matchedTag || project.projectId === matchedTag.id) return project;

      hasProjectIdChange = true;
      return { ...project, projectId: matchedTag.id };
    });

    if (hasProjectIdChange) {
      setDraft({ addedProjects: nextProjects });
    }
  }, [projectTagItems, setDraft]);

  const setSelectedDate = (date: Date | null) => {
    setDraft({
      selectedDate: date ? formatDateForApi(date) : null,
    });
  };

  const setAddedProjects = (action: SetStateAction<AddedProject[]>) => {
    const previousProjects = useRecordDraftStore.getState().addedProjects;
    const nextProjects = typeof action === "function" ? action(previousProjects) : action;

    setDraft({ addedProjects: nextProjects });
  };

  const loadProjectsForDate = (date: Date, options?: { preferSession?: boolean }) =>
    loadDailyProjects({
      date,
      todayDateKey,
      setDraft,
      setHasTodayRecordFromServer,
      loadDailyProjectsRequestRef,
      projectTagItemsRef,
      options,
    });

  useEffect(() => {
    if (!selectedDateStr && hasLoadedInitialDateRef.current) return;

    hasLoadedInitialDateRef.current = true;
    const date = selectedDateStr ? parseApiDate(selectedDateStr) : getToday();

    void loadDailyProjects({
      date,
      todayDateKey,
      setDraft,
      setHasTodayRecordFromServer,
      loadDailyProjectsRequestRef,
      projectTagItemsRef,
      options: { preferSession: true },
    });

    return () => {
      loadDailyProjectsRequestRef.current += 1;
      hasLoadedInitialDateRef.current = false;
    };
  }, [selectedDateStr, setDraft, todayDateKey]);

  const setIsTodayWithExistingRecord = useRecordDraftStore(
    state => state.setIsTodayWithExistingRecord,
  );

  useEffect(() => {
    const currentValue = useRecordDraftStore.getState().isTodayWithExistingRecord;
    if (currentValue === isTodayWithExistingRecord) return;

    setIsTodayWithExistingRecord(isTodayWithExistingRecord);
  }, [isTodayWithExistingRecord, setIsTodayWithExistingRecord]);

  useEffect(() => {
    const handleLockedNextClick = () => {
      if (!isTodayWithExistingRecord) return;

      showScrumToast("오늘은 이미 기록이 있어요");
    };

    window.addEventListener("today-task-locked-next-click", handleLockedNextClick);

    return () => {
      window.removeEventListener("today-task-locked-next-click", handleLockedNextClick);
    };
  }, [isTodayWithExistingRecord, showScrumToast]);

  useEffect(() => {
    const canProceed =
      !isTodayWithExistingRecord &&
      selectedDate !== null &&
      addedProjects.length > 0 &&
      totalTaskCount <= 5 &&
      !isSaving;

    window.dispatchEvent(
      new CustomEvent("today-task-ready-change", {
        detail: canProceed,
      }),
    );
  }, [addedProjects.length, isSaving, isTodayWithExistingRecord, selectedDate, totalTaskCount]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("today-task-saving-change", { detail: isSaving }));
  }, [isSaving]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("today-task-ready-change", { detail: false }));
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("today-task-dirty-change", {
        detail:
          (selectedDate !== null &&
            formatDateForApi(selectedDate) !== formatDateForApi(getToday())) ||
          addedProjects.length > 0 ||
          selectedProjectTag !== null ||
          projectTitle.trim().length > 0 ||
          projectTasks.some(task => task.trim().length > 0),
      }),
    );
  }, [addedProjects.length, projectTasks, projectTitle, selectedDate, selectedProjectTag]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("today-task-dirty-change", { detail: false }));
    };
  }, []);

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const submitEvent = event as CustomEvent<{
        onSuccess?: () => void;
        onError?: () => void;
      }>;

      if (!selectedDate || addedProjects.length === 0 || isSaving) {
        submitEvent.detail?.onError?.();
        return;
      }

      const date = formatDateForApi(selectedDate);

      if (
        isSameCalendarDay(selectedDate, getToday()) &&
        (isTodayTaskSubmitted(date) || isStarDate(selectedDate) || hasTodayRecordFromServer)
      ) {
        showScrumToast("오늘은 이미 기록이 있어요");
        submitEvent.detail?.onError?.();
        return;
      }

      const save = async () => {
        setIsSaving(true);

        try {
          const daily = await getDaily(date);
          const dailyGroups = daily?.groups ?? [];
          const hasNewTitle = addedProjects.some(project => !resolveTitleId(project, dailyGroups));
          let sessionGroups: TodayTaskSessionGroup[] = [];

          if (dailyGroups.length > 0 && hasNewTitle) {
            await putDaily(date, { groups: [] });
            const postWriteResponse = await postWrite(buildBulkWriteRequest(date, addedProjects));

            sessionGroups = buildBulkWriteSessionGroups(addedProjects, postWriteResponse ?? []);
          } else if (dailyGroups.length > 0) {
            const syncBody = buildSyncDailyScrumRequest(addedProjects, dailyGroups);

            if (syncBody.groups.length > 0) {
              await putDaily(date, syncBody);
            }

            sessionGroups = buildSyncedSessionGroups(addedProjects, dailyGroups);

            if (hasMissingScrumIds(sessionGroups)) {
              sessionGroups = (await getDaily(date))?.groups ?? [];
            }
          } else {
            const postWriteResponse = await postWrite(buildBulkWriteRequest(date, addedProjects));

            sessionGroups = buildBulkWriteSessionGroups(addedProjects, postWriteResponse ?? []);
          }

          const savedProjects = mapSessionGroupsToAddedProjects(addedProjects, sessionGroups);

          setDraft({
            selectedDate: date,
            addedProjects: savedProjects,
          });

          window.sessionStorage.setItem(
            TODAY_TASK_SCRUMS_KEY,
            JSON.stringify(buildTodayTaskScrumsSession(date, sessionGroups)),
          );
          if (date === todayDateKey) {
            markTodayTaskSubmitted(date);
            setHasTodayRecordFromServer(true);
          }
          clearCreatedProjectTagIds();
          window.dispatchEvent(new CustomEvent("record-created-tags-committed"));
          submitEvent.detail?.onSuccess?.();
        } catch {
          showProjectTagToast("오늘의 작업을 저장하지 못했어요");
          submitEvent.detail?.onError?.();
        } finally {
          setIsSaving(false);
        }
      };

      void save();
    };

    window.addEventListener("today-task-submit", handleSubmit);

    return () => {
      window.removeEventListener("today-task-submit", handleSubmit);
    };
  }, [
    addedProjects,
    hasTodayRecordFromServer,
    isSaving,
    isStarDate,
    selectedDate,
    setDraft,
    showProjectTagToast,
    showScrumToast,
    todayDateKey,
  ]);

  return {
    selectedDate,
    addedProjects,
    isSaving,
    isTodayWithExistingRecord,
    setSelectedDate,
    setAddedProjects,
    loadDailyProjects: loadProjectsForDate,
  };
};
