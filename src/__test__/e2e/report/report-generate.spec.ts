import { expect, test } from "@playwright/test";

import { fulfillApiSuccess, gotoReportPage, MOCK_REPORT_ID_GENERATE } from "./helpers";

const MINI_GENERATE_PATH = `/report/generate?type=mini&reportId=${MOCK_REPORT_ID_GENERATE}`;
const CAREER_GENERATE_PATH = `/report/generate?type=career&reportId=${MOCK_REPORT_ID_GENERATE}`;

test.describe("리포트 생성 페이지", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  // webkit(Mobile Safari)은 useSearchParams + Suspense 조합의 hydration 타이밍 이슈로 건너뜀
  test.beforeEach(({ browserName }) => {
    test.skip(browserName === "webkit", "webkit: Suspense hydration timing issue");
  });

  test("미니 리포트 생성 중 타이틀이 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    // Suspense 해제 후 GeneratePage 렌더까지 webkit에서 느릴 수 있어 여유 있게 대기
    await expect(page.getByText("미니 리포트를 생성하고 있어요!")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("최대 1분 정도 소요될 수 있어요.")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("커리어 리포트 생성 중 타이틀이 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, CAREER_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByText("커리어 리포트를 생성하고 있어요!")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("최대 1분 정도 소요될 수 있어요.")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("진행률 텍스트가 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByText(/\d+% 완료/)).toBeVisible({ timeout: 20_000 });
  });

  test("리포트 생성 중 캐릭터 이미지가 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByAltText("리포트 생성 중")).toBeVisible({ timeout: 20_000 });
  });

  test("생성 완료(SUCCESS) 시 미니 리포트 상세 페이지로 이동해야 한다", async ({ page }) => {
    // SUCCESS → 2초 딜레이 후 /report/mini/{id}로 router.push 이동
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "SUCCESS" });
    await expect(page).not.toHaveURL(/\/report\/generate/, { timeout: 15_000 });
  });

  test("생성 완료(SUCCESS) 시 커리어 리포트 상세 페이지로 이동해야 한다", async ({ page }) => {
    await gotoReportPage(page, CAREER_GENERATE_PATH, { generateStatus: "SUCCESS" });
    await expect(page).not.toHaveURL(/\/report\/generate/, { timeout: 15_000 });
  });

  test("생성 실패(FAILED) + retry 불가 시 생성 페이지를 벗어나야 한다", async ({ page }) => {
    // FAILED + retryAvailable=false → router.replace("/report/create")

    await gotoReportPage(page, MINI_GENERATE_PATH);

    await page.route(/\/api\/reports\/\d+\/status/, async route => {
      await route.fulfill(
        fulfillApiSuccess({
          reportId: MOCK_REPORT_ID_GENERATE,
          status: "FAILED",
          retryAvailable: false,
        }),
      );
    });

    await expect(page).not.toHaveURL(/\/report\/generate/, { timeout: 15_000 });
  });
});
