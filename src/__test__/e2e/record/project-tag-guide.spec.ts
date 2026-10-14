import { expect, test } from "@playwright/test";

import { gotoRecordPage } from "./helpers";

const GUIDE_SEEN_KEY = "record-project-tag-add-guide-seen";
const GUIDE_CHIP_TEXT = "ex. 졸업 프로젝트";

test.describe("기록하기 - 프로젝트 태그 첫 추가 가이드", () => {
  test.beforeEach(async ({ page }) => {
    await gotoRecordPage(page, "/record/today-task");
    await expect(page.getByTestId("add-project-button")).toBeVisible();
  });

  test("처음 추가를 누르면 예시 칩이 표시되고, 누르면 빈 입력 상태로 전환되어야 한다", async ({
    page,
  }) => {
    await page.getByTestId("add-project-button").click();
    const projectSheet = page.getByRole("dialog");
    const addButton = projectSheet.getByRole("button", { name: "추가", exact: true });

    await addButton.click();

    const guideChip = projectSheet.getByRole("button", { name: GUIDE_CHIP_TEXT });
    await expect(guideChip).toBeVisible();
    await expect(addButton).toBeDisabled();
    await expect(projectSheet.getByRole("textbox")).toHaveCount(0);

    await guideChip.click();

    await expect(guideChip).toBeHidden();
    const tagInput = projectSheet.getByRole("textbox");
    await expect(tagInput).toBeVisible();
    await expect(tagInput).toHaveValue("");
    await expect(tagInput).toBeFocused();

    const isGuideSeen = await page.evaluate(
      key => window.localStorage.getItem(key),
      GUIDE_SEEN_KEY,
    );
    expect(isGuideSeen).toBe("true");
  });

  test("가이드를 이미 본 경우 추가를 누르면 바로 입력 상태가 되어야 한다", async ({ page }) => {
    await page.evaluate(key => window.localStorage.setItem(key, "true"), GUIDE_SEEN_KEY);

    await page.getByTestId("add-project-button").click();
    const projectSheet = page.getByRole("dialog");
    await projectSheet.getByRole("button", { name: "추가", exact: true }).click();

    await expect(projectSheet.getByRole("button", { name: GUIDE_CHIP_TEXT })).toHaveCount(0);
    await expect(projectSheet.getByRole("textbox")).toBeVisible();
  });

  test("가이드 칩이 떠 있을 때 기존 태그를 선택하면 가이드가 사라져야 한다", async ({ page }) => {
    await page.getByTestId("add-project-button").click();
    const projectSheet = page.getByRole("dialog");
    const addButton = projectSheet.getByRole("button", { name: "추가", exact: true });

    await addButton.click();
    await expect(projectSheet.getByRole("button", { name: GUIDE_CHIP_TEXT })).toBeVisible();

    await projectSheet.getByText("기획", { exact: true }).click();

    await expect(projectSheet.getByRole("button", { name: GUIDE_CHIP_TEXT })).toHaveCount(0);
    await expect(addButton).toBeEnabled();

    const isGuideSeen = await page.evaluate(
      key => window.localStorage.getItem(key),
      GUIDE_SEEN_KEY,
    );
    expect(isGuideSeen).toBeNull();
  });
});
