import { expect, test } from "@playwright/test";

import { fulfillApiSuccess, gotoCalendarPage, MOCK_PREVIEW_SCRUMS, TODAY_KEY } from "./helpers";

test.describe("캘린더 페이지", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await gotoCalendarPage(page);
    // 월별 데이터가 로드될 때까지 대기
    await expect(page.getByText("캘린더 기능 기획")).toBeVisible({ timeout: 15_000 });
  });

  test("캘린더 페이지 진입 시 오늘 날짜의 프리뷰가 표시되어야 한다", async ({ page }) => {
    await expect(page).toHaveURL(/\/calendar/);
    await expect(page.getByText("기획", { exact: true })).toBeVisible();
  });

  test("기록이 있는 날짜에서 자세히 보기 버튼이 활성화되어야 한다", async ({ page }) => {
    const detailButton = page.getByRole("button", { name: "자세히 보기" });
    await expect(detailButton).toBeEnabled();
  });

  test("자세히 보기 버튼 클릭 시 날짜별 상세 페이지로 이동해야 한다", async ({ page }) => {
    await page.getByRole("button", { name: "자세히 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/calendar/${TODAY_KEY}`), { timeout: 10_000 });
  });

  test("기록이 없는 날짜를 선택하면 빈 상태 메시지가 표시되어야 한다", async ({ page }) => {
    // data-day 속성으로 정확히 현재 월의 6월 3일 버튼을 타겟팅
    const june3Button = page.locator('td[data-day="2026-06-03"]:not([data-outside]) button');
    await june3Button.click();

    await expect(page.getByText("아직 기록이 없어요")).toBeVisible({ timeout: 10_000 });

    const detailButton = page.getByRole("button", { name: "자세히 보기" });
    await expect(detailButton).toBeDisabled();
  });

  test("프리뷰 카드에 여러 프로젝트가 표시되어야 한다", async ({ page }) => {
    // staleTime(2분) 캐시를 피하기 위해 route 등록 후 페이지를 새로 로드
    await page.route(/\/api\/calendar\/daily-preview(\?|$)/, async route => {
      await route.fulfill(
        fulfillApiSuccess({
          date: TODAY_KEY,
          titles: [
            ...MOCK_PREVIEW_SCRUMS,
            {
              titleId: 2,
              projectName: "개발",
              freeText: "API 연동 작업",
              primaryCategories: ["PROBLEM_SOLVING"],
              scrumCount: 1,
              hasStarAny: true,
            },
          ],
        }),
      );
    });

    await page.reload();
    await expect(page.getByText("API 연동 작업")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("개발")).toBeVisible();
  });
});
