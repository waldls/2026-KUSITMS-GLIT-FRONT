"use client";

import { Suspense } from "react";

import Button from "@/components/common/Button";
import LoadingScreen from "@/components/common/LoadingScreen";
import Modal from "@/components/common/Modal";
import ProgressBar from "@/components/common/ProgressBar";
import TextArea from "@/components/common/TextArea";
import SkillTag from "@/components/record/SkillTag";
import SkillTaggingFail from "@/containers/record/skill-tagging/SkillTaggingFail";
import SkillTaggingSuccess from "@/containers/record/skill-tagging/SkillTaggingSuccess";
import StarAllComplete from "@/containers/record/star-log/StarAllComplete";
import StarAnalysisDelayed from "@/containers/record/star-log/StarAnalysisDelayed";
import StarImageUploader from "@/containers/record/star-log/StarImageUploader";
import StarTaskComplete from "@/containers/record/star-log/StarTaskComplete";
import { useStarLog } from "@/lib/hooks/record/useStarLog";
import { cn } from "@/lib/utils/cn";
import { STAR_STEPS } from "@/lib/utils/record/starLog";

const StarLogContent = () => {
  const {
    tasks,
    currentTask,
    currentStep,
    currentGuideExample,
    viewState,
    aiTaggingResults,
    animationDirection,
    taskIndex,
    stepIndex,
    completedTaskIndex,
    answer,
    hasAnswer,
    isLastStep,
    currentStarRecordId,
    currentImageAttachments,
    isSavingStep,
    isUploadingImage,
    isExitModalOpen,
    apiErrorMessage,
    handleAnswerChange,
    handleImageAttachmentsChange,
    handleImageUpload,
    handleImageRemove,
    handlePrevClick,
    handleNextClick,
    handleNextTaskClick,
    dismissApiError,
    dismissExitModal,
  } = useStarLog();

  if (!currentTask) return null;

  if (viewState === "skillTaggingSuccess" && aiTaggingResults) {
    return <SkillTaggingSuccess results={aiTaggingResults} />;
  }

  if (viewState === "skillTaggingFail") {
    return <SkillTaggingFail />;
  }

  if (viewState === "allComplete") {
    return <StarAllComplete />;
  }

  if (viewState === "analyzing") {
    return (
      <StarAllComplete
        title="AI가 오늘의 경험을 분석하는 중이에요"
        description="오늘의 경험은 어떤 태그로 기록될까요?"
      />
    );
  }

  if (viewState === "delayed") {
    return <StarAnalysisDelayed />;
  }

  if (viewState === "taskComplete") {
    const completedTask = tasks[completedTaskIndex];
    const nextTask = tasks[completedTaskIndex + 1];

    if (!completedTask || !nextTask) {
      return <StarAllComplete />;
    }

    return (
      <StarTaskComplete
        completedTaskNumber={completedTaskIndex + 1}
        completedTaskSkillId={completedTask.skillId}
        nextTask={nextTask}
        onNextTaskClick={handleNextTaskClick}
      />
    );
  }

  return (
    <>
      <div
        key={`${taskIndex}-${stepIndex}`}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right",
        )}>
        <div className="-mx-5 shrink-0">
          <ProgressBar value={stepIndex + 1} max={STAR_STEPS.length} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <section className="mt-6.5 flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <SkillTag skillId={currentTask.skillId} />
              <span className="body-5 truncate text-gray-700">{currentTask.title}</span>
            </div>

            <h2 className="body-3 mt-3 text-white">{currentStep.question}</h2>
            <p className="body-5 mt-1 mr-7.75 whitespace-pre-line text-gray-700">
              {currentGuideExample}
            </p>

            <TextArea
              className="mt-5"
              placeholder={currentStep.placeholder}
              value={answer}
              onChange={handleAnswerChange}
            />

            {currentStep.key === "result" && (
              <StarImageUploader
                images={currentImageAttachments}
                onImagesChange={handleImageAttachmentsChange}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
              />
            )}
          </section>

          <div className="flex shrink-0 gap-2 pt-4 pb-10 md:pb-5">
            <Button
              size="lg"
              variant="gray"
              onClick={handlePrevClick}
              className="text-offwhite-500 flex-[1.5] bg-gray-400/40">
              이전
            </Button>
            <Button
              size="lg"
              variant="gray"
              disabled={!hasAnswer || !currentStarRecordId || isSavingStep || isUploadingImage}
              className={cn(
                "flex-[3.5]",
                (!hasAnswer || !currentStarRecordId || isSavingStep || isUploadingImage) &&
                  "text-offwhite-500 bg-gray-400/40",
                hasAnswer &&
                  currentStarRecordId &&
                  !isSavingStep &&
                  !isUploadingImage &&
                  "bg-white text-gray-900",
              )}
              onClick={handleNextClick}>
              {isLastStep ? "완료" : "다음"}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isExitModalOpen}
        type="double"
        title="정말 그만두시겠어요?"
        contents="지금 나가면 작성 중인 내용이 없어져요"
        btnLLabel="나가기"
        btnRLabel="머무르기"
        onBtnLClick={() => window.history.back()}
        onBtnRClick={dismissExitModal}
        onClose={dismissExitModal}
      />

      <Modal
        isOpen={apiErrorMessage.length > 0}
        type="single"
        title={apiErrorMessage}
        btnLabel="확인"
        onBtnClick={dismissApiError}
        onClose={dismissApiError}
      />

      {isSavingStep && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-gray-900">
          <LoadingScreen className="bg-transparent" />
        </div>
      )}
    </>
  );
};

const Page = () => (
  <Suspense>
    <StarLogContent />
  </Suspense>
);

export default Page;
