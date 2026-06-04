import { describe, expect, it } from "vitest";

import { getProgressStep, getScrumPopoverStyle } from "@/lib/utils/report";

describe("getProgressStep", () => {
  describe("각 구간별 딜레이·스텝 반환", () => {
    it("progress = 0 → delay 80, step 3", () => {
      expect(getProgressStep(0)).toEqual({ delay: 80, step: 3 });
    });

    it("progress = 10 → delay 80, step 3", () => {
      expect(getProgressStep(10)).toEqual({ delay: 80, step: 3 });
    });

    it("progress = 19 (< 20 경계) → delay 80, step 3", () => {
      expect(getProgressStep(19)).toEqual({ delay: 80, step: 3 });
    });

    it("progress = 20 (>= 20 경계) → delay 220, step 2", () => {
      expect(getProgressStep(20)).toEqual({ delay: 220, step: 2 });
    });

    it("progress = 35 → delay 220, step 2", () => {
      expect(getProgressStep(35)).toEqual({ delay: 220, step: 2 });
    });

    it("progress = 49 (< 50 경계) → delay 220, step 2", () => {
      expect(getProgressStep(49)).toEqual({ delay: 220, step: 2 });
    });

    it("progress = 50 (>= 50 경계) → delay 600, step 1", () => {
      expect(getProgressStep(50)).toEqual({ delay: 600, step: 1 });
    });

    it("progress = 62 → delay 600, step 1", () => {
      expect(getProgressStep(62)).toEqual({ delay: 600, step: 1 });
    });

    it("progress = 74 (< 75 경계) → delay 600, step 1", () => {
      expect(getProgressStep(74)).toEqual({ delay: 600, step: 1 });
    });

    it("progress = 75 (>= 75 경계) → delay 1400, step 1", () => {
      expect(getProgressStep(75)).toEqual({ delay: 1400, step: 1 });
    });

    it("progress = 80 → delay 1400, step 1", () => {
      expect(getProgressStep(80)).toEqual({ delay: 1400, step: 1 });
    });

    it("progress = 89 (< 90 경계) → delay 1400, step 1", () => {
      expect(getProgressStep(89)).toEqual({ delay: 1400, step: 1 });
    });

    it("progress = 90 (>= 90 경계) → delay 3000, step 1", () => {
      expect(getProgressStep(90)).toEqual({ delay: 3000, step: 1 });
    });

    it("progress = 95 → delay 3000, step 1", () => {
      expect(getProgressStep(95)).toEqual({ delay: 3000, step: 1 });
    });

    it("progress = 99 → delay 3000, step 1", () => {
      expect(getProgressStep(99)).toEqual({ delay: 3000, step: 1 });
    });

    it("progress = 100 → delay 3000, step 1", () => {
      expect(getProgressStep(100)).toEqual({ delay: 3000, step: 1 });
    });
  });
});

// getBoundingClientRect는 jsdom에서 항상 0을 반환하므로 직접 mock
function mockRect(element: HTMLElement, rect: Partial<DOMRect>) {
  element.getBoundingClientRect = () =>
    ({
      x: rect.left ?? 0,
      y: rect.top ?? 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      toJSON: () => {},
      ...rect,
    }) as DOMRect;
}

function buildContainer({
  isFirstRow,
  containerRect,
  cellRect,
}: {
  isFirstRow: boolean;
  containerRect: Partial<DOMRect>;
  cellRect: Partial<DOMRect>;
}) {
  const container = document.createElement("div");
  const slide = document.createElement("div");
  slide.className = "swiper-slide-active";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  if (!isFirstRow) {
    // 첫 번째 행을 추가해 테스트 대상 행이 두 번째가 되게 함
    const dummyRow = document.createElement("tr");
    dummyRow.appendChild(document.createElement("td"));
    tbody.appendChild(dummyRow);
  }

  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.setAttribute("data-selected", "true");
  row.appendChild(cell);
  tbody.appendChild(row);

  table.appendChild(tbody);
  slide.appendChild(table);
  container.appendChild(slide);

  mockRect(container, containerRect);
  mockRect(cell, cellRect);

  return container;
}

describe("getScrumPopoverStyle", () => {
  it("활성 슬라이드에 선택된 셀이 없으면 null을 반환해야 한다", () => {
    const container = document.createElement("div");
    expect(getScrumPopoverStyle(container)).toBeNull();
  });

  it(".swiper-slide-active가 없으면 null을 반환해야 한다", () => {
    // slide-active 클래스 없이 td만 있는 경우
    const container = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("data-selected", "true");
    row.appendChild(cell);
    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
    expect(getScrumPopoverStyle(container)).toBeNull();
  });

  it("선택된 셀이 첫 번째 행에 있으면 placement 'bottom'을 반환해야 한다", () => {
    const container = buildContainer({
      isFirstRow: true,
      containerRect: { top: 0, left: 0, width: 300, height: 400, bottom: 400, right: 300 },
      cellRect: { top: 60, left: 80, bottom: 80, right: 130, width: 50, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    expect(result).not.toBeNull();
    expect(result?.placement).toBe("bottom");
  });

  it("선택된 셀이 첫 번째 행이 아니면 placement 'top'을 반환해야 한다", () => {
    const container = buildContainer({
      isFirstRow: false,
      containerRect: { top: 0, left: 0, width: 300, height: 400, bottom: 400, right: 300 },
      cellRect: { top: 120, left: 80, bottom: 140, right: 130, width: 50, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    expect(result).not.toBeNull();
    expect(result?.placement).toBe("top");
  });

  it("bottom 배치 시 style.top은 cell.bottom - container.top + 8이어야 한다", () => {
    const container = buildContainer({
      isFirstRow: true,
      containerRect: { top: 10, left: 0, width: 300, height: 400, bottom: 410, right: 300 },
      cellRect: { top: 70, left: 100, bottom: 90, right: 150, width: 50, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    // top = cell.bottom - container.top + 8 = 90 - 10 + 8 = 88
    expect(result?.style.top).toBe(88);
  });

  it("top 배치 시 style.top은 cell.top - container.top이어야 한다", () => {
    const container = buildContainer({
      isFirstRow: false,
      containerRect: { top: 10, left: 0, width: 300, height: 400, bottom: 410, right: 300 },
      cellRect: { top: 120, left: 100, bottom: 140, right: 150, width: 50, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    // top = cell.top - container.top = 120 - 10 = 110
    expect(result?.style.top).toBe(110);
  });

  it("left는 0 이상 (container.width - 262) 이하로 클램프되어야 한다", () => {
    // cell이 왼쪽 끝 → left가 음수 → 0으로 클램프
    const container = buildContainer({
      isFirstRow: false,
      containerRect: { top: 0, left: 0, width: 400, height: 400, bottom: 400, right: 400 },
      cellRect: { top: 100, left: 0, bottom: 120, right: 30, width: 30, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    // left = max(0, min(0 - 0 + 15 - 131, 400 - 262)) = max(0, min(-116, 138)) = 0
    expect(result?.style.left).toBe(0);
  });

  it("left는 container 오른쪽 초과 시 (container.width - 262)로 클램프되어야 한다", () => {
    // cell이 오른쪽 끝 → left가 container.width - 262 초과 → 클램프
    const container = buildContainer({
      isFirstRow: false,
      containerRect: { top: 0, left: 0, width: 400, height: 400, bottom: 400, right: 400 },
      cellRect: { top: 100, left: 380, bottom: 120, right: 410, width: 30, height: 20 },
    });
    const result = getScrumPopoverStyle(container);
    // left = max(0, min(380 - 0 + 15 - 131, 400 - 262)) = max(0, min(264, 138)) = 138
    expect(result?.style.left).toBe(138);
  });
});
