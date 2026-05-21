import StarAnalysisDelayed from "@/containers/record/star-log/StarAnalysisDelayed";

function NotFound() {
  return (
    <div className="flex size-full min-h-0 flex-col px-5">
      <StarAnalysisDelayed
        title="앗, 잠시 오류가 발생했어요"
        description="불편을 드려 죄송해요, 다시 한 번 시도해보실래요?"
        animated={false}
      />
    </div>
  );
}

export default NotFound;
