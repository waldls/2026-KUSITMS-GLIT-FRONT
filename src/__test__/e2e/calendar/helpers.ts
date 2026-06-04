import type { Page } from "@playwright/test";

import type { DailyCalendarGroup } from "@/types/record/calendar";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

export { fulfillApiSuccess, setupAuthCookie };

export const TODAY_KEY = "2026-06-05";
export const TODAY_MONTH_KEY = "2026-06";

export const E2E_TESTER_PROFILE = {
  profileImage: null,
  nickname: "테스터",
  jobRole: "기획자",
  userStatus: "ACTIVE",
  consecutiveRecordDays: 3,
  glaring: false,
};

export const MOCK_CALENDAR_DAYS = [
  { date: TODAY_KEY, hasScrums: true, hasStar: false, primaryCategory: null, starCount: 0 },
  {
    date: "2026-06-04",
    hasScrums: true,
    hasStar: true,
    primaryCategory: "PROBLEM_SOLVING",
    starCount: 1,
  },
  { date: "2026-06-03", hasScrums: false, hasStar: false, primaryCategory: null, starCount: 0 },
];

export const MOCK_PREVIEW_SCRUMS = [
  {
    titleId: 1,
    projectName: "기획",
    freeText: "캘린더 기능 기획",
    primaryCategories: [],
    scrumCount: 2,
    hasStarAny: false,
  },
];

export const MOCK_DAILY_GROUPS: DailyCalendarGroup[] = [
  {
    titleId: 1,
    projectTag: "기획",
    freeText: "캘린더 기능 기획",
    isEditable: true,
    items: [
      { scrumId: 101, content: "화면 설계서 작성", hasStar: false, primaryCategory: null },
      {
        scrumId: 102,
        content: "API 명세 검토",
        hasStar: true,
        primaryCategory: "PROBLEM_SOLVING",
        starRecordId: 201,
      },
    ],
  },
];

type CalendarApiMockOptions = {
  calendarDays?: typeof MOCK_CALENDAR_DAYS;
  previewScrums?: typeof MOCK_PREVIEW_SCRUMS;
  dailyGroups?: DailyCalendarGroup[];
};

export async function setupCalendarApiMocks(page: Page, options: CalendarApiMockOptions = {}) {
  const {
    calendarDays = MOCK_CALENDAR_DAYS,
    previewScrums = MOCK_PREVIEW_SCRUMS,
    dailyGroups = MOCK_DAILY_GROUPS,
  } = options;

  await page.route("**/api/users/me", async route => {
    await route.fulfill(fulfillApiSuccess(E2E_TESTER_PROFILE));
  });

  await page.route("**/api/calendar/monthly**", async route => {
    await route.fulfill(fulfillApiSuccess({ month: TODAY_MONTH_KEY, days: calendarDays }));
  });

  await page.route(/\/api\/calendar\/daily-preview(\?|$)/, async route => {
    await route.fulfill(fulfillApiSuccess({ date: TODAY_KEY, titles: previewScrums }));
  });

  // "daily**" 글로브는 daily-preview까지 매칭되므로 정규식으로 정확히 구분
  await page.route(/\/api\/calendar\/daily(\?|$)/, async route => {
    await route.fulfill(fulfillApiSuccess({ groups: dailyGroups }));
  });

  await page.route("**/api/scrums/**", async route => {
    if (["DELETE"].includes(route.request().method())) {
      await route.fulfill(fulfillApiSuccess(null));
      return;
    }
    await route.continue();
  });

  await page.route(/\/api\/titles\/\d+/, async route => {
    if (route.request().method() === "DELETE") {
      await route.fulfill(fulfillApiSuccess(null));
      return;
    }
    await route.continue();
  });
}

export async function gotoCalendarPage(
  page: Page,
  path = "/calendar",
  mockOptions?: CalendarApiMockOptions,
) {
  await setupAuthCookie(page);
  await setupCalendarApiMocks(page, mockOptions);

  await page.addInitScript((todayKey: string) => {
    Object.defineProperty(window, "__E2E_TODAY_KEY__", { value: todayKey });
  }, TODAY_KEY);

  await page.goto(path, { waitUntil: "domcontentloaded" });
}
