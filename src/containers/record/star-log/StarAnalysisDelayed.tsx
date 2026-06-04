import FilledHeartGem from "@/components/record/stones/FilledHeartGem";
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
    <section className="relative -mx-5 min-h-dvh bg-gray-900 px-5">
      {animated && <div className="star-analysis-wind" aria-hidden />}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-18 h-58 w-58 rounded-full bg-red-400 opacity-40 blur-[112px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -left-20 h-62 w-62 rounded-full bg-red-400 opacity-40 blur-[104px]"
      />

      <div className="relative z-10 flex min-h-dvh flex-col items-center">
        <div aria-hidden className="flex-1" />
        <div className="flex w-full flex-col items-center">
          <div className="flex size-32 shrink-0 items-center justify-center">
            <FilledHeartGem ariaLabel={title} />
          </div>
          <div className="mt-3.75 flex w-full max-w-sm flex-col items-center text-center">
            <p
              className={cn(
                "head-4 min-h-14 text-white",
                animated && "animate-star-complete-copy",
              )}>
              {title}
            </p>
            <p
              className={cn(
                "body-5 mt-0.25 min-h-5 text-gray-500",
                animated && "animate-star-complete-copy",
              )}>
              {description}
            </p>
          </div>
        </div>
        <div aria-hidden className="flex-1" />
      </div>
    </section>
  );
}

export default StarAnalysisDelayed;
