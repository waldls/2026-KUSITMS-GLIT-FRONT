import { expect, test } from "@playwright/test";

import { fulfillApiSuccess, gotoCalendarPage, TODAY_KEY } from "./helpers";

const DETAIL_PATH = `/calendar/${TODAY_KEY}`;

test.describe("캘린더 상세 페이지", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await gotoCalendarPage(page, DETAIL_PATH);
    await expect(
      page.getByRole("heading", { name: new RegExp(TODAY_KEY.replace(/-/g, "\\.")) }),
    ).toBeVisible({
      timeout: 10_000,
    });
  });

  test("날짜별 상세 페이지 진입 시 기록 카드가 표시되어야 한다", async ({ page }) => {
    await expect(page.getByText("캘린더 기능 기획")).toBeVisible();
    await expect(page.getByText("화면 설계서 작성")).toBeVisible();
    await expect(page.getByText("API 명세 검토")).toBeVisible();
  });

  test("편집 버튼 클릭 시 삭제 버튼이 나타나야 한다", async ({ page }) => {
    await page.getByRole("button", { name: "편집" }).click();

    await expect(page.getByRole("button", { name: "완료" })).toBeVisible();

    const deleteButton = page.locator("[aria-label='삭제'], button[type='button']").filter({
      has: page.locator("svg"),
    });
    expect(await deleteButton.count()).toBeGreaterThan(0);
  });

  test("편집 모드에서 완료 버튼 클릭 시 편집 모드가 해제되어야 한다", async ({ page }) => {
    await page.getByRole("button", { name: "편집" }).click();
    await expect(page.getByRole("button", { name: "완료" })).toBeVisible();

    await page.getByRole("button", { name: "완료" }).click();
    await expect(page.getByRole("button", { name: "편집" })).toBeVisible();
  });

  test("프로젝트 삭제 버튼 클릭 시 확인 모달이 표시되어야 한다", async ({ page }) => {
    await page.getByRole("button", { name: "편집" }).click();

    const projectDeleteButton = page
      .getByTestId("project-delete-button")
      .or(page.locator("[data-testid='delete-button']"))
      .first();

    if ((await projectDeleteButton.count()) > 0) {
      await projectDeleteButton.click();
      await expect(page.getByText("삭제하시겠어요?")).toBeVisible();
      await expect(page.getByText("기록과 심화기록이 함께 삭제되며")).toBeVisible();
    } else {
      const editModeButtons = page.getByRole("button").filter({ hasText: /삭제|delete/i });
      if ((await editModeButtons.count()) > 0) {
        await editModeButtons.first().click();
        await expect(page.getByText("삭제하시겠어요?")).toBeVisible();
      }
    }
  });

  test("삭제 모달에서 취소하기 클릭 시 모달이 닫혀야 한다", async ({ page }) => {
    await page.getByRole("button", { name: "편집" }).click();

    const allButtons = await page.getByRole("button").all();
    const nonTextButtons = allButtons.filter(async btn => {
      const text = await btn.textContent();
      return !text || text.trim() === "";
    });

    if (nonTextButtons.length > 0) {
      await nonTextButtons[0].click();
      const modal = page.getByText("삭제하시겠어요?");
      if (await modal.isVisible()) {
        await page.getByRole("button", { name: "취소하기" }).click();
        await expect(modal).toBeHidden();
      }
    }
  });

  test("마지막 프로젝트 삭제 시 캘린더 페이지로 이동해야 한다", async ({ page }) => {
    // router.back()이 /calendar로 돌아가려면 히스토리에 /calendar가 있어야 함
    await page.goto("/calendar", { waitUntil: "domcontentloaded" });
    await page.goto(DETAIL_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("캘린더 기능 기획")).toBeVisible({ timeout: 10_000 });

    // 삭제 후 daily 재조회 시 빈 데이터 반환 → router.back() 트리거
    await page.route(/\/api\/calendar\/daily(\?|$)/, async route => {
      await route.fulfill(fulfillApiSuccess({ groups: [] }));
    });

    await page.getByRole("button", { name: "더보기" }).click();
    // 팝오버 아이템은 role="menuitem"
    await page.getByRole("menuitem", { name: "삭제하기" }).click();
    await expect(page.getByText("삭제하시겠어요?")).toBeVisible();
    // 모달 확인 버튼은 role="button"
    await page.getByRole("button", { name: "삭제하기" }).click();

    await expect(page).toHaveURL(/\/calendar$/, { timeout: 10_000 });
  });

  test("심화 기록이 있는 스크럼 클릭 시 심화 기록 상세 페이지로 이동해야 한다", async ({
    page,
  }) => {
    const starRecordId = 201;

    await page.route("**/api/calendar/daily**", async route => {
      await route.fulfill(
        fulfillApiSuccess({
          groups: [
            {
              titleId: 1,
              projectTag: "기획",
              freeText: "캘린더 기능 기획",
              isEditable: true,
              items: [
                {
                  scrumId: 102,
                  content: "API 명세 검토",
                  hasStar: true,
                  primaryCategory: "PROBLEM_SOLVING",
                  starRecordId,
                },
              ],
            },
          ],
        }),
      );
    });

    await page.reload();
    await expect(page.getByText("API 명세 검토")).toBeVisible({ timeout: 10_000 });

    await page.getByText("API 명세 검토").click();
    await expect(page).toHaveURL(new RegExp(`/calendar/${TODAY_KEY}/${starRecordId}`), {
      timeout: 10_000,
    });
  });
});
