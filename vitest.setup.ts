import "@testing-library/jest-dom";

import { afterEach, beforeEach, vi } from "vitest";

Object.defineProperty(window, "Notification", {
  value: {
    permission: "default",
    requestPermission: vi.fn().mockResolvedValue("default"),
  },
  writable: true,
});

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
  window.sessionStorage.clear();
});
