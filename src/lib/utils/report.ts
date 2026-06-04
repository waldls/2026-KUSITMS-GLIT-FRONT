import type { CSSProperties } from "react";

export const getProgressStep = (progress: number): { delay: number; step: number } => {
  if (progress < 20) return { delay: 80, step: 3 };
  if (progress < 50) return { delay: 220, step: 2 };
  if (progress < 75) return { delay: 600, step: 1 };
  if (progress < 90) return { delay: 1400, step: 1 };
  return { delay: 3000, step: 1 };
};

// ScrumDatePopover를 선택된 날짜 셀 위/아래에 띄우기 위한 top/left 계산
// 262px 너비 팝오버 기준, 셀 중앙 정렬 + 컨테이너 경계 클램프
// 첫 번째 주(row)인 경우 잘림 방지를 위해 셀 아래에 위치
export const getScrumPopoverStyle = (
  container: HTMLElement,
): { style: CSSProperties; placement: "top" | "bottom" } | null => {
  const cell = container.querySelector<HTMLElement>(
    '.swiper-slide-active td[data-selected="true"]',
  );
  if (!cell) return null;
  const cr = container.getBoundingClientRect();
  const dr = cell.getBoundingClientRect();
  const left = Math.max(0, Math.min(dr.left - cr.left + dr.width / 2 - 131, cr.width - 262));

  const row = cell.closest("tr");
  const isFirstRow = row?.parentElement?.firstElementChild === row;

  if (isFirstRow) {
    return { style: { top: dr.bottom - cr.top + 8, left }, placement: "bottom" };
  }
  return { style: { top: dr.top - cr.top, left }, placement: "top" };
};
