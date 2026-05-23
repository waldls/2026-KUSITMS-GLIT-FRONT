import { MyPageIcon } from "@/assets/icons";
import { cn } from "@/lib/utils/cn";
import type { GrassStatus, MonthlyGrassData as HeatmapData } from "@/types/home/home";

type HeatmapLevel = "default" | 1 | 2 | "full";

export const statusToLevel: Record<GrassStatus, HeatmapLevel> = {
  NO_DATA: "default",
  STAR_LOW: 1,
  STAR_MID: 2,
  STAR_HIGH: "full",
};

interface HeatmapCellProps {
  level: HeatmapLevel;
  date: string;
}

type Layer = { height: string; color: string };

const levelLayers: Record<HeatmapLevel, Layer[]> = {
  default: [],
  1: [{ height: "h-1/3", color: "bg-sea-blue-300" }],
  2: [
    { height: "h-2/3", color: "bg-sea-blue-400" },
    { height: "h-1/3", color: "bg-sea-blue-300" },
  ],
  full: [{ height: "h-full", color: "bg-sea-blue-600" }],
};

export const HeatmapCell = ({ level, date }: HeatmapCellProps) => (
  <div className="bg-gray-850 rounded-6 relative size-7.5 overflow-hidden">
    {levelLayers[level].map(({ height, color }, i) => (
      <div key={i} className={cn("absolute inset-x-0 bottom-0", height, color)} />
    ))}
    {level === "default" && (
      <span className="body-4 absolute inset-0 flex items-center justify-center text-gray-800">
        {Number(date.split("-")[2])}
      </span>
    )}
    {level === "full" && (
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <MyPageIcon className="text-offwhite-100 size-5" />
      </div>
    )}
  </div>
);

interface HeatmapProps {
  data: HeatmapData;
}

const Heatmap = ({ data }: HeatmapProps) => (
  <div className="mx-auto grid w-fit grid-cols-9 gap-1">
    {data.days.map(({ date, status }) => (
      <HeatmapCell key={date} level={statusToLevel[status]} date={date} />
    ))}
  </div>
);

export default Heatmap;
