"use client";

import React from "react";
import {
  type BaseTickContentProps,
  Customized,
  PolarAngleAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  useChartHeight,
  useChartWidth,
} from "recharts";

import {
  AXIS_STROKE,
  AXIS_STROKE_WIDTH,
  AXIS_TICK_GAP,
  AXIS_TICK_INSET,
  CHART_MARGIN,
  GRID_RATIOS,
  INNER_RATIO,
  OUTER_RADIUS,
  RADAR_CATEGORIES,
} from "@/constants/radarChart";
import { RadarChartData } from "@/data/radarchart";
import {
  axisAngle,
  buildStarPoints,
  getResponsiveOuterRadius,
  type Point,
  roundedInnerStarPath,
  sharpTipStarPath,
} from "@/lib/utils/radarChart";

const StarGrid = () => {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = getResponsiveOuterRadius(width, height);

  return (
    <g>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient
          id="radarFill"
          cx="14.37%"
          cy="11%"
          r="135%"
          gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="var(--color-offwhite-100, #fefefe)" />
          <stop offset="19.71%" stopColor="#bcfff6" />
          <stop offset="38.46%" stopColor="var(--color-sea-blue-300, #aefaff)" />
          <stop offset="57.69%" stopColor="#dffdff" />
          <stop offset="77.4%" stopColor="#c0fcff" />
          <stop offset="97.12%" stopColor="#26eaf1" />
        </radialGradient>
      </defs>

      {GRID_RATIOS.map((ratio, i) => {
        const { outerPts, notchPts } = buildStarPoints(
          cx,
          cy,
          outerRadius * ratio,
          outerRadius * ratio * INNER_RATIO,
        );

        return (
          <path
            key={i}
            d={roundedInnerStarPath(outerPts, notchPts)}
            fill="none"
            stroke={AXIS_STROKE}
            strokeWidth={AXIS_STROKE_WIDTH}
          />
        );
      })}

      {RADAR_CATEGORIES.map((_, i) => (
        <line
          key={`a${i}`}
          x1={cx}
          y1={cy}
          x2={cx + outerRadius * Math.cos(axisAngle(i))}
          y2={cy + outerRadius * Math.sin(axisAngle(i))}
          stroke={AXIS_STROKE}
          strokeWidth={AXIS_STROKE_WIDTH}
        />
      ))}
    </g>
  );
};

interface StarShapeProps {
  points?: Point[];
}

type AxisTickProps = BaseTickContentProps;

function AxisTickInner({ x = 0, y = 0, textAnchor, payload }: AxisTickProps) {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;
  const baseX = typeof x === "number" ? x : Number(x);
  const baseY = typeof y === "number" ? y : Number(y);
  const dx = baseX - cx;
  const dy = baseY - cy;
  const distance = Math.hypot(dx, dy) || 1;
  const radialOffsetX = (dx / distance) * AXIS_TICK_GAP;
  const radialOffsetY = (dy / distance) * AXIS_TICK_GAP;
  const insetX =
    textAnchor === "start" ? -AXIS_TICK_INSET : textAnchor === "end" ? AXIS_TICK_INSET : 0;
  const finalX = Math.round(baseX + radialOffsetX + insetX);
  const finalY = Math.round(baseY + radialOffsetY);

  return (
    <text
      x={finalX}
      y={finalY}
      textAnchor={textAnchor}
      dominantBaseline="central"
      textRendering="geometricPrecision"
      className="body-4 text-gray-400"
      fill="var(--color-gray-400, #dddddd)">
      {payload?.value}
    </text>
  );
}

const AxisTick = React.memo(AxisTickInner);
AxisTick.displayName = "AxisTick";

const renderAxisTick = (props: AxisTickProps) => <AxisTick {...props} />;

const StarShape = ({ points = [] }: StarShapeProps) => {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;

  if (points.length === 0) return null;

  const outerPts = points.map(p => ({ x: p.x, y: p.y }));
  const notchPts = points.map((p, i) => {
    const next = points[(i + 1) % points.length];
    const pAngle = Math.atan2(p.y - cy, p.x - cx);
    const nAngle = Math.atan2(next.y - cy, next.x - cx);
    let diff = nAngle - pAngle;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    const midAngle = pAngle + diff / 2;
    const innerR =
      ((Math.hypot(p.x - cx, p.y - cy) + Math.hypot(next.x - cx, next.y - cy)) / 2) * INNER_RATIO;
    return { x: cx + innerR * Math.cos(midAngle), y: cy + innerR * Math.sin(midAngle) };
  });

  return (
    <g>
      <path
        className="radar-polygon"
        d={sharpTipStarPath(outerPts, notchPts)}
        fill="url(#radarFill)"
        stroke="none"
        filter="url(#glow)"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-sea-blue-400, #68eff7)" />
      ))}
    </g>
  );
};

interface RadarChartProps {
  data: RadarChartData;
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const { max, categories } = data;

  const chartData = RADAR_CATEGORIES.map(({ key, label }) => ({
    subject: label,
    value: categories[key],
    fullMark: max,
  }));

  return (
    <ResponsiveContainer width="100%" height={300} style={{ userSelect: "none" }}>
      <RechartsRadarChart
        data={chartData}
        margin={{
          top: CHART_MARGIN,
          right: CHART_MARGIN,
          bottom: CHART_MARGIN,
          left: CHART_MARGIN,
        }}
        cx="50%"
        cy="50%"
        outerRadius={OUTER_RADIUS}
        startAngle={90}
        endAngle={-270}
        style={{ pointerEvents: "none" }}>
        <Customized component={StarGrid} />
        <PolarAngleAxis dataKey="subject" tick={renderAxisTick} />
        <Radar dataKey="value" shape={<StarShape />} dot={false} activeDot={false} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
