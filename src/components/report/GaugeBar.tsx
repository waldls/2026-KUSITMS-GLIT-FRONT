import { cn } from "@/lib/utils/cn";

interface GaugeBarProps {
  progressRate: number;
  isGeneratable: boolean;
}

const GaugeBar = ({ progressRate, isGeneratable }: GaugeBarProps) => {
  const percent = Math.min(100, progressRate * 100);

  return (
    <div className="bg-gray-850 rounded-10 h-2 w-full overflow-hidden">
      <div
        className={cn("h-full rounded-full", isGeneratable ? "bg-sea-blue-200" : "bg-gray-700")}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default GaugeBar;
