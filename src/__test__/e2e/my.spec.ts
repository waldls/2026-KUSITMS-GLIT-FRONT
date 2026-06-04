import { expect, type Page, test } from "@playwright/test";

const FAKE_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksInN1YiI6InRlc3QifQ.fakesig";

const MOCK_USER = {
  profileImage: null,
  nickname: "테스트유저",
  jobRole: "개발자",
  userStatus: "재학중",
  consecutiveRecordDays: 5,
  glaring: false,
};

const waitForPage = async (page: Page) => {
  await page
    .context()
    .addCookies([
      { name: "accessToken", value: FAKE_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);

  await page.route("https://stg-api.glit.today/**", async route => {
    const isGetMe =
      route.request().method() === "GET" && route.request().url().includes("/api/users/me");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: isGetMe ? MOCK_USER : null }),
    });
  });

  await page.goto("/");
  await page.waitForSelector("nav", { timeout: 15000 });
  await page.goto("/my");
  await page.waitForSelector("nav", { timeout: 15000 });
};

test.describe("마이페이지", () => {
  test.beforeEach(async ({ page }) => {
    await waitForPage(page);
  });

  test("마이페이지가 로드된다", async ({ page }) => {
    await expect(page).toHaveURL("/my");
  });

  test("헤더에 '마이페이지' 타이틀이 표시된다", async ({ page }) => {
    await expect(page.getByText("마이페이지")).toBeVisible();
  });

  test("프로필 관리 링크가 /my/profile을 가리킨다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "프로필 관리" })).toHaveAttribute(
      "href",
      "/my/profile",
    );
  });

  test("서비스 이용 가이드 링크가 /my/guide를 가리킨다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "서비스 이용 가이드" })).toHaveAttribute(
      "href",
      "/my/guide",
    );
  });

  test("알림설정 링크가 /my/alarm을 가리킨다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "알림설정" })).toHaveAttribute("href", "/my/alarm");
  });

  test("하단 네비게이션 바가 표시된다", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
  });
});

test.describe("로그아웃 모달 (MenuSection)", () => {
  test.beforeEach(async ({ page }) => {
    await waitForPage(page);
  });

  test("로그아웃 버튼 클릭 시 로그아웃 확인 모달이 열린다", async ({ page }) => {
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page.getByText("로그아웃 하시겠어요?")).toBeVisible();
  });

  test("로그아웃 모달에서 취소하기 클릭 시 모달이 닫힌다", async ({ page }) => {
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page.getByText("로그아웃 하시겠어요?")).toBeVisible();
    await page.getByRole("button", { name: "취소하기" }).click();
    await expect(page.getByText("로그아웃 하시겠어요?")).not.toBeVisible();
  });

  test("로그아웃 모달에서 로그아웃 확인 클릭 시 /auth로 이동한다", async ({ page }) => {
    await page.getByRole("button", { name: "로그아웃" }).click();
    await page.getByRole("button", { name: "로그아웃" }).last().click();
    await expect(page).toHaveURL("/auth");
  });
});

test.describe("회원탈퇴 모달 (MenuSection)", () => {
  test.beforeEach(async ({ page }) => {
    await waitForPage(page);
  });

  test("회원탈퇴 버튼 클릭 시 탈퇴 확인 모달이 열린다", async ({ page }) => {
    await page.getByRole("button", { name: "회원탈퇴" }).click();
    await expect(page.getByText("쌓아온 빛이 사라져요")).toBeVisible();
  });

  test("회원탈퇴 모달에서 취소하기 클릭 시 모달이 닫힌다", async ({ page }) => {
    await page.getByRole("button", { name: "회원탈퇴" }).click();
    await expect(page.getByText("쌓아온 빛이 사라져요")).toBeVisible();
    await page.getByRole("button", { name: "취소하기" }).click();
    await expect(page.getByText("쌓아온 빛이 사라져요")).not.toBeVisible();
  });

  test("회원탈퇴 모달에서 탈퇴하기 클릭 시 /auth로 이동한다", async ({ page }) => {
    await page.getByRole("button", { name: "회원탈퇴" }).click();
    await page.getByRole("button", { name: "탈퇴하기" }).click();
    await expect(page).toHaveURL("/auth");
  });
});
