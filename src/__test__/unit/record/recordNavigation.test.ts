import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  navigateRecord,
  RECORD_ROUTE_CHANGE_EVENT,
  replaceRecordHistory,
} from "@/lib/utils/recordNavigation";

describe("recordNavigation", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("replaceRecordHistory 호출 시 history.replaceState가 호출되어야 한다", () => {
    // prototype에서 직접 메서드를 가져와 호출하므로 prototype을 spy해야 함
    const replaceStateSpy = vi.spyOn(History.prototype, "replaceState");

    replaceRecordHistory("/record/step2");

    expect(replaceStateSpy).toHaveBeenCalled();
    // 첫 번째 인자는 state, 두 번째는 title, 세 번째는 url
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "/record/step2");

    replaceStateSpy.mockRestore();
  });

  it("navigateRecord 호출 시 history.pushState와 CustomEvent가 발생해야 한다", () => {
    window.history.replaceState(null, "", "/record");
    window.sessionStorage.setItem("record-flow-active", "1");

    const pushStateSpy = vi.spyOn(History.prototype, "pushState");
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    navigateRecord("/record/today-task");

    expect(pushStateSpy).toHaveBeenCalledWith(null, "", "/record/today-task");
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));

    const event = dispatchEventSpy.mock.calls.find(
      (call: [Event]) => (call[0] as CustomEvent).type === RECORD_ROUTE_CHANGE_EVENT,
    )?.[0] as CustomEvent;

    expect(event).toBeDefined();
    expect(event.detail.pathname).toBe("/record/today-task");

    pushStateSpy.mockRestore();
    dispatchEventSpy.mockRestore();
  });
});
