import { expect, test } from "@playwright/test";

import { gotoRecordPage } from "./helpers";

test.describe("기록하기 플로우 - 전체 성공 시나리오", () => {
  test.describe.configure({ mode: "serial", timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    await gotoRecordPage(page);
  });

  test("사용자가 진입 페이지에서 시작하여 최종 AI 분석 결과까지 도달할 수 있어야 한다", async ({
    page,
  }) => {
    await expect(page.getByText("테스터님의 소중한 경험을")).toBeVisible();
    await page.getByRole("button", { name: "기록하러 가기" }).click();
    await expect(page).toHaveURL(/\/record\/today-task/);

    await expect(page.getByText("프로젝트", { exact: true })).toBeVisible();
    await page.getByTestId("add-project-button").click();

    await page.getByText("기획", { exact: true }).click();
    await page.getByTestId("project-sheet-next-button").click();

    await page.getByPlaceholder(/ex\..*작업/).fill("E2E 테스트 리팩토링");
    await page.getByTestId("project-sheet-next-button").click();

    const projectSheet = page.getByRole("dialog");
    await projectSheet.getByText("어드민 페이지 로그인 화면 작업").click();
    await projectSheet.locator("textarea").fill("Playwright 테스트 코드 개선");
    await page.getByTestId("project-sheet-next-button").click();

    await expect(page.getByText("E2E 테스트 리팩토링")).toBeVisible();

    await page.getByTestId("header-right-button").click();
    await expect(page).toHaveURL(/\/record\/deep-log/, { timeout: 15_000 });
    await expect(page.getByRole("status", { name: "로딩 중" })).toBeHidden({ timeout: 20_000 });

    await expect(page.getByText("심화 기록할 작업을 골라주세요")).toBeVisible({
      timeout: 15_000,
    });
    await page.getByRole("button", { name: "Playwright 테스트 코드 개선" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "진행하기" }).click();
    await expect(page).toHaveURL(/\/record\/select-skills/, { timeout: 15_000 });

    await expect(page.getByText("직무 역량을 달아주세요")).toBeVisible();
    await page.getByRole("article").getByRole("button", { name: "역량 선택" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitemradio", { name: "문제해결/개선" }).click();
    await page.getByRole("button", { name: "심화 기록하기" }).click();
    await expect(page).toHaveURL(/\/record\/star-log/, { timeout: 15_000 });

    await expect(page.getByRole("heading", { level: 1, name: "상황/과제" })).toBeVisible();
    await page.locator("textarea").fill("테스트 환경이 불안정하여 개선이 필요한 상황");
    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "행동" })).toBeVisible();
    await page.locator("textarea").fill("Playwright의 의미론적 셀렉터와 data-testid를 도입함");
    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "결과" })).toBeVisible();
    await page.locator("textarea").fill("테스트의 신뢰성이 높아지고 유지보수가 쉬워짐");
    await page.getByRole("button", { name: "완료" }).click();

    await expect(page).toHaveURL(/\/record\/skill-tagging/, { timeout: 20_000 });
    await expect(page.getByText("오늘의 경험이")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("으로 기록됐어요")).toBeVisible();
  });
});
