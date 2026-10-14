import type { Page } from "@playwright/test";

import type { DailyCalendarGroup } from "@/types/record/calendar";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

export { fulfillApiSuccess, setupAuthCookie };

// 캘린더 페이지는 서버에서 Asia/Seoul 기준 오늘 날짜를 계산하므로 테스트도 실제 오늘 기준으로 맞춤
const getSeoulToday = () => {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" })
    .format(new Date())
    .split("-")
    .map(Number);
  return new Date(year, month - 1, day);
};

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// 오늘과 같은 달 안에서 오늘로부터 offset만큼 떨어진 날짜 (월 경계를 넘으면 반대 방향으로)
const getSameMonthDateKey = (offset: number) => {
  const today = getSeoulToday();
  const past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
  const future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  return toDateKey(past.getMonth() === today.getMonth() ? past : future);
};

export const TODAY_KEY = toDateKey(getSeoulToday());
export const TODAY_MONTH_KEY = TODAY_KEY.slice(0, 7);
export const STAR_DAY_KEY = getSameMonthDateKey(1);
export const EMPTY_DAY_KEY = getSameMonthDateKey(2);

export const E2E_TESTER_PROFILE = {
  profileImage: null,
  nickname: "테스터",
  jobRole: "기획자",
  userStatus: "ACTIVE",
  consecutiveRecordDays: 3,
  glaring: false,
  joinedAt: "2026-01-01",
};

export const MOCK_CALENDAR_DAYS = [
  { date: TODAY_KEY, hasScrums: true, hasStar: false, primaryCategory: null, starCount: 0 },
  {
    date: STAR_DAY_KEY,
    hasScrums: true,
    hasStar: true,
    primaryCategory: "PROBLEM_SOLVING",
    starCount: 1,
  },
  { date: EMPTY_DAY_KEY, hasScrums: false, hasStar: false, primaryCategory: null, starCount: 0 },
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

  await page.goto(path, { waitUntil: "domcontentloaded" });
}
