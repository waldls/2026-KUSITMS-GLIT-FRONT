import { describe, expect, it } from "vitest";

import { getProjectIdFromResponse } from "@/lib/utils/projectId";

describe("getProjectIdFromResponse", () => {
  it("projectId 필드가 숫자일 때 그대로 반환해야 한다", () => {
    expect(getProjectIdFromResponse({ projectId: 12, name: "프로젝트" })).toBe(12);
  });

  it("중첩된 project 객체의 문자열 id도 숫자로 변환해야 한다", () => {
    const nestedProject = {
      project: {
        id: "34",
      },
    } as unknown as Parameters<typeof getProjectIdFromResponse>[0];

    expect(getProjectIdFromResponse(nestedProject)).toBe(34);
  });

  it("유효하지 않은 값이나 nullish 값은 null을 반환해야 한다", () => {
    const invalidProjectId = { projectId: "abc" } as unknown as Parameters<
      typeof getProjectIdFromResponse
    >[0];
    const invalidNestedProject = {
      project: {
        id: "",
      },
    } as unknown as Parameters<typeof getProjectIdFromResponse>[0];

    expect(getProjectIdFromResponse(null)).toBeNull();
    expect(getProjectIdFromResponse(undefined)).toBeNull();
    expect(getProjectIdFromResponse(invalidProjectId)).toBeNull();
    expect(getProjectIdFromResponse(invalidNestedProject)).toBeNull();
  });
});
