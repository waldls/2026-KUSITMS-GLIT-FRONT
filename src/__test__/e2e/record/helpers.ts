import type { Page } from "@playwright/test";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

export { fulfillApiSuccess, setupAuthCookie };

export const E2E_TESTER_PROFILE = {
  profileImage: null,
  nickname: "테스터",
  jobRole: "기획자",
  userStatus: "ACTIVE",
  consecutiveRecordDays: 5,
  glaring: false,
};

export const E2E_PROJECT_TAGS = [
  { projectId: 1, name: "기획", deletable: false },
  { projectId: 2, name: "디자인", deletable: false },
  { projectId: 3, name: "개발", deletable: false },
];

const AI_TAGGING_RESULT = {
  status: "SUCCESS" as const,
  primaryCategory: "PROBLEM_SOLVING" as const,
  detailTags: ["# E2E"],
};

type SetupRecordApiMocksOptions = {
  dailyGroups?: Array<{
    titleId: number;
    projectTag: string;
    freeText: string;
    items: Array<{ scrumId: number; content: string }>;
  }>;
};

export async function setupRecordApiMocks(page: Page, options: SetupRecordApiMocksOptions = {}) {
  const { dailyGroups = [] } = options;

  await page.route("**/api/users/me", async route => {
    await route.fulfill(fulfillApiSuccess(E2E_TESTER_PROFILE));
  });

  await page.route("**/api/projects**", async route => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }

    await route.fulfill(
      fulfillApiSuccess({
        page: 0,
        size: 100,
        totalPages: 1,
        projects: E2E_PROJECT_TAGS,
      }),
    );
  });

  await page.route("**/api/calendar/daily**", async route => {
    await route.fulfill(fulfillApiSuccess({ groups: dailyGroups }));
  });

  await page.route("**/api/calendar/monthly**", async route => {
    await route.fulfill(fulfillApiSuccess({ days: [] }));
  });

  await page.route("**/api/scrums/write", async route => {
    await route.fulfill(
      fulfillApiSuccess([
        {
          projectName: "기획",
          freeText: "E2E 테스트 리팩토링",
          scrums: [{ scrumId: 101, content: "Playwright 테스트 코드 개선" }],
        },
      ]),
    );
  });

  await page.route(/\/api\/scrums\/daily(\?|$)/, async route => {
    if (route.request().method() === "PUT") {
      await route.fulfill(fulfillApiSuccess(null));
      return;
    }

    await route.continue();
  });

  await page.route("**/api/scrums/competencies", async route => {
    await route.fulfill(fulfillApiSuccess(null));
  });

  await page.route("**/api/star-records/bulk", async route => {
    await route.fulfill(
      fulfillApiSuccess({
        items: [{ scrumId: 101, starRecordId: 1 }],
      }),
    );
  });

  await page.route(/\/api\/star-records\/\d+\/steps\//, async route => {
    await route.fulfill(fulfillApiSuccess(null));
  });

  await page.route(/\/api\/star-records\/\d+\/images(\/|$|\?)/, async route => {
    if (route.request().method() === "GET") {
      await route.fulfill(fulfillApiSuccess([]));
      return;
    }

    await route.fulfill(fulfillApiSuccess(null));
  });

  await page.route(/\/api\/star-records\/\d+\/ai-tagging\/status/, async route => {
    await route.fulfill(fulfillApiSuccess({ status: "SUCCESS" }));
  });

  await page.route(/\/api\/star-records\/\d+\/ai-tagging\/result/, async route => {
    await route.fulfill(fulfillApiSuccess(AI_TAGGING_RESULT));
  });

  await page.route(/\/api\/star-records\/\d+\/ai-tagging$/, async route => {
    if (route.request().method() === "POST") {
      await route.fulfill(fulfillApiSuccess(null));
      return;
    }

    await route.continue();
  });

  await page.route("**/api/star-records/home-summary", async route => {
    await route.fulfill(
      fulfillApiSuccess({
        isFirstStar: false,
        reportModal: { show: false, type: null },
      }),
    );
  });
}

export async function activateRecordFlow(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("record-flow-active", "1");
  });
}

export async function gotoRecordPage(page: Page, path = "/record") {
  await setupAuthCookie(page);
  await activateRecordFlow(page);
  await setupRecordApiMocks(page);

  await page.goto(path, { waitUntil: "domcontentloaded" });

  if (path.startsWith("/record/")) {
    await page.waitForURL(new RegExp(`${path.replace("/", "\\/")}(\\?.*)?$`));
  }
}
