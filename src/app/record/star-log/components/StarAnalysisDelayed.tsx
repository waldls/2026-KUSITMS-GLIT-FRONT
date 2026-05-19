import { cn } from "@/lib/utils/cn";

interface StarAnalysisDelayedProps {
  title?: string;
  description?: string;
  animated?: boolean;
}

function StarAnalysisDelayed({
  title = "다시 한 번 시도하는 중이에요",
  description = "조금만 더 기다려주세요",
  animated = true,
}: StarAnalysisDelayedProps) {
  return (
    <section className="relative -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-900 px-5">
      {animated && <div className="star-analysis-wind" aria-hidden />}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-18 h-58 w-58 rounded-full bg-red-400 opacity-40 blur-[112px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -left-20 h-62 w-62 rounded-full bg-red-400 opacity-40 blur-[104px]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <p className={cn("head-4 text-white", animated && "animate-star-complete-copy")}>{title}</p>
        <p className={cn("body-5 mt-0.25 text-gray-500", animated && "animate-star-complete-copy")}>
          {description}
        </p>
      </div>
    </section>
  );
}

export default StarAnalysisDelayed;
