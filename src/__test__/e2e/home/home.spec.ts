import { expect, type Page, test } from "@playwright/test";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

const MOCK_USER = {
  profileImage: null,
  nickname: "테스트유저",
  jobRole: "개발자",
  userStatus: "취준",
  consecutiveRecordDays: 0,
  glaring: false,
  joinedAt: "2026-01-01",
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
    await expect(page.getByText(/님의 강점을 확인해보세요/)).toBeVisible();
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

test.describe("알림 허용 모달 (홈 화면 추가 유저)", () => {
  type NotificationMockOptions = {
    standalone: boolean;
    permission: NotificationPermission;
    asked?: boolean;
  };

  // Notification·standalone(display-mode) 모킹, requestPermission 호출 여부는 window에 기록
  const mockNotification = (page: Page, options: NotificationMockOptions) =>
    page.addInitScript(({ standalone, permission, asked }) => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = permission;
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "default";
          };
        },
        configurable: true,
        writable: true,
      });

      const originalMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query: string) =>
        query === "(display-mode: standalone)"
          ? ({ ...originalMatchMedia(query), matches: standalone } as MediaQueryList)
          : originalMatchMedia(query);

      if (asked) localStorage.setItem("notification_asked", "true");
      else localStorage.removeItem("notification_asked");
    }, options);

  const wasRequested = (page: Page) =>
    page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );

  const modalTitle = "커리어 기록 알림을 설정할까요?";

  test("홈 화면 추가 유저가 아니면 모달이 표시되지 않는다", async ({ page }) => {
    await mockNotification(page, { standalone: false, permission: "default" });
    await waitForPage(page);
    await page.waitForTimeout(500);

    await expect(page.getByText(modalTitle)).not.toBeVisible();
  });

  test("알림 허용 클릭 시 권한을 요청하고 다시 묻지 않도록 저장한다", async ({ page }) => {
    await mockNotification(page, { standalone: true, permission: "default" });
    await waitForPage(page);

    await expect(page.getByText(modalTitle)).toBeVisible();
    await page.getByRole("button", { name: "알림 허용" }).click();

    await expect(page.getByText(modalTitle)).not.toBeVisible();
    expect(await wasRequested(page)).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem("notification_asked"))).toBe("true");
  });

  test("건너뛰기 클릭 시 권한을 요청하지 않고 다시 묻지 않도록 저장한다", async ({ page }) => {
    await mockNotification(page, { standalone: true, permission: "default" });
    await waitForPage(page);

    await page.getByRole("button", { name: "건너뛰기" }).click();

    await expect(page.getByText(modalTitle)).not.toBeVisible();
    expect(await wasRequested(page)).toBe(false);
    expect(await page.evaluate(() => localStorage.getItem("notification_asked"))).toBe("true");
  });

  test("이미 물어본 유저에게는 모달이 표시되지 않는다", async ({ page }) => {
    await mockNotification(page, { standalone: true, permission: "default", asked: true });
    await waitForPage(page);
    await page.waitForTimeout(500);

    await expect(page.getByText(modalTitle)).not.toBeVisible();
  });

  test("알림 권한이 denied이면 모달이 표시되지 않는다", async ({ page }) => {
    await mockNotification(page, { standalone: true, permission: "denied" });
    await waitForPage(page);
    await page.waitForTimeout(500);

    await expect(page.getByText(modalTitle)).not.toBeVisible();
  });
});

test.describe("리포트 생성 모달", () => {
  const PENDING_REPORT_MODAL_KEY = "pending-report-modal";

  test("기록 완료 후 저장된 리포트 모달이 홈 진입 시 표시된다", async ({ page }) => {
    await page.addInitScript(key => {
      window.sessionStorage.setItem(key, "FULL");
    }, PENDING_REPORT_MODAL_KEY);

    await waitForPage(page);

    await expect(page.getByText("커리어 리포트를 발행해보세요")).toBeVisible();
    const pendingType = await page.evaluate(
      key => window.sessionStorage.getItem(key),
      PENDING_REPORT_MODAL_KEY,
    );
    expect(pendingType).toBeNull();
  });

  test("홈 진입 후 늦게 도착한 리포트 모달도 표시된다", async ({ page }) => {
    await waitForPage(page);
    await expect(page.getByText("리포트를 발행해보세요")).toBeHidden();

    await page.evaluate(key => {
      window.sessionStorage.setItem(key, "MINI");
      window.dispatchEvent(new Event("pending-report-modal-saved"));
    }, PENDING_REPORT_MODAL_KEY);

    await expect(page.getByText("커리어 미니 리포트를 발행해보세요")).toBeVisible();
  });

  test("다음에 보기를 누르면 모달이 닫힌다", async ({ page }) => {
    await page.addInitScript(key => {
      window.sessionStorage.setItem(key, "MINI");
    }, PENDING_REPORT_MODAL_KEY);

    await waitForPage(page);
    await page.getByRole("button", { name: "다음에 보기" }).click();

    await expect(page.getByText("커리어 미니 리포트를 발행해보세요")).toBeHidden();
  });

  test("리포트 만들기를 누르면 리포트 페이지로 이동한다", async ({ page }) => {
    await page.addInitScript(key => {
      window.sessionStorage.setItem(key, "FULL");
    }, PENDING_REPORT_MODAL_KEY);

    await waitForPage(page);
    await page.getByRole("button", { name: "리포트 만들기" }).click();

    await expect(page).toHaveURL(/\/report/);
  });
});
