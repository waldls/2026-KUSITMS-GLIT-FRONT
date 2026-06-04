import { useRecordDraftStore } from "@/store/recordDraftStore";

export const RECORD_CREATED_PROJECT_TAG_IDS_KEY = "record-created-project-tag-ids";
export const RECORD_CREATED_PROJECT_TAG_NAMES_KEY = "record-created-project-tag-names";

const parseStoredIds = (stored: string): number[] => {
  try {
    const parsed = JSON.parse(stored) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(id => {
        if (typeof id === "number" && Number.isFinite(id)) return id;
        if (typeof id === "string" && id.trim().length > 0) {
          const parsedId = Number(id);
          return Number.isFinite(parsedId) ? parsedId : null;
        }
        return null;
      })
      .filter((id): id is number => id !== null);
  } catch {
    return [];
  }
};

const parseStoredNames = (stored: string): string[] => {
  try {
    const parsed = JSON.parse(stored) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (name): name is string => typeof name === "string" && name.trim().length > 0,
    );
  } catch {
    return [];
  }
};

export const getCreatedProjectTagIds = (): number[] => {
  if (typeof window === "undefined") return [];

  const stored = window.sessionStorage.getItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY);
  if (!stored) return [];

  return parseStoredIds(stored);
};

export const getCreatedProjectTagNames = (): string[] => {
  if (typeof window === "undefined") return [];

  const stored = window.sessionStorage.getItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY);
  if (!stored) return [];

  return parseStoredNames(stored);
};

export const setCreatedProjectTagIds = (ids: number[]) => {
  if (typeof window === "undefined") return;

  if (ids.length === 0) {
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY);
    return;
  }

  window.sessionStorage.setItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY, JSON.stringify(ids));
};

export const setCreatedProjectTagNames = (names: string[]) => {
  if (typeof window === "undefined") return;

  const uniqueNames = [...new Set(names.map(name => name.trim()).filter(Boolean))];

  if (uniqueNames.length === 0) {
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY);
    return;
  }

  window.sessionStorage.setItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY, JSON.stringify(uniqueNames));
};

export const clearAllCreatedProjectTagTracking = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY);
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY);
  }

  useRecordDraftStore.getState().clearCreatedProjectTagTracking();
};

export const addCreatedProjectTagId = (projectId: number) => {
  if (!Number.isFinite(projectId)) return;

  const currentIds = getCreatedProjectTagIds();
  if (currentIds.includes(projectId)) return;

  useRecordDraftStore.getState().trackCreatedProjectTagId(projectId);
  setCreatedProjectTagIds([...currentIds, projectId]);
};

export const addCreatedProjectTagName = (name: string) => {
  const trimmedName = name.trim();
  if (!trimmedName) return;

  const currentNames = getCreatedProjectTagNames();
  if (currentNames.includes(trimmedName)) return;

  setCreatedProjectTagNames([...currentNames, trimmedName]);
};

export const addCreatedProjectTag = (params: { projectId: number | null; name: string }) => {
  if (params.projectId !== null && Number.isFinite(params.projectId)) {
    addCreatedProjectTagId(params.projectId);
  }

  addCreatedProjectTagName(params.name);
};

export const removeCreatedProjectTagId = (projectId: number) => {
  useRecordDraftStore.getState().untrackCreatedProjectTagId(projectId);
  setCreatedProjectTagIds(getCreatedProjectTagIds().filter(id => id !== projectId));
};

export const removeCreatedProjectTagName = (name: string) => {
  const trimmedName = name.trim();
  setCreatedProjectTagNames(getCreatedProjectTagNames().filter(tagName => tagName !== trimmedName));
};

export const clearCreatedProjectTagIds = () => {
  clearAllCreatedProjectTagTracking();
};

export const hydrateCreatedProjectTagIds = (ids: number[]) => {
  const uniqueIds = [...new Set(ids.filter(id => Number.isFinite(id)))];

  useRecordDraftStore.getState().hydrateCreatedProjectTagIds(uniqueIds);
  setCreatedProjectTagIds(uniqueIds);
};
