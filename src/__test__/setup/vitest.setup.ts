import "@testing-library/jest-dom";

import { vi } from "vitest";

// jsdom에 없는 브라우저 API 스텁
Object.defineProperty(window, "Notification", {
  value: {
    permission: "default",
    requestPermission: vi.fn().mockResolvedValue("default"),
  },
  writable: true,
});
