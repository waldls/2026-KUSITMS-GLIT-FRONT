import { afterEach, describe, expect, it } from "vitest";

import { getMaxAccessibleRecordPath, resolveRecordFlowPath } from "@/lib/utils/recordFlowGuard";
import {
  DEEP_LOG_SELECTED_SCRUMS_KEY,
  RECORD_FLOW_ACTIVE_KEY,
  SKILL_TAGGING_STATE_KEY,
  STAR_LOG_TASKS_KEY,
  TODAY_TASK_SCRUMS_KEY,
} from "@/lib/utils/recordSession";

const enterRecordFlow = () => {
  window.sessionStorage.setItem(RECORD_FLOW_ACTIVE_KEY, "1");
};

describe("recordFlowGuard", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("플로우 밖에서 record 하위 경로로 직접 진입하면 record 홈으로 보내야 한다", () => {
    expect(resolveRecordFlowPath("/record/today-task")).toBe("/record");
    expect(resolveRecordFlowPath("/record/deep-log")).toBe("/record");
    expect(resolveRecordFlowPath("/record/skill-tagging")).toBe("/record");
  });

  it("기록 데이터가 없으면 today-task까지만 접근 가능해야 한다", () => {
    enterRecordFlow();

    expect(getMaxAccessibleRecordPath()).toBe("/record/today-task");
    expect(resolveRecordFlowPath("/record/deep-log")).toBe("/record/today-task");
    expect(resolveRecordFlowPath("/record/select-skills")).toBe("/record/today-task");
    expect(resolveRecordFlowPath("/record/star-log")).toBe("/record/today-task");
  });

  it("오늘 작업만 있으면 deep-log까지만 접근 가능해야 한다", () => {
    enterRecordFlow();
    window.sessionStorage.setItem(
      TODAY_TASK_SCRUMS_KEY,
      JSON.stringify({
        date: "2026-06-04",
        projects: [{ titleId: 1, projectName: "A", scrums: [{ scrumId: 1, content: "task" }] }],
      }),
    );

    expect(getMaxAccessibleRecordPath()).toBe("/record/deep-log");
    expect(resolveRecordFlowPath("/record/today-task")).toBe("/record/today-task");
    expect(resolveRecordFlowPath("/record/deep-log")).toBe("/record/deep-log");
    expect(resolveRecordFlowPath("/record/select-skills")).toBe("/record/deep-log");
  });

  it("심화 기록 대상이 저장되면 select-skills까지 접근 가능해야 한다", () => {
    enterRecordFlow();
    window.sessionStorage.setItem(
      DEEP_LOG_SELECTED_SCRUMS_KEY,
      JSON.stringify({
        projects: [{ id: 1, tag: "A", title: "title", tasks: [{ id: 1, title: "task" }] }],
      }),
    );

    expect(getMaxAccessibleRecordPath()).toBe("/record/select-skills");
    expect(resolveRecordFlowPath("/record/star-log")).toBe("/record/select-skills");
  });

  it("star-log tasks가 있으면 star-log까지 접근 가능해야 한다", () => {
    enterRecordFlow();
    window.sessionStorage.setItem(
      STAR_LOG_TASKS_KEY,
      JSON.stringify([{ id: 1, title: "task", skillId: 1 }]),
    );

    expect(getMaxAccessibleRecordPath()).toBe("/record/star-log");
    expect(resolveRecordFlowPath("/record/skill-tagging")).toBe("/record/star-log");
  });

  it("skill-tagging state가 있으면 skill-tagging까지 접근 가능해야 한다", () => {
    enterRecordFlow();
    window.sessionStorage.setItem(SKILL_TAGGING_STATE_KEY, "success");

    expect(getMaxAccessibleRecordPath()).toBe("/record/skill-tagging");
    expect(resolveRecordFlowPath("/record/skill-tagging")).toBe("/record/skill-tagging");
  });

  it("/record 홈은 항상 접근 가능해야 한다", () => {
    expect(resolveRecordFlowPath("/record")).toBe("/record");
  });

  it("/recording 같은 비기록 경로는 record 플로우 가드 대상이 아니어야 한다", () => {
    expect(resolveRecordFlowPath("/recording/session")).toBe("/recording/session");
  });
});
