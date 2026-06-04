import type { Page } from "@playwright/test";

import type { ApiResponse } from "@/types/api";

const MOCK_ACCESS_TOKEN = (() => {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }),
  ).toString("base64url");

  return `${header}.${payload}.e2e-signature`;
})();

export function fulfillApiSuccess<T>(data: T) {
  const body: ApiResponse<T> = {
    success: true,
    code: "OK",
    message: "success",
    data,
  };

  return {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(body),
  };
}

export async function setupAuthCookie(page: Page) {
  await page.context().addCookies([
    {
      name: "accessToken",
      value: MOCK_ACCESS_TOKEN,
      domain: "localhost",
      path: "/",
      sameSite: "Lax",
    },
  ]);
}
