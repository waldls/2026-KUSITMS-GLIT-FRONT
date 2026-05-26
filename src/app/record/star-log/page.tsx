"use client";

import { type Dispatch, type SetStateAction, Suspense, useEffect, useRef, useState } from "react";

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
import StarImageUploader, {
  type StarImageAttachment,
} from "@/containers/record/star-log/StarImageUploader";
import StarTaskComplete from "@/containers/record/star-log/StarTaskComplete";
import { getStarGuideExample } from "@/data/record/starGuides";
import type { Competency } from "@/types/competency";
import {
  type AiTaggingResultResponse,
  getAiTaggingResult,
  getAiTaggingStatus,
  triggerAiTagging,
} from "@/lib/apis/record/record";
import { confirmImage, uploadImage } from "@/lib/apis/record/starImage";
import { updateStep } from "@/lib/apis/record/starRecord";
import { useMe } from "@/lib/hooks/user/userClient";
import { cn } from "@/lib/utils/cn";
import { navigateRecord, replaceRecordHistory } from "@/lib/utils/recordNavigation";

const STAR_STEPS = [
  {
    key: "situation",
    apiStep: "situation-task",
    param: "st",
    headerTitle: "상황/과제",
    question: "어떤 상황에서 이 일을 맡게 됐고, 목표는 무엇이었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "action",
    apiStep: "action",
    param: "a",
    headerTitle: "행동",
    question: "목표를 위해 어떤 행동을 했고, 그렇게 한 이유도 있었나요?",
    placeholder: "3~5문장이면 충분해요",
  },
  {
    key: "result",
    apiStep: "result",
    param: "r",
    headerTitle: "결과",
    question: "어떤 결과로 이어졌고, 이 경험에서 무엇을 배웠나요?",
    placeholder: "3~5문장이면 충분해요",
  },
] as const;

type StarStep = (typeof STAR_STEPS)[number]["key"];
type ViewState =
  | "form"
  | "taskComplete"
  | "allComplete"
  | "analyzing"
  | "delayed"
  | "skillTaggingSuccess"
  | "skillTaggingFail";
type StarLogStateView = Exclude<ViewState, "form" | "skillTaggingSuccess" | "skillTaggingFail">;
const STAR_LOG_STATE_PARAM_MAP: Record<StarLogStateView, string> = {
  taskComplete: "task-complete",
  allComplete: "all-complete",
  analyzing: "analyzing",
  delayed: "delayed",
};
type ImageAttachmentMap = Record<number, StarImageAttachment[]>;

interface StarTask {
  id: number;
  starRecordId?: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
  competency?: Competency;
}

const triggeredAiTaggingKeys = new Set<string>();
const ANALYZING_STATUS_POLL_LIMIT = 20;

const getInitialTasks = () => {
  if (typeof window === "undefined") return [];

  const storedTasks = window.sessionStorage.getItem("star-log-tasks");

  if (!storedTasks) return [];

  try {
    const parsedTasks = JSON.parse(storedTasks) as StarTask[];
    return parsedTasks.length > 0 ? parsedTasks : [];
  } catch {
    return [];
  }
};

const getInitialCompletedStarRecordIds = () => {
  if (typeof window === "undefined") return [];

  const storedIds = window.sessionStorage.getItem("star-log-completed-star-record-ids");
  if (!storedIds) return [];

  try {
    const parsedIds = JSON.parse(storedIds) as number[];
    return parsedIds.filter(id => Number.isFinite(id));
  } catch {
    return [];
  }
};

const saveCompletedStarRecordIds = (ids: number[]) => {
  window.sessionStorage.setItem("star-log-completed-star-record-ids", JSON.stringify(ids));
};

const getUploadImageMimeType = async (file: File) => {
  if (file.type === "image/png" || file.type === "image/jpeg") return file.type;

  if (file.type) throw new Error("JPG 또는 PNG 이미지만 업로드할 수 있어요");

  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  if (isPng) return "image/png";
  if (isJpeg) return "image/jpeg";

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";

  throw new Error("JPG 또는 PNG 이미지만 업로드할 수 있어요");
};

const uploadStarImage = async (starRecordId: number, image: StarImageAttachment) => {
  const mimeType = await getUploadImageMimeType(image.file);
  const uploadTargets = await uploadImage(starRecordId, {
    mimeTypes: [mimeType],
  });
  const uploadTarget = uploadTargets?.[0];

  if (!uploadTarget?.presignedUrl || !uploadTarget.imageKey) {
    throw new Error("이미지 업로드 URL을 발급받지 못했어요");
  }

  const response = await fetch(uploadTarget.presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: image.file,
  });

  if (!response.ok) throw new Error("이미지를 업로드하지 못했어요");

  await confirmImage(starRecordId, { imageKeys: [uploadTarget.imageKey] });
};

const getInitialStepIndex = () => {
  if (typeof window === "undefined") return 0;

  const stepParam = new URLSearchParams(window.location.search).get("step");

  return Math.max(
    0,
    STAR_STEPS.findIndex(step => step.param === stepParam),
  );
};

const getInitialViewState = (): ViewState => {
  if (typeof window === "undefined") return "form";

  const stateParam = new URLSearchParams(window.location.search).get("state");

  if (stateParam === "task-complete") return "taskComplete";
  if (stateParam === "all-complete") return "allComplete";
  if (stateParam === "analyzing") return "analyzing";
  if (stateParam === "delayed") return "delayed";

  return "form";
};

const getCurrentPathname = () =>
  typeof window === "undefined" ? "/record/star-log" : window.location.pathname;

const getCurrentSearchParams = () =>
  new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

const createStepHref = (nextStepIndex: number, viewState: ViewState = "form") => {
  const pathname = getCurrentPathname();
  const searchParams = getCurrentSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  if (viewState === "form") {
    params.delete("state");
  } else if (viewState in STAR_LOG_STATE_PARAM_MAP) {
    params.set("state", STAR_LOG_STATE_PARAM_MAP[viewState as StarLogStateView]);
  }

  params.set("step", STAR_STEPS[nextStepIndex].param);
  return `${pathname}?${params.toString()}`;
};

const replaceCurrentHistory = (href: string) => {
  replaceRecordHistory(href);
};

const replaceStarLogState = (
  nextViewState: StarLogStateView,
  stepIndex: number,
  setViewState: (viewState: ViewState) => void,
) => {
  setViewState(nextViewState);
  replaceCurrentHistory(createStepHref(stepIndex, nextViewState));
};

const replaceSkillTagging = (
  state: "success" | "fail",
  setViewState: (viewState: ViewState) => void,
) => {
  window.sessionStorage.setItem("skill-tagging-state", state);
  replaceRecordHistory("/record/skill-tagging");
  setViewState(state === "success" ? "skillTaggingSuccess" : "skillTaggingFail");
};

const StarLogContent = () => {
  const imageAttachmentsRef = useRef<ImageAttachmentMap>({});
  const aiTaggingStatusPollCountRef = useRef(0);
  const { data: profile } = useMe();
  const [tasks] = useState<StarTask[]>(getInitialTasks);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completedTaskIndex, setCompletedTaskIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(getInitialStepIndex);
  const [viewState, setViewState] = useState<ViewState>(getInitialViewState);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Partial<Record<StarStep, string>>>>({});
  const [imageAttachments, setImageAttachments] = useState<ImageAttachmentMap>({});
  const [completedStarRecordIds, setCompletedStarRecordIds] = useState<number[]>(
    getInitialCompletedStarRecordIds,
  );
  const [aiTaggingResults, setAiTaggingResults] = useState<AiTaggingResultResponse[] | null>(null);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const currentTask = tasks[taskIndex];
  const currentStep = STAR_STEPS[stepIndex];
  const currentGuideExample = currentTask
    ? getStarGuideExample({
        job: profile?.jobRole,
        competency: currentTask.competency,
        skillId: currentTask.skillId,
        stepKey: currentStep.key,
      })
    : "";
  const answer = currentTask ? (answers[currentTask.id]?.[currentStep.key] ?? "") : "";
  const currentImageAttachments = currentTask ? (imageAttachments[currentTask.id] ?? []) : [];
  const hasAnswer = answer.trim().length > 0;
  const isLastStep = stepIndex === STAR_STEPS.length - 1;
  const isLastTask = taskIndex === tasks.length - 1;
  const currentStarRecordId = currentTask?.starRecordId;
  const isUploadingImage = currentImageAttachments.some(image => image.isUploading);
  const starRecordIdList = tasks
    .map(task => task.starRecordId)
    .filter((starRecordId): starRecordId is number => Boolean(starRecordId));
  const starRecordIdKey = starRecordIdList.join(",");
  const hasCompletedAllTasks =
    tasks.length > 0 &&
    starRecordIdList.length === tasks.length &&
    starRecordIdList.every(starRecordId => completedStarRecordIds.includes(starRecordId));

  const replaceStep = (nextStepIndex: number, direction?: "left" | "right") => {
    setAnimationDirection(direction ?? (nextStepIndex < stepIndex ? "left" : "right"));
    setViewState("form");
    setStepIndex(nextStepIndex);
    replaceCurrentHistory(createStepHref(nextStepIndex));
  };

  useEffect(() => {
    if (tasks.length === 0) navigateRecord("/record/select-skills", { replace: true });
  }, [tasks]);

  useEffect(() => {
    if (viewState !== "form") return;
    replaceCurrentHistory(createStepHref(stepIndex));
  }, [stepIndex, viewState]);

  useEffect(() => {
    if (viewState !== "allComplete") return;
    if (!hasCompletedAllTasks) return;

    return ((redirectTimer: number) => () => {
      window.clearTimeout(redirectTimer);
    })(
      window.setTimeout(() => {
        replaceStarLogState("analyzing", stepIndex, setViewState);
      }, 3500),
    );
  }, [hasCompletedAllTasks, stepIndex, viewState]);

  useEffect(() => {
    if (viewState !== "analyzing" && viewState !== "delayed") return;
    if (!hasCompletedAllTasks) {
      replaceStarLogState("allComplete", stepIndex, setViewState);
      return;
    }

    const aiTaggingStarRecordIds = tasks
      .map(task => task.starRecordId)
      .filter((starRecordId): starRecordId is number => Boolean(starRecordId));
    let ignore = false;
    let pollingTimer: number | undefined;
    const taggingStorageKey = `star-log-ai-tagging:${starRecordIdKey}`;
    const isAnalyzing = viewState === "analyzing";

    if (isAnalyzing) {
      aiTaggingStatusPollCountRef.current = 0;
    }

    const scheduleNextPoll = () => {
      pollingTimer = window.setTimeout(() => {
        void pollAiTagging();
      }, 1500);
    };

    const pollAiTagging = async () => {
      try {
        aiTaggingStatusPollCountRef.current += 1;

        const statuses = await Promise.all(aiTaggingStarRecordIds.map(getAiTaggingStatus));
        if (ignore) return;

        if (statuses.some(status => status?.status === "FAILED")) {
          replaceSkillTagging("fail", setViewState);
          return;
        }

        if (statuses.every(status => status?.status === "SUCCESS")) {
          const nextResults = await Promise.all(aiTaggingStarRecordIds.map(getAiTaggingResult));
          if (ignore) return;

          if (nextResults.some(result => result?.status !== "SUCCESS")) {
            throw new Error("AI 태깅 결과를 찾지 못했어요");
          }

          setAiTaggingResults(
            nextResults.filter((result): result is AiTaggingResultResponse => result !== null),
          );
          replaceSkillTagging("success", setViewState);
          return;
        }
      } catch {
        if (ignore) return;
      }

      if (
        viewState === "analyzing" &&
        aiTaggingStatusPollCountRef.current >= ANALYZING_STATUS_POLL_LIMIT
      ) {
        replaceStarLogState("delayed", stepIndex, setViewState);
        return;
      }

      scheduleNextPoll();
    };

    const startAiTagging = async () => {
      try {
        if (aiTaggingStarRecordIds.length === 0) {
          replaceSkillTagging("fail", setViewState);
          return;
        }

        if (!triggeredAiTaggingKeys.has(taggingStorageKey)) {
          await Promise.all(aiTaggingStarRecordIds.map(triggerAiTagging));
          triggeredAiTaggingKeys.add(taggingStorageKey);
        }

        await pollAiTagging();
      } catch {
        if (!ignore) replaceSkillTagging("fail", setViewState);
      }
    };

    void startAiTagging();

    return () => {
      ignore = true;
      if (pollingTimer) window.clearTimeout(pollingTimer);
    };
  }, [hasCompletedAllTasks, starRecordIdKey, stepIndex, tasks, viewState]);

  useEffect(() => {
    const title =
      viewState === "form"
        ? currentStep.headerTitle
        : viewState === "taskComplete"
          ? "다음 심화기록"
          : viewState === "allComplete"
            ? "기록 완료"
            : "AI 역량 태깅";

    window.dispatchEvent(new CustomEvent("record-title-change", { detail: title }));
    window.dispatchEvent(
      new CustomEvent("record-header-hidden-change", { detail: viewState !== "form" }),
    );

    return () => {
      window.dispatchEvent(new CustomEvent("record-header-hidden-change", { detail: false }));
    };
  }, [currentStep.headerTitle, viewState]);

  const handleAnswerChange = (value: string) => {
    if (!currentTask) return;

    setAnswers(prev => ({
      ...prev,
      [currentTask.id]: {
        ...prev[currentTask.id],
        [currentStep.key]: value,
      },
    }));
  };

  const handleImageAttachmentsChange: Dispatch<SetStateAction<StarImageAttachment[]>> = action => {
    if (!currentTask) return;

    const taskId = currentTask.id;

    setImageAttachments(prev => ({
      ...prev,
      [taskId]: typeof action === "function" ? action(prev[taskId] ?? []) : action,
    }));
  };

  const handleImageUpload = async (image: StarImageAttachment) => {
    if (!currentTask || !currentStarRecordId) throw new Error("심화기록을 찾을 수 없어요");

    const taskId = currentTask.id;

    try {
      await uploadStarImage(currentStarRecordId, image);

      setImageAttachments(prev => ({
        ...prev,
        [taskId]: (prev[taskId] ?? []).map(item =>
          item.id === image.id ? { ...item, isUploading: false } : item,
        ),
      }));
    } catch (error) {
      setImageAttachments(prev => ({
        ...prev,
        [taskId]: (prev[taskId] ?? []).filter(item => item.id !== image.id),
      }));
      throw error;
    }
  };

  const handlePrevClick = () => {
    if (stepIndex > 0) {
      replaceStep(stepIndex - 1, "left");
      return;
    }

    setIsExitModalOpen(true);
  };

  const handleNextClick = async () => {
    if (!currentTask || !hasAnswer || !currentStarRecordId || isSavingStep || isUploadingImage) {
      return;
    }

    setIsSavingStep(true);
    setApiErrorMessage("");

    try {
      await updateStep(currentStarRecordId, currentStep.apiStep, { userAnswer: answer.trim() });
    } catch (error) {
      setApiErrorMessage(
        error instanceof Error && error.message ? error.message : "심화기록을 저장하지 못했어요",
      );
      return;
    } finally {
      setIsSavingStep(false);
    }

    if (!isLastStep) {
      replaceStep(stepIndex + 1, "right");
      return;
    }

    setCompletedStarRecordIds(prev => {
      if (prev.includes(currentStarRecordId)) return prev;

      const next = [...prev, currentStarRecordId];
      saveCompletedStarRecordIds(next);
      return next;
    });
    setCompletedTaskIndex(taskIndex);
    replaceStarLogState(isLastTask ? "allComplete" : "taskComplete", stepIndex, setViewState);
  };

  const handleNextTaskClick = () => {
    setTaskIndex(completedTaskIndex + 1);
    replaceStep(0, "right");
  };

  useEffect(() => {
    imageAttachmentsRef.current = imageAttachments;
  }, [imageAttachments]);

  useEffect(() => {
    return () => {
      Object.values(imageAttachmentsRef.current)
        .flat()
        .forEach(image => URL.revokeObjectURL(image.url));
    };
  }, []);

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
    const nextTask = tasks[completedTaskIndex + 1];

    if (!nextTask) {
      return <StarAllComplete />;
    }

    return (
      <StarTaskComplete
        completedTaskNumber={completedTaskIndex + 1}
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

        {/* 태그 + 제목 + 질문 내용 영역 + 텍스트 작성 영역 */}
        <div className="flex min-h-0 flex-1 flex-col">
          <section className="mt-6.5 flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <SkillTag skillId={currentTask.skillId} />
              <span className="body-5 truncate text-gray-700">{currentTask.projectTitle}</span>
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

            {/* 이미지 첨부 영역 (result만 해당) */}
            {currentStep.key === "result" && (
              <StarImageUploader
                images={currentImageAttachments}
                onImagesChange={handleImageAttachmentsChange}
                onImageUpload={handleImageUpload}
              />
            )}
          </section>

          {/* 이전 다음 버튼 영역 */}
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
        onBtnRClick={() => setIsExitModalOpen(false)}
        onClose={() => setIsExitModalOpen(false)}
      />

      <Modal
        isOpen={apiErrorMessage.length > 0}
        type="single"
        title={apiErrorMessage}
        btnLabel="확인"
        onBtnClick={() => setApiErrorMessage("")}
        onClose={() => setApiErrorMessage("")}
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
