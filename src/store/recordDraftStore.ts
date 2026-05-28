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
  isTodayWithExistingRecord: boolean;
  setDraft: (
    draft: Partial<
      Pick<RecordDraftState, "selectedDate" | "addedProjects" | "deepLogSelectedTaskIds">
    >,
  ) => void;
  setIsTodayWithExistingRecord: (isTodayWithExistingRecord: boolean) => void;
  reset: () => void;
};

const initialState = {
  selectedDate: null,
  addedProjects: [] as AddedProject[],
  deepLogSelectedTaskIds: [] as number[],
  isTodayWithExistingRecord: false,
};

export const useRecordDraftStore = create<RecordDraftState>(set => ({
  ...initialState,
  setDraft: draft => set(state => ({ ...state, ...draft })),
  setIsTodayWithExistingRecord: isTodayWithExistingRecord => set({ isTodayWithExistingRecord }),
  reset: () => set(initialState),
}));
