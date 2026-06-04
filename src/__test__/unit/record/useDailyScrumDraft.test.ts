import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// API 및 유틸 모킹
vi.mock("@/lib/apis/record/calendar", () => ({
  getDaily: vi.fn(),
}));

vi.mock("@/lib/utils/recordSession", () => ({
  getTodayTaskScrums: vi.fn(),
  isTodayTaskSubmitted: vi.fn(() => false),
  mapStoredScrumsToAddedProjects: vi.fn(() => []),
  buildTodayTaskScrumsSession: vi.fn(),
  markTodayTaskSubmitted: vi.fn(),
  TODAY_TASK_SCRUMS_KEY: "today-task-scrums",
}));

import { getDaily } from "@/lib/apis/record/calendar";
import { useDailyScrumDraft } from "@/lib/hooks/record/useDailyScrumDraft";
import { getTodayTaskScrums, mapStoredScrumsToAddedProjects } from "@/lib/utils/recordSession";
import { useRecordDraftStore } from "@/store/recordDraftStore";
import type { DailyCalendarData } from "@/types/record/calendar";

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

describe("useDailyScrumDraft", () => {
  const todayKey = formatDateForApi(new Date());

  const mockParams = {
    projectTagItems: [{ id: 1, name: "프로젝트1", deletable: false }],
    selectedProjectTag: null,
    projectTitle: "",
    projectTasks: [],
    totalTaskCount: 0,
    showProjectTagToast: vi.fn(),
    showScrumToast: vi.fn(),
    isStarDate: vi.fn(() => false),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useRecordDraftStore.getState().reset();
  });

  it("마운트 시 세션에 데이터가 있으면 이를 불러와서 스토어에 반영해야 한다", async () => {
    const mockSessionData = {
      date: todayKey,
      projects: [{ titleId: 1, projectName: "프로젝트1", scrums: [] }],
    };
    vi.mocked(getTodayTaskScrums).mockReturnValue(mockSessionData);
    vi.mocked(mapStoredScrumsToAddedProjects).mockReturnValue([
      {
        id: 1,
        titleId: 1,
        projectId: 1,
        label: "프로젝트1",
        title: "제목",
        tasks: [],
        scrumIds: [],
      },
    ]);

    renderHook(() => useDailyScrumDraft(mockParams));

    await waitFor(() => {
      expect(useRecordDraftStore.getState().addedProjects).toHaveLength(1);
      expect(useRecordDraftStore.getState().addedProjects[0].label).toBe("프로젝트1");
    });
  });

  it("세션에 데이터가 없으면 서버에서 데이터를 가져와야 한다", async () => {
    vi.mocked(getTodayTaskScrums).mockReturnValue(null);
    vi.mocked(getDaily).mockResolvedValue({
      groups: [{ titleId: 10, projectTag: "프로젝트1", freeText: "서버제목", items: [] }],
    } as DailyCalendarData);

    renderHook(() => useDailyScrumDraft(mockParams));

    await waitFor(() => {
      expect(getDaily).toHaveBeenCalled();
      expect(useRecordDraftStore.getState().addedProjects).toHaveLength(1);
      expect(useRecordDraftStore.getState().addedProjects[0].title).toBe("서버제목");
    });
  });

  it("날짜를 변경하면 해당 날짜의 데이터를 다시 로드해야 한다", async () => {
    const { result } = renderHook(() => useDailyScrumDraft(mockParams));

    const newDate = new Date(2026, 5, 10); // 2026-06-10

    result.current.setSelectedDate(newDate);

    await waitFor(() => {
      expect(getDaily).toHaveBeenCalledWith("2026-06-10");
    });
  });
});
