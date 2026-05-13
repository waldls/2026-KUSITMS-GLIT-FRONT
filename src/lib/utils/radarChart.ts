import {
  CHART_MARGIN,
  INNER_CORNER_ROUNDING,
  OUTER_RADIUS_PERCENT,
  RADAR_COUNT,
} from "@/constants/radarChart";

export interface Point {
  x: number;
  y: number;
}

export const axisAngle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / RADAR_COUNT;
export const notchAngle = (i: number) => -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / RADAR_COUNT;

export const getResponsiveOuterRadius = (width: number, height: number) =>
  (Math.max(0, Math.min(width - CHART_MARGIN * 2, height - CHART_MARGIN * 2)) / 2) *
  (OUTER_RADIUS_PERCENT / 100);

export const buildStarPoints = (cx: number, cy: number, outerR: number, innerR: number) => ({
  outerPts: Array.from({ length: RADAR_COUNT }, (_, i) => ({
    x: cx + outerR * Math.cos(axisAngle(i)),
    y: cy + outerR * Math.sin(axisAngle(i)),
  })),
  notchPts: Array.from({ length: RADAR_COUNT }, (_, i) => ({
    x: cx + innerR * Math.cos(notchAngle(i)),
    y: cy + innerR * Math.sin(notchAngle(i)),
  })),
});

export const moveToward = (from: Point, to: Point, distance: number): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: from.x + (dx / length) * distance,
    y: from.y + (dy / length) * distance,
  };
};

export function roundedInnerStarPath(outerPts: Point[], notchPts: Point[]): string {
  const n = outerPts.length;
  const d: string[] = [`M ${outerPts[0].x},${outerPts[0].y}`];

  for (let i = 0; i < n; i++) {
    const outer = outerPts[i];
    const notch = notchPts[i];
    const next = outerPts[(i + 1) % n];
    const inLength = Math.hypot(notch.x - outer.x, notch.y - outer.y);
    const outLength = Math.hypot(next.x - notch.x, next.y - notch.y);
    const rounding = Math.min(inLength, outLength) * INNER_CORNER_ROUNDING;
    const curveStart = moveToward(notch, outer, rounding);
    const curveEnd = moveToward(notch, next, rounding);

    d.push(`L ${curveStart.x},${curveStart.y}`);
    d.push(`Q ${notch.x},${notch.y} ${curveEnd.x},${curveEnd.y}`);
    d.push(`L ${next.x},${next.y}`);
  }

  return d.join(" ") + " Z";
}

export function sharpTipStarPath(outerPts: Point[], notchPts: Point[]): string {
  const n = outerPts.length;
  const d: string[] = [`M ${outerPts[0].x},${outerPts[0].y}`];
  for (let i = 0; i < n; i++) {
    const notch = notchPts[i];
    const next = outerPts[(i + 1) % n];
    d.push(`Q ${notch.x},${notch.y} ${next.x},${next.y}`);
  }
  return d.join(" ") + " Z";
}
