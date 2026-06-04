import { beforeEach, describe, expect, it } from "vitest";

import { useRecordDraftStore } from "@/store/recordDraftStore";

describe("recordDraftStore", () => {
  beforeEach(() => {
    useRecordDraftStore.getState().reset();
  });

  it("초기 상태가 올바르게 설정되어야 한다", () => {
    const state = useRecordDraftStore.getState();
    expect(state.selectedDate).toBeNull();
    expect(state.addedProjects).toEqual([]);
    expect(state.deepLogSelectedTaskIds).toEqual([]);
    expect(state.createdProjectTagIds).toEqual([]);
    expect(state.isTodayWithExistingRecord).toBe(false);
  });

  it("setDraft 호출 시 특정 필드만 부분적으로 업데이트되어야 한다", () => {
    const { setDraft } = useRecordDraftStore.getState();

    setDraft({ selectedDate: "2026-06-04" });
    expect(useRecordDraftStore.getState().selectedDate).toBe("2026-06-04");
    expect(useRecordDraftStore.getState().addedProjects).toEqual([]);

    setDraft({
      addedProjects: [
        {
          id: 1,
          projectId: 10,
          label: "테스트",
          title: "제목",
          tasks: ["태스크1"],
        },
      ],
    });
    expect(useRecordDraftStore.getState().selectedDate).toBe("2026-06-04");
    expect(useRecordDraftStore.getState().addedProjects).toHaveLength(1);
  });

  it("trackCreatedProjectTagId 호출 시 중복된 ID가 추가되지 않아야 한다", () => {
    const { trackCreatedProjectTagId } = useRecordDraftStore.getState();

    trackCreatedProjectTagId(100);
    trackCreatedProjectTagId(100);
    trackCreatedProjectTagId(200);

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([100, 200]);
  });

  it("reset 호출 시 모든 상태가 초기값으로 돌아가야 한다", () => {
    const { setDraft, trackCreatedProjectTagId, reset } = useRecordDraftStore.getState();

    setDraft({ selectedDate: "2026-06-04", deepLogSelectedTaskIds: [1, 2] });
    trackCreatedProjectTagId(50);

    reset();

    const state = useRecordDraftStore.getState();
    expect(state.selectedDate).toBeNull();
    expect(state.deepLogSelectedTaskIds).toEqual([]);
    expect(state.createdProjectTagIds).toEqual([]);
  });

  it("hydrateCreatedProjectTagIds는 유효한 숫자만 중복 없이 저장해야 한다", () => {
    const { hydrateCreatedProjectTagIds } = useRecordDraftStore.getState();

    hydrateCreatedProjectTagIds([1, 2, 2, Number.NaN, 3]);

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([1, 2, 3]);
  });
});
