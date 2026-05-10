import { cn } from "@/lib/utils/cn";

type Step = 1 | 2 | 3;

const ProgressBar = ({ step }: { step: Step }) => {
  return (
    <div className="h-0.75 w-full bg-gray-800">
      <div
        className={cn(
          "bg-sea-blue-500 h-full transition-all duration-300",
          step === 1 && "w-1/3",
          step === 2 && "w-2/3",
          step === 3 && "w-full",
        )}
      />
    </div>
  );
};

export default ProgressBar;
