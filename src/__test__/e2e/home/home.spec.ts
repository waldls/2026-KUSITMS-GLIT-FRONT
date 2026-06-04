import { expect, type Page, test } from "@playwright/test";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

const MOCK_USER = {
  profileImage: null,
  nickname: "테스트유저",
  jobRole: "개발자",
  userStatus: "취준",
  consecutiveRecordDays: 0,
  glaring: false,
};

const waitForPage = async (page: Page) => {
  await setupAuthCookie(page);

  await page.route(/\/api\//, async route => {
    const isGetMe =
      route.request().method() === "GET" && route.request().url().includes("/api/users/me");

    await route.fulfill(fulfillApiSuccess(isGetMe ? MOCK_USER : null));
  });

  await page.goto("/");
  await page.waitForSelector("nav", { timeout: 15000 });
};

test.describe("홈 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await waitForPage(page);
  });

  test("홈 페이지가 로드된다", async ({ page }) => {
    await expect(page).toHaveURL("/");
  });

  test("강점 확인 안내 문구가 표시된다", async ({ page }) => {
    await expect(page.locator("p").filter({ hasText: /님의 강점을 확인해보세요/ })).toBeVisible();
  });

  test("기록하러 가기 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "기록하러 가기" })).toBeVisible();
  });

  test("기록하러 가기 링크가 /record 경로를 가리킨다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "기록하러 가기" })).toHaveAttribute(
      "href",
      "/record",
    );
  });

  test("하단 네비게이션 바가 표시된다", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
  });
});

test.describe("알림 권한 요청 (NotificationPermission)", () => {
  test("최초 방문 후 화면 클릭 시 알림 권한 요청이 호출된다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "default";
          };
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));

    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();

    await page.waitForFunction(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
      { timeout: 5000 },
    );

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(true);
  });

  test("이미 알림을 요청한 경우 재요청하지 않는다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "default";
          };
        },
        configurable: true,
        writable: true,
      });
      localStorage.setItem("notification_asked", "true");
    });

    await waitForPage(page);
    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();
    await page.waitForTimeout(500);

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(false);
  });

  test("알림 권한이 denied이면 요청하지 않는다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "denied";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "denied";
          };
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));
    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();
    await page.waitForTimeout(500);

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(false);
  });

  test("첫 클릭 시 notification_asked가 localStorage에 저장된다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => "granted";
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));

    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();

    const asked = await page.evaluate(() => localStorage.getItem("notification_asked"));
    expect(asked).toBe("true");
  });
});
