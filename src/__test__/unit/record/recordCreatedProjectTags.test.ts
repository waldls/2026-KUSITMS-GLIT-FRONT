import { beforeEach, describe, expect, it } from "vitest";

import {
  addCreatedProjectTag,
  addCreatedProjectTagId,
  clearCreatedProjectTagIds,
  getCreatedProjectTagIds,
  getCreatedProjectTagNames,
  hydrateCreatedProjectTagIds,
  RECORD_CREATED_PROJECT_TAG_IDS_KEY,
  RECORD_CREATED_PROJECT_TAG_NAMES_KEY,
} from "@/lib/utils/recordCreatedProjectTags";
import { useRecordDraftStore } from "@/store/recordDraftStore";

describe("recordCreatedProjectTags", () => {
  beforeEach(() => {
    useRecordDraftStore.getState().reset();
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY);
    window.sessionStorage.removeItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY);
  });

  it("유효하지 않은 projectId는 스토어와 세션에 반영하지 않아야 한다", () => {
    addCreatedProjectTagId(Number.NaN);

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([]);
    expect(getCreatedProjectTagIds()).toEqual([]);
  });

  it("생성된 프로젝트 태그 id를 스토어와 세션에 중복 없이 저장해야 한다", () => {
    addCreatedProjectTagId(3);
    addCreatedProjectTagId(3);
    addCreatedProjectTagId(5);

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([3, 5]);
    expect(getCreatedProjectTagIds()).toEqual([3, 5]);
  });

  it("hydrate는 유효한 숫자만 dedupe해서 반영해야 한다", () => {
    hydrateCreatedProjectTagIds([1, 2, 2, Number.NaN, Number.POSITIVE_INFINITY, 3]);

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([1, 2, 3]);
    expect(
      JSON.parse(window.sessionStorage.getItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY) ?? "[]"),
    ).toEqual([1, 2, 3]);
  });

  it("addCreatedProjectTag는 id와 이름을 함께 저장해야 한다", () => {
    addCreatedProjectTag({ projectId: 99, name: "New Tag" });

    expect(getCreatedProjectTagIds()).toEqual([99]);
    expect(getCreatedProjectTagNames()).toEqual(["New Tag"]);
  });

  it("clearCreatedProjectTagIds는 추적 정보를 모두 비워야 한다", () => {
    useRecordDraftStore.getState().trackCreatedProjectTagId(40);
    window.sessionStorage.setItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY, JSON.stringify([40, 50]));

    clearCreatedProjectTagIds();

    expect(useRecordDraftStore.getState().createdProjectTagIds).toEqual([]);
    expect(window.sessionStorage.getItem(RECORD_CREATED_PROJECT_TAG_IDS_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(RECORD_CREATED_PROJECT_TAG_NAMES_KEY)).toBeNull();
  });
});
