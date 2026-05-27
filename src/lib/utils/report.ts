import type { CSSProperties } from "react";

export const getProgressStep = (progress: number): { delay: number; step: number } => {
  if (progress < 20) return { delay: 80, step: 3 };
  if (progress < 50) return { delay: 220, step: 2 };
  if (progress < 75) return { delay: 600, step: 1 };
  if (progress < 90) return { delay: 1400, step: 1 };
  return { delay: 3000, step: 1 };
};

// ScrumDatePopover를 선택된 날짜 셀 위에 띄우기 위한 top/left 계산
// 262px 너비 팝오버 기준, 셀 중앙 정렬 + 컨테이너 경계 클램프
export const getScrumPopoverStyle = (container: HTMLElement): CSSProperties | null => {
  const cell = container.querySelector<HTMLElement>(
    '.swiper-slide-active td[data-selected="true"]',
  );
  if (!cell) return null;
  const cr = container.getBoundingClientRect();
  const dr = cell.getBoundingClientRect();
  return {
    top: dr.top - cr.top,
    left: Math.max(0, Math.min(dr.left - cr.left + dr.width / 2 - 131, cr.width - 262)),
  };
};
