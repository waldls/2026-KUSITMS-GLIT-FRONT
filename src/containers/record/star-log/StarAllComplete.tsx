import FilledHeartGem from "@/components/record/stones/FilledHeartGem";
import { cn } from "@/lib/utils/cn";

interface StarAllCompleteProps {
  title?: string;
  description?: string;
}

function StarAllComplete({ title = "모든 작업 기록 완료", description }: StarAllCompleteProps) {
  return (
    <section className="bg-star-complete-gradient relative -mx-5 min-h-dvh px-5">
      <div className="star-complete-wave" aria-hidden />
      <div className="star-analysis-wind star-analysis-wind-blue" aria-hidden />
      <div className="relative z-10 flex min-h-dvh flex-col items-center">
        <div aria-hidden className="flex-1" />
        <div className="flex w-full flex-col items-center">
          <div className="flex size-32 shrink-0 items-center justify-center">
            <FilledHeartGem ariaLabel={title} />
          </div>
          <div className="mt-3.75 flex w-full max-w-sm flex-col items-center text-center">
            <p key={title} className="animate-star-complete-copy head-4 text-white">
              {title}
            </p>
            <p
              key={description ?? "empty"}
              style={{ animationDelay: "120ms" }}
              className={cn(
                "animate-star-complete-copy body-5 text-gray-500",
                !description && "invisible",
              )}>
              {description ?? "오늘의 경험은 어떤 태그로 기록될까요?"}
            </p>
          </div>
        </div>
        <div aria-hidden className="flex-1" />
      </div>
    </section>
  );
}

export default StarAllComplete;
