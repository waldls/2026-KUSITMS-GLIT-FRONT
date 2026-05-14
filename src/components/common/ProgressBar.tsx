import { cn } from "@/lib/utils/cn";

type Step = 1 | 2 | 3;

interface ProgressBarProps {
  step?: Step;
  value?: number;
  max?: number;
}

const ProgressBar = ({ step, value, max }: ProgressBarProps) => {
  const progress =
    value !== undefined && max !== undefined && max > 0
      ? Math.min(Math.max(value / max, 0), 1)
      : undefined;

  return (
    <div className="h-0.75 w-full bg-gray-800">
      <div
        style={progress !== undefined ? { width: `${progress * 100}%` } : undefined}
        className={cn(
          "bg-sea-blue-500 h-full transition-all duration-300",
          progress === undefined && step === 1 && "w-1/3",
          progress === undefined && step === 2 && "w-2/3",
          progress === undefined && step === 3 && "w-full",
        )}
      />
    </div>
  );
};

export default ProgressBar;
