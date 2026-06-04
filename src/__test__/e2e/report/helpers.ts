import type { Page } from "@playwright/test";

import type { ReportStatus } from "@/types/report/report";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

export { fulfillApiSuccess, setupAuthCookie };

export const MOCK_REPORT_ID_GENERATE = 99;

type ReportApiMockOptions = {
  generateStatus?: ReportStatus;
};

export async function setupReportApiMocks(page: Page, options: ReportApiMockOptions = {}) {
  const { generateStatus } = options;

  if (generateStatus !== undefined) {
    await page.route(/\/api\/reports\/\d+\/status/, async route => {
      await route.fulfill(
        fulfillApiSuccess({
          reportId: MOCK_REPORT_ID_GENERATE,
          status: generateStatus,
          retryAvailable: null,
        }),
      );
    });
  }

  await page.route(/\/api\/reports\/\d+\/retry/, async route => {
    await route.fulfill(fulfillApiSuccess({ reportId: MOCK_REPORT_ID_GENERATE }));
  });
}

export async function gotoReportPage(page: Page, path: string, mockOptions?: ReportApiMockOptions) {
  await setupAuthCookie(page);
  await setupReportApiMocks(page, mockOptions);
  // "load" 이벤트까지 대기해야 React 번들이 다운로드되어 Suspense 해제가 안정적으로 진행됨
  await page.goto(path, { waitUntil: "load" });
}
