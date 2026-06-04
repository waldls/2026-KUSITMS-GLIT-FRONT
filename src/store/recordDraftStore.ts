import { create } from "zustand";

export type AddedProject = {
  id: number;
  titleId?: number;
  projectId: number;
  label: string;
  title: string;
  tasks: string[];
  scrumIds?: (number | null)[];
};

type RecordDraftState = {
  selectedDate: string | null;
  addedProjects: AddedProject[];
  deepLogSelectedTaskIds: number[];
  createdProjectTagIds: number[];
  isTodayWithExistingRecord: boolean;
  setDraft: (
    draft: Partial<
      Pick<RecordDraftState, "selectedDate" | "addedProjects" | "deepLogSelectedTaskIds">
    >,
  ) => void;
  setIsTodayWithExistingRecord: (isTodayWithExistingRecord: boolean) => void;
  trackCreatedProjectTagId: (projectId: number) => void;
  untrackCreatedProjectTagId: (projectId: number) => void;
  hydrateCreatedProjectTagIds: (projectIds: number[]) => void;
  clearCreatedProjectTagTracking: () => void;
  reset: () => void;
};

const initialState = {
  selectedDate: null,
  addedProjects: [] as AddedProject[],
  deepLogSelectedTaskIds: [] as number[],
  createdProjectTagIds: [] as number[],
  isTodayWithExistingRecord: false,
};

export const useRecordDraftStore = create<RecordDraftState>(set => ({
  ...initialState,
  setDraft: draft => set(state => ({ ...state, ...draft })),
  setIsTodayWithExistingRecord: isTodayWithExistingRecord => set({ isTodayWithExistingRecord }),
  trackCreatedProjectTagId: projectId =>
    set(state => ({
      createdProjectTagIds: state.createdProjectTagIds.includes(projectId)
        ? state.createdProjectTagIds
        : [...state.createdProjectTagIds, projectId],
    })),
  untrackCreatedProjectTagId: projectId =>
    set(state => ({
      createdProjectTagIds: state.createdProjectTagIds.filter(id => id !== projectId),
    })),
  hydrateCreatedProjectTagIds: projectIds =>
    set({
      createdProjectTagIds: [...new Set(projectIds.filter(id => Number.isFinite(id)))],
    }),
  clearCreatedProjectTagTracking: () => set({ createdProjectTagIds: [] }),
  reset: () => set(initialState),
}));
