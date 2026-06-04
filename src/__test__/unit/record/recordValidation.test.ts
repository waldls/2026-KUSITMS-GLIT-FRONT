import { describe, expect, it } from "vitest";

import { isProjectStepReady, normalizeTasks } from "@/lib/utils/record/projectSheetValidation";

describe("record validation logic", () => {
  describe("isProjectStepReady", () => {
    it("tag 단계에서는 태그가 선택되어야 한다", () => {
      expect(isProjectStepReady("tag", "프로젝트", "", [])).toBe(true);
      expect(isProjectStepReady("tag", null, "", [])).toBe(false);
    });

    it("title 단계에서는 공백이 아닌 제목이 있어야 한다", () => {
      expect(isProjectStepReady("title", "태그", "제목", [])).toBe(true);
      expect(isProjectStepReady("title", "태그", "  ", [])).toBe(false);
      expect(isProjectStepReady("title", "태그", "", [])).toBe(false);
    });

    it("task 단계에서는 최소 하나 이상의 유효한 태스크가 있어야 한다", () => {
      expect(isProjectStepReady("task", "태그", "제목", ["작업1"])).toBe(true);
      expect(isProjectStepReady("task", "태그", "제목", ["  ", ""])).toBe(false);
      expect(isProjectStepReady("task", "태그", "제목", [])).toBe(false);
    });
  });

  describe("normalizeTasks", () => {
    it("태스크의 앞뒤 공백을 제거하고 빈 문자열은 필터링해야 한다", () => {
      const input = ["  작업1  ", "", "   ", "작업2"];
      expect(normalizeTasks(input)).toEqual(["작업1", "작업2"]);
    });

    it("모든 태스크가 비어있으면 빈 배열을 반환해야 한다", () => {
      expect(normalizeTasks([" ", "  "])).toEqual([]);
    });
  });
});
