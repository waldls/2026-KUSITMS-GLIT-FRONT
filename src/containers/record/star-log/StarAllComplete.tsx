import FilledHeartGem from "@/components/record/stones/FilledHeartGem";

interface StarAllCompleteProps {
  title?: string;
  description?: string;
}

function StarAllComplete({ title = "모든 작업 기록 완료", description }: StarAllCompleteProps) {
  return (
    <section className="bg-star-complete-gradient -mx-5 flex min-h-0 flex-1 flex-col overflow-hidden px-5">
      <div className="star-complete-wave" aria-hidden />
      <div className="star-analysis-wind star-analysis-wind-blue" aria-hidden />
      <div className="relative z-10 flex-[0.4]" />
      <div className="relative z-10 flex flex-col items-center">
        <FilledHeartGem ariaLabel="모든 작업 기록 완료" />
        <p key={title} className="animate-star-complete-copy head-4 mt-3.75 text-white">
          {title}
        </p>
        {description && (
          <p key={description} className="animate-star-complete-copy body-5 text-gray-500">
            {description}
          </p>
        )}
      </div>
      <div className="relative z-10 flex-[0.4]" />
    </section>
  );
}

export default StarAllComplete;
