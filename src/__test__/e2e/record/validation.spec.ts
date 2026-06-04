import { expect, test } from "@playwright/test";

import { gotoRecordPage, setupRecordApiMocks } from "./helpers";

test.describe("기록하기 플로우 - 유효성 검사 및 예외 처리", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await gotoRecordPage(page, "/record/today-task");
    await expect(page.getByTestId("add-project-button")).toBeVisible();
  });

  test("필수 입력값이 누락된 경우 다음 단계 버튼이 비활성화되어야 한다", async ({ page }) => {
    await page.getByTestId("add-project-button").click();
    await page.getByText("기획", { exact: true }).click();
    await page.getByTestId("project-sheet-next-button").click();

    const titleInput = page.getByPlaceholder(/ex\..*작업/);
    await expect(titleInput).toHaveValue("");

    const nextButton = page.getByTestId("project-sheet-next-button");
    await expect(nextButton).toBeDisabled();

    await titleInput.fill("유효한 제목");
    await expect(nextButton).toBeEnabled();
  });

  test("이미 기록이 존재하는 날짜를 선택하면 중복 기록 방지 안내가 표시되어야 한다", async ({
    page,
  }) => {
    await gotoRecordPage(page, "/record/today-task");
    await setupRecordApiMocks(page, {
      dailyGroups: [
        {
          titleId: 1,
          projectTag: "기획",
          freeText: "기존 업무",
          items: [{ scrumId: 1, content: "이미 완료된 작업" }],
        },
      ],
    });
    await page.reload();
    await page.waitForURL(/\/record\/today-task/);

    await expect(page.getByText("기존 업무")).toBeVisible();
    await page.getByTestId("header-right-button").click();
    await expect(page.getByText("오늘은 이미 기록이 있어요")).toBeVisible();
  });
});
