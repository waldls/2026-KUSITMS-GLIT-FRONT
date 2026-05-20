import { cn } from "@/lib/utils/cn";

interface MoreStepProps {
  className?: string;
}

const MoreStep = ({ className }: MoreStepProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 self-center", className)}>
      <div className="bg-gray-850 size-1.5 rounded-full opacity-60" />
      <div className="size-1.5 rounded-full bg-gray-800 opacity-80" />
      <div className="size-1.5 rounded-full bg-gray-700 opacity-80" />
      <div className="size-1.5 rounded-full bg-gray-400 opacity-80" />
    </div>
  );
};

export default MoreStep;
