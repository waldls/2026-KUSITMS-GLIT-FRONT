import { beforeEach, describe, expect, it } from "vitest";

import {
  buildTodayTaskScrumsSession,
  consumeRecordFlowCompleted,
  loadSelectSkillsState,
  mapStoredScrumsToAddedProjects,
  mapTodayTaskScrumsToDeepLogProjects,
  markRecordFlowCompleted,
  markTodayTaskSubmitted,
  RECORD_FLOW_COMPLETED_KEY,
  SELECT_SKILLS_DRAFT_KEY,
  TODAY_TASK_SUBMITTED_DATES_KEY,
} from "@/lib/utils/recordSession";

describe("recordSession", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("저장된 scrum 데이터를 addedProjects 형태로 매핑해야 한다", () => {
    const result = mapStoredScrumsToAddedProjects(
      {
        date: "2026-06-04",
        projects: [
          {
            titleId: 7,
            projectName: " GLIT ",
            freeText: " API 정리 ",
            scrums: [
              { scrumId: 101, content: " 문서 작성 " },
              { scrumId: 102, content: " " },
            ],
          },
          {
            projectName: "제외 대상",
            freeText: "titleId 없음",
            scrums: [{ scrumId: 999, content: "무시" }],
          },
        ],
      },
      [{ id: 3, name: " GLIT " }],
    );

    expect(result).toEqual([
      {
        id: 7,
        titleId: 7,
        projectId: 3,
        label: "GLIT",
        title: "API 정리",
        tasks: ["문서 작성"],
        scrumIds: [101, 102],
      },
    ]);
  });

  it("deep log 프로젝트 매핑 시 유효한 태스크만 남기고 빈 프로젝트는 제외해야 한다", () => {
    const result = mapTodayTaskScrumsToDeepLogProjects({
      date: "2026-06-04",
      projects: [
        {
          titleId: 11,
          projectName: " 협업 ",
          freeText: " 회고 ",
          scrums: [
            { scrumId: 1, content: " 배포 확인 " },
            { scrumId: undefined, content: "id 없음" },
            { scrumId: 2, content: " " },
          ],
        },
        {
          titleId: 12,
          projectName: "빈 프로젝트",
          freeText: "제외",
          scrums: [{ scrumId: undefined, content: "" }],
        },
      ],
    });

    expect(result).toEqual([
      {
        id: 11,
        tag: "협업",
        title: "회고",
        tasks: [{ id: 1, title: "배포 확인" }],
      },
    ]);
  });

  it("제출 완료 날짜는 중복 없이 저장해야 한다", () => {
    markTodayTaskSubmitted("2026-06-04");
    markTodayTaskSubmitted("2026-06-04");
    markTodayTaskSubmitted("2026-06-05");

    expect(
      JSON.parse(window.sessionStorage.getItem(TODAY_TASK_SUBMITTED_DATES_KEY) ?? "[]"),
    ).toEqual(["2026-06-04", "2026-06-05"]);
  });

  it("record flow 완료 플래그는 한 번만 소비되어야 한다", () => {
    markRecordFlowCompleted();

    expect(window.sessionStorage.getItem(RECORD_FLOW_COMPLETED_KEY)).toBe("true");
    expect(consumeRecordFlowCompleted()).toBe(true);
    expect(consumeRecordFlowCompleted()).toBe(false);
  });

  it("손상된 select-skills draft는 빈 상태로 복구해야 한다", () => {
    window.sessionStorage.setItem(
      SELECT_SKILLS_DRAFT_KEY,
      JSON.stringify({ selectedSkillIds: {}, selectedSkillEntries: undefined }),
    );

    expect(loadSelectSkillsState()).toEqual({
      projects: null,
      selectedSkillIds: {},
      selectedSkillEntries: [],
    });
  });

  it("today task session 빌더는 그룹 데이터를 저장 형태로 변환해야 한다", () => {
    expect(
      buildTodayTaskScrumsSession("2026-06-04", [
        {
          titleId: 15,
          projectTag: "기획",
          freeText: "홈 개편",
          items: [{ scrumId: 5, content: "와이어프레임 정리" }],
        },
      ]),
    ).toEqual({
      date: "2026-06-04",
      projects: [
        {
          titleId: 15,
          projectName: "기획",
          freeText: "홈 개편",
          scrums: [{ scrumId: 5, content: "와이어프레임 정리" }],
        },
      ],
    });
  });
});
